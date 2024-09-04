# Debian12安装Gitea

>系统信息：PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
>
>内核信息：Linux Gitea 6.8.12-1-pve #1 SMP PREEMPT_DYNAMIC PMX 6.8.12-1 (2024-08-05T16:17Z) x86_64 GNU/Linux



## 使用二进制文件安装

所有打包的二进制程序均包含 SQLite，MySQL 和 PostgreSQL 的数据库连接支持，同时网站的静态资源均已嵌入到可执行程序中，这一点和曾经的 Gogs 有所不同。



### 使用 wget 下载

使用以下命令下载适用于 64-bit Linux 平台的二进制文件。

~~~bash
wget -O gitea https://dl.gitea.com/gitea/1.22.1/gitea-1.22.1-linux-amd64
chmod +x gitea
~~~

[其它版本下载地址](https://dl.gitea.com/gitea/)

### 选择架构

- **对于 Linux**，`linux-amd64` 适用于 64-bit 的 Intel/AMD 平台。更多架构包含 `arm64` (Raspberry PI 4)，`386` (32-bit)，`arm-5` 以及 `arm-6`。
- **对于 Windows**，`windows-4.0-amd64` 适用于 64-bit 的 Intel/AMD 平台，`386` 适用于 32-bit 的 Intel/AMD 平台。（提示：`gogit-windows` 版本内建了 gogit 可能缓解在旧的 Windows 平台上 Go 程序调用 git 子程序时面临的 [性能问题](https://github.com/go-gitea/gitea/pull/15482)）
- **对于 macOS**，`darwin-arm64` 适用于 Apple Silicon 架构，`darwin-amd64` 适用于 Intel 架构.
- **对于 FreeBSD**，`freebsd12-amd64` 适用于 64-bit 的 Intel/AMD 平台。



## 验证 GPG 签名

Gitea 对打包的二进制文件使用 [GPG密钥](https://keys.openpgp.org/search?q=teabot@gitea.io) 签名以防止篡改。 请根据对应文件名 `.asc` 中包含的校验码检验文件的一致性。

```sh
gpg --keyserver keys.openpgp.org --recv 7C9E68152594688862D62AF62D9AE806EC1592E2
gpg --verify gitea-1.22.1-linux-amd64.asc gitea-1.22.1-linux-amd64
```

校验正确时的信息为 `Good signature from "Teabot <teabot@gitea.io>"`。 校验错误时的信息为 `This key is not certified with a trusted signature!`。



## 服务器设置

**提示：** `GITEA_WORK_DIR` 表示 Gitea 工作的路径。

### 准备环境

检查是否安装 Git。要求 Git 版本 >= 2.0。

```sh
git --version
```

创建用户（推荐使用名称 `git`）

```sh
adduser \
   --system \
   --shell /bin/bash \
   --gecos 'Git Version Control' \
   --group \
   --disabled-password \
   --home /home/git \
   git
```



### 创建工作路径

```sh
mkdir -p /var/lib/gitea/{custom,data,log}
chown -R git:git /var/lib/gitea/
chmod -R 750 /var/lib/gitea/
mkdir /etc/gitea
chown root:git /etc/gitea
chmod 770 /etc/gitea
```



> **注意：** 为了让 Web 安装程序可以写入配置文件，我们临时为 `/etc/gitea` 路径授予了组外用户 `git` 写入权限。建议在安装结束后将配置文件的权限设置为只读。
>
> ```sh
> chmod 750 /etc/gitea
> chmod 640 /etc/gitea/app.ini
> ```

### 配置 Gitea 工作路径

**提示：** 如果使用 Systemd 管理 Gitea 的 Linux 服务，你可以采用 `WorkingDirectory` 参数来配置工作路径。 否则，使用环境变量 `GITEA_WORK_DIR` 来明确指出程序工作和数据存放路径。

```sh
export GITEA_WORK_DIR=/var/lib/gitea/
```



### 复制二进制文件到全局位置

```sh
cp gitea /usr/local/bin/gitea
```



### 添加 bash/zsh 自动补全（从 1.19 版本开始）

可以在 [`contrib/autocompletion/bash_autocomplete`](https://raw.githubusercontent.com/go-gitea/gitea/main/contrib/autocompletion/bash_autocomplete) 找到启用 bash 自动补全的脚本。可以将其复制到 `/usr/share/bash-completion/completions/gitea`，或在 `.bashrc` 中引用。

在文件末尾添加以下行：

~~~bash
if [ -f /usr/share/bash-completion/completions/gitea ]; then
    . /usr/share/bash-completion/completions/gitea
fi
~~~

重新加载 `.bashrc` 文件以应用更改：

~~~bash
source ~/.bashrc
~~~



同样地，zsh 自动补全的脚本可以在 [`contrib/autocompletion/zsh_autocomplete`](https://raw.githubusercontent.com/go-gitea/gitea/main/contrib/autocompletion/zsh_autocomplete) 找到。您可以将其复制到 `/usr/share/zsh/_gitea`，或在您的 `.zshrc` 中引用。

具体情况可能会有所不同，这些脚本可能需要进一步的改进。



## 运行 Gitea

### 1. 创建服务自动启动 Gitea（推荐）

在 terminal 中执行以下命令：

```text
sudo vim /etc/systemd/system/gitea.service
```

~~~bash
[Unit]
Description=Gitea (Git with a cup of tea)
After=network.target
###
# Don't forget to add the database service dependencies
###
#
#Wants=mysql.service
#After=mysql.service
#
#Wants=mariadb.service
#After=mariadb.service
#
#Wants=postgresql.service
#After=postgresql.service
#
#Wants=memcached.service
#After=memcached.service
#
#Wants=redis.service
#After=redis.service
#
###
# If using socket activation for main http/s
###
#
#After=gitea.main.socket
#Requires=gitea.main.socket
#
###
# (You can also provide gitea an http fallback and/or ssh socket too)
#
# An example of /etc/systemd/system/gitea.main.socket
###
##
## [Unit]
## Description=Gitea Web Socket
## PartOf=gitea.service
##
## [Socket]
## Service=gitea.service
## ListenStream=<some_port>
## NoDelay=true
##
## [Install]
## WantedBy=sockets.target
##
###

[Service]
# Uncomment the next line if you have repos with lots of files and get a HTTP 500 error because of that
# LimitNOFILE=524288:524288
RestartSec=2s
Type=simple
User=git
Group=git
WorkingDirectory=/var/lib/gitea/
# If using Unix socket: tells systemd to create the /run/gitea folder, which will contain the gitea.sock file
# (manually creating /run/gitea doesn't work, because it would not persist across reboots)
#RuntimeDirectory=gitea
ExecStart=/usr/local/bin/gitea web --config /etc/gitea/app.ini
Restart=always
Environment=USER=git HOME=/home/git GITEA_WORK_DIR=/var/lib/gitea
# If you install Git to directory prefix other than default PATH (which happens
# for example if you install other versions of Git side-to-side with
# distribution version), uncomment below line and add that prefix to PATH
# Don't forget to place git-lfs binary on the PATH below if you want to enable
# Git LFS support
#Environment=PATH=/path/to/git/bin:/bin:/sbin:/usr/bin:/usr/sbin
# If you want to bind Gitea to a port below 1024, uncomment
# the two values below, or use socket activation to pass Gitea its ports as above
###
#CapabilityBoundingSet=CAP_NET_BIND_SERVICE
#AmbientCapabilities=CAP_NET_BIND_SERVICE
###
# In some cases, when using CapabilityBoundingSet and AmbientCapabilities option, you may want to
# set the following value to false to allow capabilities to be applied on gitea process. The following
# value if set to true sandboxes gitea service and prevent any processes from running with privileges
# in the host user namespace.
###
#PrivateUsers=false
###

[Install]
WantedBy=multi-user.target
~~~

激活 gitea 并将它作为系统自启动服务：

```text
sudo systemctl enable gitea
sudo systemctl start gitea
```



### 2. 通过命令行终端运行

```sh
GITEA_WORK_DIR=/var/lib/gitea/ /usr/local/bin/gitea web -c /etc/gitea/app.ini
```