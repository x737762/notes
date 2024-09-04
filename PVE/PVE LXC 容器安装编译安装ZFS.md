# PVE LXC 容器安装编译安装 ZFS

```bash
apt install build-essential zlib1g-dev uuid-dev libblkid-dev libssl-dev alien linux-headers-amd64
```

```bash
#  signature from "Christian Hesse <eworm@archlinux.org>" is unknown trust 解决方法
rm -rf /etc/pacman.d/gnupg
pacman-key --init
pacman-key --populate
```
