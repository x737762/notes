# 开机自动挂载 smb 共享文件

可以编辑 `/etc/fstab` 文件实现开机自动挂载 smb 共享文件。

1. 安装 cifs-utils。

```bash
sudo apt install cifs-utils
```

2. 创建目录并挂载 smb 共享文件。

```bash
mkdir /mnt/smb
# 临时挂载
sudo mount -t cifs //10.10.10.11/share /mnt/smb -o username=myname,password=mypassword
```

3. 修改 `/etc/fstab` 文件实现开机自动挂载。

```bash
# 在 /etc/fstab 文件末尾添加如下内容
//10.10.10.11/share		/mnt/smb	cifs	username=myname,password=mypassword		0	0
```

4. 保存并关闭文件。

**注意：**IP 更换为自己的 IP，myname、mypassword 更换为自己共享文件夹的访问密码。
