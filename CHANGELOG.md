#Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]


## [v4.0.0] - 2021-06-11

### Changed

  - [BREAKING] rename `client.socket` to `client.conn`
  - 更新了 `send buffer` 和 `receive buffer` 的日志，输出更便于理解

### Fixed

  - 解决 socket 新旧交替的异常, 需要避免旧逻辑的 destroySocket 删除新逻辑的 socket


## [v3.0.2] - 2021-06-11

### Added
  - 优化 CMPP 鉴权锁，引入 `cmppConnected` 作为鉴权完成的标志

### Fixed
  - 要求 TCP 连接正常后发送 CMPP_CONNECT

## [v3.0.1] - 2021-05-27

### Fixed

  - 优化 Fee_terminal_Id 字段解析方式，由 number 类型改为 string 类型, 方便解析(不影响使用)

### Added

  - add cmpp protocol connection images
  - add CHANGELOG.md

## [v3.0.0] - 2021-01-21

### Changed

  - [BREAKING] 引入 `client.setReceive(async() => {})` 和 `client.setDeliver(async() => {})` 设置「回调处理方法」。由原来的**并行**处理 「`CMPP_DELIVER_RESP` 响应」 / 「回调处理方法」改为**先**执行「回调处理方法」**后**执行「`CMPP_DELIVER_RESP` 响应」
  - `CMPP_ACTIVE_TEST_RESP` 内容缺少 `Reserved`

## [v2.2.0] - 2020-12-09

### Added
  - 支持 `CMPP v3.0`