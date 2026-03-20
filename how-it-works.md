# Memento — How It Works

A simple, non-technical overview of the app.

---

## What Is Memento?

Memento is a daily wellness app built around Stoic philosophy. The name comes from "memento mori" — a Latin phrase meaning "remember that you will die." That sounds heavy, but the idea is simple: knowing your time is limited helps you use it better.

The app gives you a short morning and evening ritual, a library of ancient wisdom, a journal, and a visual countdown of your remaining life. It looks and feels like something carved in stone — dark backgrounds, gold accents, classical Roman typography. No bright colors, no confetti, no streak badges.

---

## The Five Tabs

### 1. AWAKEN (Home)

This is the first thing you see when you open the app. It shows:

- **A live clock** — the current time, updating every second
- **Days remaining** — an estimate of how many days you have left to live, based on your age and lifestyle factors
- **An hourglass** — a visual reminder that time is passing

Depending on the time of day, it gives you a button to start your **morning ritual** or your **evening reflection**.

### 2. SAPIENTIA (Wisdom)

A library of 50 hand-picked quotes from Stoic philosophers — Marcus Aurelius, Seneca, and Epictetus. Each day, one quote is highlighted as the "quote of the day."

You can:
- Browse all quotes
- Filter by theme (mortality, duty, endurance, grief, etc.)
- Tap any quote to read historical context about when and why it was written
- Save quotes to your personal **Commonplace Book** and add your own notes

### 3. TEMPUS (Time)

A life calculator. It shows how much of your life has passed and how much remains, broken down into:

- Days remaining
- Weeks remaining
- Birthdays remaining

You can adjust lifestyle factors (exercise, sleep, diet, etc.) and watch the numbers change in real time. The hourglass fills based on how far along you are.

### 4. SCRIPTUM (Writing)

A private journal. Two ways to write:

- **Freeform** — a blank page, write whatever you want
- **Stoic Prompt** — the app gives you a philosophical question to reflect on (e.g., "What would Marcus Aurelius do in your situation today?")

Your entries are saved locally on your device. Nothing leaves your phone.

### 5. VIRTUS (Virtue)

Your practice tracker and settings. (This section is still being built.)

---

## The Morning Ritual

1. Open the app in the morning
2. Read the daily Stoic quote with its historical context
3. Set an **intention** for the day — one sentence about what matters most today
4. Go live your day

## The Evening Reflection

1. Open the app in the evening
2. Answer four short prompts:
   - What went well today?
   - Where did you fall short?
   - What didn't actually matter as much as you thought?
   - A gratitude question (changes daily)
3. Your answers are saved as a journal entry

---

## How Your Data Works

- **Everything stays on your phone.** There is no account, no login, no cloud sync, no server.
- Your journal entries, saved quotes, and preferences are stored in a small local database on the device.
- The 50 quotes and daily prompts are bundled inside the app — they don't need an internet connection.
- Deleting the app deletes all your data. There is no backup (for now).

---

## The Design

The look and feel is intentional:

- **Dark backgrounds** — like aged parchment in shadow
- **Gold accents** — like inscriptions on Roman monuments
- **Two fonts only** — Cinzel (a classical display font for titles) and Cormorant Garamond (an elegant serif for body text)
- **No emoji, no exclamation marks** — the app speaks calmly and directly
- **Subtle animations** — things breathe and pulse slowly, like a heartbeat. Nothing bounces or slides.

The tone is that of a wise, well-read friend. Not a coach, not a guru, not a gamified habit tracker.

---

## Tech Stack (One Paragraph)

Memento is built with React Native and Expo, which means it runs on both iPhone and Android from one codebase. Data is stored locally using SQLite. There is no backend server. All content (quotes, prompts) is embedded in the app. The app is written in TypeScript.
