const EventEmitter = require('events')
const iconv = require('iconv-lite')
const cmdCfg = require('./commandsConfig')
const Socket = require('./cmppSocket')
const isPromise = require('is-promise');

const RetryInfo = 'please retry later';

class Client extends EventEmitter {
  constructor(config) {
    super()
    this.config = config
    this.contentLimit = 70
    this.longSmsBufLimit = 140
    this.sendingMobileCount = 0
    _.defaults(config, require('./config'))

    this.debug = require('debug')(`cmpp${config.version.toString(16)}:client:${config.host}:${config.port}`)

    this.conn = new Socket(config)
    // 上行回调处理方法
    this.receive = (body) => {
      console.log('receive data', body);
    }
    // 下行回调处理方法
    this.deliver = (body) => {
      console.log('Get deliver data', body);
    }

    this.bindEvent()
    this.clearMobileCount()
  }

  connect(spId, secret) {
    const _this = this
    const timestamp = _this.getTimestamp()

    if (this.conn.isReady) {
      return Promise.resolve()
    }
    this.spId = spId

    return this.conn.connect(this.config.port, this.config.host).then(() => {
      // 要求 TCP 已经连接
      if (this.conn.isReady) {
        return this.conn.send(cmdCfg.Commands.CMPP_CONNECT, {
          Source_Addr: spId,
          AuthenticatorSource: _this.getAuthenticatorSource(spId, secret, timestamp),
          // 对于 3.0 版本 CMPP，要求 `CMPP_CONNECT` 消息和 `CMPP_CONNECT_RESP` 消息中的 `Version` 字段表示 3.0 版本;
          Version: _this.config.version,
          Timestamp: parseInt(timestamp)
        }).then(() => {
          _this.conn.cmppConnected = true; // 鉴权通过
        }).catch((err) => {
          _this.debug('cmpp_connect failed')
          _this.conn.destroySocket()
          throw err;
        });
      }
    })
  }

  disconnect() {
    if (!this.conn.isReady) return Promise.resolve()
    return this.conn.disconnect()
  }

  /**
   * 设置上行回调处理方法
   * @param {!function} receive
   */
  setReceive(receive) {
    this.receive = receive;
  }

  /**
   * 设置下行回调处理方法
   * @param {!function} deliver
   */
  setDeliver(deliver) {
    this.deliver = deliver;
  }

  bindEvent() {
    const _this = this
    /**
     * @param {!object} data - 回调
     * @param {!function} next - 发送该 deliver 相对的 CMPP_DELIVER_RESP 响应. sendRes(Result = 0) 其中参数 Result 为响应中 Result.
     */
    this.conn.on('deliver', (data, sendRes) => {
      const body = data.body
      let handler;
      switch (body.Registered_Delivery) {
        case 1:
          handler = _this.deliver(body);
          break
        default:
          handler = _this.receive(body);
      }

      handler = isPromise(handler) ? handler : Promise.resolve(handler);
      let done = false;
      const once = (...args) => {
        if (!done) {
          done = true;
          sendRes(...args);
        }
      }
      // 先处理 deliver 再响应
      handler.then(() => {
        once();
      }).catch((err) => {
        // 7:业务代码错
        once(7);
      })
    })

    this.conn.on('terminated', (message) => {
        _this.emit('terminated', message)
    })

    this.conn.on('error', (err) => {
        _this.emit('error', err)
    })

    this.conn.on('timeout', (command) => {
      _this.emit('timeout', command)
    })

    this.conn.on('connect', () => {
      _this.emit('connect')
    })
  }

  sendGroup(mobileList, content, extendCode) {
    if (!this.conn.isReady) {
      return Promise.reject(new Error(`socket is not Ready. ${RetryInfo}`))
    }

    // CMPP 连接前无法发送
    if (!this.conn.cmppConnected) {
      return Promise.reject(new Error(`cmpp connect is not Ready. ${RetryInfo}`));
    }

    if ((this.sendingMobileCount + mobileList.length) > this.config.mobilesPerSecond) {
        return Promise.reject(new Error(`cmpp exceed max mobilesPerSecond[${this.config.mobilesPerSecond}], ${RetryInfo}`))
    }
    this.sendingMobileCount += mobileList.length
    const body = this.buildSubmitBody()
    const destBuffer = Buffer.alloc(mobileList.length * 21, 0)
    mobileList.forEach((mobile, index) => {
        destBuffer.write(mobile, index * 21, 21, 'ascii')
    })
    body.DestUsr_tl = mobileList.length
    body.Dest_terminal_Id = destBuffer
    if (extendCode) {
      body.Src_Id = body.Src_Id + extendCode;
    }
    if (content.length > this.contentLimit) {
        return this.sendLongSms(body, content)
    }

    const str = iconv.encode(content, 'gbk')
    const buf = Buffer.from(str)
    body.Msg_Length = buf.length
    body.Msg_Content = buf

    return this.conn.send(cmdCfg.Commands.CMPP_SUBMIT, body)
  }

  sendLongSms(body, content) {
    const _this = this
    const buf = Buffer.from(content, 'ucs2').swap16() // big-endian
    const bufSliceCount = this.longSmsBufLimit - 6
    const splitCount = Math.ceil(buf.length / bufSliceCount)
    const tp_udhiHead_buf = Buffer.alloc(6)
    tp_udhiHead_buf[0] = 5
    tp_udhiHead_buf[1] = 0
    tp_udhiHead_buf[2] = 3
    tp_udhiHead_buf[3] = _.random(127)
    tp_udhiHead_buf[4] = splitCount
    const promiseList = []
    _.times(splitCount, function (idx) {
        tp_udhiHead_buf[5] = idx + 1
        body.TP_udhi = 1
        body.Msg_Fmt = 8
        body.Pk_total = splitCount
        body.Pk_number = idx + 1
        body.Msg_Content = Buffer.concat([tp_udhiHead_buf, buf.slice(bufSliceCount * idx, bufSliceCount * (idx + 1))])
        body.Msg_Length = body.Msg_Content['length']
        promiseList.push(_this.conn.send(cmdCfg.Commands.CMPP_SUBMIT, body))
    })
    return Promise.all(promiseList)
  }

  send(mobile, content, extendCode) {
    return this.sendGroup([mobile], content, extendCode)
  }

  buildSubmitBody() {
    return  this.config.version === 0x30 ? {
      Msg_Id: '',
      Pk_total: 1,
      Pk_number: 1,
      Registered_Delivery: 1,
      Msg_level: 1,
      Service_Id: this.config.serviceId,
      Fee_UserType: 2,
      Fee_terminal_Id: '',
      Fee_terminal_type: 1, // 0:真实号码;1: 伪码
      TP_pId: 0,
      TP_udhi: 0,
      Msg_Fmt: 15,
      Msg_src: this.spId,
      FeeType: '03',
      FeeCode: this.config.feeCode,
      ValId_Time: '',
      At_Time: '',
      Src_Id: this.config.srcId,
      DestUsr_tl: 1,
      Dest_terminal_Id: '',
      Dest_terminal_type: 0, // 0:真实号码;1: 伪码
      Msg_Length: 0,
      Msg_Content: '',
      // Reserve: ''
      LinkID: ''
    } : {
      Msg_Id: '',
      Pk_total: 1,
      Pk_number: 1,
      Registered_Delivery: 1,
      Msg_level: 1,
      Service_Id: this.config.serviceId,
      Fee_UserType: 2,
      Fee_terminal_Id: '',
      //Fee_terminal_type: 1,
      TP_pId: 0,
      TP_udhi: 0,
      Msg_Fmt: 15,
      Msg_src: this.spId,
      FeeType: '03',
      FeeCode: this.config.feeCode,
      ValId_Time: '',
      At_Time: '',
      Src_Id: this.config.srcId,
      DestUsr_tl: 1,
      Dest_terminal_Id: '',
      Dest_terminal_type: 0,
      Msg_Length: 0,
      Msg_Content: '',
      Reserve: ''
      //LinkID: ''
    }
  }

  clearMobileCount() {
    const _this = this
    this.emit('mobile_count', this.sendingMobileCount)
    if (this.sendingMobileCount >= this.config.mpsThreshold * this.config.mobilesPerSecond) {
      this.emit('overflow', this.sendingMobileCount);
    }
    this.sendingMobileCount = 0
    setTimeout(() => {
      _this.clearMobileCount()
    }, 1000)
  }

  getAuthenticatorSource(spId, secret, timestamp) {
    const buffers = []
    buffers.push(Buffer.from(spId, 'ascii'));
    buffers.push(Buffer.alloc(9, 0));
    buffers.push(Buffer.from(secret, 'ascii'));
    buffers.push(Buffer.from(timestamp, 'ascii'));
    const buffer = Buffer.concat(buffers);

    return require('crypto').createHash('md5').update(buffer).digest();
  }

  getTimestamp() {
    return moment().format('MMDDHHmmss')
  }
}

module.exports.Client = Client
