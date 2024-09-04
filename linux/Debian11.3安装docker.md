# Debian11.3安装docker

> 系统版本：Linux iZj6cfj3q2ezf07u273jdnZ 5.10.0-15-amd64 #1 SMP Debian 5.10.120-1 (2022-06-09) x86_64 GNU/Linux



## 使用 apt 存储库安装



1. 设置 Docker 的 apt 存储库。

~~~bash
# 添加 Docker 的官方 GPG 密钥
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 向 Apt 源添加存储库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
~~~

2. 安装 Docker 包。

~~~bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
~~~

3. 通过运行 hello-world 映像验证安装是否成功。

~~~bash
sudo docker run hello-world
~~~

