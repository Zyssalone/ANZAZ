# ANZAZ — Biodiversity Demo App

## Setup

```bash
cd anzaz
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

## Screens

| # | Screen | Navigation |
|---|--------|-----------|
| 1 | Splash | Auto-advances to Auth |
| 2 | Auth | Login / Sign Up — any input works |
| 3 | Home | Bottom tab |
| 4 | Capture | Centre tab button (modal) |
| 5 | Result | After tapping capture shutter |
| 6 | Map | Bottom tab — tap pins |
| 7 | Journal | Bottom tab — Grid / List toggle |
| 8 | Profile | Bottom tab — badges + leaderboard |
| 9 | Species Detail | Tap any species card |

## Stack

- Expo SDK 51 + React Native 0.74
- React Navigation 6 (Stack + Bottom Tabs)
- Reanimated 3 — all transitions and micro-interactions
- Lucide React Native — consistent icon set
- Fully hardcoded mock data — no backend needed
