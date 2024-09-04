# NGINX安装

> 系统版本：Linux debian 6.1.0-23-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.99-1 (2024-07-15) x86_64 GNU/Linux



## 一、编译安装（推荐）

### 安装 Nginx

1. 下载 `nginx` 源文件

~~~bash
curl -O https://nginx.org/download/nginx-1.27.0.tar.gz
~~~

2. 解压源文件

~~~bash
tar zxf nginx-1.27.0.tar.gz
~~~

3. 编译安装 `nginx`

~~~bash
cd nginx-1.27.0
./configure --prefix=/usr/local/nginx
make
make install
~~~

- `Makefile `文件创建成功

~~~bash
creating objs/Makefile

Configuration summary
  + using system PCRE library
  + OpenSSL library is not used
  + using system zlib library

  nginx path prefix: "/usr/local/nginx"
  nginx binary file: "/usr/local/nginx/sbin/nginx"
  nginx modules path: "/usr/local/nginx/modules"
  nginx configuration prefix: "/usr/local/nginx/conf"
  nginx configuration file: "/usr/local/nginx/conf/nginx.conf"
  nginx pid file: "/usr/local/nginx/logs/nginx.pid"
  nginx error log file: "/usr/local/nginx/logs/error.log"
  nginx http access log file: "/usr/local/nginx/logs/access.log"
  nginx http client request body temporary files: "client_body_temp"
  nginx http proxy temporary files: "proxy_temp"
  nginx http fastcgi temporary files: "fastcgi_temp"
  nginx http uwsgi temporary files: "uwsgi_temp"
  nginx http scgi temporary files: "scgi_temp"
~~~



### 启动 Nginx

1. 进入 `nginx` 目录

~~~bash
cd /usr/local/nginx/sbin
~~~

~~~bash
./nginx           # 启动
./nginx -s stop   # 快速停止
./nginx -s quit   # 退出，在退出前完成已经接受的连接请求
./nginx -s reload # 重新加载配置
~~~

启动成功，输入ip地址应该能访问到页面。



### 安装成系统服务

1. 创建服务脚本 `vim /usr/lib/systemd/system/nginx.servie`， 内容如下

~~~bash
# 定义了服务的描述信息及启动顺序依赖关系。
[Unit]
# 服务提供一个简短的描述。
Description=nginx -	web server
# 定义服务启动的顺序。nginx 服务将在 network.target（网络服务）、remote-fs.target（远程文件系统挂载）和 nss-lookup.target（网络名称解析）完成后启动。
After=network.target remote-fs.target nss-lookup.target 

#定义了服务的安装设置，主要是它如何被启用或禁用。
[Install]
# 指定在哪个运行级别或目标下启动服务。multi-user.target 是一个典型的系统运行级别（对应于传统的运行级别 3），意味着 Nginx 服务将在系统进入多用户模式时启动。
WantedBy=multi-user.target

# 定义了如何启动、停止、重载和管理服务的具体操作。
[Service]
# 指定服务的启动类型为 forking，这意味着 Nginx 将启动一个主进程，然后派生（fork）子进程，主进程会退出，而子进程继续运行。这是 Nginx 的典型启动方式。
Type=forking
# 指定 Nginx 服务启动后，将其主进程的 PID（进程标识符）记录在 /usr/local/nginx/logs/nginx.pid 文件中。
PIDFile=/usr/local/nginx/logs/nginx.pid
# 在启动 Nginx 主进程前执行的命令。这个命令用于测试 Nginx 的配置文件是否正确。-t 表示测试配置文件，-c 后跟 Nginx 配置文件的路径。
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
# 启动 Nginx 主进程的命令，使用指定的配置文件路径（-c /usr/local/nginx/conf/nginx.conf）。
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
# 当 systemd 要求重载服务时执行的命令。-s reload 会通知 Nginx 重新加载其配置文件，而不需要完全重启服务。
ExecReload=/usr/local/nginx/sbin/nginx -s reload
# 停止 Nginx 服务。
ExecStop=/usr/local/nginx/sbin/nginx -s stop
# 退出 Nginx 服务。
ExecQuit=/usr/local/nginx/sbin/nginx -s quit
# 为服务提供一个独立的临时文件空间，其他服务无法访问这个服务的临时文件。
PrivateTmp=true
~~~

2. 重新加载系统服务

~~~bash
systemctl daemon-reload
~~~

3. 设置nginx开机启动

~~~bash
systemctl enable nginx.service
~~~





### **错误处理**

#### 缺少gcc编译器

- 提示：

~~~bash
checking for OS
 + Linux 6.1.0-23-amd64 x86_64
checking for C compiler ... not found

./configure: error: C compiler cc is not found
~~~

- 安装 `gcc`

~~~bash
apt install -y gcc
~~~



#### 缺少pcre库

- 提示：

~~~bash
./configure: error: the HTTP rewrite module requires the PCRE library.
You can either disable the module by using --without-http_rewrite_module
option, or install the PCRE library into the system, or build the PCRE library
statically from the source with nginx by using --with-pcre=<path> option.
~~~

- 安装 `pcre`

~~~bash
apt install -y libpcre3 libpcre3-dev
~~~



#### 缺少zlib库

- 提示：

~~~bash
./configure: error: the HTTP gzip module requires the zlib library.
You can either disable the module by using --without-http_gzip_module
option, or install the zlib library into the system, or build the zlib library
statically from the source with nginx by using --with-zlib=<path> option.
~~~

- 安装 `zlib`

~~~bash
apt install -y zlib1g zlib1g-dev
~~~



#### 缺少make工具

- 提示：

~~~bash
-bash: make: command not found
~~~

- 安装 `make`

~~~bash
apt install -y make
# 或者
apt install -y build-essential # 包含 make、gcc 等基本编译工具的元包
~~~





## 二、通过 apt 安装

1. 安装需要用到的工具

~~~bash
apt install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
~~~

2. 导入 `nginx` 签名密钥

~~~bash
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
~~~

3. 验证密钥是否正确

~~~bash
gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
~~~

4. 输出应包含完整指纹`573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62`如下

~~~bash
pub   rsa4096 2024-05-29 [SC]
      8540A6F18833A80E9C1653A42FD21310B49F6B46
uid                      nginx signing key <signing-key-2@nginx.com>

pub   rsa2048 2011-08-19 [SC] [expires: 2027-05-24]
      573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>

pub   rsa4096 2024-05-29 [SC]
      9E9BE90EACBCDE69FE9B204CBCDCD8A38D88A2B3
uid                      nginx signing key <signing-key-3@nginx.com>
~~~

5. 设置 `apt` 存储库

~~~bash
# 稳定版
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/debian `lsb_release -cs` nginx" | tee /etc/apt/sources.list.d/nginx.list
# 或者设置成 nginx mainline 包
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/mainline/debian `lsb_release -cs` nginx" | tee /etc/apt/sources.list.d/nginx.list
~~~

6. 为 `nginx` 包设置优先级，确保从 `nginx.org` 仓库中安装或升级 Nginx 而不是使用 `Debian` 官方仓库中的版本（可选）。

~~~bash
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" | tee /etc/apt/preferences.d/99nginx
~~~

7. 安装 `nginx`

~~~bash
apt update 
apt install nginx
~~~

