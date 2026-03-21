# MEMENTO MORI

> *"You could leave life right now. Let that determine what you do and say and think."* — Marcus Aurelius

**Memento** is a strict, time-locked iOS/Android application built to enforce brutal stoic discipline. It is not a standard habit tracker; it is a psychological mirror. 

![Vanitas Mode](assets/splash-icon.png)

## Core Architecture
Built structurally on **React Native (Expo)**, **Zustand**, and **SQLite**. Memento operates with absolute zero cloud dependencies. Your statistical death calculations, daily intentions, and personal evening confessions are physically stored locally entirely upon your device's processor.

### The Time-Locked Ritual
The application enforces a rigid daily rhythm perfectly synchronized with your phone's physical clock:
* **Awaken (Morning):** Unlocked at dawn. You must physically face your exact remaining statistical days on Earth and set a single stoic intention for the exact 24 hours ahead of you.
* **Reflect (Evening):** Actively time-locked until 5:00 PM. You cannot progress or close out the day until the sun physically begins to set. You must carry the weight of the ticking hourglass throughout the day until it is time to face the ledger.

## The Pillars
1. **Tempus (Time):** A brutally precise algorithm calculating your statistical remaining days on Earth based on your physical life factors (smoking, drinking, exercise, sleep, and diet).
2. **Sapientia (Wisdom):** A built-in repository of 100 classical stoic quotes from Marcus Aurelius, Seneca, Epictetus, Musonius Rufus, Montaigne, and Viktor Frankl. Save your favorites to your localized, dark-mode Commonplace Book.
3. **Virtus (Discipline):** A strictly authenticated 30-day chronological dot-grid dashboard tracking your exact streaks of completed daily practice. A discipline dot is only organically earned if *both* the Morning and Evening sequences are fulfilled. Begin the ritual in the morning to ensure your day registers on Virtus — the evening reflection alone will not earn the mark.

## Development Setup

To test the application locally in an iOS Simulator or via Expo Go:

```bash
# 1. Install precise node modules
npm install

# 2. Start the Metro Bundler
npx expo start
```

*Note: Push notifications are wired directly into the physical `expo-notifications` matrix and will gracefully fallback if executed within a standard web browser.*

## V1 Pre-Release Notes

- [x] Replace `assets/vanitas_bg.png` with a high-res version (upgraded to 1848x1848)
- [x] Revise Sapientia tab (quote library with theme filtering, enriched empty states)
