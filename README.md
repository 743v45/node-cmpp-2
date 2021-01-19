# cmpp

cmpp v2.0 / v3.0 的实现方案

## Usage

```javascript
const Client = require('cmpp');

const client = new Client({
  host: '127.0.0.1',
  port: 7890,
  serviceId: 'serviceName',
  srcId: '10xxxxxx',
  heartbeatMaxAttempts: 3,
  heartbeatInterval: 3 * 60 * 1000,
  heartbeatTimeout: 60 * 1000,
  timeout: 30 * 1000,
  mobilesPerSecond: 200,
  version: 0x20, // or 0x30,
});

// 每秒的发送量
client.on('mobile_count', (sendingMobileCount) => {});

// 设置「上行回调」处理方法, 同步异步均支持
// 方法执行完成后发送 CMPP_DELIVER_RESP, 异常失败时 Result = 7 (业务代码错)
client.setReceive(async(body = {}) => {
  // console.log(body);
});

// 设置「下行回调」处理方法，同步异步均支持
// 方法执行完成后发送 CMPP_DELIVER_RESP, 异常失败时 Result = 7 (业务代码错)
client.setDeliver(async(body = {}) => {
  // console.log(body);
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

const SourceAddr = '100100'; // 源地址，此处为 SP_Id，即 SP 的企业代码
const SharedSecret = 'password'; // 授权密码
client.connect(SourceAddr, SharedSecret).catch(err => {});

// client.send(mobile, content, extendCode); // 扩展码可不填
client.send('1358888xxxx', '【签名】这里是内容', '1234');

// 批量发送, 上限 100 个号码
// client.sendGroup(['1358888xxxx', '1368888xxxx'], '【签名】这里是内容', '1234');

// 断开连接
client.disconnect()
```

---

## 备注

v0.x.x 基于 [@nbcat](https://www.npmjs.com/~nbnat) 实现的 [nb-cmpp-2](https://www.npmjs.com/package/nb-cmpp-2) 项目重写.
