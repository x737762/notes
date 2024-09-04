# Debian11.3 部署 WordPress

> 系统版本：Linux iZj6cfj3q2ezf07u273jdnZ 5.10.0-15-amd64 #1 SMP Debian 5.10.120-1 (2022-06-09) x86_64 GNU/Linux



## 1、下载wordpress压缩包

1. 下载wordpress压缩包到服务器并解压，这里解压到 `/root/wordpress`。

~~~bash
curl -O https://cn.wordpress.org/wordpress-6.6.1-zh_CN.tar.gz
tar zxf wordpress-6.6.1-zh_CN.tar.gz
~~~

2. 修改配置文件，把`/root/wordpress/wp-config-sample.php` 重命名成 `wp-config.php`，然后修改内容。

~~~php
define( 'DB_NAME', '你的数据库名' ); 
define( 'DB_USER', '你的用户名' );
define( 'DB_PASSWORD', '你的密码' );
define( 'DB_HOST', '172.17.0.4' );
define( 'DB_CHARSET', 'utf8mb4' );
~~~

**注意：**中文内容与后面数据库配置信息一致。



## 2、安装数据库

> 数据库使用 `MariaDB`，使用 `docker` 部署

1. 安装数据库（有数据库的跳过）。

~~~yml
version: '3.7'

services:
  mariaDB :
    image: mariadb
    container_name: MariaDB
    restart: always
    volumes:
      - ./mariadb/config:/etc/mysql/mariadb.conf.d
      - ./mariadb/data:/var/lib/mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: '&yC7fYvX5uAz91R0V!S&ip2y'
    networks:
      ng_net:
        ipv4_address: 172.17.0.4
        
networks:
  ng_net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.17.0.0/24
~~~

2. 创建数据库和 `wordpress` 用户（自行替换中文值）。

~~~mysql
CREATE DATABASE 你的数据库名;

CREATE USER '你的用户名'@'%' IDENTIFIED BY '你的密码';

GRANT ALL PRIVILEGES ON 你的数据库名.* TO '你的用户名'@'%';

FLUSH PRIVILEGES;
~~~

- 允许root用户远程登陆

~~~bash
vim /etc/mysql/mariadb.conf.d/50-server.cnf

bind-address = 0.0.0.0 # 改成0.0.0.0或者注释，然后重启服务器
~~~



## 3、创建 php-fpm 容器

1. 创建 `dockerfile` 文件。

~~~dockerfile
# 选择基础镜像
FROM php:8.2-fpm

# 安装PHP扩展和 GD 扩展
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-install pdo pdo_mysql mysqli \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 配置文件挂载路径
VOLUME ["/var/www/html"]

# 暴露端口
EXPOSE 9000

# 启动PHP-FPM
CMD ["php-fpm"]
~~~

2. 编译 php-fpm

~~~bash
docker build -t php-fpm .
~~~

3. 运行php-fpm

~~~yml
version: '3.7'

services:
  # php-fpm
  phpfpm :
    image: php-fpm
    container_name: phpfpm
    volumes:
      - /root/wordpress:/var/www/html
    networks:
      ng_net:
        ipv4_address: 172.17.0.5



networks:
  ng_net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.17.0.0/24
~~~

4. 进入`php-fpm`容器修改目录权限（php-fpm一般以`www-data`用户运行）。

~~~bash
docker exec -it phpfpm bash

chown -R www-data:www-data /var/www/html
~~~



## 4、创建 Nginx

1. 创建Nginx容器。

~~~bash
version: '3.7'

services:
  # Nginx
  nginx:
    image: nginx
    container_name: Nginx
    volumes:
      - ./wordpress:/wordpress
    ports:
      - "80:80"
      - "443:443"
    networks:
      ng_net:
        ipv4_address: 172.17.0.2

networks:
  ng_net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.17.0.0/24
~~~

2. 进入nginx容器修改配置文件

~~~bash
docker exec -it Nginx bash

vim /etc/nginx/conf.d/default.conf

server {
    listen 80;
    server_name beizong.cc www.beizong.cc;
    root /var/www/html;  # 确保这个路径是你存放 PHP 文件的位置

    location / {
        try_files $uri $uri/ /index.php?$query_string;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass 172.17.0.5:9000;  # 根据你的 PHP-FPM 配置调整
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~* \.(css|js|ico|jpg|jpeg|gif|png|svg|woff|woff2|ttf|eot|webp|ico|icon)$ {
        root /wordpress;
        try_files $uri =404;
        access_log off;
    }
}
~~~

3. 重启docker

~~~bash
docker compose restart 
~~~



输入服务器IP地址应该能正常访问网站了。
