module.exports = {
  heartbeatInterval: 3 * 60 * 1000,
  heartbeatTimeout: 60 * 1000,
  heartbeatMaxAttempts: 3,
  timeout: 30 * 1000,
  port: 7890,
  host: '127.0.0.1',
  serviceId: 'serviceName',
  feeCode: '100',
  mobilesPerSecond: 200,
  mpsThreshold: 1, // mobile per second threshold
  srcId: '10xxxxxx',
  version: 0x20, // 默认为 2.0
}
