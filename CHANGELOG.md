# Memento — Changelog

A running record of every version shipped. Update this at the start of each session by checking `app.json` for the current version, and at the end by logging what changed.

---

## [1.1.0] — 2026-04-30

### New Features
- **Expanded quote detail** — full typography-first layout with large italic quote, author name + dates, source citation pill, dedicated CONTEXT section with historical background, discipline badge (Desire / Action / Assent), and theme tags
- **Streak & practice history** — new HISTORIA screen accessible from Virtus tab; shows total days practiced, current streak, and a 90-day dot calendar
- **Settings screen** — moved all configuration out of Tempus into a dedicated Settings screen (accessible from Virtus tab): birthdate, lifestyle factors, time format, morning/evening bell times, and background brightness
- **Background brightness control** — DIM / STANDARD / BRIGHT toggle in Settings; applies a warm overlay across the entire app
- **Improved onboarding** — rebuilt as a 3-step flow (Welcome → Calibrate → Notifications) with progress dots and a dedicated bell permission step
- **Notification improvements** — smart scheduling skips today's bell if the practice is already complete; morning notifications include a quote snippet; 30-day scheduling window (up from 14)

### Architecture & Code Quality
- Extracted shared utilities: `src/utils/date.ts` (todayString, parseBirthDate, formatBirthInput) and `src/utils/id.ts` (generateId) — removed 3–4 duplicated copies across repositories
- All route names moved to `ROUTES` constants in `src/navigation/routes.ts` — no raw string literals anywhere
- Expanded design token set: full `fontSize` scale, additional gold/background color variants, new `letterSpacing` steps
- Repository pattern enforced: repo methods now own both the DB write and the Zustand store update — removed all double-update patterns from screens
- Token adoption pass across all screens: no more raw hex colors, font strings, or magic size numbers
- Removed dead code: orphan `quotes-starter-50.json`, stale `memento-component-reference.tsx`, unused `lastPracticeDate` store field
- TypeScript: zero errors across entire codebase

### Bug Fixes
- `VanitasBackground` was missing `colors` import
- `webOutlineFix` cast now uses `as unknown as TextStyle` to satisfy strict mode
- `QuoteLibraryScreen` theme filter typed correctly against `Theme` union
- `SegmentedControl` in `LifestyleSliders` hoisted out of render body (was re-created on every render)

---

## [1.0.0] — 2025 (initial App Store release)

### Features Shipped
- **Awaken tab** — daily mortality reminder with animated hourglass, days remaining counter, morning/evening practice buttons
- **Morning flow** — daily Stoic quote → set intention → mark morning complete
- **Evening flow** — guided reflection with 3-step prompts, mark evening complete
- **Sapientia tab** — quote library browsable by theme, quote detail, commonplace book (saved quotes)
- **Tempus tab** — life calculator showing days/weeks/birthdays remaining, percentage elapsed; lifestyle factor inputs (smoking, drinking, exercise, diet, sleep) that adjust the estimate
- **Scriptum tab** — freeform journal + morning/evening linked entries, entry list with date and mode tags
- **Virtus tab** — practice streak, 30-day dot calendar
- **Onboarding** — 2-step flow: welcome screen + calibrate (birthdate, lifestyle, time format)
- **Notifications** — morning and evening bells via expo-notifications (local only)
- **Persistence** — SQLite via expo-sqlite; all data stays on device
- **Design system** — Cinzel + Cormorant Garamond, dark Roman aesthetic, gold/bone color palette, breathing animations

### Stack
- React Native + Expo (managed workflow)
- TypeScript strict mode
- Zustand (state), expo-sqlite (persistence), React Navigation (routing)
- React Native Reanimated (animations), expo-notifications (local bells)

---

## Roadmap (not yet scheduled)

Features from the product spec that are explicitly deferred — do not build until added to a versioned entry above.

- Audio narration
- Spaced repetition for quotes
- Role tracking / assessments
- Legacy reflections
- Cloud sync / auth
- Community features
- Breathing exercises
- Midday bell
- View from Above meditation
- Study paths
- Progression titles
- On This Day resurfacing
