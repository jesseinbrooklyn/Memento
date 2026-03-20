# CLAUDE.md — Memento Project Instructions

## What this is

Memento is a Stoic wellness app for men. Daily mortality reminder, philosophical quotes, journaling, life calculator. Dark, classical, Roman aesthetic. React Native + Expo.

Read the full specs in `/docs/` if you need context. This file tells you how to write code for this project.

---

## Stack

- **Framework:** React Native + Expo (managed workflow)
- **Language:** TypeScript (strict mode, no implicit any, no any types)
- **Navigation:** React Navigation (bottom tabs + native stack)
- **State:** Zustand (domain state) + component-local useState/useReducer (UI state)
- **Persistence:** expo-sqlite (all persistent data)
- **Animations:** React Native Reanimated
- **SVG:** react-native-svg
- **Fonts:** expo-font (Cinzel + Cormorant Garamond)
- **Notifications:** expo-notifications (local only, no push server)
- **Haptics:** expo-haptics

## What we do NOT use

- No Redux, no MobX
- No SecureStore in V1 (everything in SQLite)
- No backend API, no fetch, no TanStack Query (all content is embedded locally)
- No expo-av in V1 (no audio)
- No encryption libraries in V1
- No social login, no Firebase Auth
- No icon libraries (all icons are custom SVG)

---

## Architecture rules

### State management

Three layers. Never mix them.

1. **UI state** — component-local. Modal open/closed, form drafts, scroll position, animation state. Dies when the component unmounts.

2. **Domain state** — Zustand stores. Shared across screens. Four stores:
   - `useDailyContentStore` — today's quote, intention, reflection status
   - `usePracticeStore` — practice log, calendar data
   - `useQuotesStore` — saved quotes, commonplace book
   - `usePreferencesStore` — notification times, birthdate, lifestyle factors

3. **Persistence** — SQLite via repository layer. Zustand stores hydrate FROM repositories on app launch. Stores never write directly to SQLite.

### Repository pattern

All database reads and writes go through repository functions. Stores do NOT auto-persist.

```typescript
// CORRECT — explicit repository action
async function completeMorningPractice(intention: string) {
  await PracticeRepository.markMorningComplete(today(), intention);
  usePracticeStore.getState().setMorningComplete(intention);
}

// WRONG — store middleware auto-writing
usePracticeStore.subscribe((state) => db.write(state)); // Never do this
```

Four repositories:
- `PracticeRepository` — practice log CRUD
- `JournalRepository` — journal entries CRUD
- `QuoteRepository` — saved quotes CRUD
- `PreferencesRepository` — key-value preferences CRUD

Repository files live in `/src/repositories/`.

### File structure

```
src/
  components/        # Shared UI components
    VanitasBackground.tsx
    OrnateHourglass.tsx
    DailyQuote.tsx
    PracticeCalendar.tsx
  screens/           # Screen components (one per tab + sub-screens)
    awaken/
    sapientia/
    tempus/
    scriptum/
    virtus/
  stores/            # Zustand stores
    dailyContent.ts
    practice.ts
    quotes.ts
    preferences.ts
  repositories/      # SQLite data access
    practice.ts
    journal.ts
    quotes.ts
    preferences.ts
    db.ts            # SQLite connection + table creation
  content/           # Embedded JSON content
    quotes.json
    prompts.json
  theme/             # Design system tokens
    tokens.ts
    fonts.ts
  utils/             # Pure utility functions
    lifeCalculator.ts
    dailyContent.ts
  types/             # TypeScript type definitions
    index.ts
  navigation/        # React Navigation config
    TabNavigator.tsx
    stacks/
```

### Naming conventions

- Files: `camelCase.ts` for utilities/stores/repos, `PascalCase.tsx` for components
- Components: PascalCase (`OrnateHourglass`, `VanitasBackground`)
- Stores: `use[Name]Store` (`usePracticeStore`)
- Repository functions: verb + noun (`markMorningComplete`, `getEntriesByDate`)
- Types: PascalCase (`Quote`, `JournalEntry`, `PracticeDay`)
- Constants: UPPER_SNAKE_CASE (`MEMENTO_GOLD`, `BASE_LIFE_EXPECTANCY`)

---

## Design system

### Colors — use token names, never raw hex

```typescript
export const colors = {
  bgPrimary: '#14100a',       // App background
  bgSecondary: '#1c1710',     // Cards, elevated surfaces
  bgTertiary: '#0e0b07',      // Deepest surfaces, overlays
  gold: '#c4a35a',            // Primary accent
  goldDim: 'rgba(196,163,90,0.25)',   // Borders, dividers
  goldGlow: 'rgba(196,163,90,0.06)',  // Card backgrounds
  bone: '#d4c5a0',            // Primary text
  boneDim: 'rgba(212,197,160,0.55)',  // Secondary text
  boneGhost: 'rgba(212,197,160,0.25)', // Tertiary text
  ember: '#8b4513',           // Warning
  ash: '#3a3630',             // Disabled
  ink: 'rgba(0,0,0,0.85)',    // Text on gold backgrounds
} as const;
```

There is no light mode. The app is always dark. Never add light mode support.

### Typography

Two fonts only. Never add a third.

- **Cinzel** — display font. Titles, labels, buttons, inscriptions, time displays. Always letter-spaced.
- **Cormorant Garamond** — body font. Quotes, journal text, descriptions, prompts. Italic for quotes only.

```typescript
export const fonts = {
  display: 'Cinzel',           // Titles, headers, buttons
  displayMedium: 'Cinzel-Medium',
  displaySemiBold: 'Cinzel-SemiBold',
  body: 'CormorantGaramond-Regular',
  bodyLight: 'CormorantGaramond-Light',
  bodyMedium: 'CormorantGaramond-Medium',
  bodyItalic: 'CormorantGaramond-Italic',
  bodyMediumItalic: 'CormorantGaramond-MediumItalic',
} as const;
```

### Spacing

8px grid. All spacing values must be multiples of 8.

```typescript
export const spacing = {
  xs: 4,    // Icon gaps
  sm: 8,    // Between related elements
  md: 16,   // Standard padding
  lg: 24,   // Section gaps
  xl: 32,   // Between major sections
  xxl: 48,  // Screen top/bottom padding
  xxxl: 64, // Hero breathing room
} as const;
```

### Borders

Always thin, always gold-derived.

- Card border: `0.5px solid ${colors.goldDim}`
- Active border: `1px solid rgba(196,163,90,0.35)`
- Divider: `1px solid rgba(196,163,90,0.08)`
- Border radius: `2px` (inputs), `4px` (cards, buttons), `8px` (modals). Never fully rounded.

---

## Animation rules

All animations serve one purpose: mirroring life's rhythms. Breathing, flickering, settling, fading. Never bouncing, sliding, or snapping.

### Core animations

- `breathe` — scale 1 → 1.008 → 1, 12s, ease-in-out. Background imagery only.
- `slowPulse` — opacity 0.9 → 1 → 0.9, 6s, ease-in-out. Hourglass.
- `fadeUp` — opacity 0 + translateY(12) → opacity 1 + translateY(0), 1.2s, ease. Content entrance.

### Entrance choreography

When a screen loads, content enters in staggered `fadeUp`:
- Base delay: 200ms
- Increment: 100-150ms per element
- Maximum total: 1600ms (nothing still animating after this)

### All animations must be wrapped in reduced-motion check

```typescript
const prefersReducedMotion = useReducedMotion();
// If true, skip animation entirely — resolve to end state
```

### Transitions

- Screen-to-screen: cross-fade, 300ms ease
- Button hover: background fills over 500ms ease
- Button press: scale(0.98) at 100ms

---

## Content system

All content is embedded in the app binary as JSON. No server. No API calls.

### Daily content selection

```typescript
function getDailyIndex(poolSize: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return dayOfYear % poolSize;
}
```

Use local device date, not UTC. Pin content to the timezone at first app open of the day.

### Quote data shape

```typescript
interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;          // e.g., "Meditations 2.11"
  authorDates: string;     // e.g., "121–180 AD"
  context: string;         // 2-3 sentences of historical context
  themes: Theme[];
  discipline: 'desire' | 'action' | 'assent';
}

type Theme =
  | 'mortality' | 'anger' | 'duty' | 'fatherhood'
  | 'endurance' | 'work' | 'grief' | 'wealth'
  | 'solitude' | 'legacy';
```

---

## SQLite schema

```sql
CREATE TABLE practice_log (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  morning_complete INTEGER DEFAULT 0,
  evening_complete INTEGER DEFAULT 0,
  intention TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  mode TEXT NOT NULL,           -- freeform | morning | evening_reflection
  content TEXT NOT NULL,
  prompt_key TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE saved_quotes (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL,
  personal_note TEXT,
  saved_at TEXT NOT NULL
);

CREATE TABLE preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

Practice log = lightweight daily ledger (completion metadata only). All written content = journal_entries.

---

## Code style rules

- No `console.log` in committed code. Use a logger utility if needed.
- No inline styles longer than 3 properties. Extract to StyleSheet.create().
- No magic numbers. Use spacing/color/font tokens.
- No string literals for routes. Define route names as constants.
- No default exports except for screen components (React Navigation convention).
- Every component gets a TypeScript interface for its props.
- Prefer `const` arrow functions for components: `const MyComponent: React.FC<Props> = ({ ... }) => { }`
- Destructure props in the function signature, not in the body.
- Keep components under 200 lines. Extract sub-components if longer.
- Comments explain WHY, not WHAT. The code explains what.

---

## Tone and copy

The app speaks like a wise friend who has read deeply. Direct. Honest. Never preachy, never condescending.

- ✅ "Remember." / "The day is ending. Reflect." / "What is in your control today?"
- ❌ "You've got this!" / "Great job!" / "Don't break your streak!"
- ❌ Any emoji, ever
- ❌ Exclamation marks in UI copy (use periods or no punctuation)

Latin inscriptions use CINZEL ALL CAPS with wide letter-spacing. English body text uses Cormorant Garamond sentence case.

---

## What NOT to build

These features are explicitly deferred. Do not implement them, do not scaffold them, do not add placeholder UI for them:

- Audio playback or narration
- Spaced repetition
- Role tracking or assessments
- Legacy reflections
- Cloud sync
- Auth / user accounts
- Encryption
- Community features
- Paywall or subscription logic
- Breathing exercises
- Midday bell
- View from Above meditation
- Study paths
- Physical products / storefront
- Progression titles
- On This Day resurfacing

If a feature isn't in the V1 Build Spec, it doesn't exist yet.
