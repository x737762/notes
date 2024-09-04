# PVE 安装

> 版本：Virtual Environment 8.0.3

> 安装说明：安装 PVE 后删除自带的`local`、`local-lvm`存储，然后挂载 zfs 阵列作为存储盘。

## 一、安装 PVE

在选择硬盘时点击 options，maxvz 值设置为 0；maxroot 设置为硬盘大小。系统安装完成后就不会出现`local-lvm`分区。

。。。等待系统安装完成

## 二、删除 local

- 编辑`/usr/share/perl5/PVE/Storage/Plugin.pm`文件，注释创建`local`存储的代码。
  1. 在 `make sure we have a reasonable 'local:' storage`上面插入 `=comment-out` 行；
  2. 在 `delete($ids->{local}->{nodes});` 后面插入 `=cut` 行；
  3. 重启系统；

```bash
	......
    my $cfg = $class->SUPER::parse_config($filename, $raw);
    my $ids = $cfg->{ids};
=comment-out
    # make sure we have a reasonable 'local:' storage
    # we want 'local' to be always the same 'type' (on all cluster nodes)
    if (!$ids->{local} || $ids->{local}->{type} ne 'dir' ||
        ($ids->{local}->{path} && $ids->{local}->{path} ne '/var/lib/vz')) {
        $ids->{local} = {
            type => 'dir',
            priority => 0, # force first entry
            path => '/var/lib/vz',
            'prune-backups' => 'keep-all=1',
            content => {
                backup => 1,
                images => 1,
                iso => 1,
                rootdir => 1,
                snippets => 1,
                vztmpl => 1,
            },
        };
    }

    # make sure we have a path
    $ids->{local}->{path} = '/var/lib/vz' if !$ids->{local}->{path};

    # remove node restrictions for local storage
    delete($ids->{local}->{nodes});
=cut
    foreach my $storeid (keys %$ids) {
        my $d = $ids->{$storeid};
        .............
```

1. 删除`/var/lib/vz`目录；
2. 删除`/mnt/pve` 目录；
3. 编辑 `/etc/pve/storage.cfg`，清空里面所有内容。

## 导入存储池

```bash
# 查看可以导入的存储池
zpool import

# 导入存储池
zpool import source-pool
```

## 修改文件挂载 pve 存储

修改`/etc/pve/storage.cfg`文件呢容如下。

```bash
dir: template
        path /source-pool/template
        content vztmpl,iso
        prune-backups keep-all=1
        shared 0

dir: vm
        path /source-pool/vm
        content images,rootdir
        prune-backups keep-all=1
        shared 0

dir: backup
        path /source-pool/backup
        content backup
        prune-backups keep-all=1
        shared 0
```
