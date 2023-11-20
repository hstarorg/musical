# musical

A musical player for myself. Only play local musics.

# Get started

## 选型说明

```js
// 路由库（https://reactnavigation.org/）
react-navigation;
// 定时器（https://github.com/ocetnik/react-native-background-timer）
react-native-background-timer
```

## react-native 升级工具

> https://react-native-community.github.io/upgrade-helper/

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
# 注意：如果要执行构建，那么需要满足两个条件
# 1. 需要生成密钥文件，并放在 src/android/app 下，密钥文件必须是 musical-release-key.keystore
# 2. 在 src/android/gradle.properties 中设置“配置密钥”中的内容，并设置好具体的密码
cd android
gradlew assembleRelease # 如果是Linux or Mac，则需要 ./gradlew assembleRelease
# 也可执行执行：
npm run build:android

# 可以从如下地址找到部署包
android/app/build/outputs/apk/release/app-release.apk
```

## 其他

```bash
# 清除 gradle 缓存
gradlew cleanBuildCache
```


# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).
