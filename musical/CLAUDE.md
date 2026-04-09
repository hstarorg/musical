# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native music player app built with **Expo 55** (SDK 55), **React 19**, **React Native 0.83**, and **TypeScript**. Targets iOS, Android, and Web. Uses pnpm as package manager.

## Common Commands

```bash
pnpm install              # Install dependencies
pnpm start                # Start Expo dev server
pnpm ios                  # Run on iOS simulator
pnpm android              # Run on Android emulator
pnpm web                  # Run web version
pnpm test                 # Run tests (Jest with jest-expo preset)
pnpm lint                 # Lint (ESLint with expo config)
pnpm prebuild             # Regenerate native code (expo prebuild --clean)
```

## Architecture

### Routing & Navigation
File-based routing via **Expo Router** (`app/` directory). Bottom tab navigation with three screens: Play (home), Music library, and Me (profile/favorites/history).

### State Management
**Valtio 2.x** proxy-based reactive state. ViewModels extend `ViewModelBase` (in `libs/bizify/`) which wraps Valtio's `proxy`. Components subscribe via `$useSnapshot()`.

- `app-vms/playerVm.ts` — Playback control, progress, current music, play mode, favorites toggle
- `app-vms/libraryVm.ts` — Music library management, scanning, file selection
- `app-vms/meVm.ts` — Favorites list, play history, tab switching

### Audio Playback
`libs/AudioManager.ts` — singleton wrapping **expo-audio** (`createAudioPlayer`) with EventEmitter for playback status. Supports background audio, concurrency control (sequence-based load cancellation).

### Data Layer
- **SQLite** (`services/db.service.ts`) — local persistence via expo-sqlite, with transaction support
- **MusicService** (`services/music.service.ts`) — music CRUD, current track, playback logic, favorites, play history, play queue. All public methods await `ensureInit()` for safe DB access.
- **Tables**: `sys_config`, `music`, `favorites`, `play_history`, `play_queue`

### Play Modes
`MusicPlaySortEnum`: Random, SingleLoop, ListLoop, Asc. Auto-advances on track finish.

### Key Directories
- `app/` — Screens and layouts (file-based routing)
- `app-vms/` — Valtio-based view models
- `services/` — Database and music business logic
- `libs/` — AudioManager singleton, ViewModelBase
- `components/` — Themed UI components (from Expo template)
- `utils/` — File system, music utilities, RN helpers
- `constants/` — Theme colors (in `theme.ts`), enums (in `index.ts`)
- `types/` — TypeScript types (MusicInfo with id, name, path, duration, artist, album)
- `hooks/` — useColorScheme (guarantees 'light'|'dark'), useThemeColor

### Path Aliases
`@/*` maps to project root (configured in tsconfig.json).

### Theme System
Colors defined in `constants/theme.ts` with light/dark variants including: text, textSecondary, background, surface, tint, border, controlText, controlBg. Hook `useColorScheme()` guarantees `'light' | 'dark'` return type.
