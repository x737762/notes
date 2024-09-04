# pve虚拟机使用spice连接



## 修改虚拟机配置文件

~~~bash
vim /etc/pve/qemu-server/xxx.conf
# 添加如下内容
args: -spice port=6666,addr=0.0.0.0,disable-ticketing,seamless-migration=on
~~~

- -spice：配置spice。
- port：监听的端口。
- addr：允许访问的网络，0.0.0.0允许所有网络访问。
- disable-ticketing：去掉验证，如需加密验证，此参数改为：password=xxxxx。
- seamless-migration：on启用QMP支持。



## 连接远程桌面

在 spice 客户端数据 spice://10.10.10.10:6666 就可以正常连接了。

10.10.10.10：为pve主机ip地址。



## 创建 .vv 文件连接远程桌面

~~~bash
[virt-viewer]
type=spice
host=10.10.10.10 # pve ip
port=6603 # 端口
password=xxxx # 密码
~~~



