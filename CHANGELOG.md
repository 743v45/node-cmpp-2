## v3.0.0

#### breaking changes

  - 引入 `client.setReceive(async() => {})` 和 `client.setDeliver(async() => {})` 设置「回调处理方法」。由原来的**并行**处理 「`CMPP_DELIVER_RESP` 响应」 / 「回调处理方法」改为**先**执行「回调处理方法」**后**执行「`CMPP_DELIVER_RESP` 响应」

#### Other changes

  - `CMPP_ACTIVE_TEST_RESP` 内容缺少 `Reserved`

## v2.2.0
  - 支持 `CMPP v3.0`