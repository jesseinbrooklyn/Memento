# MEMENTO — Technical Architecture

### Frontend & Backend Specification

---

*"First say to yourself what you would be; and then do what you have to do."*
— Epictetus, Discourses 3.23

---

## Document purpose

This is the engineering companion to the Memento Product Design document. It covers everything needed to build: frontend architecture, backend services, data models, screen-by-screen specifications, design system tokens, animation standards, audio design, monetization implementation, and deployment strategy. The product design doc covers *what* and *why*. This doc covers *how*.

---

# Part I — Frontend

---

## 1. Design system — Codex Aesthetica

The visual identity is the product's first argument. Before a user reads a single quote, the aesthetic tells them: this is serious, this is classical, this is for you. Every design decision traces back to one question: would this feel at home carved into the wall of a Roman bathhouse?

### 1.1 Color tokens

All colors derive from a constrained palette inspired by vanitas paintings, aged parchment, tarnished gold, and lampblack.

| Token | Hex | Usage |
|-------|-----|-------|
| `--memento-bg-primary` | `#14100a` | App background, primary surfaces |
| `--memento-bg-secondary` | `#1c1710` | Cards, elevated surfaces, modals |
| `--memento-bg-tertiary` | `#0e0b07` | Deepest surfaces, overlays |
| `--memento-gold` | `#c4a35a` | Primary accent — headers, borders, interactive elements, icons |
| `--memento-gold-dim` | `rgba(196,163,90,0.25)` | Subtle borders, dividers, inactive states |
| `--memento-gold-glow` | `rgba(196,163,90,0.06)` | Card backgrounds, hover states |
| `--memento-bone` | `#d4c5a0` | Primary text color |
| `--memento-bone-dim` | `rgba(212,197,160,0.55)` | Secondary text, descriptions |
| `--memento-bone-ghost` | `rgba(212,197,160,0.25)` | Tertiary text, timestamps, metadata |
| `--memento-ember` | `#8b4513` | Warning states, urgent prompts |
| `--memento-ash` | `#3a3630` | Disabled states, placeholder text |
| `--memento-ink` | `rgba(0,0,0,0.85)` | Text on gold backgrounds (buttons, badges) |

There is no "light mode." The app is always dark. Light mode would fundamentally break the contemplative atmosphere. This is a deliberate product decision, not a missing feature.

### 1.2 Typography

Two typefaces. No more, ever.

| Role | Family | Weights | Usage |
|------|--------|---------|-------|
| Display | Cinzel | 400, 500, 600 | Screen titles, Latin inscriptions, navigation labels, buttons, time displays, section headers |
| Body | Cormorant Garamond | 300, 400, 500 (roman + italic) | Quotes, journal text, body copy, descriptions, reflections, prompts |

**Sizing scale** (using `clamp()` for responsive behavior):

| Token | Min | Preferred | Max | Usage |
|-------|-----|-----------|-----|-------|
| `--text-inscription` | 9px | 1.2vw | 11px | Latin subtitles, metadata, timestamps |
| `--text-caption` | 11px | 1.5vw | 13px | Section labels, navigation, small UI text |
| `--text-body` | 15px | 2.5vw | 18px | Body text, descriptions, journal prompts |
| `--text-quote` | 17px | 3.5vw | 22px | Philosophical quotes, primary reading content |
| `--text-title` | 24px | 6vw | 36px | Screen titles, major headings |
| `--text-display` | 30px | 8vw | 52px | MEMENTO MORI, time display, hero numbers |

**Letter spacing rules:**

- Cinzel: always tracked. `--tracking-wide: 5px` for titles, `--tracking-ultra: 8px` for inscriptions like TEMPUS FUGIT.
- Cormorant Garamond: natural spacing. Never track body text. Italic for quotes only.

**Line height:**

- Cinzel: `1.2` (tight, monumental)
- Cormorant Garamond: `1.8` (generous, readable, contemplative pacing)

### 1.3 Spacing and layout

The spatial system uses an 8px base grid. All spacing values are multiples of 8.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Icon gaps, tight internal padding |
| `--space-sm` | 8px | Between related elements |
| `--space-md` | 16px | Standard component padding |
| `--space-lg` | 24px | Section gaps within a screen |
| `--space-xl` | 32px | Between major content sections |
| `--space-2xl` | 48px | Top/bottom screen padding |
| `--space-3xl` | 64px | Hero content breathing room |

**Maximum content width:** 640px, centered. No screen ever exceeds this. On tablets and desktop, the content floats in a sea of darkness — the negative space is part of the design.

**Border radius:** `2px` for subtle (inputs), `4px` for cards and buttons, `8px` for modals. Never fully rounded corners — this isn't a playful interface. The geometry should feel hewn, not inflated.

### 1.4 Borders and dividers

Borders are thin, always gold-derived, and used sparingly.

| Pattern | CSS | Usage |
|---------|-----|-------|
| Card border | `0.5px solid var(--memento-gold-dim)` | Cards, containers, input fields |
| Active border | `1px solid rgba(196,163,90,0.35)` | Selected states, focused inputs |
| Divider (horizontal) | `1px solid rgba(196,163,90,0.08)` | Between list items, sections |
| Vertical rule | `width: 1px; background: linear-gradient(to bottom, rgba(196,163,90,0.25), transparent)` | Decorative separators between content blocks |

### 1.5 Iconography

No icon library. All icons are custom SVG, minimal, single-weight (1px stroke or filled), gold-colored. The icon set references classical motifs:

| Concept | Icon reference |
|---------|---------------|
| Home / Awaken | Hourglass (the existing ornate SVG) |
| Wisdom library | Open scroll or codex |
| Journal | Wax tablet and stylus |
| Community | Two columns (the stoa) |
| Reflection | Mirror / still water |
| Breathing | Candle flame |
| Timer | Sundial |
| Settings | Gear with Roman teeth pattern |
| Legacy | Laurel wreath |
| Roles | Theater masks (comedy/tragedy) |

Icons should be 24x24px at standard density, 1px stroke weight, no fill unless specifically a filled variant. Gold (#c4a35a) at full opacity for active state, 35% opacity for inactive.

### 1.6 Imagery

All imagery follows the vanitas tradition established in the existing prototype.

**Background paintings:** Classical vanitas still life paintings (public domain, pre-1900). Rendered at 18% opacity with sepia(30%) brightness(0.7) contrast(1.1) filter stack. 12-second breathing animation (scale pulse between 1.0 and 1.008). Always overlaid with radial vignette and grain texture.

**Impermanence meditation imagery:** Wabi-sabi photography — cracked pottery, autumn leaves, weathered stone, tidal erosion, rust patterns. Same opacity/filter treatment as vanitas paintings, but at 12-15% opacity (slightly more subdued to let contemplation text breathe).

**No photography of people.** No stock imagery. No illustrations. No emoji. No decorative graphics. The only visual content is classical paintings and nature textures, always treated as atmospheric background layers, never as foreground content.

---

## 2. Animation standards — Motus Vivendi

Animation in Memento serves one purpose: to mirror the rhythms of life. Breathing, flickering, settling, fading. Never bouncing, never sliding, never snapping.

### 2.1 Core animations

| Name | Keyframes | Duration | Easing | Usage |
|------|-----------|----------|--------|-------|
| `breathe` | `scale(1) → scale(1.008) → scale(1)` | 12s | ease-in-out | Background imagery |
| `slowPulse` | `opacity: 0.9 → 1 → 0.9` | 6s | ease-in-out | Hourglass, candle flames |
| `fadeUp` | `opacity: 0, translateY(12px) → opacity: 1, translateY(0)` | 1.2s | ease | Content entrance on screen load |
| `fadeIn` | `opacity: 0 → opacity: 1` | 0.8s | ease | Subtle reveals, modal content |
| `sandFall` | `cy: top → cy: bottom` | 1.4-2.4s | linear | Sand particles in hourglass |
| `flicker` | `opacity: 0.7 → 1 → 0.85 → 1` | 3s | ease-in-out | Candle flame in breathing exercises |
| `settle` | `translateY(-4px) → translateY(0)` | 0.6s | cubic-bezier(0.25, 0.46, 0.45, 0.94) | Elements landing after transition |

### 2.2 Entrance choreography

When a screen loads, content enters in a staggered cascade with `fadeUp`:

- Base delay: `0.2s`
- Increment per element: `0.1s` to `0.15s`
- Maximum total entrance time: `1.6s` (nothing should still be animating after this)

Order: top inscriptions → primary content (hourglass, title, time) → secondary content (quote, body text) → interactive elements (buttons, sliders) → metadata (attribution, footnotes).

### 2.3 Transitions

Screen-to-screen transitions use a simple cross-fade at `0.3s ease`. No sliding, no parallax, no shared-element transitions. The contemplative pacing comes from the staggered entrance, not the transition itself.

**Button hover/press:**
- Hover: `background` transitions over `0.5s ease` — gold fills in slowly, like ink spreading on parchment.
- Press: `transform: scale(0.98)` at `0.1s` — subtle, physical.

**Scroll behavior:** `scroll-behavior: smooth` globally. No scroll-linked animations. No parallax. The painting background is `position: fixed` and does not move with scroll.

### 2.4 Reduced motion

All animations are wrapped in `@media (prefers-reduced-motion: no-preference)`. When reduced motion is preferred, all animations resolve to their end state instantly. The app remains fully functional and aesthetically coherent without animation.

---

## 3. Audio design — Vox Silentii

Audio is minimal, optional, and never intrusive.

### 3.1 Sound palette

| Sound | Description | Duration | Trigger |
|-------|-------------|----------|---------|
| Bell (single) | Tibetan singing bowl, single strike, low resonance | 3-4s decay | Midday mindfulness bell |
| Bell (triple) | Three ascending strikes, spaced 1.5s apart | ~8s total | Morning awaken sequence start |
| Chime (soft) | Small brass chime, high pitch, quick decay | 1s | Timer completion, session end |
| Gong (deep) | Low bronze gong, slow attack, long resonance | 6-8s decay | Evening reflection start |
| Ambient: rain | Rain on stone courtyard, no thunder, steady | Looping | Optional meditation background |
| Ambient: fire | Hearth fire crackling, no wind, intimate | Looping | Optional evening reflection background |
| Ambient: night | Crickets, distant wind, faint stars-on-stone quality | Looping | Optional pre-sleep background |

### 3.2 Voice

A single male voice narrator for guided content. Characteristics: calm, deep, authoritative without being commanding. Mid-Atlantic or British accent. No vocal fry, no uptalk, no ASMR whisper. Think a documentary narrator reading from a personal letter, not a meditation instructor. Natural pacing with genuine pauses — not metronomically timed.

The voice is used for: guided premeditatio malorum, audio Stoic narratives (evening stories), and spoken quotes in the wisdom library. The voice is never used for: UI instructions, notifications, or encouragement.

### 3.3 Haptics (mobile)

Light haptic feedback on: button press (single light tap), timer completion (double tap), bell strike (medium impact), and sand percentage slider (continuous light friction). No haptics on scroll, swipe, or passive interactions.

---

## 4. Screen specifications — Tabulae

Each screen is a single React functional component using hooks. No external state management library in V1 — component state and Context API only. Each screen owns its own data fetching and state.

### 4.1 Navigation structure

Bottom tab bar with five icons. The tab bar uses the existing vanitas aesthetic: `--memento-bg-secondary` background, `0.5px` top border in `--memento-gold-dim`, icons at 24px.

| Tab | Latin name | Icon | Screen |
|-----|-----------|------|--------|
| 1 | AWAKEN | Hourglass | Morning sequence / Memento mori |
| 2 | SAPIENTIA | Scroll | Wisdom library |
| 3 | TEMPUS | Sundial | Life calculator / Time awareness |
| 4 | SCRIPTUM | Wax tablet | Journal |
| 5 | VIRTUS | Laurel wreath | Profile / Roles / Legacy / Settings |

The tab bar hides during immersive experiences (guided meditations, breathing exercises, View from Above). Swipe-up or tap to reveal.

### 4.2 Screen: Awaken (Tab 1)

The app's daily entry point. Behavior changes based on time of day and user state.

**Morning state (5am–12pm, pre-practice):**

1. Full-screen vanitas background with breathing animation
2. Ornate hourglass (existing SVG component, centered)
3. MEMENTO MORI title
4. Live clock (Cinzel, large)
5. Remaining days counter (from life calculator data)
6. "I AM AWAKE" button

On pressing "I AM AWAKE," the screen transitions through:
- Daily quote (Cormorant Garamond italic, with author and date)
- Premeditatio malorum prompt (rotates daily through categories: difficult people, setbacks, loss, frustration, physical pain, public failure)
- Daily intention setter (text input with role selector dropdown)
- "BEGIN" button that marks morning practice complete and transitions to home state

**Home state (post morning practice, or 12pm+ if skipped):**

1. Condensed view: today's quote, intention reminder, remaining days (smaller)
2. Quick-access cards: "Evening reflection" (visible after 5pm), "Breathe" (always), "Read" (links to wisdom library)
3. Practice calendar (simple dot grid — current month, dots for days practiced, no streaks, no highlighting of gaps)

**Evening state (5pm–midnight):**

1. Evening reflection flow becomes primary CTA
2. Three-question flow: What went well? / Where did I fall short? / What didn't matter as much as I thought?
3. Gratitude through impermanence prompt
4. Tomorrow's edge question
5. Completion transitions to a quiet end screen with optional ambient audio

**Component structure:**

```
AwakenScreen/
  index.jsx              — State machine (morning/home/evening)
  MorningSequence.jsx    — Awaken → Quote → Premeditatio → Intention
  HomeView.jsx           — Post-practice dashboard
  EveningReflection.jsx  — Three-question flow + gratitude
  PracticeCalendar.jsx   — Dot grid, no streaks
  components/
    OrnateHourglass.jsx  — Existing SVG hourglass
    VanitasBackground.jsx — Painting + vignette + grain layers
    DailyQuote.jsx       — Quote card with author context
    IntentionSetter.jsx  — Role dropdown + text input
```

### 4.3 Screen: Sapientia / Wisdom library (Tab 2)

Organized by theme, not author. Search and browse.

**Layout:**

1. Header: SAPIENTIA inscription
2. "Today's letter" — daily curated passage with brief commentary (Seneca's letter format)
3. Theme grid: scrollable horizontal chips — "Mortality," "Anger," "Duty," "Fatherhood," "Endurance," "Work," "Grief," "Wealth," "Solitude," "Legacy"
4. On theme selection: vertical list of quotes within that theme, each showing passage excerpt, author, source, and date
5. On quote selection: full passage view with historical context panel (who said it, what they were facing, why it matters)

**Spaced repetition integration:** Quotes the user has saved to their Commonplace Book resurface on a spaced schedule (day 1, 3, 7, 14, 30). When a resurfaced quote appears, it includes a contemplation prompt: "When you first saved this, you were reflecting on [original context]. How has your understanding changed?"

**Audio:** Each quote has an optional audio reading (the male narrator voice). Tap play, hear the passage, then a 5-second silence for contemplation.

**Component structure:**

```
SapientiaScreen/
  index.jsx              — Theme browser + daily letter
  DailyLetter.jsx        — Seneca-format curated passage
  ThemeChips.jsx         — Horizontal scrollable theme filter
  QuoteList.jsx          — Vertical list within selected theme
  QuoteDetail.jsx        — Full passage + historical context
  CommonplaceBook.jsx    — User's saved quotes with spaced repetition
  AudioPlayer.jsx        — Minimal audio player for narrated quotes
```

### 4.4 Screen: Tempus / Life calculator (Tab 3)

The quantified mortality screen. Shows time remaining in multiple formats.

**Layout:**

1. Header: TEMPUS FUGIT inscription
2. Primary display: remaining days as large number (Cinzel display)
3. Secondary displays (horizontal scroll or vertical stack):
   - Remaining weeks
   - Remaining seasons (spring/summer/autumn/winter cycles left)
   - Remaining [user's birthday] celebrations
   - Percentage of estimated life elapsed (progress bar, gold fill on dark track)
4. Animated hourglass (smaller, sidebar position) with sand percentage matching life elapsed
5. "Adjust assumptions" expandable: birthdate, lifestyle factor sliders (smoking, drinking, exercise, diet, sleep)
6. "Perspective" section: "In the time it took you to read this, approximately X people died worldwide"

**Breathing exercise access:** A "BREATHE" floating button that launches a full-screen breathing exercise. The candle flame animation syncs to the chosen pattern (4-7-8, box breathing, or natural). Timer shows on screen. Subtle haptic on each phase transition.

**View from Above:** Accessed from this screen. A full-screen animated sequence: zooming out from a point, through levels of scale (room → building → city → continent → planet → solar system → galaxy). Each level holds for 5 seconds with a single contemplation line. Total duration: 60-90 seconds. Purely visual with optional ambient audio.

**Component structure:**

```
TempusScreen/
  index.jsx               — Main mortality dashboard
  LifeCalculator.jsx       — Days/weeks/seasons remaining
  LifeProgressBar.jsx      — Percentage elapsed visualization
  LifeFactorsPanel.jsx     — Expandable lifestyle adjustment sliders
  BreathingExercise.jsx    — Full-screen candle flame breathing
  ViewFromAbove.jsx        — Zoom-out perspective meditation
  PerspectiveStats.jsx     — Contextual mortality statistics
```

### 4.5 Screen: Scriptum / Journal (Tab 4)

Private, local-first journaling with Stoic structure.

**Layout:**

1. Header: SCRIPTUM inscription
2. "Write" floating button (primary CTA)
3. Entry list: reverse chronological, showing date, first line preview, and which prompt category was used (if any)
4. Filter chips: "All," "Morning," "Evening," "Freeform," "Letters"

**New entry flow:**

1. Choose mode: Freeform / Morning template / Evening template / Stoic prompt / Letter
2. Morning template: structured grid — "What is in my control today?" / "What virtue will I practice?" / "What am I grateful for?"
3. Evening template: "Where did I act with virtue?" / "Where did I fall short?" / "What did I learn?"
4. Stoic prompt: random prompt from curated set, organized by pillar (Desire, Action, Assent)
5. Letter: addressed to a specific recipient (future self, a child, a friend, anonymously to community)

**"On This Day" resurfacing:** When opening the journal, if entries exist from the same date in previous years, show a subtle card: "One year ago today, you wrote..." This is consistently the highest-rated feature in journaling apps and creates compounding value over time.

**Privacy:** All journal data encrypted at rest on device. Optional end-to-end encrypted cloud backup. Full data export in Markdown format at any time. The app never reads journal content for analytics, recommendations, or any other purpose. Frame this Stoically: "Your inner citadel is yours alone."

**Component structure:**

```
ScriptumScreen/
  index.jsx              — Entry list + filters
  EntryComposer.jsx      — New entry flow with mode selection
  MorningTemplate.jsx    — Structured morning grid
  EveningTemplate.jsx    — Structured evening grid
  StoicPrompt.jsx        — Random prompt by pillar
  LetterComposer.jsx     — Letter mode with recipient
  OnThisDay.jsx          — Historical entry resurfacing
  EntryDetail.jsx        — Read/edit existing entry
```

### 4.6 Screen: Virtus / Profile & Settings (Tab 5)

The user's identity and long-term tracking.

**Layout (scrollable sections):**

1. Header: user's name (Cinzel) + "Prokopton" designation (or progression title)
2. Practice summary: total days practiced, total journal entries, total hours in meditation, member since date — displayed as quiet metrics, not achievements
3. **Roles section:** user-defined roles (Father, Husband, Engineer, Friend, Son, Mentor, etc.) with brief personal definitions. Each role tappable to see assessment history
4. **Role assessment:** periodic (weekly or biweekly) — for each role, a simple 1-5 scale and a short reflection. Trends displayed as a minimal line over time. No gamification, no comparison — just honest self-observation
5. **Legacy reflection:** quarterly prompt set. "What do you want to be remembered for?" / "What are you building that outlasts you?" / "What would you want said at your funeral?" Previous reflections viewable in timeline
6. **Commonplace book:** all saved quotes from the wisdom library, with personal annotations
7. **Settings:** notification timing (morning, midday, evening), bell frequency, ambient sound preference, theme adjustment (painting selection), data management (export, delete), subscription status

**Progression titles** (earned through practice days, not displayed as levels — just quiet designations that appear on the profile):

| Days practiced | Latin title | English meaning |
|----------------|-------------|-----------------|
| 0 | Neophytus | Beginner |
| 7 | Auditor | One who listens |
| 30 | Discipulus | Student |
| 90 | Prokopton | One making progress |
| 180 | Philosophus | Lover of wisdom |
| 365 | Sapiens | The wise |

These are never announced, never celebrated with fanfare. They simply appear on the profile screen when earned. If the user notices, good. If not, that's fine too. The practice is the reward.

**Component structure:**

```
VirtusScreen/
  index.jsx              — Profile dashboard
  PracticeSummary.jsx    — Quiet metrics display
  RolesManager.jsx       — Define and manage roles
  RoleAssessment.jsx     — Periodic rating + reflection
  RoleTrends.jsx         — Minimal line charts per role
  LegacyReflection.jsx   — Quarterly prompts + history
  CommonplaceBook.jsx    — Saved quotes + annotations
  SettingsPanel.jsx      — All user preferences
  ProgressionTitle.jsx   — Latin designation display
```

### 4.7 Overlay: Midday bell

Not a screen — an overlay triggered by scheduled notification.

When triggered, the app (if open) or a notification (if backgrounded) presents:

1. Full-screen dark overlay with single gentle bell animation (concentric rings expanding outward from center, fading)
2. One contemplation line (rotates daily): "Is this essential?" / "What is in your control right now?" / "How would you act if this were your last day?" / "Are you seeing clearly?" / "Return to your principles."
3. Optional: 30-second breathing animation (tap to start)
4. Tap anywhere to dismiss

Total interaction time: 5-15 seconds. The bell should feel like a gentle hand on the shoulder, not an interruption.

---

## 5. Frontend technical stack

### 5.1 Framework and tooling

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | React Native (Expo) | Cross-platform iOS/Android from single codebase. Expo simplifies build/deploy. |
| Navigation | React Navigation (native stack + bottom tabs) | Standard, performant, handles tab bar + modal overlays |
| State (local) | React hooks + Context API | Sufficient for V1. No Redux overhead. |
| State (persistent) | AsyncStorage + SQLite (expo-sqlite) | AsyncStorage for preferences, SQLite for journal entries and practice data |
| Animations | React Native Reanimated + Moti | Hardware-accelerated animations, declarative API |
| Audio | expo-av | Playback for bells, ambient, and narrated content |
| Haptics | expo-haptics | Subtle physical feedback |
| Notifications | expo-notifications | Scheduled local notifications for daily rhythm |
| Encryption | react-native-quick-crypto | Journal entry encryption at rest |
| SVG | react-native-svg | Hourglass and custom icon rendering |
| Fonts | expo-font | Cinzel + Cormorant Garamond loading |

### 5.2 Web prototype (current)

The existing React + Tailwind prototype continues to serve as the design exploration environment. It is not the production app — it is the proving ground where screens are designed, iterated, and approved before being rebuilt in React Native.

### 5.3 Performance targets

| Metric | Target |
|--------|--------|
| Cold launch to interactive | < 2 seconds |
| Screen transition | < 300ms |
| Animation frame rate | 60fps (all animations on UI thread via Reanimated) |
| Journal entry save | < 100ms perceived |
| Offline capability | 100% of core features work offline |
| App binary size | < 50MB (excluding downloadable audio content) |

---

# Part II — Backend

---

## 6. Backend architecture — Machina

The backend is intentionally minimal. Memento is a local-first app. The server exists to serve content, manage subscriptions, and optionally sync data — not to be the brain of the application.

### 6.1 Architecture overview

```
Client (React Native)
  ↕ HTTPS/REST
API Gateway (Cloudflare Workers or AWS API Gateway)
  ↕
Services:
  ├── Content Service (daily quotes, letters, prompts, meditation scripts)
  ├── Auth Service (account creation, login, token management)
  ├── Subscription Service (payment processing, entitlement checking)
  ├── Sync Service (optional encrypted journal/preference sync)
  ├── Community Service (letters, circles, accountability — Phase 4)
  └── Scholarship Service (Epictetus program — application + verification)
  ↕
Data stores:
  ├── PostgreSQL (users, subscriptions, content metadata)
  ├── S3/R2 (audio files, painting images, downloadable content packs)
  ├── Redis (session cache, rate limiting, daily content selection)
  └── SQLite on device (journal, preferences, practice log — source of truth)
```

### 6.2 Content service

The content service is the most important backend component. It serves the daily philosophical content that gives users a reason to return.

**Daily content selection algorithm:**

1. Each day at midnight UTC, generate the day's content set:
   - 1 daily quote (selected by day-of-year modulo from curated pool, with seasonal weighting)
   - 1 daily letter (Seneca-format curated passage with commentary)
   - 1 premeditatio malorum category (rotating through: difficult people, setbacks, loss, frustration, physical pain, public failure)
   - 1 impermanence subject (rotating through: season, life stage, place, relationship, capability)
   - 1 evening gratitude prompt
   - 3 journal prompts (one per Stoic discipline)
2. Content is cached in Redis with 24-hour TTL
3. Client fetches daily content on first launch of the day, caches locally
4. If offline, client uses locally cached content or falls back to embedded baseline set

**Content data model:**

```
Quote {
  id: UUID
  text: string
  author: string
  source: string (e.g., "Meditations 2.11")
  author_dates: string (e.g., "121–180 AD")
  historical_context: string (paragraph about what the author was facing)
  themes: string[] (e.g., ["mortality", "action", "duty"])
  discipline: enum (desire | action | assent)
  season_weight: object ({ spring: 1.0, summer: 0.5, autumn: 1.5, winter: 0.8 })
  audio_url: string? (optional narrated version)
  created_at: timestamp
}

DailyLetter {
  id: UUID
  title: string
  passage: string
  commentary: string
  related_quotes: UUID[]
  themes: string[]
  created_at: timestamp
}

MeditationScript {
  id: UUID
  type: enum (premeditatio | impermanence | view_from_above | amor_fati | breathing)
  title: string
  duration_seconds: int
  text_prompts: { timestamp_seconds: int, text: string }[]
  audio_url: string?
  created_at: timestamp
}
```

### 6.3 Auth service

Simple email + password authentication. No social login (philosophical choice — your practice is not connected to your social identity).

- JWT tokens with 30-day expiry, refresh token rotation
- Account creation requires only email + password. Name is optional. No phone number, no profile photo, no social connections
- Magic link login as alternative to password (email-based, 15-minute expiry)
- Account deletion is immediate and permanent. All server-side data removed within 24 hours. Local data remains on device until user deletes the app

### 6.4 Subscription service

Manages the three paid tiers and the Epictetus scholarship.

**Entitlements model:**

```
Subscription {
  id: UUID
  user_id: UUID
  tier: enum (free | annual | lifetime)
  status: enum (active | expired | cancelled | scholarship)
  started_at: timestamp
  expires_at: timestamp? (null for lifetime)
  payment_provider: enum (apple | google | stripe)
  payment_provider_id: string
  scholarship_applied_at: timestamp? (null unless scholarship)
  scholarship_eligible_at: timestamp? (60 days after first practice)
}
```

**Tier entitlements:**

| Feature | Free (Agora) | Annual ($99/yr) | Lifetime ($249-299) | Scholarship |
|---------|:---:|:---:|:---:|:---:|
| Daily quote | ✓ | ✓ | ✓ | ✓ |
| Basic timer | ✓ | ✓ | ✓ | ✓ |
| 7-day intro course | ✓ | ✓ | ✓ | ✓ |
| Memento mori screen | ✓ | ✓ | ✓ | ✓ |
| Community (read-only) | ✓ | ✓ | ✓ | ✓ |
| Morning awaken sequence | | ✓ | ✓ | ✓ |
| Evening reflection | | ✓ | ✓ | ✓ |
| Full wisdom library | | ✓ | ✓ | ✓ |
| Journal + prompts | | ✓ | ✓ | ✓ |
| All breathing exercises | | ✓ | ✓ | ✓ |
| Spaced repetition | | ✓ | ✓ | ✓ |
| Community (full) | | ✓ | ✓ | ✓ |
| Stoic study paths | | ✓ | ✓ | ✓ |
| Audio narrations | | ✓ | ✓ | ✓ |
| Role assessments | | ✓ | ✓ | ✓ |
| Legacy reflections | | ✓ | ✓ | ✓ |
| Physical artifact | | | ✓ (included) | |
| Exclusive content | | | ✓ | |

**Payment processing:**

- iOS: Apple In-App Purchase (required by Apple for digital content)
- Android: Google Play Billing
- Web/direct: Stripe (for lifetime purchases and physical artifact orders)

**No monthly option.** Annual-only subscription signals serious commitment and reduces churn from casual users. The price ($99/year) is deliberately a round prestige number, not $69.99 — the pricing communicates positioning.

### 6.5 Epictetus scholarship service

Named after the Stoic philosopher born into slavery. Available only after 60-90 days of active practice (minimum 40 practice days within the first 90 calendar days).

**Flow:**

1. User signs up for free tier
2. After 60 calendar days AND 40+ practice days logged, a quiet notification appears on the Virtus/Settings screen: "The Epictetus Scholarship is available to you."
3. User taps to learn more. Simple page explains: "Epictetus was born a slave. He believed philosophy must be accessible to all. If the cost of Memento prevents your practice, this scholarship grants you full access. No questions asked. No proof required."
4. User submits scholarship request (no form fields beyond confirmation)
5. Scholarship is automatically granted. No review process, no approval queue
6. Scholarship is valid for 1 year, renewable by continued practice (minimum 100 practice days in the scholarship year)

**Backend model:**

```
ScholarshipApplication {
  id: UUID
  user_id: UUID
  applied_at: timestamp
  practice_days_at_application: int
  calendar_days_since_signup: int
  status: enum (active | expired | renewed)
  expires_at: timestamp
  renewed_count: int
}
```

**Abuse prevention:** The 60-90 day practice gate is the primary filter. Someone willing to practice Stoic philosophy daily for two months before requesting free access is, by definition, the kind of user the scholarship is for. No additional verification is needed. If abuse becomes measurable and significant (>20% of active users on scholarship), revisit — but default to trust.

### 6.6 Sync service

Optional. Users opt in explicitly. Journal data is never synced without conscious consent.

- End-to-end encryption: client encrypts journal entries with a key derived from user's password before upload. Server stores only ciphertext. Server cannot read journal content under any circumstances
- Sync scope: journal entries, practice log, saved quotes, role definitions, legacy reflections, preferences
- Conflict resolution: last-write-wins with timestamp comparison. Client is always the source of truth
- Sync frequency: on app launch + every 15 minutes while active + on entry save
- Data stored in PostgreSQL (encrypted blobs) with S3 backup

### 6.7 Community service (Phase 4)

Intentionally deferred. When built:

- **Letters:** async sharing of journal entries marked as "letters." Anonymous by default, attributed if user opts in. No likes, no comments, no karma. Letters are read, not reacted to. A reader can privately save a letter to their Commonplace Book
- **Accountability partners:** matched by practice frequency and timezone. Partners see each other's practice calendar (practiced/didn't practice) but never content. A gentle nudge system: if your partner hasn't practiced in 3 days, you get a prompt: "Your partner may benefit from a word of encouragement"
- **Discussion circles:** small groups (5-8 people) reading the same Stoic text over a set period. Weekly discussion prompts. Text-based, async. Moderated by community guidelines, not by moderators

---

## 7. Data model — local (SQLite on device)

The device database is the source of truth for all user-generated content.

```sql
-- Practice tracking
CREATE TABLE practice_log (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,           -- YYYY-MM-DD
  morning_complete INTEGER DEFAULT 0,
  evening_complete INTEGER DEFAULT 0,
  meditation_seconds INTEGER DEFAULT 0,
  breathing_seconds INTEGER DEFAULT 0,
  journal_entry_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Journal entries
CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  mode TEXT NOT NULL,            -- freeform | morning | evening | prompt | letter
  prompt_id TEXT,                -- references content service prompt if used
  content_encrypted TEXT NOT NULL,
  role_id TEXT,                  -- if tied to a specific role
  is_letter INTEGER DEFAULT 0,
  letter_recipient TEXT,         -- future_self | child | friend | community
  letter_shared INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Saved quotes (Commonplace Book)
CREATE TABLE saved_quotes (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL,        -- references content service quote
  personal_note TEXT,
  saved_at TEXT NOT NULL,
  next_resurface_at TEXT,        -- spaced repetition schedule
  resurface_count INTEGER DEFAULT 0
);

-- User roles
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,            -- Father, Husband, Engineer, etc.
  definition TEXT,               -- User's personal definition of excellence
  sort_order INTEGER,
  created_at TEXT NOT NULL
);

-- Role assessments
CREATE TABLE role_assessments (
  id TEXT PRIMARY KEY,
  role_id TEXT NOT NULL REFERENCES roles(id),
  rating INTEGER NOT NULL,       -- 1-5
  reflection TEXT,
  assessed_at TEXT NOT NULL
);

-- Legacy reflections
CREATE TABLE legacy_reflections (
  id TEXT PRIMARY KEY,
  quarter TEXT NOT NULL,          -- YYYY-Q1, YYYY-Q2, etc.
  remembered_for TEXT,
  building TEXT,
  funeral_words TEXT,
  unfinished TEXT,
  putting_off TEXT,
  created_at TEXT NOT NULL
);

-- User preferences
CREATE TABLE preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Spaced repetition queue
CREATE TABLE repetition_queue (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,     -- quote | principle | exercise
  content_id TEXT NOT NULL,
  ease_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  next_review_at TEXT NOT NULL,
  last_reviewed_at TEXT,
  review_count INTEGER DEFAULT 0
);
```

---

## 8. Spaced repetition engine

The most powerful non-gamification retention mechanic in the app. Based on a simplified SM-2 algorithm.

### 8.1 How it works

1. When a user saves a quote or completes a philosophical lesson, it enters the repetition queue
2. Initial intervals: Day 1 → Day 3 → Day 7 → Day 14 → Day 30 → Day 60 → Day 120
3. Each time a quote resurfaces, the user rates their engagement: "Still resonates" (increases interval) / "Need to sit with this more" (decreases interval) / "Archive" (removes from queue)
4. Resurfaced content appears in the Wisdom Library tab as a "Returning thought" card at the top of the screen
5. Each resurfaced quote includes a contemplation question: "How does this land differently today?"

### 8.2 What enters the queue

- Quotes saved to Commonplace Book (automatic)
- Stoic principles from study paths (on lesson completion)
- Passages highlighted in daily letters (on highlight)
- Personal journal insights the user explicitly flags as "worth revisiting"

### 8.3 What does NOT enter the queue

- Practice logs (you don't "review" whether you practiced)
- Role assessments (these have their own periodic schedule)
- Legacy reflections (quarterly by design)

---

## 9. Notification strategy

Notifications are the daily rhythm's heartbeat. They must feel like a bell in a monastery, not a push notification from a social app.

### 9.1 Notification types

| Type | Default time | Customizable | Content |
|------|-------------|:---:|---------|
| Morning bell | 6:30 AM | ✓ | "The day awaits. Remember." + daily quote preview |
| Midday bell | 12:00 PM | ✓ (time + on/off) | Single contemplation line only |
| Evening bell | 8:00 PM | ✓ | "The day is ending. Reflect." |
| Resurfacing | With morning bell | | "A thought returns." (spaced repetition) |
| Role assessment | Sunday 10 AM | ✓ (day + on/off) | "How did you fulfill your roles this week?" |
| Legacy prompt | First of quarter | | "A season has passed. What endures?" |

### 9.2 Notification rules

- Maximum 3 notifications per day (morning + midday + evening). Never more
- If user hasn't opened the app in 7+ days, reduce to 1 notification per day (morning only)
- If user hasn't opened in 30+ days, stop all notifications. On next open, gently re-offer: "Would you like to resume your daily bells?"
- Never send notifications about sales, features, updates, or anything besides the practice itself
- Notification text is always philosophical, never promotional. No "You're on a 5-day streak!" No "Don't break your habit!"

---

## 10. Monetization implementation

### 10.1 Paywall presentation

The paywall appears when a free-tier user taps a premium feature. It is never a pop-up, never an interruption, never a dark pattern.

**Design:**

1. The tapped feature briefly previews (the screen loads with content visible but interaction disabled, overlaid with a subtle frosted-glass treatment at `--memento-bg-tertiary` with 85% opacity)
2. A bottom sheet slides up with:
   - "UNLOCK YOUR PRACTICE" (Cinzel, gold)
   - One sentence describing what they're accessing
   - "$99 per year" in large Cinzel text
   - "Or own it forever: $249" in smaller text below
   - "Begin" button (gold fill)
   - "Not now" text link (dim, no guilt language)
3. Below the CTA, a single line: "If cost prevents your practice, the Epictetus Scholarship may be available." (only shown if user has 60+ days of practice)

**What the paywall never does:**

- Counts down a timer
- Shows a "limited time" discount
- Compares plans in a feature matrix
- Uses social proof ("10,000 practitioners and counting!")
- Triggers on app launch
- Blocks reading a quote mid-sentence

### 10.2 Physical artifacts (Stripe integration)

Physical products are ordered through an in-app storefront (Phase 3+). Handled via Stripe for payment and a fulfillment partner for shipping.

**Product line (initial):**

| Product | Price | Description |
|---------|-------|-------------|
| Memento Mori medallion | $28-35 | Bronze-finish coin, skull/hourglass design, pocket-sized |
| Stoic leather journal | $45-60 | Embossed leather cover, acid-free pages, ribbon marker |
| Wax seal kit | $35-45 | Brass seal with custom Stoic symbol + sealing wax |
| Marcus Aurelius bust | $65-80 | Small desktop sculpture, matte finish |

These are not merchandise. They are practice tools. The medallion goes in your pocket as a daily reminder. The journal is where you write. The seal marks your letters. The bust watches you from your desk. Every product description frames the item as a philosophical instrument.

---

## 11. Deployment and infrastructure

### 11.1 Mobile deployment

| Platform | Distribution |
|----------|-------------|
| iOS | App Store (Expo EAS Build → TestFlight → App Store Connect) |
| Android | Google Play (Expo EAS Build → Internal testing → Production) |

**Release cadence:** Major feature releases quarterly (aligned with the legacy reflection cycle). Bug fixes and content updates as needed. Content updates (new quotes, letters, meditation scripts) are server-side and require no app update.

### 11.2 Backend deployment

| Service | Infrastructure |
|---------|---------------|
| API | Cloudflare Workers (edge-deployed, minimal latency) or AWS Lambda |
| Database | Supabase (managed PostgreSQL) or AWS RDS |
| Object storage | Cloudflare R2 or AWS S3 (audio, images) |
| Cache | Upstash Redis (serverless) |
| CDN | Cloudflare (static assets, audio delivery) |
| Monitoring | Sentry (error tracking), simple uptime monitoring |

### 11.3 Cost estimate (monthly, at 10K active users)

| Service | Estimated cost |
|---------|---------------|
| Cloudflare Workers | $5-25 |
| Supabase (Pro) | $25 |
| Upstash Redis | $10 |
| Cloudflare R2 storage | $5-15 |
| CDN | Included with Cloudflare |
| Expo EAS | $0 (free tier sufficient to start) |
| Apple Developer | $8.25/mo ($99/yr) |
| Google Play Developer | One-time $25 |
| **Total** | **~$80-110/month** |

At $99/year per subscriber, the app reaches profitability at approximately 15 paying subscribers (covering infrastructure). At 100 paying subscribers, monthly revenue is ~$825 against ~$100 infrastructure cost. This is an extremely capital-efficient model.

---

## 12. Development phases — Ordo Operandi

### Phase 1 — Fundamentum (Foundation) — Weeks 1-8

Build the core daily experience. A user should be able to install the app and have a meaningful morning-to-evening practice cycle.

- [ ] React Native project setup (Expo, navigation, fonts, design tokens)
- [ ] Design system implementation (all color, typography, spacing tokens)
- [ ] VanitasBackground component (painting + vignette + grain + breathing)
- [ ] OrnateHourglass component (port existing SVG to react-native-svg)
- [ ] Awaken screen: morning sequence (memento mori → quote → I AM AWAKE)
- [ ] Awaken screen: home state (post-practice dashboard)
- [ ] Awaken screen: evening reflection (three questions + gratitude)
- [ ] Basic wisdom library (daily quote + theme browse + quote detail)
- [ ] Life calculator (remaining days/weeks/seasons + lifestyle factors)
- [ ] Local database setup (SQLite schema, practice logging)
- [ ] Practice calendar (dot grid)
- [ ] Notification system (morning + evening bells)
- [ ] Content: curate initial 100 quotes with full historical context
- [ ] Content: write 30 daily letters (one month of content)
- [ ] Content: write premeditatio prompts (6 categories × 5 variations = 30)

### Phase 2 — Praxis (Practice) — Weeks 9-16

Deepen the practice tools and add the features that drive retention.

- [ ] Journal (freeform + morning/evening templates + Stoic prompts)
- [ ] Commonplace Book (save quotes + personal annotations)
- [ ] Spaced repetition engine (SM-2 implementation + resurfacing UI)
- [ ] Breathing exercises (3 patterns + candle flame animation)
- [ ] Midday mindfulness bell (notification + overlay)
- [ ] Audio: record narrated versions of top 50 quotes
- [ ] Audio: bell/chime/gong sound set
- [ ] Auth service (email + password, JWT)
- [ ] Subscription service (Apple IAP + Google Play Billing)
- [ ] Paywall implementation
- [ ] On This Day resurfacing for journal
- [ ] Content: expand to 200+ quotes, 90 daily letters (three months)

### Phase 3 — Virtus (Character) — Weeks 17-24

Add the identity and long-term reflection features.

- [ ] Role definition and management
- [ ] Role assessment (periodic rating + reflection + trend display)
- [ ] Legacy reflection (quarterly prompts + history)
- [ ] View from Above meditation (animated zoom sequence)
- [ ] Impermanence meditation (rotating subjects + wabi-sabi imagery)
- [ ] Progression titles (quiet Latin designations)
- [ ] Stoic study paths (Discourses, Meditations, Letters deep dives)
- [ ] Lifetime membership (Stripe integration)
- [ ] Physical artifact storefront (Stripe + fulfillment)
- [ ] Epictetus Scholarship implementation (60-day gate + auto-grant)
- [ ] Optional encrypted cloud sync
- [ ] Content: expand to 366+ quotes (full year), 180 daily letters

### Phase 4 — Forum (Community) — Weeks 25-36

Build the quiet community features.

- [ ] Letters (async anonymous/attributed sharing)
- [ ] Accountability partners (matched by practice + timezone)
- [ ] Discussion circles (small groups, shared text study)
- [ ] Monthly Stoic challenges (community-wide themed practice)
- [ ] Community moderation guidelines and tools
- [ ] Audio: Stoic narrative recordings (evening stories, 10-15 min each)
- [ ] Ambient soundscapes (rain, fire, night — 30+ min loops)

### Phase 5 — Imperium (Platform) — Ongoing

Extend to new surfaces.

- [ ] Apple Watch complication (remaining days, daily intention)
- [ ] iOS widget (morning quote, days remaining)
- [ ] Android widget equivalent
- [ ] Web app (journal access, wisdom library, settings)
- [ ] Seasonal content calendar (Stoic holidays, solstices, historical dates)
- [ ] API for potential integrations (export practice data, calendar sync)

---

*"No man is free who is not master of himself."*
— Epictetus

*Faber est suae quisque fortunae.*
Every man is the architect of his own fortune.
