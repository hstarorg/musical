# Musical

A cross-platform music player built with React Native and Expo.

## Features

### Play

- Local music playback with background audio support
- Real-time audio waveform visualization (circular spectrum)
- Play controls: play/pause, next/previous, seek
- Four play modes: random, single loop, list loop, sequential
- Favorite toggle on the player screen

### Music Library

- Add music from device via file picker
- Scan device for local MP3 files
- Auto-extract ID3 metadata: title, artist, album, cover art, year, track number, duration
- Album cover display in music list

### Me

- Favorites collection
- Play history (auto-recorded, last 50 entries)
- Clear history

### Other

- Light / dark theme (follows system)
- Play queue with "next up" support
- SQLite local persistence

## Supported Platforms

| Platform | Status |
|----------|--------|
| iOS      | 16.0+  |
| Android  | 7.0+   |
| Web      | Partial |

## Supported Audio Formats

MP3, M4A, FLAC, OGG, WAV, AAC, WMA

---

## Development Guide

### Prerequisites

- Node.js >= 20
- pnpm
- Xcode 26+ (for iOS)
- Android Studio (for Android)

### Setup

```bash
# Install dependencies
pnpm install

# Install Skia prebuilt binaries (required for waveform visualization)
node node_modules/@shopify/react-native-skia/scripts/install-libs.js
```

### Run

```bash
pnpm start           # Expo dev server
pnpm ios             # iOS simulator
pnpm android         # Android emulator
pnpm web             # Web browser
```

### Build

```bash
# Regenerate native code (required after changing app.json or native dependencies)
pnpm prebuild

# Android APK
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Test

```bash
pnpm test
```

### Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Expo 55 (SDK 55) |
| Runtime | React 19, React Native 0.83 |
| Language | TypeScript (strict) |
| Routing | Expo Router (file-based) |
| State | Valtio 2.x (proxy-based reactive) |
| Audio | expo-audio |
| Database | expo-sqlite |
| Visualization | @shopify/react-native-skia |
| Metadata | music-metadata |
| Package Manager | pnpm |

### Project Structure

```
app/                  Screens & layouts (file-based routing)
app-vms/              Valtio ViewModels (player, library, me)
services/             SQLite database & music business logic
libs/                 AudioManager, ViewModelBase
components/           Shared UI components (MusicItem, WaveformVisualizer)
utils/                Helpers (metadata extraction, filesystem, formatting)
constants/            Theme colors, enums
types/                TypeScript type definitions
hooks/                useColorScheme, useThemeColor
```
