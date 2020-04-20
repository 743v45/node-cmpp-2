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
          _this.emit('receive', body.Src_terminal_id, body.Msg_Content)

      }

      this.socket.on('terminated', () => {
          _this.emit('terminated')
      })

      this.socket.on('error', (err) => {
          _this.emit('error', err)
      })
    })
  }

  sendGroup(mobileList, content) {
    if (!this.socket.isReady)
        return Promise.reject(new Error('socket is not Ready'))
    if ((this.sendingMobileCount + mobileList.length) > this.config.mobilesPerSecond) {
        return Promise.reject(new Error('cmpp exceed max mobilesPerSecond[' + this.config.mobilesPerSecond + '], please retry later'))
    }
    this.sendingMobileCount += mobileList.length
    const body = this.buildSubmitBody()
    const destBuffer = new Buffer(mobileList.length * 21)
    destBuffer.fill(0)
    mobileList.forEach((mobile, index) => {
        destBuffer.write(mobile, index * 21, 21, 'ascii')
    })
    body.DestUsr_tl = mobileList.length
    body.Dest_terminal_Id = destBuffer
    if (content.length > this.contentLimit) {
        return this.sendLongSms(body, content)
    }

    const str = iconv.encode(content, 'gbk')
    const buf = new Buffer(str)
    body.Msg_Length = buf.length
    body.Msg_Content = buf

    return this.socket.send(cmdCfg.Commands.CMPP_SUBMIT, body)
  }

  sendLongSms(body, content) {
    const _this = this
    const buf = new Buffer(content, 'utf16')
    const bufSliceCount = this.longSmsBufLimit - 8
    const splitCount = Math.ceil(buf.length / bufSliceCount)
    const tp_udhiHead_buf = new Buffer(7)
    tp_udhiHead_buf[0] = 6
    tp_udhiHead_buf[1] = 8
    tp_udhiHead_buf[2] = 4
    tp_udhiHead_buf[3] = _.random(127)
    tp_udhiHead_buf[4] = _.random(127)
    tp_udhiHead_buf[5] = splitCount
    const promiseList = []
    _.times(splitCount, function (idx) {
        tp_udhiHead_buf[6] = idx + 1
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
    this.sendingMobileCount = 0
    setTimeout(() => {
      _this.clearMobileCount()
    }, 1100)
  }

  getAuthenticatorSource(spId, secret, timestamp) {
    const buffer = Buffer.alloc(31, 0)
    buffer.write(spId, 0, 6, 'ascii')
    buffer.write(secret, 15, 21, 'ascii')
    buffer.write(timestamp, 21, 10, 'ascii')
    return require('crypto').createHash('md5').update(buffer).digest()
  }

  getTimestamp() {
    return moment().format('MMDDHHmmss')
  }
}

module.exports.Client = Client