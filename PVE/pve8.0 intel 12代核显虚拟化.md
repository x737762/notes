# pve8.0 intel 12代核显虚拟化

> 版本信息：Linux beizong 6.2.16-3-pve #1 SMP PREEMPT_DYNAMIC PVE 6.2.16-3 (2023-06-17T05:58Z) x86_64 GNU/Linux
>
> CPU：i3-12100 
>
> 驱动：[[i915-sriov-dkms](https://github.com/strongtz/i915-sriov-dkms)]



1. 修改国内镜像源。

~~~bash
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware

# deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
# # deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware

deb https://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
# deb-src https://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/pve bookworm pve-no-subscription
~~~

2. 开启直通，修改 `/etc/default/grub` 文件的 `GRUB_CMDLINE_LINUX_DEFAULT` 内容。

~~~bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on i915.enable_guc=3 i915.max_vfs=7"
~~~

3. 安装内核头文件。

~~~bash
apt install pve-headers-$(uname -r)
~~~

4. 安装驱动编译需要的软件包。

~~~bash
apt install build-* dkms
~~~

5. 克隆驱动仓库。

~~~bash
git clone https://github.com/strongtz/i915-sriov-dkms.git
~~~

6. 修改包名和包版本，在克隆的仓库中修改`dkms.conf`文件。

~~~bash
# PACKAGE_NAME="@_PKGBASE@"
# PACKAGE_VERSION="@PKGVER@"
# 改成
PACKAGE_NAME="i915-sriov-dkms"
PACKAGE_VERSION="6.1"
~~~

7. 移动仓库至 `/usr/src/i915-sriov-dkms-6.1`.

~~~bash
mv -f ./i915-sriov-dkms /usr/src/i915-sriov-dkms-6.1
~~~

8. 编译并安装驱动。

~~~bash
dkms install --force -m i915-sriov-dkms  -v 6.1
~~~

9. 检查驱动安装情况。

~~~bash
dkms status
# 输出如下内容表示安装成功了
i915-sriov-dkms/6.1, 6.2.16-3-pve, x86_64: installed
# 如果没成功，删除掉重来
# dkms remove i915-sriov-dkms/6.1 --all
~~~

10. 更新 `grub` 和 `initrramfs` 。

~~~bash
update-grub && update-initramfs -u
~~~

11. 启用 VFs，修改 `sysfs` 变量。

~~~bash
apt install sysfsutils
echo "devices/pci0000:00/0000:00:02.0/sriov_numvfs = 7" > /etc/sysfs.conf
# 00:02 换成自己的 GPU ID，使用 lspci | grep VGA 查看
~~~

12. 重启系统，查看是否成功。

~~~bash
lspci | grep VGA
00:02.0 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c)
00:02.1 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c)
00:02.2 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c)
00:02.3 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c)
00:02.4 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c)
00:02.5 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c)
00:02.6 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c)
00:02.7 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c)
~~~

**注意：**只有UEFI，q35支持。不要直通.0设备，即0000:00:02.0设备，不要勾选全部功能。











