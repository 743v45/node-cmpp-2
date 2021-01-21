const Client = require('../index');

const client = new Client({
  host: '127.0.0.1',
  port: 7890,
  serviceId: '',
  srcId: '10690661',
  heartbeatMaxAttempts: 3,
  heartbeatInterval: 3 * 60 * 1000,
  heartbeatTimeout: 60 * 1000,
  timeout: 30 * 1000,
  mobilesPerSecond: 200,
  version: 0x30,
});

const SourceAddr = '900001'; // 源地址，此处为 SP_Id，即 SP 的企业代码
const SharedSecret = '888888'; // 授权密码

// 每秒的发送量
client.on('mobile_count', (sendingMobileCount) => {});

// 设置「上行回调」处理方法, 同步异步均支持
// 方法执行完成后发送 CMPP_DELIVER_RESP, 异常失败时 Result = 7 (业务代码错)
client.setReceive(async(body = {}) => {
  console.log(body);
});

// 设置「下行回调」处理方法，同步异步均支持
// 方法执行完成后发送 CMPP_DELIVER_RESP, 异常失败时 Result = 7 (业务代码错)
client.setDeliver(async(body = {}) => {
  console.log(body);
});

// 报错信息
client.on('error', (err) => {});

// 请求超时, command 为命令, 比如 CMPP_CONNECT
client.on('timeout', (command) => {});

client.on('terminated', (message) => {
  // 连接主动断开和心跳停止断开
  // undefined or 'heartbeat'
  console.log(message);
});

client.connect(SourceAddr, SharedSecret).then().catch(err => {});

let sendLoop = setInterval(() => {

  // client.send(mobile, content, extendCode); // 扩展码可不填
  client.send('13588881234', '【签名】这里是内容', '1234');

  // 批量发送, 上限 100 个号码
  // client.sendGroup(['1358888xxxx', '1368888xxxx'], '【签名】这里是内容', '1234');
}, 3000);

process.on('SIGTERM', function() {
  clearInterval(sendLoop);
  gracefulExit();
});

process.on('SIGINT', function() {
  clearInterval(sendLoop);
  gracefulExit();
});

function gracefulExit() {
  // 断开连接
  client.disconnect().finally(() => {process.exit();})
}
