# Memento — Shipping Guide

Everything you need to get Memento from "code complete" to live on the App Store and Google Play.

---

## Phase 1: Accounts (one-time setup)

### Apple Developer Program
- Enroll at developer.apple.com ($99/year)
- Uses your Apple ID
- Approval takes 24-48 hours
- Required for App Store submission — no way around it

### Google Play Developer Account
- Register at play.google.com/console ($25 one-time)
- Usually approved same day

### Expo Account
- Sign up at expo.dev (free)
- Builds happen in the cloud so you don't need Xcode or Android Studio
- Connect locally by running `npx eas login` in terminal

---

## Phase 2: Test on a real device

Web doesn't test haptics, notifications, or SQLite persistence. Before shipping, run through the full flow on your iPhone via Expo Go:

```bash
npx expo start
```

Scan the QR code with Expo Go and verify:
- Onboarding shows on first launch, then never again
- Morning flow: I AM AWAKE → quote → intention (chips work) → BEGIN DAY (haptic fires)
- After 5pm: REFLECT button appears → 4-step evening flow → haptic on completion
- Virtus dot lights up for the day (requires both morning AND evening)
- Sapientia: daily quote rotates, save/unsave works (haptic fires), commonplace book shows saved quotes
- Scriptum: journal entries persist, empty state shows when no entries exist
- Tempus: days remaining updates when you enter birthdate and adjust lifestyle sliders
- Tab icons render in gold (active) and dim (inactive)
- Entrance animations play on each tab (subtle fade-up)

---

## Phase 3: Build the app

### Install EAS CLI
```bash
npm install -g eas-cli
```

### Log into Expo
```bash
eas login
```

### Build for iOS
```bash
eas build --platform ios --profile production
```
- First time: EAS asks for your Apple Developer credentials
- It generates signing certificates automatically — you don't need to understand code signing
- Build takes ~15-20 minutes in the cloud
- You get a `.ipa` file URL when done

### Build for Android
```bash
eas build --platform android --profile production
```
- Generates a `.aab` file (Android App Bundle)
- Also ~15-20 minutes

---

## Phase 4: Submit to stores

### iOS — App Store

```bash
eas submit --platform ios
```

EAS uploads the build to App Store Connect. Then go to appstoreconnect.apple.com and fill in:

**App Information:**
- App name: Memento
- Subtitle: Stoic daily practice (or similar, 30 char max)
- Category: Health & Fitness or Lifestyle
- Content rights: "This app does not contain third-party content" (all quotes are public domain)

**App Listing (what users see):**
- Description: 2-3 paragraphs about the app (see copy section below)
- Keywords: stoic, memento mori, meditation, journal, philosophy, marcus aurelius, seneca, daily practice
- Screenshots: Required sizes below

**Screenshots needed:**
- 6.7" display (iPhone 15 Pro Max): 1290 x 2796px — minimum 3, recommended 6
- 6.1" display (iPhone 15 Pro): 1179 x 2556px — minimum 3
- Take them from Simulator (`Cmd+S` in Simulator saves a screenshot) or your phone

**Privacy Policy URL:**
- Required even though you collect zero data
- Create a simple page that says: "Memento stores all data locally on your device. We do not collect, transmit, or store any personal information."
- Host on GitHub Pages (free) or any static site

**Age Rating:**
- Fill out Apple's questionnaire (no violence, no gambling, no mature content, etc.)
- The app will likely land at 4+ or 12+ depending on how Apple views mortality themes

**Review Notes (important):**
Write this in the "Notes for Review" field:

> Memento is a Stoic philosophy app inspired by the ancient practice of memento mori ("remember you will die"). The skull imagery and mortality references are philosophical, drawn from Marcus Aurelius, Seneca, and Epictetus — the same tradition taught in university philosophy departments worldwide. The life expectancy calculator uses CDC actuarial data (NCHS Data Brief 548, 2024) for personal reflection purposes, not medical advice. All data is stored locally on the device. There is no backend, no accounts, and no data collection.

### Android — Google Play

```bash
eas submit --platform android
```

- First time: you need to create a Google Service Account key
- EAS docs walk you through it: docs.expo.dev/submit/android
- Then go to play.google.com/console and fill in similar listing info
- Google review is usually faster than Apple (hours vs. days)

---

## Phase 5: Post-launch updates

### OTA updates (no new store review)

For JavaScript/content changes — bug fixes, new quotes, UI tweaks, copy changes:

```bash
# One-time setup
eas update:configure

# Push an update
eas update --branch production --message "fix: description of fix"
```

Users get the update next time they open the app. No store review needed.

### New store build (requires review)

Only needed when you change native dependencies (add a new Expo module, upgrade SDK, change permissions):

```bash
eas build --platform all --profile production
eas submit --platform all
```

---

## Suggested App Store Description

> Remember that you will die. Let that shape how you live.
>
> Memento is a daily Stoic practice built on the ancient tradition of memento mori. Each morning, face your remaining days and set a single intention. Each evening, reflect on what went well, where you fell short, and what didn't matter as much as you thought.
>
> 100 quotes from Marcus Aurelius, Seneca, Epictetus, Musonius Rufus, Montaigne, and Viktor Frankl. A personal commonplace book for the wisdom that strikes you. A life calculator grounded in actuarial data. A journal for the words you need to write but no one else needs to read.
>
> No accounts. No cloud. No streaks. No confetti. Everything stays on your device.
>
> Dark, quiet, and honest — like the philosophy it carries.

---

## Things you do NOT need

- Xcode (EAS builds in the cloud)
- Android Studio (same)
- A Mac for building (EAS works from any machine)
- Code signing knowledge (EAS auto-manages certificates)
- A backend server (everything is local)
- Any paid infrastructure beyond the developer accounts

---

## Bundle identifier

The app is configured as `com.jesse.memento` for both iOS and Android. If you want a different identifier (e.g., your company name), change it in `app.json` before your first build. Once you submit to the stores, the bundle ID is permanent.

---

## Version bumping

For future releases, update the `version` field in `app.json`:

```json
"version": "1.1.0"
```

`buildNumber` (iOS) and `versionCode` (Android) auto-increment via EAS when using the production profile.
