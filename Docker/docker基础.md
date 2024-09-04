# docker 基础

Docker 本身是一个容器运行载体或称之为管理引擎。

Docker 是一个 Client-Server 结构的系统，Docker 守护进程运行在主机上，然后通过 Socket 连接从客户端访问，守护进程从客户端接收命令并管理运行再主机上的容器。

## docker 的基本组成

- 镜像（image）：镜像就是一个只读模板。镜像可以用来创建 Docker 容器，一个镜像可以创建很多容器。它相当于一个 root 文件系统。
- 容器（container）：容器为镜像提供一个标准的和隔离的运行环境，它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证安全的平台。
- 仓库（repository）：集中存放镜像文件的场所。仓库分为公开仓库和私有仓库。

## 整体架构及底层通信原理

1. 用户使用 Docker Client 与 Docker Daemon 进行通信，并发送请求给后者。
2. Docker Daemon 作为 Docker 架构中的主体部分，首先提供 Docker Server 的功能使其可以接收 Docker Client 的请求。
3. Docker Engine 执行 Docker 内部的一系列工作，每一项工作都是以一个 Job 的形式存在。
4. Job 的运行过程中，当需要容器镜像是，则从 Docker Registry 中下载镜像，并通过镜像驱动 Graph driver 将下载镜像以 Graph 的形式存储。
5. 当需要为 Docker 创建网络环境时，通过网络驱动 Network driver 创建并配置 Docker 容器网络环境。
6. 当需要限制 Docker 容器运行资源或执行用户指令操作时，则通过 Exec driver 来完成。
7. Libcontainer 是一项独立的容器管理包，Network driver 以及 Exec driver 都是通过 libcontainer 来实现具体队容器进行的操作。

## 常用命令及常用参数

### 列出本地主机上的镜像

用法：`docker images [OPTIONS] [REPOSITORY[:TAG]]`

- options:

  - -a：列出本地所有镜像（含历史镜像层）。
  - -q：只显示镜像 ID。

- REPOSITORY：镜像的仓库源。
- TAG：镜像标签（版本号）。
- IMAGE ID：镜像 ID。
- CREATED：镜像创建时间。
- SIZE：镜像大小。

### 在仓库中搜索镜像。

用法：`docker search [OPTIONS] TERM`

### 从仓库中拉取一个镜像。

用法：`docker pull [OPTIONS] 镜像名称[:TAG|@DIGEST]`

**没有 TAG 默认下载最新版。**

### 删除一个镜像。

用法：`docker rmi [OPTIONS] 镜像名称 [IMAGE...]`

- options
  - -f：强制删除。

### 新建并并运行一个容器。

用法：`docker run [OPTIONS] 镜像名称 [COMMAND] [ARG...]`

- options:
  - --name='容器名称'：为容器指定一个名称。
  - -d：后台运行容器并返回容器 ID。
  - -i：以交互模式运行容器，通常与-t 同时使用。
  - -t：为容器重新分配一个伪终端，通常与-i 同时使用。
  - -P：随机端口映射。
  - -p：指定端口映射。

### 列出当前所有正在运行的容器。

用法：`docker ps [OPTIONS]`

- options:
  - -a：列出当前所有正在运行的容器+历史运行过的。
  - -l：显示最近创建的一个容器。
  - -n：显示最近创建的 n 个容器。
  - -q：静默模式，只显示容器编号。

### 退出容器。

- eixt：run 进去容器，exit 退出，容器停止。
- ctrl+p+q：run 进去容器，ctrl+p+q 退出，容器不停止。

### 启动已经停止运行的容器。

用法：`docker start [OPTIONS] 容器ID或名称`

- options:
  - -i：以交互模式启动容器。

### 重启容器。

用法：`docker restart [OPTIONS] 容器ID或名称`

### 停止容器。

用法：`docker restart [OPTIONS] 容器ID或名称`

### 强制停止容器。

用法：`docker kill [OPTIONS] 容器ID或名称`

### 删除已停止的容器。

用法：`docker rm [OPTIONS] 容器ID或名称`

- options
  - -f：强制删除。

一次删除多个容器实例

- `docker rm -f $(docker ps -a -q)`
- `docker ps -a -q | xargs docker rm`
