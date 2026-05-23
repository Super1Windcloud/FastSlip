# Create Expo Stack Template

Modern Expo starter for multi-platform apps. It ships with Expo Router, TypeScript,
Biome, NativeWind, Tailwind CSS, shadcn-inspired React Native primitives, Supabase
utilities, Zustand, React Query, and English/Chinese i18n.

## Tech Stack

- Expo SDK 56 with Expo Router
- React Native 0.85 and React 19
- TypeScript in strict mode
- Biome for linting and formatting
- NativeWind v5 preview with Tailwind CSS 4
- React Native Reusables / `@rn-primitives` UI primitives
- i18n with `i18next`, `react-i18next`, and `expo-localization`
- Supabase client wrapper with AsyncStorage session persistence
- Zustand, React Query, React Hook Form, Zod, and Lucide icons

## Getting Started

### Prerequisites

- Node.js 22+ recommended
- npm 11+ recommended
- Android Studio / Xcode for local development builds

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env` from `.env.example` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

`utils/supabase.ts` throws during import when either value is missing. If your app
does not use Supabase, remove `utils/supabase.ts` and the Supabase-related
dependencies.

### Run The App

```bash
npm start       # Expo CLI for a development build
npm run android # expo run:android
npm run ios     # expo run:ios
npm run web     # expo start --web
```

Run `npm run android` or `npm run ios` once to install a development build, then
use `npm start` for the Metro server. Use `npm run start:go` only when you want
to open the project in Expo Go.

Use `npm run startc` after changing Metro, NativeWind, or Tailwind configuration
so Expo starts with a clean cache.

## Scripts

- `npm run start` - start Expo for a development build
- `npm run startc` - start Expo for a development build with cache reset
- `npm run start:go` - start Expo for Expo Go
- `npm run android` - build and run Android locally
- `npm run ios` - build and run iOS locally
- `npm run web` - start Expo web
- `npm run static` - export and serve the static web build
- `npm run lint` - run Biome checks
- `npm run format` / `npm run fix` - apply Biome fixes
- `npm run typecheck` - run TypeScript checks
- `npm run doctor` - run Expo Doctor
- `npm run align` - run `expo install --fix`
- `npm run prebuild` - generate native projects
- `npm run apk` - local EAS Android production build
- `npm run ipa` - local EAS iOS production build
- `npm run shadcn` - add React Native Reusables components
- `npm run taze` - update dependencies

## Project Structure

- `app/` - Expo Router routes and root layout
- `components/` - shared components and UI primitives
- `components/theme.tsx` - status bar, system background, and web dark class sync
- `components/ui/` - shadcn-inspired React Native components
- `lib/utils.ts` - `cn` helper using `clsx` and `tailwind-merge`
- `locales/` - English and Chinese translation catalogs
- `store/` - Zustand store setup
- `utils/supabase.ts` - Supabase client
- `global.css` - Tailwind CSS 4 imports, NativeWind theme import, sources, and theme tokens
- `postcss.config.mjs` - Tailwind CSS 4 PostCSS plugin
- `metro.config.js` - Expo Metro wrapped by NativeWind

## Styling

NativeWind is configured for Tailwind CSS 4. Theme tokens live in `global.css`
inside `@theme`, with light and dark CSS variables below it.

Important files:

- `global.css`
- `postcss.config.mjs`
- `metro.config.js`
- `babel.config.js`
- `nativewind-env.d.ts`

The app imports `global.css` once in `app/_layout.tsx`.

## Internationalization

Language detection reads the device locale via `expo-localization` and normalizes
to `en` or `zh`.

To add a language:

1. Add `locales/<lang>.json`.
2. Register it in `locales/index.ts`.
3. Keep translation keys mirrored across locale files.

## Supabase

Supabase is included as a starter utility, not a required architecture choice.
The client expects:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Auth sessions persist in AsyncStorage and auto-refresh by default.

## EAS Builds

`eas.json` includes `development`, `preview`, and `production` profiles. Before
publishing a real app, update:

- `expo.name`
- `expo.slug`
- `expo.scheme`
- `android.package`
- iOS `bundleIdentifier` if you add iOS native config

## Native Projects

This template currently includes an Android native project. If you want a pure
Expo CNG template, remove generated native folders and let each app run
`npm run prebuild` when needed.

## Quality Checks

Run these before shipping template changes:

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

