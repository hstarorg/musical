# Musical

你的私人音乐空间 — 开源跨平台音乐播放器。

## 功能特性

### 播放

- 本地音乐播放，支持后台播放
- 6 种实时波形可视化效果（环形频谱、柱状频谱、流动波浪、粒子脉冲、水波涟漪、山脉地形）
- 播放控制：播放/暂停、上一曲/下一曲、进度拖拽
- 四种播放模式：随机、单曲循环、列表循环、顺序
- 播放页一键收藏

### 音乐库

- 从设备选择文件添加音乐
- 扫描系统媒体库自动发现音乐
- 自动读取 ID3 元数据：歌曲名、艺术家、专辑、封面、年份、曲目号、时长
- 左滑删除歌曲
- 重复歌曲自动去重

### 我的

- 收藏列表
- 播放历史（自动记录，最近 50 条）
- 清空历史

### 其他

- 亮色/深色主题（跟随系统）
- 播放队列
- SQLite 本地持久化

## 支持的平台

| 平台 | 最低版本 |
|------|---------|
| iOS | 16.0+ |
| Android | 7.0+ (API 24) |

## 支持的音频格式

MP3, M4A, FLAC, OGG, WAV, AAC, WMA

---

## 开发指南

### 环境要求

- Node.js >= 20
- pnpm
- Xcode 26+（iOS 构建）
- Android Studio（Android 构建）

### 安装

```bash
# 安装依赖
pnpm install

# 安装 Skia 预编译二进制（波形可视化需要）
node node_modules/@shopify/react-native-skia/scripts/install-libs.js
```

### 开发运行

```bash
pnpm start           # Expo 开发服务器
pnpm ios             # iOS 模拟器
pnpm android         # Android 模拟器
pnpm web             # Web 浏览器
```

### iOS 构建

```bash
# 1. 生成 iOS 原生代码
pnpm prebuild:ios

# 2. 在 Xcode 中构建（推荐）
open ios/musical.xcworkspace
# 选择目标设备 → Product → Build

# 或命令行构建
cd ios && xcodebuild -workspace musical.xcworkspace -scheme musical -configuration Release -sdk iphoneos
```

### Android 构建

```bash
# 1. 生成 Android 原生代码
pnpm prebuild:android

# 2. 打 Release APK
cd android && ./gradlew assembleRelease

# APK 输出路径
# android/app/build/outputs/apk/release/app-release.apk

# 3.（可选）打 AAB（用于 Google Play）
cd android && ./gradlew bundleRelease
```

> 默认只打 arm64 架构以减小包体积。如需支持更多架构，修改 `app.json` 中 `expo-build-properties` 的 `buildArchs` 配置。

### 测试

```bash
pnpm test
```

### 生成 Logo

```bash
node scripts/generate-logo.mjs
```

自动生成 app 图标、启动屏图标、favicon、Android 自适应图标、官网 logo。

### 官网

```bash
pnpm --filter docs dev      # 本地预览
pnpm --filter docs build    # 构建静态文件
```

推送到 `main` 分支后 GitHub Actions 自动部署到 GitHub Pages。

### 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Expo 55 (SDK 55) |
| 运行时 | React 19, React Native 0.83 |
| 语言 | TypeScript (strict) |
| 路由 | Expo Router (文件路由) |
| 状态管理 | Valtio 2.x |
| 音频 | expo-audio |
| 数据库 | expo-sqlite |
| 可视化 | @shopify/react-native-skia |
| 元数据 | music-metadata |
| 包管理 | pnpm |

### 项目结构

```
app/                  页面和布局（文件路由）
app-vms/              Valtio ViewModel（player, library, me）
services/             SQLite 数据库和音乐业务逻辑
libs/                 AudioManager, ViewModelBase
components/           共享 UI 组件（MusicItem, AudioVisualizer, DefaultCover）
utils/                工具函数（元数据提取、媒体库扫描、格式化）
constants/            主题颜色、枚举
types/                TypeScript 类型定义
hooks/                useColorScheme, useThemeColor
docs/                 官网（VitePress）
scripts/              构建脚本（Logo 生成等）
```

## 许可证

MIT
