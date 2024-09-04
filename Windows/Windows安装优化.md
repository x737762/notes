# Windows 安装优化

## 安装 powershell

1. 查看当前 powershell 版本，如果不是 7 以上版本则升级为[最新版本](https://docs.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2)。

```powershell
$psversiontable
```

2. 下载完后点直接以管理员安装。

## 安装 scoop

1. 以管理员身份运行 powershell。

2. 自定义 scoop 安装目录。

```powershell
$env:SCOOP='D:\Applications\Scoop'
[Environment]::SetEnvironmentVariable('SCOOP', $env:SCOOP, 'User')
```

3. 自定义 scoop 全局安装目录。

```powershell
$env:SCOOP_GLOBAL='D:\Applications\ScoopGlobal'
[Environment]::SetEnvironmentVariable('ScoopGlobal', $env:SCOOP_GLOBAL, 'Machine')
```

4. 自定义 scoop 缓存目录。

```powershell
$env:SCOOP_CACHE='D:\Applications\ScoopCache'
[Environment]::SetEnvironmentVariable('ScoopCache', $env:SCOOP_CACHE, 'Machine')
```

5. 安装 scoop

```powershell
iwr -useb get.scoop.sh | iex
```

## 安装 Windows-Terminal

1. 应用商店搜索安装。

2. 通过 scoop 安装

```powershell
scoop bucket add extras
scoop install windows-terminal
```

3. 配置 terminal

**setting.json**

```json
{
  "$help": "https://aka.ms/terminal-documentation",
  "$schema": "https://aka.ms/terminal-profiles-schema",
  "actions": [
    {
      "command": {
        "action": "copy",
        "singleLine": false
      },
      "keys": "ctrl+c"
    },
    {
      "command": "paste",
      "keys": "ctrl+v"
    },
    {
      "command": "find",
      "keys": "ctrl+shift+f"
    },
    {
      "command": {
        "action": "splitPane",
        "split": "auto",
        "splitMode": "duplicate"
      },
      "keys": "alt+shift+d"
    }
  ],
  "alwaysShowTabs": false,
  "copyFormatting": "none",
  "copyOnSelect": false,
  "defaultProfile": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
  "experimental.rendering.forceFullRepaint": true,
  "experimental.rendering.software": true,
  "initialCols": 145,
  "initialRows": 45,
  "profiles": {
    "defaults": {
      "backgroundImage": "desktopWallpaper",
      "backgroundImageOpacity": 0.4,
      "colorScheme": "Campbell",
      "font": {
        "face": "Hack Nerd Font",
        "size": 16
      },
      "icon": "C:\\Users\\Shi\\Pictures\\powershell.png",
      "opacity": 100,
      "padding": "20",
      "scrollbarState": "hidden",
      "startingDirectory": "D:\\",
      "tabTitle": "PowerShell",
      "useAcrylic": false
    },
    "list": [
      {
        "commandline": "%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
        "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
        "hidden": false,
        "name": "PowerShell 5"
      },
      {
        "commandline": "%SystemRoot%\\System32\\cmd.exe",
        "guid": "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}",
        "hidden": false,
        "icon": "C:\\Users\\Shi\\Pictures\\cmd.png",
        "name": "\u547d\u4ee4\u63d0\u793a\u7b26"
      },
      {
        "commandline": "\"C:\\Program Files\\PowerShell\\7\\pwsh.exe\" -nologo",
        "guid": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
        "hidden": false,
        "name": "PowerShell 7",
        "source": "Windows.Terminal.PowershellCore"
      }
    ]
  },
  "schemes": [
    {
      "background": "#0C0C0C",
      "black": "#0C0C0C",
      "blue": "#0037DA",
      "brightBlack": "#767676",
      "brightBlue": "#3B78FF",
      "brightCyan": "#61D6D6",
      "brightGreen": "#16C60C",
      "brightPurple": "#B4009E",
      "brightRed": "#E74856",
      "brightWhite": "#F2F2F2",
      "brightYellow": "#F9F1A5",
      "cursorColor": "#FFFFFF",
      "cyan": "#3A96DD",
      "foreground": "#CCCCCC",
      "green": "#13A10E",
      "name": "Campbell",
      "purple": "#881798",
      "red": "#C50F1F",
      "selectionBackground": "#FFFFFF",
      "white": "#CCCCCC",
      "yellow": "#C19C00"
    }
  ],
  "showTabsInTitlebar": true,
  "theme": "system"
}
```

## 安装 oh-my-posh

1. 通过 winget 安装 oh-my-posh

```powershell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

2. 修改 powershell 配置文件

```powershell
# 检测有没有配置文件，没有则创建
if (!(Test-Path -Path $PROFILE )) { New-Item -Type File -Path $PROFILE -Force }

# 用 notepad 修改配置文件
notepad $PROFILE
```

<!-- 3. 设置自定义主题

```powershell
Set-PoshPrompt -Theme  C:\Users\Shi\Documents\PowerShell\oh-my-posh-theme.json
# 'C:\Users\Shi\Documents\PowerShell\oh-my-posh-theme.json' 改成自己主题路径
``` -->

4. 在配置文件中添加下面代码

```ps1
oh-my-posh init pwsh --config C:\Users\Shi\Documents\PowerShell\oh-my-posh-theme.json | Invoke-Expression
# 'C:\Users\Shi\Documents\PowerShell\oh-my-posh-theme.json' 改成自己主题路径

Set-PSReadLineOption -PredictionSource History
# 启用 powershell 历史命令提示功能
```

5. 刷新配置文件或者重启 terminal

```powershell
. $PROFILE
```

6. oh-my-posh-theme 文件

**oh-my-posh-theme.json**

```json
{
  "$schema": "https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json",
  "blocks": [
    {
      "alignment": "left",
      "segments": [
        {
          "foreground": "#3A86FF",
          "properties": {
            "template": "{{ if .WSL }}WSL at {{ end }}{{.Icon}} "
          },
          "style": "plain",
          "type": "os"
        },
        {
          "background": "#242424",
          "foreground": "#f1184c",
          "powerline_symbol": "\ue0b0",
          "properties": {
            "display_host": false,
            "template": " {{ if .SSHSession }}\uf817 {{ end }}{{ .UserName }}"
          },
          "style": "powerline",
          "type": "session"
        },
        {
          "background": "#242424",
          "foreground": "#f1184c",
          "powerline_symbol": "\ue0b0",
          "properties": {
            "template": "- root \uf0e7"
          },
          "style": "powerline",
          "type": "root"
        },
        {
          "background": "#242424",
          "foreground": "#33DD2D",
          "powerline_symbol": "\ue0b0",
          "properties": {
            "folder_separator_icon": "/",
            "style": "full",
            "template": "\ue5ff {{ .Path }} "
          },
          "style": "powerline",
          "type": "path"
        },
        {
          "background": "#2f2f2f",
          "foreground": "#ffeb3b",
          "foreground_templates": [
            "{{ if or (.Working.Changed) (.Staging.Changed) }}#ffeb3b{{ end }}",
            "{{ if gt .Ahead 0 }}#8A4FFF{{ end }}",
            "{{ if gt .Behind 0 }}#2EC4B6{{ end }}"
          ],
          "properties": {
            "fetch_stash_count": true,
            "fetch_status": true,
            "fetch_upstream_icon": true,
            "template": "<#7a7a7a>\ue0b1 </>{{ .HEAD }} {{ .BranchStatus }}{{ if .Working.Changed }} \uf044 <#E84855>{{ .Working.String }}</>{{ end }}{{ if and (.Staging.Changed) (.Working.Changed) }} |{{ end }}{{ if .Staging.Changed }} \uf046 <#2FDA4E>{{ .Staging.String }}</>{{ end }}{{ if gt .StashCount 0}} \uf692 {{ .StashCount }}{{ end }}{{ if gt .WorktreeCount 0}} \uf1bb {{ .WorktreeCount }}{{ end }} "
          },
          "style": "diamond",
          "type": "git"
        },
        {
          "background": "#33DD2D",
          "background_templates": ["{{ if gt .Code 0 }}#f1184c{{ end }}"],
          "foreground": "#242424",
          "powerline_symbol": "\ue0b0",
          "properties": {
            "always_enabled": true,
            "template": " \ufc8d{{ if gt .Code 0 }}\uf00d{{ else }}\uf42e{{ end }} "
          },
          "style": "powerline",
          "type": "exit"
        }
      ],
      "type": "prompt"
    },
    {
      "alignment": "right",
      "segments": [
        {
          "background": "#2f2f2f",
          "foreground": "#fafafa",
          "leading_diamond": "\ue0b2",
          "properties": {
            "template": ""
          },
          "style": "diamond",
          "type": "text"
        },
        {
          "background": "#2f2f2f",
          "foreground": "#6CA35E",
          "properties": {
            "template": " \ue718 {{ if .PackageManagerIcon }}{{ .PackageManagerIcon }} {{ end }}{{ .Full }}<#7a7a7a> \ue0b3</>"
          },
          "style": "diamond",
          "type": "node"
        },
        {
          "background": "#242424",
          "foreground": "#FFBB00",
          "powerline_symbol": "\ue0b0",
          "properties": {
            "template": "{{ .CurrentDate | date .Format }} ",
            "time_format": "2006-01-02 15:04:05"
          },
          "style": "powerline",
          "type": "time"
        }
      ],
      "type": "prompt"
    },
    {
      "alignment": "left",
      "newline": true,
      "segments": [
        {
          "foreground": "#f1184c",
          "properties": {
            "template": "\u279c "
          },
          "style": "plain",
          "type": "text"
        }
      ],
      "type": "prompt"
    }
  ],
  "version": 1
}
```
