# PVE 使用 AX210 无线网卡上网

> 版本：7.4.1
>
> 千兆网卡：enp6s0
>
> 无线网卡：wlan0(AX210)
>
> pve IP：10.10.10.1/24
>
> pve 网关：10.10.10.1
>
> 路由器网关：192.168.31.1

## 查看系统是否正确驱动 WiFi 模块

```bash
ip addr
```

在输出的信息中查看是否包含 `w` 开头的网卡。


## 安装WiFi管理工具

这里使用iwd管理WiFi，主要原因是小巧，方便使用无需额外配置。

~~~bash
apt install iwd
# 或者下载deb包到U盘安装
dpgk -i iwd_1.14-3_amd64.deb
~~~

### 启动 iwd ，并设置开机启动。

~~~bash
systemctl start iwd
systemctl enable iwd
~~~

### 连接WiFi

~~~bash
# 查看无线网卡
iwctl device list

# 扫描并获取无线网络
iwctl station wlan0 scan
iwctl station wlan0 get-networks

# 连接无线网
iwctl --passphrase 密码 station 网卡 connect SSID
~~~

## 安装 DHCP 为虚拟机自动分配IP

- 安装 dnsmasq
~~~bash
apt install dnsmasq
~~~


- 修改配置文件 /etc/dnsmasq.conf
~~~bash
interface=vmbr0
dhcp-range=10.10.10.100,10.10.10.254,255.255.255.0,72h
~~~

- 设置开机启动
~~~bash
systemctl enable dnsmasq
~~~


## 配置网络让路由器下的其它设备能连上pve和虚拟机

编辑配置文件

- /etc/network/interfaces
```bash
auto lo
iface lo inet loopback

# 设置无线网卡静态IP
auto wlan0
iface wlan0 inet static
        address 192.168.31.2/24
        gateway 192.168.31.1

iface enp6s0 inet manual

# 设置 NAT
auto vmbr0
iface vmbr0 inet static
        address 10.10.10.2/24
        bridge-ports enp6s0
        bridge-stp off
        bridge-fd 0

        post-up echo 1 > /proc/sys/net/ipv4/ip_forward # 开启IP转发
        post-up bash /root/iptables.config.sh # 定义规则
```

- iptables.config.sh 
```bash
#!/usr/bin/env bash

# 设置NAT，让10.10.10.0/24的数据走wlan0网卡
iptables -t nat -A POSTROUTING -s '10.10.10.0/24' -o wlan0 -j MASQUERADE
iptables -t raw -I PREROUTING -i fwbr+ -j CT --zone 1

# 设置端口转发, 让路由器下的设备能访问到虚拟机
iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 8006 -j DNAT --to-destination 10.10.10.1:8006
iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 10100 -j DNAT --to-destination 10.10.10.100:80

# 设置默认路由，将所有未知目的地的数据包发送到 wlan0 网络接口上，并将它们的下一跳设置为 192.168.31.1
ip route add default via 192.168.31.1 dev wlan0
ip route flush cache
```

## 设置PCIE直通

- 修改 /etc/default/grub

~~~bash
# intel CPU
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"
# amd CPU
GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on iommu=pt"
~~~

- 更新grub
~~~bash
update-grub
~~~

- 编辑 /etc/modules 加载内核模块

~~~bash
#添加模块
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
~~~

- 添加黑名单 /etc/modprobe.d/blacklist.conf

~~~bash
# Nvidia
blacklist nvidiafb
blacklist nouveau
blacklist nvidia

# AMD

blacklist amdgpu
blacklist radeon

# Intel UHD
blacklist snd_hda_codec_hdmi
blacklist snd_hda_intel
blacklist snd_hda_codec
blacklist snd_hda_core
~~~

- 查看显卡ID
```bash
lspci -nn | grep -iA2 vga

03:00.0 VGA compatible controller [0300]: NVIDIA Corporation TU116 [GeForce GTX 1660 SUPER] [10de:21c4] (rev a1)
03:00.1 Audio device [0403]: NVIDIA Corporation TU116 High Definition Audio Controller [10de:1aeb] (rev a1)
03:00.2 USB controller [0c03]: NVIDIA Corporation TU116 USB 3.1 Host Controller [10de:1aec] (rev a1)
```

- 把ID添加到直通组中 /etc/modprobe.d/vfio.conf

~~~bash
options vfio-pci ids=10de:21c4,10de:1aeb,10de:1aec
~~~

- 更新文件系统

~~~bash
update-initramfs -u -k all
~~~

- 重启系统



deb http://mirrors.163.com/debian/ buster main non-free contrib
deb http://mirrors.163.com/debian/ buster-updates main non-free contrib
deb http://mirrors.163.com/debian/ buster-backports main non-free contrib
deb-src http://mirrors.163.com/debian/ buster main non-free contrib
deb-src http://mirrors.163.com/debian/ buster-updates main non-free contrib
deb-src http://mirrors.163.com/debian/ buster-backports main non-free contrib
deb http://mirrors.163.com/debian-security/ buster/updates main non-free contrib
deb-src http://mirrors.163.com/debian-security/ buster/updates main non-free contrib

