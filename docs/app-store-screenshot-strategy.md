# Memento — App Store Screenshot Strategy

*Research compiled April 2026*

---

## The Problem

The current listing uses a dated iPhone frame (likely iPhone X or 12-era with the thick notch). In the App Store grid, your screenshots compete in a very small thumbnail — the old frame signals "unmaintained" before a user even reads a word. Combined with small-feeling composition, you're losing conversions on first impression.

---

## Step 1: Replace the Device Frame

### Use the iPhone 16 Pro

The iPhone 16 Pro is the current flagship and what most of your target audience is holding. Key visual differences that matter for your screenshots:

- **Dynamic Island** (pill-shaped cutout at top center) instead of a notch — looks modern and intentional
- **Titanium Black** colorway — premium, dark, matches Memento's aesthetic perfectly
- Slightly squarer corners than older models

### Where to get free iPhone 16 Pro mockup templates

| Tool | What it is | Link |
|------|-----------|------|
| **BrandBird** | Free online generator, no watermark, no signup. Upload screenshot, choose model, export. | brandbird.app/tools/iphone-16-mockup-generator |
| **Screenhance** | Add realistic iPhone 16 frames instantly, no Photoshop | screenhance.com/iphone-mockup-generator |
| **Screenshots.pro** | Full App Store screenshot generator with text overlays, perspective 3D frames, exports at 4K | screenshots.pro |
| **Figma community** | "FREE iPhone 16 / 16 Pro Mockups by Design Monks" — fully editable Figma file | figma.com/community/file/1415271109553553432 |
| **Mockupnest** | Free iPhone 16 Pro PSD/PNG download | mockupnest.com/free-iphone-16-pro-mockup |

**Recommended workflow:** Build your screenshots in Figma (or Photoshop/Sketch), drop into the Design Monks Figma template to frame them, export at 1290×2796px (iPhone 16 Pro Max size, which covers App Store requirements).

---

## Step 2: Screenshot Architecture

Apple shows the **first 3 screenshots** in search results before a user taps through. That's your entire pitch in most cases. Structure them as a narrative:

```
Screenshot 1 → The Hook (emotional, the "why")
Screenshot 2 → The Feature (show the most powerful screen)
Screenshot 3 → The Benefit (outcome, transformation)
Screenshots 4–10 → Supporting detail for interested users
```

### Proposed 6-Screenshot Sequence for Memento

| # | Screen shown | Headline (Cinzel, all caps) | Sub-copy (Cormorant, italic) |
|---|-------------|---------------------------|------------------------------|
| 1 | Daily mortality reminder / Awaken screen | **MEMENTO MORI** | *You will die. Act accordingly.* |
| 2 | Daily Stoic quote card | **THE ANCIENTS SPEAK** | *One curated quote. Every day.* |
| 3 | Life calculator / weeks grid (Tempus) | **SEE YOUR TIME** | *Every week of your life. In one view.* |
| 4 | Journal / Scriptum screen | **WRITE WHAT MATTERS** | *Morning intention. Evening reflection.* |
| 5 | Practice calendar / streak (Virtus) | **BUILD THE PRACTICE** | *Track your discipline. Day by day.* |
| 6 | Composite / mood shot — dark background with gold ornament | **LIVE AWAKE** | *A daily Stoic companion for men.* |

---

## Step 3: Visual Treatment — Making It Punch

### The problem with most "frame on white" screenshots

Most app screenshots plop a device frame on a white or gradient background. For a dark, premium app like Memento, this creates tonal dissonance — your deep brown-black UI inside a white box looks jarring and small.

### What the top dark/premium apps do

**Option A — Full bleed, no frame**
The app UI fills the entire canvas edge to edge. The screenshot IS the experience. Used by apps like Calm, some versions of Headspace. Looks immersive. Works best when your UI has strong visual identity on its own (Memento qualifies).

**Option B — Floating device on matched background**
iPhone 16 Pro in Titanium Black floats on a deep background that matches your app's `bgPrimary` (#14100a). The frame almost disappears into the background — the screen glows. This is the Memento-native approach. Premium, minimal, Roman.

**Option C — Partial device crop**
The phone is cropped at the sides or bottom, showing a large, legible UI. Feels cinematic. Good for detail screens.

**Recommendation for Memento: Option B with Option C on screenshots 2–4.**

### Typography for text overlays

- **Headlines:** Cinzel SemiBold, all caps, wide letter-spacing (~0.15em), `color: bone (#d4c5a0)`
- **Sub-copy:** Cormorant Garamond Italic, `color: boneDim (rgba(212,197,160,0.55))`
- **Text placement:** Top third of canvas (above the device) or bottom third — never overlapping the phone screen
- **Size check:** If you can't read the headline at 100px wide thumbnail, it's too small or too wordy

### Color discipline

Every screenshot canvas should use only:
- `bgPrimary: #14100a` as the background
- `gold: #c4a35a` for any accent lines, dividers, or icon highlights
- `bone: #d4c5a0` for headline text
- No other colors introduced in the marketing layer

This creates a gallery effect in the App Store — all 6 screenshots read as one cohesive piece.

---

## Step 4: Sizing Requirements (2026)

Apple requires screenshots for two display sizes to cover all devices:

| Required size | Covers |
|--------------|--------|
| **1320 × 2868 px** (6.9" — iPhone 16 Pro Max) | iPhone 16 Pro Max, 15 Plus, etc. |
| **1206 × 2622 px** (6.3" — iPhone 16 Pro) | iPhone 16 Pro, 15 Pro, etc. |

You can upload one set (the 6.9" size) and let Apple scale it, but providing both is better for quality.

---

## Step 5: Competitor Reference Points

These are the apps in Memento's category that have strong screenshot design:

| App | What they do well |
|----|------------------|
| **Stoa** (stoic meditation) | Dark backgrounds, serif type, minimal device frames, focus on one feature per shot |
| **Stoic. Journal & Mental Health** | Clean text overlays, consistent color across all screenshots, emotional headline first |
| **Oak — Meditation & Breathing** | Ultra-minimal, no device frame on several shots, the UI itself is the visual |
| **Calm** | Full-bleed backgrounds, large readable type, aspirational copy |

The pattern across all of them: **less is more**. Each screenshot has one idea, one headline, one CTA. Nothing competes for attention.

---

## Quick Wins (can do this week)

1. **Drop your current screenshots into BrandBird** — wrap them in iPhone 16 Pro Titanium Black frame on a #14100a background. Even this alone is a significant upgrade from an old notched frame on white.

2. **Rewrite your headlines** — make them benefit-driven, not feature-describing. "Daily mortality reminder" → "LIVE AWAKE". "Stoic quotes" → "THE ANCIENTS SPEAK".

3. **Screenshot 1 is your ad** — if it doesn't stop someone in a scroll, they won't tap. Test a full-bleed Awaken screen with "MEMENTO MORI" in large Cinzel over the top third.

4. **Consistency check** — all 6 screenshots should look like they came from the same designer in the same session. Same font size relationships, same margin/padding, same background color.

---

## Tools Summary

- **Free frames:** [BrandBird iPhone 16](https://www.brandbird.app/tools/iphone-16-mockup-generator) · [Mockupnest](https://mockupnest.com/free-iphone-16-pro-mockup) · [Design Monks Figma](https://www.figma.com/community/file/1415271109553553432)
- **Full screenshot builder:** [Screenshots.pro](https://screenshots.pro) · [BrandBird templates](https://www.brandbird.app/templates/67123211cdb296d4ab71dba2)
- **Size spec:** 1320 × 2868 px (6.9") required · 1206 × 2622 px (6.3") recommended
- **Inspiration:** Stoa, Oak, Calm, Stoic Journal — search each on App Store and screenshot their listings
