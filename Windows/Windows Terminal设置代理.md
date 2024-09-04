# Windows Terminal设置代理

## powershell & cmd

​	set http_proxy=http://127.0.0.1:10809
​	set https_proxy=http://127.0.0.1:10809
​	

	启动自动设置代理
		 -NoExit -c 'set http_proxy=http://127.0.0.1:10809';'set https_proxy=http://127.0.0.1:10809'

## wls2(Linux子系统)

​	export http_proxy=http://127.0.0.1:10809
​	export https_proxy=http://127.0.0.1:10809
​	
10809 为本机设置的代理端口