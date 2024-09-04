# pve虚拟机核显驱动安装

**说明：**pve中intel核显虚拟化后直通给虚拟机，虚拟机驱动安装。

> 系统：Debian 12.0.0
>
> 由于 Debian 内核中缺少一部分模块，所以需要重新编译内核安装。
>
> 虚拟机配置：
>
> - BIOS：OVMF(UEFI)
> - 显卡：默认
> - 机型：q35
>
> 禁用预注册密钥。否则会导致无法启动。

1. 安装 6.1 内核源码。

~~~bash
apt -y install dkms dwarves git linux-source-6.1 pahole vainfo
cd /usr/src
tar xJvf linux-source-6.1.tar.xz
~~~

2. 复制 Debian 原始构建配置到源码中。

~~~bash
cp /boot/config-6.1.0-10-amd64 /usr/src/linux-source-6.1/.config
~~~

3. 编辑 `/usr/src/linux-source-6.1/.config` 配置文件，并确保下列参数存在（不存在则自己添加）。

~~~bash
CONFIG_INTEL_MEI_PXP=m
CONFIG_DRM_I915_PXP=y
~~~

4. 编译并安装内核。

~~~bash
cd /usr/src/linux-source-6.1
make deb-pkg LOCALVERSION=-sriov KDEB_PKGVERSION=$(make kernelversion)-1

	。。。遇到提示确认，全部按回车。。。
	。。。等待内核编译完成成。。。

dpkg -i /usr/src/*.deb
reboot
~~~

5. 验证新的内核是否正常运行。

~~~bash
uname -r
6.1.38-sriov
~~~

6. 编译并安装驱动。

~~~bash
cd /usr/src
git clone https://github.com/strongtz/i915-sriov-dkms i915-sriov-dkms-6.1

# 修改 /usr/src/i915-sriov-dkms-6.1/dkms.conf 文件
PACKAGE_NAME="i915-sriov-dkms"
PACKAGE_VERSION="6.1"

# 编译并安装驱动
dkms install --force -m i915-sriov-dkms -v 6.1

# 修改 grub 文件
GRUB_CMDLINE_LINUX_DEFAULT="quiet i915.enable_guc=3"

# 更新
update-grub
update-initramfs -u
poweroff
~~~

7. 添加一个 0000:01:00.x 的驱动并启动虚拟机

~~~bash
root@debian:~# lspci | grep -i vga
00:01.0 VGA compatible controller: Device 1234:1111 (rev 02)
01:00.0 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c)
root@debian:~# lspci -vs 01:00
01:00.0 VGA compatible controller: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730] (rev 0c) (prog-if 00 [VGA controller])
        Subsystem: Intel Corporation Alder Lake-S GT1 [UHD Graphics 730]
        Physical Slot: 0
        Flags: bus master, fast devsel, latency 0, IRQ 43
        Memory at c1000000 (64-bit, non-prefetchable) [size=16M]
        Memory at 7000000000 (64-bit, prefetchable) [size=512M]
        Capabilities: [70] Express Endpoint, MSI 00
        Capabilities: [ac] MSI: Enable+ Count=1/1 Maskable+ 64bit-
        Kernel driver in use: i915
        Kernel modules: i915

root@debian:~# dmesg | grep i915
[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.1.38-sriov root=UUID=ca2fb4a3-be33-4da2-af9a-68c6ab5c4946 ro quiet i915.enable_guc=3
[    0.014761] Kernel command line: BOOT_IMAGE=/boot/vmlinuz-6.1.38-sriov root=UUID=ca2fb4a3-be33-4da2-af9a-68c6ab5c4946 ro quiet i915.enable_guc=3
[    1.790525] i915: loading out-of-tree module taints kernel.
[    1.890999] i915: module verification failed: signature and/or required key missing - tainting kernel
[    2.014078] i915 0000:01:00.0: Running in SR-IOV VF mode
[    2.014509] i915 0000:01:00.0: [drm] GT0: GUC: interface version 0.1.0.0
[    2.015784] i915 0000:01:00.0: [drm] VT-d active for gfx access
[    2.015802] i915 0000:01:00.0: [drm] Using Transparent Hugepages
[    2.016533] i915 0000:01:00.0: [drm] GT0: GUC: interface version 0.1.0.0
[    2.016804] i915 0000:01:00.0: GuC firmware PRELOADED version 1.0 submission:SR-IOV VF
[    2.016806] i915 0000:01:00.0: HuC firmware PRELOADED
[    2.018736] i915 0000:01:00.0: [drm] Protected Xe Path (PXP) protected content support initialized
[    2.018741] i915 0000:01:00.0: [drm] PMU not supported for this GPU.
[    2.018793] [drm] Initialized i915 1.6.0 20201103 for 0000:01:00.0 on minor 1
root@debian:~#
root@debian:~# ls /dev/dri
by-path  card0  card1  renderD128
root@debian:~#
~~~



**如果是其它 Linux 发现版，例如 Ubuntu 直接跳过前三步，从第4步开始就行。**





