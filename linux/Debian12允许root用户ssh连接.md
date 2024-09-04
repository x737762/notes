# Debian12允许root用户ssh连接



1、修改`sshd_config`配置文件。

~~~bash
vim /etc/ssh/sshd_config

#PermitRootLogin prohibit-password
#解除注释并修改值
PermitRootLogin yes
~~~



2、重启ssh服务。

~~~bash
systemctl restart sshd.service
~~~

