# 指定 wsl IP 地址

~~~bash
sudo wsl -d Ubuntu-20.04 -u root ip addr add 172.25.25.26/24 broadcast 172.25.25.255 dev eth0 label eth0:1
sudo netsh interface ip add address "vEthernet (WSL)" 172.25.25.25 255.255.255.0
~~~

重启电脑后消失

