# Hotel Booking Order Generator

A cross-platform Expo app for generating editable mobile-style hotel order and transfer bill previews. The app is built with Expo Router, React Native, TypeScript, NativeWind, and reusable React Native UI primitives.

> This project is intended for UI prototyping, testing, demos, and internal workflows. Do not use generated screens or images to impersonate real orders, payments, bookings, receipts, or financial records.

## Features

- Hotel order preview generator for Ctrip and Meituan-style layouts
- Transfer bill preview generator for WeChat and Alipay-style layouts
- Editable fields for order numbers, dates, hotel details, guest details, payment amount, bill status, account names, and transaction metadata
- Save generated previews to the device photo library on iOS and Android
- Responsive editor and phone-preview layout for wider screens
- iOS, Android, and web support through Expo
- English and Chinese i18n setup
- Supabase client utility with AsyncStorage session persistence
- Biome linting and formatting

## Tech Stack

- Expo SDK 56
- Expo Router
- React Native 0.85 and React 19
- TypeScript
- NativeWind and Tailwind CSS
- React Native Reusables / `@rn-primitives`
- Zustand
- React Query
- i18next / react-i18next
- Supabase
- Lucide React Native icons
- `expo-media-library` and `react-native-view-shot` for saving generated previews

## Prerequisites

- Node.js 22 or newer recommended
- npm 11 or newer recommended
- Xcode for iOS development
- Android Studio for Android development
- Expo development build for native device testing

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Fill in Supabase values if you use the Supabase client:

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The Supabase utility reads these values from the Expo public environment. If they are not needed for your work, keep Supabase-specific code out of the app flow or remove the utility and dependency.

## Running The App

Start Metro for an installed development build:

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on a physical iOS device:

```bash
npm run ios
```

Run on the iOS Simulator:

```bash
npm run ios:sim
```

Run on web:

```bash
npm run web
```

Use `npm run ios` or `npm run android` when installing the native development build for the first time, after changing native code, after adding native dependencies, or after changing native app configuration. For normal JavaScript, TypeScript, and style changes, keep the development build installed and use `npm start`.

If Metro, NativeWind, or Tailwind configuration changes, restart with a clean cache:

```bash
npm run startc
```

## Scripts

- `npm start` - start Expo for a development build
- `npm run startc` - start Expo with a clean cache
- `npm run start:go` - start Expo for Expo Go
- `npm run android` - build and run Android locally
- `npm run ios` - build and run on an available physical iOS device
- `npm run ios:sim` - build and run on the iOS Simulator
- `npm run web` - start the web app
- `npm run static` - export and serve a static web build
- `npm run lint` - run Biome checks
- `npm run format` - apply Biome formatting and fixes
- `npm run fix` - apply Biome formatting and fixes
- `npm run typecheck` - run TypeScript checks
- `npm run doctor` - run Expo Doctor
- `npm run align` - align Expo dependency versions
- `npm run prebuild` - generate native projects
- `npm run apk` - create a local Android production build with EAS
- `npm run ipa` - create a local iOS production build with EAS
- `npm run shadcn` - add React Native Reusables components
- `npm run taze` - check dependency updates

## Project Structure

```text
app/
  (tabs)/
    index.tsx       Hotel order generator
    transfer.tsx    Transfer bill generator
  _layout.tsx       Root app layout
components/         Shared components and UI primitives
components/ui/      Reusable UI components
assets/             App icons and reference images
screenshot/         Default preview image assets
locales/            Translation files
store/              Zustand store setup
utils/              Supabase client and utilities
scripts/            Local development helper scripts
```

## Main Screens

- `app/(tabs)/index.tsx` contains the hotel order generator. It supports Ctrip and Meituan-style previews, editable booking details, and saving the generated preview to the photo library.
- `app/(tabs)/transfer.tsx` contains the transfer bill generator. It supports WeChat and Alipay-style previews, editable transaction details, and saving the generated preview to the photo library.
- `app/(tabs)/_layout.tsx` defines the native tab navigation. Some starter tabs are currently hidden.

## Photo Library Saving

Generated previews are captured with `react-native-view-shot` and saved through `expo-media-library`.

Native permission strings are configured in `app.json`. After adding or changing native modules or permissions, rebuild the native app with `npm run ios`, `npm run ios:sim`, or `npm run android`.

Web can display the generator previews, but direct saving to the system photo library is only supported on native iOS and Android builds.

## Styling

NativeWind is configured for Tailwind CSS 4. Theme tokens live in `global.css` inside `@theme`, with light and dark CSS variables below it.

Important files:

- `global.css`
- `postcss.config.mjs`
- `metro.config.js`
- `babel.config.js`
- `nativewind-env.d.ts`

The app imports `global.css` once in `app/_layout.tsx`.

## Internationalization

Language detection reads the device locale via `expo-localization` and normalizes to `en` or `zh`.

To add a language:

1. Add `locales/<lang>.json`.
2. Register it in `locales/index.ts`.
3. Keep translation keys mirrored across locale files.

## Supabase

Supabase is included as a starter utility, not a required architecture choice. The client expects:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Auth sessions persist in AsyncStorage and auto-refresh by default.

## EAS Builds

`eas.json` includes `development`, `preview`, and `production` profiles. Before publishing a real app, update:

- `expo.name`
- `expo.slug`
- `expo.scheme`
- `android.package`
- iOS `bundleIdentifier` if you add iOS native config

## Native Projects

This template currently includes an Android native project. If you want a pure Expo CNG template, remove generated native folders and let each app run `npm run prebuild` when needed.

## Quality Checks

Run these before shipping changes:

```bash
npm run lint
npm run typecheck
npm run doctor
```

## Troubleshooting

- If NativeWind styles do not update, restart with `npm run startc`.
- If Expo reports dependency mismatches, run `npm run align`.
- If Supabase env values are missing, create `.env` from `.env.example`.
- If a new project uses different app identifiers, update `app.json` before native builds.
