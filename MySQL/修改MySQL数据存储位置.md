# 修改MySQL数据存储位置

## 查看MySQL配置文件位置

~~~bash
mysql --help | grep "Default options" -A 1
# 输出
Default options are read from the following files in the given order:
/etc/my.cnf /etc/mysql/my.cnf ~/.my.cnf
~~~

## 查看MySQL默认数据位置

~~~mysql
mysql> show variables like "%datadir%";
+---------------+-------------------+
| Variable_name | Value             |
+---------------+-------------------+
| datadir       | /var/lib/mysql/   |
+---------------+-------------------+
1 row in set (0.00 sec)
~~~

## 修改配置文件

1. 同步原有数据。

~~~bash
rsync -av /var/lib/mysql /mnt/mysql
~~~

2. 修改 `/etc/mysql/my.cnf` 配置文件。

~~~bash
[mysqld]
datadir	= /mnt/mysql/mysql
~~~

3. 重启MySQL

~~~bash
systemctl restart mysql.service
~~~

