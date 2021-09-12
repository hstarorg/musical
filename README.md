# musical

A musical player for myself. Only play local musics.

# Get started

## 选型说明

```js
// 路由库（https://reactnavigation.org/）
react - navigation;
```

## Connect to devices

```bash
# adb to 夜神模拟器
# 如果遇到连接时提示：adb server version (36) doesn't match this client (41); killing...
# 则可以直接将 AndroidStudio 下的 adb 拷贝到夜神模拟器安装目录(root\Nox\bin)下，并重命名为 nox_adb.exe 覆盖同名文件
adb connect 127.0.0.1:62001
```

## 发布

```bash
# 设置应用ICON，可以在 https://icon.wuruihong.com/ 一键生成多分辨率icon，然后替换 android\app\src\main\res 目录的内容

# 生成密钥文件
keytool -genkeypair -v -storetype PKCS12 -keystore musical-release-key.keystore -alias musical -keyalg RSA -keysize 2048 -validity 1000

# 配置密钥，在 android/app/gradle.properties 添加如下内容
MYAPP_RELEASE_STORE_FILE=musical-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=musical
MYAPP_RELEASE_STORE_PASSWORD=具体的密码
MYAPP_RELEASE_KEY_PASSWORD=具体的密码

# 生成 release 包
cd android
gradlew assembleRelease # 如果是Linux or Mac，则需要 ./gradlew assembleRelease

# 可以从如下地址找到部署包
android/app/build/outputs/apk/release/app-release.apk
```
