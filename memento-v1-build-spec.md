# MEMENTO — V1 Build Spec

### What actually ships first

---

*"Well-being is realized by small steps, but is truly no small thing."*
— Zeno of Citium

---

## Scope philosophy

This document describes the first shippable version of Memento. Not the vision — that lives in the Product Design doc. Not the full architecture — that lives in the Technical Architecture doc. This is what gets built in 12 weeks by a small team, and what a real user downloads on day one.

The rule: a user should be able to install Memento and have a complete, premium-feeling daily practice — morning to evening — on the first day. Everything else is future.

What "complete" means for V1: open the app in the morning, confront your mortality, read something worth reading, set an intention, go about your day, come back in the evening, reflect honestly, close the app feeling like the day was accounted for.

What "complete" does not mean for V1: audio narration, spaced repetition, role tracking, legacy reflections, community features, encrypted sync, breathing exercises, physical products, or a scholarship program. All of those are good ideas. None of them are required for the first user to get real value.

---

## V1 feature set

### Ships

| Feature | Why it's in V1 |
|---------|---------------|
| Awaken screen (memento mori + clock + remaining days) | This IS the app. The emotional core. Non-negotiable. |
| "I AM AWAKE" morning flow (quote → intention) | Creates the daily morning ritual. The reason to open the app. |
| Evening reflection (3 questions + gratitude prompt) | Closes the daily loop. Without this, the app is half a practice. |
| Daily quote with author + source | Minimum viable content. One good quote per day is enough to start. |
| Life calculator (remaining days/weeks/seasons) | Quantified mortality. Core differentiator. Already prototyped. |
| Lifestyle factor adjustments | Makes the life calculator personal. Already prototyped. |
| Small wisdom library (browse by theme) | Gives users a reason to explore beyond the daily quote. |
| Local journal (freeform + morning/evening templates) | The practice needs a place to write. Local-only, no sync, no encryption complexity. |
| Practice calendar (dot grid, no streaks) | Users need to see that they're practicing. Dots, not streaks. |
| Save quotes to Commonplace Book | One-tap save. Personal annotation. The start of long-term value. |
| Notification bells (morning + evening) | The daily rhythm needs external triggers. Two bells, configurable times. |
| Vanitas background + ornate hourglass | The aesthetic IS the brand. Already built. Port to React Native. |
| Settings (notification times, birthdate, lifestyle factors) | Basic user configuration. |
| Onboarding (birthdate + optional lifestyle factors) | First-run setup to personalize the life calculator immediately. |

### Does NOT ship

| Feature | Why it's deferred | See backlog # |
|---------|------------------|:---:|
| Subscriptions / paywall | V1 launches free. Paywall comes when there's enough content to gate. | B-01 |
| Auth / accounts | No server-side accounts in V1. Everything is local. | B-02 |
| Audio narration | Expensive to produce well. Bad audio hurts the brand more than no audio. | B-03 |
| Spaced repetition | Powerful retention tool, but requires a content library large enough to resurface meaningfully. | B-04 |
| Breathing exercises | Good feature, not core to the Stoic daily practice loop. | B-05 |
| Midday bell | Third notification adds complexity. Morning + evening is enough to establish the habit. | B-06 |
| Role definitions + assessments | Identity feature. Requires the daily practice to be solid first. | B-07 |
| Legacy reflections | Quarterly cadence doesn't fit a 12-week build. Needs practice history to be meaningful. | B-08 |
| View from Above meditation | High-polish animation. Impressive but not essential for daily practice. | B-09 |
| Impermanence meditations | Content-heavy. Requires curated imagery pipeline. | B-10 |
| Progression titles | Meaningless without enough practice days to earn them. | B-11 |
| Cloud sync | Deceptively hard. Key management, conflict resolution, encryption design — all need a dedicated pass. | B-12 |
| Journal encryption | V1 journal is local-only. Device-level encryption (OS) is sufficient. Content-level encryption comes with sync. | B-13 |
| Community (letters, partners, circles) | Needs a user base first. Community features in an empty room are depressing. | B-14 |
| Epictetus Scholarship | Requires subscriptions to exist first, plus 60-day practice history. | B-15 |
| Lifetime membership | Requires subscription infrastructure. | B-16 |
| Physical artifacts / storefront | Brand extension, not app feature. Build the audience first. | B-17 |
| Study paths (Discourses, Letters deep dives) | Massive content effort. V1 wisdom library is sufficient. | B-18 |
| On This Day resurfacing | Requires a year of journal history to be meaningful. Plant the seed, harvest later. | B-19 |
| Premeditatio malorum (guided exercise) | The morning flow includes a simpler version (intention setting). Full guided premeditatio is V2. | B-20 |

---

## Technical stack — V1 only

### What's in

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | React Native + Expo (managed workflow) | Fastest path to both stores |
| Navigation | React Navigation (bottom tabs + native stack) | 5 tabs, but only 3 active in V1 (Awaken, Sapientia, Tempus). Journal and Profile are the other two. |
| Domain state | Zustand | Lightweight, no boilerplate. Stores: daily content, practice log, saved quotes, preferences. |
| UI state | Component-local useState/useReducer | Modals, form drafts, scroll position — stays in the component. |
| Persistence | expo-sqlite | Journal entries, practice log, saved quotes, preferences. Single source of truth. |
| Preferences | All in SQLite | Birthdate and lifestyle factors are personal but not credentials. In a fully local app with no network, SQLite is sufficient. SecureStore reserved for future encryption keys only. |
| Animations | React Native Reanimated | Breathing animation, fadeUp entrance, hourglass sand. All on UI thread. |
| SVG | react-native-svg | Hourglass, custom icons. |
| Fonts | expo-font | Cinzel + Cormorant Garamond. Loaded before splash screen dismisses. |
| Notifications | expo-notifications | Local scheduled notifications only. No push server needed in V1. |
| Haptics | expo-haptics | Button press, timer events. Subtle. |

### What's NOT in

| Layer | Deferred | Why |
|-------|----------|-----|
| Backend API | No server | All content is bundled in the app binary. Daily rotation uses local date + deterministic selection. |
| Auth | No accounts | No reason to create accounts when everything is local. |
| Audio (expo-av) | No audio in V1 | Avoids content production dependency and binary size bloat. |
| Encryption (react-native-quick-crypto) | No content encryption | OS device encryption is sufficient for local-only data. |
| Network layer (TanStack Query, fetch) | No remote data | Content is embedded. No API calls. |

### State architecture

Three layers, clean separation:

```
UI State (component-local)
  └── useState, useReducer
  └── Modal open/closed, form drafts, current tab, scroll position

Domain State (Zustand stores)
  └── useDailyContentStore — today's quote, intention, reflection status
  └── usePracticeStore — practice log, calendar data
  └── useQuotesStore — saved quotes, commonplace book
  └── usePreferencesStore — notification times, birthdate, lifestyle factors

Persistence (SQLite — single source of truth)
  └── All persistent data in SQLite (no SecureStore split in V1)
  └── Hydration: Zustand stores hydrate from SQLite on app launch
  └── Writes: explicit repository actions, NOT automatic write-through
```

**Repository pattern for persistence.** Zustand stores do NOT auto-write to SQLite on every state change. Instead, explicit repository functions handle both the store update and the SQLite write in one deliberate action:

```
Repositories (data access layer)
  └── PracticeRepository
      └── completeMorningPractice(intention) — updates store + writes to SQLite
      └── completeEveningReflection(responses) — updates store + writes to SQLite
      └── getPracticeCalendar(month) — reads from SQLite
  └── JournalRepository
      └── createEntry(mode, content) — updates store + writes to SQLite
      └── updateEntry(id, content) — updates store + writes to SQLite
      └── getEntries(filters) — reads from SQLite
  └── QuoteRepository
      └── saveQuote(quoteId, note?) — updates store + writes to SQLite
      └── updateNote(id, note) — updates store + writes to SQLite
      └── getSavedQuotes() — reads from SQLite
  └── PreferencesRepository
      └── updatePreference(key, value) — updates store + writes to SQLite
      └── getAll() — reads from SQLite, hydrates store
```

This avoids chatty persistence, accidental write loops, and hard-to-debug side effects. Every write is intentional and traceable.

This replaces the "each screen owns its own state" approach from the full architecture doc. Shared domain concerns (daily content, practice status, saved quotes) live in Zustand stores that any screen can access. UI-only state stays local to the component.

---

## V1 database schema (SQLite)

Deliberately smaller than the full architecture schema. Only tables needed for V1 features.

```sql
-- Practice tracking (completion metadata only — no written content here)
CREATE TABLE practice_log (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,       -- YYYY-MM-DD, one row per day
  morning_complete INTEGER DEFAULT 0,
  evening_complete INTEGER DEFAULT 0,
  intention TEXT,                   -- morning intention (short, kept here for quick access)
  created_at TEXT NOT NULL
);

-- All written content lives here — freeform, morning, AND evening reflections
CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  mode TEXT NOT NULL,               -- freeform | morning | evening_reflection
  content TEXT NOT NULL,            -- plain text, not encrypted in V1
  prompt_key TEXT,                  -- which prompt was used (e.g., "reflection_well", "gratitude")
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE saved_quotes (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL,           -- references embedded quote data
  personal_note TEXT,
  saved_at TEXT NOT NULL
);

CREATE TABLE preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

**Schema decision:** Evening reflection text (what went well, where fell short, what didn't matter, gratitude) lives in `journal_entries` with `mode = 'evening_reflection'`, not in `practice_log`. This keeps `practice_log` as a lightweight daily ledger and puts all user-written content in one table. The journal screen shows everything the user has written in one place, and future features (export, search, On This Day) only need to query one table.

No roles table. No legacy_reflections table. No repetition_queue table. Those come later.

---

## V1 content strategy

### What's embedded in the app

All content ships inside the app binary. No server dependency. No content API. This is the single most important scope decision for V1 — it eliminates the entire backend.

| Content type | Quantity | Format |
|-------------|----------|--------|
| Quotes | 100 | JSON array with text, author, source, dates, themes, brief context (2-3 sentences, not full paragraphs) |
| Evening gratitude prompts | 30 | JSON array of prompt strings |
| Morning intention suggestions | 15 | JSON array (optional — user can also freewrite) |
| Contemplation lines | 20 | For future midday bell, but usable as random daily subtitle |
| Theme definitions | 10 | Name + description for wisdom library categories |

### Daily content selection (no server)

```javascript
// Deterministic daily selection using local date
function getDailyIndex(pool_size) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return dayOfYear % pool_size;
}

// Today's quote
const todayQuote = quotes[getDailyIndex(quotes.length)];
```

This is the same algorithm from the existing prototype. It works. It requires no server. The quote changes daily and cycles annually. When the content library grows large enough (366+), each day of the year gets a unique quote.

### Content production timeline

This is the real bottleneck, and it's honest work, not code.

| Week | Content milestone |
|------|------------------|
| 1-2 | Source 50 quotes from Marcus Aurelius, Seneca, Epictetus. Verify public domain translations. Write 2-3 sentence context for each. |
| 3-4 | Source 30 more quotes from secondary Stoics + adjacent thinkers (Montaigne, Frankl, Musonius Rufus). Tag all 80 by theme and discipline. |
| 5-6 | Write 20 remaining quotes' context. Write 30 evening gratitude prompts. Write 15 morning intention suggestions. |
| 7-8 | QA pass: verify every attribution, check every date, test every quote in the UI at actual font sizes. |
| 9-12 | Buffer. Fix content issues found in testing. Add 20 more quotes if time allows. |

100 quotes with good context is achievable in 12 weeks alongside engineering. 366 is not. Be honest about this.

---

## V1 screen specs (simplified)

### Awaken (Tab 1)

**Two states only in V1:** morning and home. Evening reflection lives here too but is triggered by time, not a separate state.

Morning (before "I AM AWAKE"):
- Vanitas background + ornate hourglass (ported from prototype)
- MEMENTO MORI title
- Live clock
- Remaining days
- "I AM AWAKE" button

After pressing "I AM AWAKE":
- Daily quote with author and source
- Text input: "What is your intention today?" (optional role prefix later)
- "BEGIN" button → marks morning complete, transitions to home

Home (rest of day):
- Today's quote (condensed)
- Today's intention (if set)
- Remaining days (smaller)
- After 5pm: "REFLECT" button appears

Evening reflection (tapping REFLECT):
- Three text prompts, one at a time, each with text input:
  1. "What went well today?"
  2. "Where did you fall short of your own standards?"
  3. "What didn't matter as much as you thought it would?"
- Gratitude prompt: "What would today have been like without [random daily prompt]?"
- "DONE" → marks evening complete, returns to home with quiet confirmation

### Sapientia / Wisdom (Tab 2)

- Today's quote (same as Awaken, displayed at top for easy access)
- Theme chips: horizontal scroll of 10 theme labels
- On theme tap: filtered list of quotes within that theme
- On quote tap: full quote view with author, source, dates, context paragraph
- Save button (heart or bookmark icon) → adds to Commonplace Book
- Commonplace Book accessible via icon in header — simple list of saved quotes with optional personal notes

### Tempus / Life calculator (Tab 3)

- Remaining days (large display)
- Remaining weeks, seasons, birthdays (secondary row)
- Life elapsed percentage bar
- Small hourglass with sand matching elapsed percentage
- "Adjust" expandable: birthdate picker + lifestyle sliders (smoking, drinking, exercise, diet, sleep)
- All calculations run locally using the existing algorithm from the prototype

### Scriptum / Journal (Tab 4)

- "Write" button
- Entry list: reverse chronological, date + first line preview + mode tag (freeform/morning/evening)
- New entry: choose Freeform or Stoic Prompt (simple random prompt from embedded set)
- Morning/evening template entries are created automatically by the Awaken screen flows, but viewable and editable here
- Edit existing entries
- No encryption, no sync, no export in V1. Just a clean local journal.

### Virtus / Profile (Tab 5)

- User name (editable, stored locally)
- Practice summary: total days practiced, current month calendar (dot grid)
- Saved quotes count
- Journal entries count
- Settings: morning bell time, evening bell time, notification on/off
- Birthdate + lifestyle factors (links to same controls as Tempus screen)
- About / version info

That's it for V1 profile. No roles, no assessments, no legacy, no progression titles.

---

## V1 notifications

Two notifications. Two.

| Notification | Default | Customizable | Content |
|-------------|---------|:---:|---------|
| Morning bell | 6:30 AM | Time only | "Remember." + first 8 words of today's quote |
| Evening bell | 8:00 PM | Time only | "The day is ending. Reflect." |

Rules:
- Local scheduled notifications only (expo-notifications)
- No push server
- If user hasn't opened in 14+ days, notifications continue unchanged (they're local, there's no "smart" throttling in V1)
- Notification content is always philosophical, never promotional

---

## V1 paywall

There is no paywall in V1.

The entire app is free. Every feature works. This is intentional.

Why: V1 doesn't have enough content depth to justify a paywall. The wisdom library has 100 quotes, not 366+. There's no audio, no study paths, no spaced repetition, no community. Charging $99/year for V1 would feel premature and damage trust.

The paywall arrives in V2 when the content library is deep enough to create a meaningful free/paid split. The free tier gets the daily quote, memento mori screen, basic timer, and 7-day intro course. Everything else goes behind the annual subscription.

V1's job is to prove the daily practice loop works and feels premium. V2's job is to monetize it.

---

## V1 performance targets (realistic)

| Metric | Target | Notes |
|--------|--------|-------|
| Cold launch to interactive | < 3 seconds | Includes font loading. Aspirational < 2s. |
| Screen transition | < 300ms | Cross-fade, achievable with React Navigation defaults. |
| Animation frame rate | 60fps | Reanimated on UI thread. Test on older devices early. |
| Journal entry save | < 200ms perceived | SQLite write + Zustand update. |
| Offline capability | 100% | No network dependency whatsoever. |
| App binary size | < 30MB | No audio, no large image packs. Embedded content is tiny. |

---

## Development environment

### Primary: Google Antigravity + Claude

The build uses Google Antigravity as the primary IDE — a free, agent-first development environment built on VS Code with native support for Claude Sonnet 4.6 and Claude Opus 4.6. This gives us agentic coding (Claude plans, writes, and iterates across files) inside a familiar VS Code environment with integrated terminal, browser preview, and Git.

**Why Antigravity for this project:**

- Free during public preview (no IDE cost)
- Claude models built in — no separate API key or proxy setup needed for coding assistance
- Manager View allows running multiple agents in parallel (e.g., one agent on the hourglass SVG port while another scaffolds the Zustand stores)
- Browser sub-agent can visually verify UI rendering, which matters for an aesthetically-driven app
- Full VS Code extension ecosystem (ESLint, Prettier, React Native Tools, etc.)

**NanoBanana integration for asset generation:**

NanoBanana (Gemini's image generation model) is available directly inside Antigravity. This is specifically useful for Memento because:

- Generate vanitas-style background paintings for testing different atmospheric moods without sourcing public domain art first
- Create wabi-sabi texture variations (cracked pottery, weathered stone, rust patterns) for future impermanence meditations
- Produce UI mockup variations before committing to implementation — generate 3-4 layout variations of the Awaken screen, review with stakeholders, then build the chosen version
- Create grain and vignette texture overlays at exact dimensions needed
- Generate placeholder imagery for content that hasn't been sourced yet, keeping the visual atmosphere consistent during development

NanoBanana Pro (Gemini 3 Pro Image) supports JSON prompting for precise control over style, lighting, and composition — useful for maintaining the consistent dark/gold/classical aesthetic across generated assets. NanoBanana 2 (Gemini 3.1 Flash Image) is faster and good for rapid iteration on batch variations.

**Workflow pattern:**

1. Describe feature requirements to Claude in Antigravity
2. Claude plans the implementation (file structure, component API, data flow)
3. Claude writes the code across relevant files
4. Use NanoBanana to generate any visual assets or mockups needed
5. Test in Expo Go on physical device
6. Iterate with Claude on fixes and refinements

### Secondary tools

| Tool | Purpose |
|------|---------|
| Expo Go (mobile) | Live preview on physical iOS/Android devices during development |
| Expo EAS | Cloud builds for TestFlight and Play Store submission |
| Git + GitHub | Version control. Antigravity has full Git integration. |
| Figma (optional) | If detailed design specs are needed before implementation. Not strictly required — NanoBanana mockups + direct code iteration may be sufficient. |

---

## Known unknowns

Things we can't know until we're holding a real device. These are the risks that don't show up in architecture diagrams.

| Unknown | Why it matters | When we'll know | Fallback |
|---------|---------------|-----------------|----------|
| Cinzel + Cormorant Garamond rendering on older Android | Custom fonts can render poorly on low-DPI Android screens. Cinzel's thin serifs may become illegible. | Week 3 (first real device test) | Fall back to system serif for body text on affected devices, keep Cinzel for display only. |
| Vanitas painting breathing animation performance on mid-range Android | A full-screen image scaling at 12s intervals with opacity layers on top may drop frames on a Pixel 6a. | Week 4 (first full Awaken screen on device) | Reduce to static image with no breathing animation on low-performance devices. Detect with a simple frame-rate check on first load. |
| Expo + react-native-svg performance with the ornate hourglass | The hourglass SVG has animated sand particles, gradient fills, and clip paths. Complex SVG + Reanimated can conflict. | Week 3-4 (hourglass port) | Simplify hourglass SVG (remove pillar rings, reduce particle count) or pre-render as animated image sequence. |
| Notification permission timing on iOS | iOS shows the permission prompt once. If the user dismisses it during onboarding before understanding the app, morning/evening bells never work. | Week 6 (onboarding flow) | Delay notification permission request until after the first morning practice is complete, when the user understands why bells matter. |
| Journal text input behavior with Cormorant Garamond | Custom fonts in TextInput on React Native can cause cursor positioning bugs, especially with italic. | Week 7 (journal implementation) | Use system font for text input, Cormorant Garamond for display/reading only. |
| App Store review for mortality-related content | Apple may flag the life expectancy calculator or memento mori imagery during review. | Week 12 (submission) | Prepare a clear App Store review note explaining the app's philosophical context. Have a version ready with softer language if needed. |
| Time zone handling for daily content rotation | The getDailyIndex function uses local date. Users crossing time zones mid-day may see content change unexpectedly. | Week 5 (content integration) | Pin daily content to the timezone at the time of first app open that day. Don't re-evaluate. |

These aren't blockers — they're the things we test early and have fallbacks ready for.

---

## V1 development timeline — 12 weeks

### Weeks 1-2: Foundation

- [ ] Antigravity setup: install, configure Claude model access, install React Native / Expo extensions
- [ ] Expo project init (managed workflow, TypeScript — strict mode, no implicit any)
- [ ] React Navigation setup (bottom tabs, 5 tabs, native stack per tab)
- [ ] Design system: all color tokens, typography tokens, spacing tokens as a theme provider
- [ ] Cinzel + Cormorant Garamond font loading (block splash until loaded)
- [ ] Zustand stores: scaffold all four (dailyContent, practice, quotes, preferences)
- [ ] SQLite setup: create tables, write repository layer (PracticeRepository, JournalRepository, QuoteRepository, PreferencesRepository)
- [ ] Hydration logic: repositories read from SQLite → populate Zustand stores on app launch
- [ ] Test font rendering on one physical iOS and one physical Android device (don't wait until week 11)

### Weeks 3-4: Core screens

- [ ] VanitasBackground component (port from web prototype — base64 painting, vignette, grain, breathing animation via Reanimated)
- [ ] OrnateHourglass component (port SVG to react-native-svg, accept pct prop)
- [ ] Awaken screen: morning state (memento mori display, clock, remaining days, I AM AWAKE button)
- [ ] Awaken screen: post-awake flow (daily quote → intention input → BEGIN)
- [ ] Awaken screen: home state (condensed view, evening trigger after 5pm)
- [ ] Life calculator logic (port existing algorithm, wire to Zustand preferences store)

### Weeks 5-6: Practice loop

- [ ] Evening reflection flow (three questions → gratitude → done)
- [ ] Practice log: write to SQLite on morning/evening completion
- [ ] Practice calendar component (dot grid for current month)
- [ ] Tempus screen (remaining days/weeks/seasons display, progress bar, lifestyle sliders)
- [ ] Notifications: morning + evening local scheduled notifications
- [ ] Onboarding flow: birthdate picker → optional lifestyle sliders → first morning sequence

### Weeks 7-8: Content + journal

- [ ] Embedded content: load 100 quotes JSON, daily selection algorithm, theme tagging
- [ ] Sapientia screen: today's quote, theme chips, filtered quote list, quote detail view
- [ ] Save quote to Commonplace Book (Zustand + SQLite write)
- [ ] Commonplace Book view (list of saved quotes + personal note input)
- [ ] Scriptum screen: entry list, new entry (freeform mode), edit entry
- [ ] Morning/evening template entries auto-created from Awaken screen flows

### Weeks 9-10: Profile + polish

- [ ] Virtus screen: practice summary, dot calendar, saved quotes count, settings
- [ ] Settings: notification time pickers, birthdate/lifestyle factor editing
- [ ] Entrance choreography: staggered fadeUp on all screens
- [ ] Button hover/press animations
- [ ] Screen transition polish (cross-fade timing)
- [ ] Haptic feedback on buttons and timer events
- [ ] Empty states: what each screen looks like before any practice data exists

### Weeks 11-12: QA + ship

- [ ] Test on physical iOS device (older model — iPhone SE or similar)
- [ ] Test on physical Android device (mid-range — Pixel 6a or similar)
- [ ] Fix animation performance issues found on real devices
- [ ] Content QA: every quote attribution verified, every date checked
- [ ] Accessibility pass: VoiceOver/TalkBack on all screens, sufficient contrast ratios
- [ ] App Store assets: screenshots, description, keywords (the aesthetic sells itself here)
- [ ] TestFlight beta to 10-20 trusted testers
- [ ] Fix critical issues from beta feedback
- [ ] Submit to App Store + Google Play

---

## What success looks like after V1

V1 is successful if:

1. A user installs the app and practices morning + evening for 7 consecutive days without quitting
2. The aesthetic makes people want to show the app to someone else
3. At least 20% of active users save a quote to their Commonplace Book in the first week
4. The app feels finished, not like an early access beta
5. Nobody asks "where's the light mode?"

V1 is NOT measured by:
- Download numbers (too early, no marketing)
- Revenue (no paywall)
- Retention at 30 days (need more content depth for that)

The only metric that matters in V1: does the daily practice loop feel real?

---

## Schedule safety valve

If weeks 7-8 start slipping, these are the named fallback cuts — features that can be simplified or removed without breaking the core experience. Decide by end of week 6 whether any are needed.

| Cut | What changes | Impact |
|-----|-------------|--------|
| **Commonplace Book personal notes** | Save quotes still works, but without editable annotations. Notes come back in V1.1. | Low. Saving is the core action; notes are a refinement. |
| **Stoic Prompt mode in journal** | Journal launches with freeform only. Morning/evening template entries still auto-created by Awaken screen. | Low. Most users will freewrite anyway. |
| **Grain texture overlay** | Remove the SVG noise layer from VanitasBackground. Keep painting + vignette only. | Minimal visual impact, saves animation performance headroom. |
| **Theme filtering in wisdom library** | Show all 100 quotes in a flat list instead of filterable by theme. | Moderate UX impact but the content is still accessible. Add themes in V1.1. |
| **Lifestyle factor sliders** | Life calculator uses birthdate only with a flat 78.5-year base. No smoking/drinking/exercise adjustments. | Moderate. Simplifies onboarding significantly. Sliders come back in V1.1. |

These are not anticipated cuts. They're pre-negotiated escape hatches. Having them named in advance prevents panicked decisions under schedule pressure.

---

*Incipe. — Begin.*
