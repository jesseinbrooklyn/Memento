# MEMENTO — Backlog

### Everything that's been cut from V1, and when it comes back

---

*"It is not that we have a short time to live, but that we waste a good deal of it."*
— Seneca, On the Shortness of Life

---

## V1 — Pre-launch bugs and polish

These need to be resolved before V1 ships. They are not backlog items — they are open issues in the current build.

### Bugs

- **IntroOverlay shows on every launch** — no `hasSeenIntro` preference saved. Should persist to SQLite after first dismiss so returning users skip it.
- **Virtus notification footnote is wrong** — says "Push notifications will be enabled in V2" but notifications are already wired in V1 via `utils/notifications.ts`. Remove or update the copy.
- **Heart symbols in QuoteDetailScreen** — uses `♥`/`♡` Unicode symbols. Spec says all icons are custom SVG, no emoji or decorative symbols.
- **`borderRadius: 16` on Sapientia theme chips** — creates pill-shaped buttons. Spec says "never fully rounded." Use `borderRadius: 4` or `8` max.
- **`fontWeight: 'bold'` in ScriptumHome and LifestyleSliders** — no Cinzel Bold font is loaded. Will fall back to system font. Use `fontFamily: fonts.displaySemiBold` instead.
- **Evening practice journal entry not visible in Scriptum until restart** — `PracticeRepository.markEveningComplete` writes to SQLite and the journal store, but verify the store update is reaching ScriptumHome.

### Dead code to remove

- `src/screens/intro/IntroScreen.tsx` — orphaned, replaced by IntroOverlay
- `src/screens/sapientia/SapientiaScreen.tsx` — dead stub, never imported
- `src/screens/scriptum/ScriptumScreen.tsx` — dead stub, never imported
- `src/stores/dailyContent.ts` — defined but never used by any screen or repository

### Missing from V1 spec

- **Haptics** — `expo-haptics` is in the spec stack but never installed or used. Add subtle haptic feedback on button presses, morning/evening completion, and quote save/unsave.
- **Onboarding flow** — birthdate picker + optional lifestyle sliders on first launch. Currently no way to set birthdate except through Tempus screen.
- **`src/types/index.ts`** — types are scattered across component and store files instead of centralized per the architecture spec.
- **`src/content/prompts.json`** — prompts are hardcoded in `utils/dailyContent.ts` instead of in a content JSON file per the file structure spec.
- **Custom SVG tab icons** — tabs show text labels only, spec calls for custom SVG icons.
- **Entrance animations** — no `fadeUp` stagger choreography on any screen.

### Minor cleanup

- 4 `console.warn` calls remain (App.tsx, EveningReflectionScreen, MorningIntentionScreen, JournalEditorScreen). Spec says no console.log in committed code.
- Raw hex/rgba values used in several places instead of token references.
- Magic numbers (font sizes, padding values) not from the spacing/design token system.

---

## How to read this document

Every feature cut from V1 is listed here with four pieces of information:

1. **What it is** — brief description
2. **Why it was cut** — the honest reason, not a polite deferral
3. **What triggers its return** — the specific condition that means it's time to build this
4. **Dependencies** — what must exist before this can be built

Features are grouped into release waves. Within each wave, items are ordered by estimated impact. This is not a fixed roadmap — it's a prioritized backlog that responds to real user behavior and business needs.

---

## Wave 1 — The monetization wave

These features come first after V1 because they enable revenue. Without revenue, nothing else gets built. Target: 4-8 weeks after V1 launch.

**Trigger for this wave:** V1 has 500+ installs and 7-day retention above 25%.

---

### B-01: Subscriptions + paywall

**What:** Annual subscription at $99/year via Apple IAP and Google Play Billing. Restrained paywall that previews content before gating. No monthly option.

**Why cut from V1:** V1 doesn't have enough content depth to justify charging. 100 quotes and a basic journal aren't worth $99/year. Launching free builds trust and proves the practice loop works before asking for money.

**Trigger:** Content library reaches 200+ quotes with full context, plus at least one of: breathing exercises, spaced repetition, or expanded journal templates. The free/paid split needs to feel fair, not extractive.

**Dependencies:** None technically (IAP integration is straightforward). Requires content depth to justify the price.

**Estimated effort:** 2-3 weeks (IAP integration, entitlement checking, paywall UI, receipt validation).

**Free tier after paywall launches:**
- Daily quote (single, no library browse)
- Memento mori screen
- Life calculator
- 7-day intro experience (curated first week)
- Practice calendar (read-only, no journal)

**Paid tier:**
- Everything else

---

### B-02: Auth + accounts

**What:** Email + password accounts. Magic link login option. Account deletion. No social login, no profile photos, no phone numbers.

**Why cut from V1:** V1 is entirely local. No server means no accounts needed. Adding auth to a local-only app is complexity with no user benefit.

**Trigger:** Subscription service requires account association. Also needed if/when cloud sync is added.

**Dependencies:** Backend API (even minimal). Subscription service (B-01) is the driver.

**Estimated effort:** 2 weeks (auth service, JWT handling, account creation flow, magic link, deletion). Can be built simultaneously with B-01.

**Architecture note:** Use Supabase Auth or Firebase Auth to avoid building auth from scratch. Both handle email/password, magic links, and JWT issuance. The philosophical objection to social login still applies — don't enable Google/Apple sign-in even though these services support it.

---

### B-16: Lifetime membership

**What:** One-time $249-299 purchase for permanent access. Includes a physical artifact (medallion or leather journal). Processed via Stripe (Apple/Google don't support lifetime IAP cleanly for this model).

**Why cut from V1:** Requires subscription infrastructure to exist. Also requires physical artifact fulfillment pipeline.

**Trigger:** Subscription service (B-01) is live and processing payments. Physical artifact supply chain is established (B-17).

**Dependencies:** B-01 (subscriptions), B-17 (physical artifacts — at least one item ready to ship).

**Estimated effort:** 1-2 weeks for Stripe integration + lifetime entitlement logic. Physical fulfillment is a separate operational effort.

---

## Wave 2 — The depth wave

These features make the app worth keeping after the first month. They're the retention layer — the features that reward consistent practice with richer content. Target: 6-12 weeks after paywall launch.

**Trigger for this wave:** Paying subscriber count reaches 100+ and content library has 200+ quotes.

---

### B-04: Spaced repetition engine

**What:** Saved quotes and philosophical principles resurface at scientifically optimal intervals (day 1, 3, 7, 14, 30, 60, 120). Users rate resonance to adjust future intervals. Simplified SM-2 algorithm.

**Why cut from V1:** Requires a large enough content library to resurface meaningfully. With 100 quotes, users would see the same material too quickly. Also requires the Commonplace Book to have enough saved quotes per user.

**Trigger:** Average active user has 15+ saved quotes in their Commonplace Book. Content library exceeds 200 quotes.

**Dependencies:** Commonplace Book (in V1). SQLite repetition_queue table. New Zustand store for resurfacing state.

**Estimated effort:** 2 weeks (SM-2 algorithm, queue management, resurfacing UI in Sapientia screen, "Returning thought" card component).

**This is the single highest-impact retention feature on the backlog.** It's the reason users open the app on day 45 instead of day 7. Prioritize it aggressively once the content library supports it.

---

### B-05: Breathing exercises

**What:** Full-screen breathing animations synced to patterns (4-7-8, box breathing, natural rhythm). Candle flame visual. Haptic pulses on phase transitions. Timer display.

**Why cut from V1:** Good feature, but not core to the Stoic daily practice loop. The morning intention and evening reflection are the practice. Breathing is supplementary.

**Trigger:** V1 retention data shows users want more in-app dwell time beyond the morning/evening loop. Or users explicitly request it.

**Dependencies:** None. Self-contained component.

**Estimated effort:** 1-2 weeks (animation design in Reanimated, three pattern presets, timer logic, haptic integration).

---

### B-06: Midday mindfulness bell

**What:** Configurable notification that triggers a full-screen overlay with a single contemplation line. 5-15 second interaction. Optional 30-second breathing animation attached.

**Why cut from V1:** Third notification in V1 risks feeling like nagging before the habit is established. Morning + evening is the right starting pair.

**Trigger:** Users who practice consistently (14+ days) request a midday touchpoint. Or B-05 (breathing) ships and this becomes a natural home for it.

**Dependencies:** B-05 (breathing exercises) for the optional breathing attachment. Otherwise self-contained.

**Estimated effort:** 1 week (notification scheduling, overlay component, contemplation line rotation from embedded content).

---

### B-20: Premeditatio malorum (guided exercise)

**What:** Structured morning exercise that walks the user through mentally rehearsing challenges they might face today. Rotates daily through categories: difficult people, unexpected setbacks, loss, frustration, physical pain, public failure. Each category has 5 variations.

**Why cut from V1:** V1's morning flow includes a simpler version (the intention setter). The full guided premeditatio is a richer experience that requires 30 content variations and a multi-step flow that adds significant UX complexity to the morning sequence.

**Trigger:** Morning practice completion rate is high (>60% of active users complete the morning flow) and user feedback suggests they want more depth in the morning routine.

**Dependencies:** 30 premeditatio prompts (6 categories × 5 variations). Content production is the bottleneck.

**Estimated effort:** 1 week engineering + 2-3 weeks content writing and QA.

---

### B-19: On This Day resurfacing

**What:** When opening the journal, if entries exist from the same date in previous years, show a "One year ago today, you wrote..." card.

**Why cut from V1:** Requires a year of journal history to work. Cannot function at launch.

**Trigger:** The app has been live for 12+ months and users have accumulated journal entries.

**Dependencies:** Journal (in V1). Date-based query on journal_entries table.

**Estimated effort:** 3-4 days. Tiny feature, enormous emotional impact. This is the feature users fall in love with in journaling apps.

**Special note:** Plant the seed now. The SQLite schema already supports date-based queries. When the time comes, this is a trivial implementation with outsized return.

---

### B-03: Audio narration

**What:** Male narrator reading philosophical passages. Bell/chime/gong sound effects. Optional ambient soundscapes (rain on stone, hearth fire, night sounds).

**Why cut from V1:** Audio production is expensive and slow. Poor voice quality would damage the brand more than no voice at all. Also adds significant binary size.

**Trigger:** Revenue from subscriptions justifies audio production budget. A narrator has been identified and test recordings approved.

**Dependencies:** expo-av integration. Audio file hosting (S3/R2). Downloadable content pack system (users shouldn't have to download 200MB of audio on install).

**Estimated effort:** 1 week engineering (player component, download manager). 4-8 weeks audio production (narrator recording, editing, mastering for 50+ passages + sound effects + ambient loops).

**Content breakdown:**
- Priority 1: Bell/chime/gong sound set (5 sounds, 1-2 days recording)
- Priority 2: Top 30 quotes narrated (2-3 days recording + editing)
- Priority 3: 3 ambient loops at 30+ minutes each (can license or commission)
- Priority 4: Expand narrated library to 100+ quotes
- Priority 5: Stoic narrative recordings (evening stories, 10-15 min each — this is Phase 4+ content)

---

## Wave 3 — The identity wave

These features build long-term user identity and make the app irreplaceable. They're why someone stays for a year instead of a month. Target: 3-6 months after paywall launch.

**Trigger for this wave:** 90-day retention is measurable and needs improvement, OR qualitative feedback shows users want deeper self-tracking.

---

### B-07: Role definitions + assessments

**What:** Users define their key life roles (Father, Husband, Engineer, Friend, etc.) with personal definitions of excellence. Weekly or biweekly assessment: rate each role 1-5 with a short reflection. Trend display over time.

**Why cut from V1:** This is an identity feature that requires the daily practice to be solid first. Users need to trust the app before they'll define their roles in it.

**Trigger:** Active users reach 30+ consecutive practice days and the daily practice loop is stable. Or user interviews surface demand for self-assessment tools.

**Dependencies:** SQLite roles + role_assessments tables. New Zustand store. Notification for weekly assessment prompt.

**Estimated effort:** 2 weeks (role management UI, assessment flow, trend visualization, weekly notification).

---

### B-08: Legacy reflections

**What:** Quarterly prompt set. "What do you want to be remembered for?" / "What are you building that outlasts you?" / "What would you want said at your funeral?" Previous reflections viewable in timeline.

**Why cut from V1:** Quarterly cadence doesn't fit a 12-week build. Also requires enough practice history to make the reflection feel grounded rather than abstract.

**Trigger:** The app has been live for 3+ months. Users with 60+ practice days get a prompt.

**Dependencies:** SQLite legacy_reflections table. Quarterly notification trigger.

**Estimated effort:** 1 week. Simple prompt flow + timeline view.

---

### B-11: Progression titles

**What:** Quiet Latin designations that appear on the profile based on cumulative practice days. Neophytus (0) → Auditor (7) → Discipulus (30) → Prokopton (90) → Philosophus (180) → Sapiens (365). Never announced, never celebrated with fanfare.

**Why cut from V1:** Meaningless without enough practice days to earn them. The earliest meaningful title (Discipulus, 30 days) requires a month of use.

**Trigger:** Users are reaching 30+ practice days and the profile screen needs more substance.

**Dependencies:** Practice log (in V1). Simple threshold check.

**Estimated effort:** 2-3 days. Trivial implementation, subtle emotional payoff.

---

### B-09: View from Above meditation

**What:** Full-screen animated sequence zooming out from a point through levels of scale (room → city → continent → planet → cosmos). Each level holds 5 seconds with a contemplation line. 60-90 seconds total.

**Why cut from V1:** High-polish animation that requires significant Reanimated work. Impressive but not essential for daily practice.

**Trigger:** Breathing exercises (B-05) are shipping and there's appetite for more meditation types. Or this becomes a marketing showcase feature worth the investment.

**Dependencies:** B-05 (breathing exercises establish the meditation UX pattern). Significant animation design time.

**Estimated effort:** 2-3 weeks (animation design, asset creation for each zoom level, timing choreography, contemplation text overlay).

---

### B-10: Impermanence meditations

**What:** Daily rotating focus on something beautiful and temporary, paired with wabi-sabi imagery. Subjects: seasons, life stages, places, relationships, capabilities.

**Why cut from V1:** Requires a curated imagery pipeline (sourcing, licensing, formatting wabi-sabi photography). Content-heavy for a supplementary feature.

**Trigger:** Content production capacity increases. The wisdom library is fully stocked (366+ quotes) and there's bandwidth for a new content type.

**Dependencies:** Image hosting (S3/R2). Downloadable content packs. 30+ curated images with contemplation text.

**Estimated effort:** 1 week engineering + 3-4 weeks image sourcing and content writing.

---

### B-18: Stoic study paths

**What:** Structured deep-dive courses through major works: Epictetus's Discourses, Marcus Aurelius's Meditations (book by book), Seneca's Letters to Lucilius (selected letters). Each lesson includes passage, context, contemplation prompt, and connection to daily practice.

**Why cut from V1:** Massive content effort. A single study path (e.g., Meditations in 30 days) requires 30 curated lessons with original commentary. This is a months-long editorial project.

**Trigger:** Subscription revenue justifies content investment. The base wisdom library (366+ quotes) is complete and the team has capacity for long-form content.

**Dependencies:** Content API (study paths are too large to embed in the app binary). Auth + accounts (progress tracking requires server-side state).

**Estimated effort:** 1 week engineering per path (lesson player, progress tracking, completion state). 8-12 weeks content production per path.

---

## Wave 4 — The sync + security wave

These features address multi-device use and data protection. They're infrastructure, not user-facing features, but they remove the biggest practical limitation of a local-only app.

**Trigger for this wave:** Users report losing data when switching phones, OR multi-device use becomes a common support request.

---

### B-12: Cloud sync

**What:** Optional sync of practice log, saved quotes, preferences, and journal entries across devices. Client is source of truth. Opt-in only.

**Why cut from V1:** Sync is deceptively hard. Last-write-wins sounds simple but creates surprising data loss scenarios for edited content. Key management, conflict resolution, and recovery paths need a dedicated design pass.

**Trigger:** User complaints about data loss on device switch reach meaningful volume. Or B-02 (auth/accounts) is live and the infrastructure exists.

**Dependencies:** B-02 (auth/accounts). Backend API. PostgreSQL for server-side storage.

**Estimated effort:** 4-6 weeks for a robust implementation. This is the single most complex engineering task on the backlog.

**Architecture recommendation from GPT review (agreed):** Start with sync as backup/restore, not live multi-device collaboration. Sync append-mostly objects first (practice logs, saved quotes, preferences). Delay syncing editable journal entries until conflict resolution is properly designed.

**Sync priority order:**
1. Preferences (simple key-value, last-write-wins is fine)
2. Practice log (append-only, no conflicts possible)
3. Saved quotes (append-mostly, rare edits to personal notes)
4. Journal entries (editable, conflict-prone — Phase 2 of sync)

---

### B-13: Journal encryption

**What:** Content-level encryption of journal entries. Client-side encryption with key derived from user password. Server stores only ciphertext.

**Why cut from V1:** V1 journal is local-only. Device-level OS encryption is sufficient. Content-level encryption is only necessary when data leaves the device (sync).

**Trigger:** Cloud sync (B-12) reaches the journal entry sync phase.

**Dependencies:** B-12 (cloud sync). expo-secure-store for key material. Encryption library (react-native-quick-crypto or equivalent).

**Estimated effort:** 2-3 weeks. The encryption itself is straightforward. The hard parts: key derivation from password, what happens on password reset (answer: encrypted data is lost unless a recovery key was saved), what happens when the user forgets their password entirely, and testing across iOS/Android/Expo compatibility.

**Critical design decision to make before building:** If the user resets their password, do they lose all encrypted journal entries? If yes, that must be clearly communicated during setup. If no, then a recovery key or secondary encryption scheme is needed, which significantly increases complexity. Recommend: yes, password reset loses encrypted data. Frame it Stoically: "Your words are protected by your word. If you lose your key, your inner citadel remains sealed — even from you."

---

## Wave 5 — The community wave

These features create human connection. They're the highest-cost, highest-risk, and potentially highest-reward features on the backlog. They also create the most operational burden (moderation, abuse handling, legal review).

**Trigger for this wave:** The app has 5,000+ active users and retention plateaus suggest users need social motivation to continue.

---

### B-14: Community (letters, partners, circles)

**What:** Three community features, each independent:

**Letters:** Journal entries marked as "letters" can be shared anonymously with the community. No likes, no comments. Readers can save letters to their Commonplace Book. Think: a quiet reading room, not a social feed.

**Accountability partners:** Matched by practice frequency and timezone. Partners see each other's practice calendar (practiced/didn't practice) but never content. Gentle nudge when partner hasn't practiced in 3 days.

**Discussion circles:** Small groups (5-8 people) reading the same Stoic text over a set period. Weekly async discussion prompts. Text-based only.

**Why cut from V1 (and V2 and V3):** Community features in an empty room are depressing. They also create moderation burden, abuse handling requirements, reporting systems, privacy concerns, retention expectations, support overhead, and legal/policy review. The GPT review correctly identified this as "much more expensive than it sounds."

**Trigger:** 5,000+ active users. Qualitative feedback strongly requesting community. Moderation infrastructure and community guidelines are ready. Legal review complete.

**Dependencies:** B-02 (auth/accounts). Backend community service. Moderation tooling. Reporting system. Privacy policy updates.

**Estimated effort:** 8-12 weeks for all three sub-features. Recommend shipping them sequentially: Letters first (lowest moderation burden), then Accountability Partners (moderate), then Discussion Circles (highest).

**Build order within this feature:**
1. Letters (2-3 weeks) — anonymous sharing, no interaction, minimal moderation
2. Accountability Partners (3-4 weeks) — matching algorithm, calendar sharing, nudge system
3. Discussion Circles (3-4 weeks) — group management, weekly prompts, async threading

---

### B-15: Epictetus Scholarship

**What:** Full subscription access for users who practice actively for 60+ days but cannot afford $99/year. Auto-granted after 40 practice days within 90 calendar days. Valid 1 year, renewable with 100 practice days.

**Why cut from V1:** Requires subscriptions (B-01) to exist. Also requires 60 days of practice history, which means the app must be live for 2+ months before anyone qualifies.

**Trigger:** Subscription service is live and has been processing payments for 60+ days.

**Dependencies:** B-01 (subscriptions). B-02 (auth/accounts). Practice log with 60+ days of history for qualifying users.

**Estimated effort:** 1 week. Simple eligibility check + auto-grant + renewal logic.

**Financial modeling note (from GPT review):** Explicitly model: what percentage of users will use the scholarship? What conversion rate keeps the business healthy? The 60-day practice gate is the primary abuse filter, but if >20% of active users are on scholarship, the pricing model needs revisiting. Track this metric from day one.

---

## Wave 6 — The platform wave

Extending Memento to new surfaces. Low urgency, high polish.

**Trigger:** The mobile app is stable, retention is strong, and there's demand for Memento outside the phone.

---

### B-17: Physical artifacts / storefront

**What:** In-app storefront for Stoic practice tools. Memento Mori medallion ($28-35), leather journal ($45-60), wax seal kit ($35-45), Marcus Aurelius bust ($65-80). Stripe payment + fulfillment partner.

**Why cut:** Brand extension, not app feature. Requires supply chain (manufacturer, fulfillment, shipping). High operational overhead relative to engineering effort.

**Trigger:** Brand identity is strong enough that physical products have built-in demand. A fulfillment partner is identified and tested.

**Dependencies:** Stripe integration. Fulfillment partner. Product design and manufacturing. Separate operational workstream.

**Estimated effort:** 2 weeks engineering (storefront UI, Stripe checkout, order tracking). 3-6 months operational setup (product design, manufacturing, fulfillment testing).

---

### Additional platform features (not individually numbered)

These are straightforward when the time comes:

- **Apple Watch complication** — remaining days, daily intention. Requires WatchOS companion app. 2-3 weeks.
- **iOS widget** — morning quote, days remaining. Requires WidgetKit. 1-2 weeks.
- **Android widget** — equivalent to iOS. 1-2 weeks.
- **Web app** — journal access, wisdom library, settings. Could use React Native Web or a separate Next.js build. 4-6 weeks.
- **Seasonal content calendar** — Stoic holidays, solstices, equinoxes, historical dates. Content effort, not engineering. Ongoing.
- **Data export** — full journal + practice history in Markdown/JSON. 2-3 days. **Note: this should ship earlier than Wave 6. Move to Wave 2 or 3.** Users who journal daily will want export capability before the app has been live a full year. It's also a trust signal that reinforces the privacy-forward brand. Simple implementation: generate a .zip of Markdown files (one per journal entry) + a JSON file of practice history + a JSON file of saved quotes.

---

## Content backlog (separate from features)

Content production runs on its own timeline, independent of engineering waves.

| Content type | V1 quantity | Target quantity | Priority | Notes |
|-------------|:-----------:|:--------------:|:--------:|-------|
| Quotes with context | 100 | 366+ | Highest | One per day of year. Source from public domain translations. |
| Evening gratitude prompts | 30 | 90+ | High | Three months of unique prompts before cycling. |
| Morning intention suggestions | 15 | 30+ | Medium | Optional — many users will freewrite. |
| Daily letters (Seneca format) | 0 | 180+ | High | Major content investment. Requires original commentary. |
| Premeditatio prompts | 0 | 30 | Medium | 6 categories × 5 variations. Needed for B-20. |
| Study path lessons | 0 | 30+ per path | Low (until Wave 3) | Meditations path first, then Discourses, then Letters. |
| Narrated audio (quotes) | 0 | 100+ | Low (until B-03) | Requires narrator. |
| Narrated audio (stories) | 0 | 12+ | Lowest | Evening Stoic narratives. Very late addition. |
| Ambient soundscapes | 0 | 3-5 | Low | License or commission. 30+ min loops. |
| Wabi-sabi images | 0 | 30+ | Low (until B-10) | Impermanence meditation imagery. |

**Content production principle:** Every piece of content should be usable for years, not months. A quote with good historical context doesn't expire. A well-written daily letter is valuable on its 5th reading. Invest in depth per piece, not breadth of pieces.

---

## Decision log

Decisions made during V1 scoping that affect the backlog:

| Decision | Rationale | Revisit when |
|----------|-----------|-------------|
| V1 launches free (no paywall) | Not enough content to justify $99/year. Build trust first. | Content library hits 200+ quotes. |
| No server in V1 | All content embedded. Eliminates backend complexity entirely. | Subscriptions require server-side entitlement checking. |
| No audio in V1 | Production cost too high, bad audio hurts brand. | Revenue justifies budget + narrator identified. |
| No encryption in V1 | Local-only data. OS encryption sufficient. | Cloud sync reaches journal phase. |
| No monthly subscription option | Annual-only signals commitment and reduces churn. | Never. This is a brand decision. |
| No social login | Practice is not connected to social identity. | Never. This is a philosophical decision. |
| No light mode | Dark-only is a brand decision, not a missing feature. | Never. |
| Two typefaces only | Cinzel + Cormorant Garamond. Brand constraint. | Never. |
| Zustand over Context-only | Shared domain state needs a proper store. GPT review recommendation accepted. | If app grows past 10 stores, evaluate alternatives. |
| Sync starts as backup/restore | Avoid multi-device conflict complexity. GPT review recommendation accepted. | User demand for true multi-device sync. |
| Scholarship requires 60 days active practice | Filters abuse while honoring the philosophy. | If scholarship utilization exceeds 20% of active users. |

---

*"Begin at once to live, and count each separate day as a separate life."*
— Seneca, Letters to Lucilius, 101

*Non scholae sed vitae discimus.*
We learn not for school but for life.
