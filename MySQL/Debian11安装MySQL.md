# Debian11安装MySQL

1. 下载MySQL

~~~bash
curl -O https://cdn.mysql.com//Downloads/MySQL-8.1/mysql-server_8.1.0-1debian11_amd64.deb-bundle.tar
~~~

2. 解压文件

~~~bash
tar -xvf mysql-server_8.1.0-1debian11_amd64.deb-bundle.tar
~~~

3. 安装MySQL

~~~bash
dpkg -i *.deb
apt install -f
~~~

4. 允许远程连接

~~~bash
mysql -uroot -p
use mysql;
update user set host='%' where user='root';
~~~

5. 开放 3306 端口

~~~bash
iptables -I INPUT -p tcp --dport 3306 -j ACCEPT
iptables-save > /etc/sysconfig/iptables
~~~

