# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native music player app built with **Expo 51** and **TypeScript**. Targets iOS, Android, and Web. Uses pnpm as package manager.

## Common Commands

```bash
pnpm install              # Install dependencies
pnpm start                # Start Expo dev server
pnpm android              # Run on Android emulator/device
pnpm ios                  # Run on iOS simulator/device
pnpm web                  # Run web version
pnpm test                 # Run tests (Jest with jest-expo preset)
pnpm lint                 # Lint
pnpm build:android        # EAS cloud build (preview profile)
pnpm build-local:android  # Local Android build
```

## Architecture

### Routing & Navigation
File-based routing via **Expo Router** (`app/` directory). Bottom tab navigation with three screens: Play (home), Music library, and Me (profile).

### State Management
**Valtio** proxy-based reactive state. ViewModels extend `ViewModelBase` (in `libs/bizify/`) which wraps Valtio's `proxy`. Components subscribe via `$useSnapshot()`. Global state lives in `app-vms/globalVm.ts`.

### Audio Playback
`libs/AudioManager.ts` — singleton wrapping Expo AV with event emitter for playback status. Supports background audio.

### Data Layer
- **SQLite** (`services/db.service.ts`) — local persistence with tables: `sys_config` (settings) and `music` (tracks)
- **MusicService** (`services/music.service.ts`) — music list management, current track, playback logic
- **Expo FileSystem** (`utils/fs-utils.ts`) — scans for .mp3 files

### Key Directories
- `app/` — Screens and layouts (file-based routing)
- `app-vms/` — Valtio-based view models
- `services/` — Database and music business logic
- `libs/` — AudioManager singleton, ViewModelBase
- `components/` — Themed UI components
- `utils/` — File system, music utilities, RN helpers
- `constants/` — Theme colors, enums (MusicPlaySortEnum)
- `types/` — TypeScript types (MusicInfo)

### Path Aliases
`@/*` maps to project root (configured in tsconfig.json).
