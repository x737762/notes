# zfs文件系统arc缓存调整

> 默认情况下，ZFS会使用宿主机50%的内存做为ARC缓存。

可以通过直接写入 `zfs_arc_max` 模块参数来更改当前引导的ARC使用限制。

~~~bash
 echo "$[10 * 1024*1024*1024]" >/sys/module/zfs/parameters/zfs_arc_max
~~~

要永久生效，请将以下行添加到 `/etc/modprobe.d/zfs.conf`中。

~~~bash
options zfs zfs_arc_max=8589934592
~~~

**注意**:如果所需的zfs_arc_max值小于或等于 zfs_arc_min（默认为系统内存的 1/32），则将忽略zfs_arc_max，除非您还将zfs_arc_min设置为最多 zfs_arc_max - 1。

如下，在256G内存的系统上，限制ARC为8GB，需要设置zfs_arc_min -1。只设置zfs_arc_max是不行的

```
echo "$[8 * 1024*1024*1024 - 1]" >/sys/module/zfs/parameters/zfs_arc_min
echo "$[8 * 1024*1024*1024]" >/sys/module/zfs/parameters/zfs_arc_max
```

如果根文件系统是 ZFS，则每次更改此值时都必须更新初始化接口： `update-initramfs -u`，同时重新启动才能激活这些更改。



