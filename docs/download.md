# 下载

## Android

<div style="padding: 24px 0;">
  <a href="https://github.com/nicai/musical/releases/latest" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; text-decoration: none; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3);">
    📦 下载最新 APK
  </a>
</div>

从 [GitHub Releases](https://github.com/nicai/musical/releases) 页面下载最新版本的 APK 安装包。

### 安装说明

1. 下载 `.apk` 文件到手机
2. 打开文件，按提示允许安装未知来源应用
3. 安装完成后即可使用

### 系统要求

- Android 7.0 (API 24) 及以上
- arm64 架构（绝大多数现代手机）

## iOS

暂未提供 iOS 安装包。你可以克隆源码自行构建：

```bash
git clone https://github.com/nicai/musical.git
cd musical
pnpm install
pnpm prebuild:ios
pnpm ios
```

## 支持的音频格式

| 格式 | 扩展名 |
|------|--------|
| MP3 | `.mp3` |
| AAC | `.m4a`, `.aac` |
| FLAC | `.flac` |
| OGG | `.ogg` |
| WAV | `.wav` |
| WMA | `.wma` |
