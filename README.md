# musical
A musical player for myself. Only play local musics.

# Get started

## 选型说明

```js
// 路由库（https://reactnavigation.org/）
react-navigation
```

## Connect to devices

```bash
# adb to 夜神模拟器 
# 如果遇到连接时提示：adb server version (36) doesn't match this client (41); killing...
# 则可以直接将 AndroidStudio 下的 adb 拷贝到夜神模拟器安装目录(root\Nox\bin)下，并重命名为 nox_adb.exe 覆盖同名文件
adb connect 127.0.0.1:62001
```