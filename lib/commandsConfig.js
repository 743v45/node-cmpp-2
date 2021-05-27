(function (Commands) {
  Commands[Commands['CMPP_CONNECT'] = 0x00000001] = 'CMPP_CONNECT'
  Commands[Commands['CMPP_CONNECT_RESP'] = 0x80000001] = 'CMPP_CONNECT_RESP'
  Commands[Commands['CMPP_SUBMIT'] = 0x00000004] = 'CMPP_SUBMIT'
  Commands[Commands['CMPP_SUBMIT_RESP'] = 0x80000004] = 'CMPP_SUBMIT_RESP'
  Commands[Commands['CMPP_DELIVER'] = 0x00000005] = 'CMPP_DELIVER'
  Commands[Commands['CMPP_DELIVER_RESP'] = 0x80000005] = 'CMPP_DELIVER_RESP'
  Commands[Commands['CMPP_ACTIVE_TEST'] = 0x00000008] = 'CMPP_ACTIVE_TEST'
  Commands[Commands['CMPP_ACTIVE_TEST_RESP'] = 0x80000008] = 'CMPP_ACTIVE_TEST_RESP'
  Commands[Commands['CMPP_TERMINATE'] = 0x00000002] = 'CMPP_TERMINATE'
  Commands[Commands['CMPP_TERMINATE_RESP'] = 0x80000002] = 'CMPP_TERMINATE_RESP'
})(exports.Commands || (exports.Commands = {}))
let Commands = exports.Commands;

(function (Errors) {
  Errors[Errors['消息结构错'] = 1] = '消息结构错'
  Errors[Errors['命令字错误'] = 2] = '命令字错误'
  Errors[Errors['消息序列号重复'] = 3] = '消息序列号重复'
  Errors[Errors['消息长度错'] = 4] = '消息长度错'
  Errors[Errors['资费代码错'] = 5] = '资费代码错'
  Errors[Errors['超过最大信息长'] = 6] = '超过最大信息长'
  Errors[Errors['业务代码错'] = 7] = '业务代码错'
  Errors[Errors['流量控制错'] = 8] = '流量控制错'
  Errors[Errors['本网关不负责此计费号码'] = 9] = '本网关不负责此计费号码'
  Errors[Errors['Src_ID错'] = 10] = 'Src_ID错'
  Errors[Errors['Msg_src错'] = 11] = 'Msg_src错'
  Errors[Errors['计费地址错'] = 12] = '计费地址错'
  Errors[Errors['目的地址错'] = 13] = '目的地址错'
  Errors[Errors['尚未建立连接'] = 51] = '尚未建立连接'
  Errors[Errors['尚未成功登录'] = 52] = '尚未成功登录'
  Errors[Errors['发送消息失败'] = 53] = '发送消息失败'
  Errors[Errors['超时未接收到响应消息'] = 54] = '超时未接收到响应消息'
  Errors[Errors['等待状态报告超时'] = 55] = '等待状态报告超时'
  Errors[Errors['有效时间已经过期'] = 61] = '有效时间已经过期'
  Errors[Errors['定时发送时间已经过期'] = 62] = '定时发送时间已经过期'
  Errors[Errors['不能识别的FeeType'] = 63] = '不能识别的FeeType'
  Errors[Errors['发送服务源地址鉴权失败'] = 64] = '发送服务源地址鉴权失败'
  Errors[Errors['发送服务目的地址鉴权失败'] = 65] = '发送服务目的地址鉴权失败'
  Errors[Errors['接收服务源地址鉴权失败'] = 66] = '接收服务源地址鉴权失败'
  Errors[Errors['接收服务目的地址鉴权失败'] = 67] = '接收服务目的地址鉴权失败'
  Errors[Errors['用户鉴权失败'] = 68] = '用户鉴权失败'
  Errors[Errors['此用户为黑名单用户'] = 69] = '此用户为黑名单用户'
  Errors[Errors['网络断连或目的设备关闭接口'] = 70] = '网络断连或目的设备关闭接口'
  Errors[Errors['超过最大节点数'] = 71] = '超过最大节点数'
  Errors[Errors['找不到路由'] = 72] = '找不到路由'
  Errors[Errors['等待应答超时'] = 73] = '等待应答超时'
  Errors[Errors['送SCP失败'] = 74] = '送SCP失败'
  Errors[Errors['送SCP鉴权等待应答超时'] = 75] = '送SCP鉴权等待应答超时'
  Errors[Errors['信息安全鉴权失败'] = 76] = '信息安全鉴权失败'
  Errors[Errors['超过最大Submit提交数'] = 77] = '超过最大Submit提交数'
  Errors[Errors['SPID为空'] = 78] = 'SPID为空'
  Errors[Errors['业务类型为空'] = 79] = '业务类型为空'
  Errors[Errors['CPCode错误'] = 80] = 'CPCode错误'
  Errors[Errors['发送接收接口重复'] = 81] = '发送接收接口重复'
  Errors[Errors['循环路由'] = 82] = '循环路由'
  Errors[Errors['超过接收侧短消息MTU'] = 83] = '超过接收侧短消息MTU'
  Errors[Errors['送DSMP重发失败'] = 84] = '送DSMP重发失败'
  Errors[Errors['DSMP系统忙重发'] = 85] = 'DSMP系统忙重发'
  Errors[Errors['DSMP系统忙且缓存满重发'] = 86] = 'DSMP系统忙且缓存满重发'
  Errors[Errors['DSMP流控重发'] = 87] = 'DSMP流控重发'
  Errors[Errors['等DSMP应答超时重发'] = 88] = '等DSMP应答超时重发'
  Errors[Errors['非神州行预付费用户'] = 202] = '非神州行预付费用户'
  Errors[Errors['数据库操作失败'] = 203] = '数据库操作失败'
  Errors[Errors['移动用户帐户数据异常'] = 206] = '移动用户帐户数据异常'
  Errors[Errors['用户余额不足'] = 208] = '用户余额不足'
  Errors[Errors['超过最高欠费额'] = 210] = '超过最高欠费额'
  Errors[Errors['重复发送消息序列号msgid相同的计费请求消息'] = 215] = '重复发送消息序列号msgid相同的计费请求消息'
  Errors[Errors['SCP互联失败'] = 218] = 'SCP互联失败'
  Errors[Errors['未登记的SP'] = 222] = '未登记的SP'
  Errors[Errors['月消费超额'] = 232] = '月消费超额'
  Errors[Errors['未定义'] = 241] = '未定义'
  Errors[Errors['消息队列满'] = 250] = '消息队列满'
})(exports.Errors || (exports.Errors = {}))
const Errors = exports.Errors;

(function (Status) {
  Status[Status['消息结构错'] = 1] = '消息结构错'
  Status[Status['非法源地址'] = 2] = '非法源地址'
  Status[Status['认证错'] = 3] = '认证错'
  Status[Status['版本太高'] = 4] = '版本太高'
  Status[Status['超过系统接口数'] = 55] = '超过系统接口数'
  Status[Status['超过帐号设置接口数'] = 56] = '超过帐号设置接口数'
  Status[Status['SP登陆IP错误'] = 57] = 'SP登陆IP错误'
  Status[Status['创建soap处理线程失败'] = 58] = '创建soap处理线程失败'
  Status[Status['登陆帐号并非属于登陆的PROXY'] = 60] = '登陆帐号并非属于登陆的PROXY'
})(exports.Status || (exports.Status = {}))
const Status = exports.Status;
exports.CommandsDescriptionV2 = {
  CMPP_CONNECT: [
      { name: 'Source_Addr', type: 'string', length: 6 },
      { name: 'AuthenticatorSource', type: 'buffer', length: 16 },
      { name: 'Version', type: 'number', length: 1 },
      { name: 'Timestamp', type: 'number', length: 4 }
  ],
  CMPP_CONNECT_RESP: [
      { name: 'Status', type: 'number', length: 1 },
      { name: 'AuthenticatorISMG', type: 'buffer', length: 16 },
      { name: 'Version', type: 'number', length: 1 }
  ],
  CMPP_ACTIVE_TEST_RESP: [
    { name: 'Reserved', type: 'number', length: 1 },
  ],
  CMPP_SUBMIT: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      { name: 'Pk_total', type: 'number', length: 1 },
      { name: 'Pk_number', type: 'number', length: 1 },
      { name: 'Registered_Delivery', type: 'number', length: 1 },
      { name: 'Msg_level', type: 'number', length: 1 },
      { name: 'Service_Id', type: 'string', length: 10 },
      { name: 'Fee_UserType', type: 'number', length: 1 },
      // CMPP 2.0 协议中为数字, 不好编码，故改成字符串（注：CMPP 3.0 已经调整为 32 位字符串）
      { name: 'Fee_terminal_Id', type: 'string', length: 21 },
      //{ name: 'Fee_terminal_type', type: 'number', length: 1 },
      { name: 'TP_pId', type: 'number', length: 1 },
      { name: 'TP_udhi', type: 'number', length: 1 },
      { name: 'Msg_Fmt', type: 'number', length: 1 },
      { name: 'Msg_src', type: 'string', length: 6 },
      { name: 'FeeType', type: 'string', length: 2 },
      { name: 'FeeCode', type: 'string', length: 6 },
      { name: 'ValId_Time', type: 'string', length: 17 },
      { name: 'At_Time', type: 'string', length: 17 },
      { name: 'Src_Id', type: 'string', length: 21 },
      { name: 'DestUsr_tl', type: 'number', length: 1 } // < 100
      ,
      { name: 'Dest_terminal_Id', type: 'string', length: function (obj) { return obj.DestUsr_tl * 21 } },
      //{ name: 'Dest_terminal_type', type: 'number', length: 1 },
      { name: 'Msg_Length', type: 'number', length: 1 } //<= 140
      ,
      { name: 'Msg_Content', type: 'buffer', length: function (obj) { return obj.Msg_Length } },
      //{ name: 'LinkID', type: 'string', length: 20 } //留空，点播业务使用的LinkID
      { name: 'Reserve', type: 'string', length: 8 } //保留
  ],
  CMPP_SUBMIT_RESP: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      { name: 'Result', type: 'number', length: 1 }
  ],
  CMPP_DELIVER: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      { name: 'Dest_Id', type: 'string', length: 21 },
      { name: 'Service_Id', type: 'string', length: 10 },
      { name: 'TP_pid', type: 'number', length: 1 },
      { name: 'TP_udhi', type: 'number', length: 1 },
      { name: 'Msg_Fmt', type: 'number', length: 1 },
      { name: 'Src_terminal_Id', type: 'string', length: 21 },
      //{ name: 'Src_terminal_type', type: 'number', length: 1 },
      { name: 'Registered_Delivery', type: 'number', length: 1 } //0 非状态报告 1 状态报告
      ,
      { name: 'Msg_Length', type: 'number', length: 1 },
      { name: 'Msg_Content', type: 'buffer', length: function (obj) { return obj.Msg_Length } },
      { name: 'Reserve', type: 'string', length: 8 } //保留
      //{ name: 'LinkID', type: 'string', length: 20 }
  ],
  CMPP_DELIVER_REPORT_CONTENT: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      { name: 'Stat', type: 'string', length: 7 },
      { name: 'Submit_time', type: 'string', length: 10 },
      { name: 'Done_time', type: 'string', length: 10 },
      { name: 'Dest_terminal_Id', type: 'string', length: 21 },
      { name: 'SMSC_sequence', type: 'number', length: 4 }
  ],
  CMPP_DELIVER_RESP: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      { name: 'Result', type: 'number', length: 1 }
  ]
}

exports.CommandsDescriptionV3 = {
  CMPP_CONNECT: [
      { name: 'Source_Addr', type: 'string', length: 6 },
      { name: 'AuthenticatorSource', type: 'buffer', length: 16 },
      { name: 'Version', type: 'number', length: 1 },
      { name: 'Timestamp', type: 'number', length: 4 }
  ],
  CMPP_CONNECT_RESP: [
      // 把所有响应消息中的状态码字段从1个字节扩展 为4个字节
      { name: 'Status', type: 'number', length: 4 },
      { name: 'AuthenticatorISMG', type: 'buffer', length: 16 },
      { name: 'Version', type: 'number', length: 1 }
  ],
  CMPP_ACTIVE_TEST_RESP: [
    { name: 'Reserved', type: 'number', length: 1 },
  ],
  CMPP_SUBMIT: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      { name: 'Pk_total', type: 'number', length: 1 },
      { name: 'Pk_number', type: 'number', length: 1 },
      { name: 'Registered_Delivery', type: 'number', length: 1 },
      { name: 'Msg_level', type: 'number', length: 1 },
      { name: 'Service_Id', type: 'string', length: 10 },
      { name: 'Fee_UserType', type: 'number', length: 1 },
      // CMPP_SUBMIT消息:扩展Fee_terminal_Id长度 为32字节，适应伪码的长度需求，并把其类型从Unsigned Integer修改为Octet String。
      { name: 'Fee_terminal_Id', type: 'string', length: 32 },
      // CMPP_SUBMIT消息:增加Fee_terminal_type 字段，表明Fee_terminal_Id是真实用户号码还是伪码
      { name: 'Fee_terminal_type', type: 'number', length: 1 },
      { name: 'TP_pId', type: 'number', length: 1 },
      { name: 'TP_udhi', type: 'number', length: 1 },
      { name: 'Msg_Fmt', type: 'number', length: 1 },
      { name: 'Msg_src', type: 'string', length: 6 },
      { name: 'FeeType', type: 'string', length: 2 },
      { name: 'FeeCode', type: 'string', length: 6 },
      { name: 'ValId_Time', type: 'string', length: 17 },
      { name: 'At_Time', type: 'string', length: 17 },
      { name: 'Src_Id', type: 'string', length: 21 },
      { name: 'DestUsr_tl', type: 'number', length: 1 }, // < 100
      // CMPP_SUBMIT消息:扩展Dest_terminal_Id的 单元长度为32字节，适应伪码的长度需求
      { name: 'Dest_terminal_Id', type: 'string', length: function (obj) { return obj.DestUsr_tl * 32 } },
      // CMPP_SUBMIT消息:增加Dest_terminal_type 字段，表明Dest_terminal_Id是真实用户号码还是伪码
      { name: 'Dest_terminal_type', type: 'number', length: 1 },
      { name: 'Msg_Length', type: 'number', length: 1 } //<= 140
      ,
      { name: 'Msg_Content', type: 'buffer', length: function (obj) { return obj.Msg_Length } },
      // 删除CMPP_SUBMIT、CMPP_DELIVER、 CMPP_FWD消息中的Reserve字段，添加LinkID字 段;(20个字节长字符串类型);
      { name: 'LinkID', type: 'string', length: 20 } //留空，点播业务使用的LinkID
      // { name: 'Reserve', type: 'string', length: 8 } //保留
  ],
  CMPP_SUBMIT_RESP: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      // 把所有响应消息中的状态码字段从1个字节扩展 为4个字节
      { name: 'Result', type: 'number', length: 4 }
  ],
  CMPP_DELIVER: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      { name: 'Dest_Id', type: 'string', length: 21 },
      { name: 'Service_Id', type: 'string', length: 10 },
      { name: 'TP_pid', type: 'number', length: 1 },
      { name: 'TP_udhi', type: 'number', length: 1 },
      { name: 'Msg_Fmt', type: 'number', length: 1 },
      { name: 'Src_terminal_Id', type: 'string', length: 32 },
      // CMPP_DELIVER消息:增加Src_terminal_type 字段，表明Src_terminal_Id是真实用户号码还是伪码;
      { name: 'Src_terminal_type', type: 'number', length: 1 },
      { name: 'Registered_Delivery', type: 'number', length: 1 } //0 非状态报告 1 状态报告
      ,
      { name: 'Msg_Length', type: 'number', length: 1 },
      { name: 'Msg_Content', type: 'buffer', length: function (obj) { return obj.Msg_Length } },
      // 删除CMPP_SUBMIT、CMPP_DELIVER、 CMPP_FWD消息中的Reserve字段，添加LinkID字 段;(20个字节长字符串类型);
      // { name: 'Reserve', type: 'string', length: 8 } //保留
      { name: 'LinkID', type: 'string', length: 20 }
  ],
  CMPP_DELIVER_REPORT_CONTENT: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      { name: 'Stat', type: 'string', length: 7 },
      { name: 'Submit_time', type: 'string', length: 10 },
      { name: 'Done_time', type: 'string', length: 10 },
      // CMPP_DELIVER消息传递内容为状态报告时， Msg_Content中的Dest_terminal_Id字段的长度从21 个字节扩充为32个字节;
      { name: 'Dest_terminal_Id', type: 'string', length: 32 },
      { name: 'SMSC_sequence', type: 'number', length: 4 }
  ],
  CMPP_DELIVER_RESP: [
      { name: 'Msg_Id', type: 'buffer', length: 8 },
      // 把所有响应消息中的状态码字段从1个字节扩展 为4个字节
      { name: 'Result', type: 'number', length: 4 }
  ]
}