const EventEmitter = require('events')
const iconv = require('iconv-lite')
const cmdCfg = require('./commandsConfig')
const Socket = require('./cmppSocket')

class Client extends EventEmitter {
  constructor(config) {
    super()
    this.config = config
    this.contentLimit = 70
    this.longSmsBufLimit = 140
    this.sendingMobileCount = 0
    _.defaults(config, require('./config'))

    this.debug = require('debug')(`cmpp:client:${config.host}:${config.port}`)

    this.socket = new Socket(config)
    this.bindEvent()
    this.clearMobileCount()
  }

  connect(spId, secret) {
    const _this = this
    const timestamp = _this.getTimestamp()

    if (this.socket.isReady) {
      return Promise.resolve()
    }
    this.spId = spId

    return this.socket.connect(this.config.port, this.config.host).then(() => {
      return this.socket.send(cmdCfg.Commands.CMPP_CONNECT, {
        Source_Addr: spId,
        AuthenticatorSource: _this.getAuthenticatorSource(spId, secret, timestamp),
        Version: 0x20,
        Timestamp: parseInt(timestamp)
      })
    })
  }

  disconnect() {
    if (!this.socket.isReady) return Promise.resolve()
    return this.socket.disconnect()
  }

  bindEvent() {
    const _this = this
    this.socket.on('deliver', (res) => {
      const body = res.body
      switch (body.Registered_Delivery) {
        case 1:
          _this.emit('deliver', body.Msg_Content)
          break
        default:
          _this.emit('receive', body.Src_terminal_Id, body.Msg_Content, body.Msg_Id)

      }
    })

    this.socket.on('terminated', (message) => {
        _this.emit('terminated', message)
    })

    this.socket.on('error', (err) => {
        _this.emit('error', err)
    })

    this.socket.on('timeout', (command) => {
      _this.emit('timeout', command)
    })
  }

  sendGroup(mobileList, content) {
    if (!this.socket.isReady)
        return Promise.reject(new Error('socket is not Ready. please retry later'))
    if ((this.sendingMobileCount + mobileList.length) > this.config.mobilesPerSecond) {
        return Promise.reject(new Error('cmpp exceed max mobilesPerSecond[' + this.config.mobilesPerSecond + '], please retry later'))
    }
    this.sendingMobileCount += mobileList.length
    const body = this.buildSubmitBody()
    const destBuffer = Buffer.alloc(mobileList.length * 21, 0)
    mobileList.forEach((mobile, index) => {
        destBuffer.write(mobile, index * 21, 21, 'ascii')
    })
    body.DestUsr_tl = mobileList.length
    body.Dest_terminal_Id = destBuffer
    if (content.length > this.contentLimit) {
        return this.sendLongSms(body, content)
    }

    const str = iconv.encode(content, 'gbk')
    const buf = Buffer.from(str)
    body.Msg_Length = buf.length
    body.Msg_Content = buf

    return this.socket.send(cmdCfg.Commands.CMPP_SUBMIT, body)
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
        promiseList.push(_this.socket.send(cmdCfg.Commands.CMPP_SUBMIT, body))
    })
    return Promise.all(promiseList)
  }

  send(mobile, content) {
    return this.sendGroup([mobile], content)
  }

  buildSubmitBody() {
    return {
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
      //Dest_terminal_type: 0,
      Msg_Length: 0,
      Msg_Content: '',
      Reserve: ''
      //LinkID: ''
    }
  }

  clearMobileCount() {
    const _this = this
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
