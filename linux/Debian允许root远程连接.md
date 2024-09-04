# Debian允许root远程连接



> 系统版本：Linux iZj6cfj3q2ezf07u273jdnZ 5.10.0-15-amd64 #1 SMP Debian 5.10.120-1 (2022-06-09) x86_64 GNU/Linux
>
> ssh版本：OpenSSH_8.4p1 Debian-5+deb11u3, OpenSSL 1.1.1w  11 Sep 2023



## 修改ssh配置文件

~~~bash
vim /etc/ssh/sshd_config

PermitRootLogin prohibit-password 	// 解除注释，prohibit-password 改为 yes
PasswordAuthentication yes          // 解除注释，值改成 yes 允许密码认证
~~~



## 重启 sshd 服务

~~~bash
systemctl restart sshd
~~~

