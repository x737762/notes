# PVE LXC 容器安装 MySQL8

> LXC 系统版本：Debian 12 MySQL：[下载地址](https://dev.mysql.com/downloads/mysql/)

## 下载安装 MySQL APT 存储库

```bash
curl -O https://repo.mysql.com//mysql-apt-config_0.8.28-1_all.deb
dpkg -i mysql-apt-config_0.8.28-1_all.deb
```

如果提示依赖错误：手动安装缺少依赖。

## 安装 MySQL

```bash
apt update
apt install mysql-server
systemctl start mysql
```

## 允许远程连接

```bash
mysql -uroot -p
use mysql;
update user set host='%' where user='root';
```

## 开放 3306 端口

```bash
iptables -I INPUT -p tcp --dport 3306 -j ACCEPT
iptables-save > /etc/sysconfig/iptables
```
