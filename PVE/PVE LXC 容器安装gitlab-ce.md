# PVE LXC 容器安装 GitLab-ce

> LXC 系统版本：Debian 12

## 安装配置依赖项

```bash
sudo apt-get update
sudo apt-get install -y curl openssh-server ca-certificates perl
```

## 添加 GitLab 包存储库并安装

```bash
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
sudo EXTERNAL_URL="https://gitlab.example.com" apt-get install gitlab-ce
```

- 遇到报错执行 `gitlab-ctl reconfigure manually to fix` 命令后重新执行安装命令。
- 默认 root 用户密码存储于 `/etc/gitlab/initial_password` 文件内，24 小时后自动删除。
