// ─── Colors ────────────────────────────────────────────────────────────────────
// Use these token names everywhere — never raw hex or rgba values.
export const colors = {
  // Backgrounds
  bgPrimary: '#14100a',       // App background
  bgSecondary: '#1c1710',     // Cards, elevated surfaces
  bgTertiary: '#0e0b07',      // Deepest surfaces, overlays
  bgDeep: '#0a0805',          // VanitasBackground gradient stop (intentionally deeper)

  // Gold family
  gold: '#c4a35a',                     // Primary accent
  goldDim: 'rgba(196,163,90,0.25)',    // Borders, dividers
  goldGlow: 'rgba(196,163,90,0.06)',   // Card backgrounds
  goldMuted: 'rgba(196,163,90,0.35)',  // Inactive tab tint, soft borders
  goldStrong: 'rgba(196,163,90,0.9)', // Button fill on press
  goldDeep: '#b8973e',                 // Sand particles, darker-gold mid-tone

  // Text
  bone: '#d4c5a0',                     // Primary text
  boneDim: 'rgba(212,197,160,0.55)',   // Secondary text
  boneGhost: 'rgba(212,197,160,0.25)', // Tertiary text / placeholders

  // Semantic
  ember: '#8b4513',                    // Warning
  danger: 'rgba(255,0,0,0.2)',         // Error background (e.g. character-limit indicator)
  dangerText: '#ff4444',               // Error text
  ash: '#3a3630',                      // Disabled
  ink: 'rgba(0,0,0,0.85)',             // Text on gold backgrounds

  // Utility
  shadow: 'rgba(0,0,0,0.9)',               // Text shadow color on hero elements
  surfaceMuted: 'rgba(255,255,255,0.05)',   // Subtle surface tint (e.g. missed-day dot)
  dividerSubtle: 'rgba(255,255,255,0.1)',   // Very faint dividers
} as const;

// ─── Spacing (8px grid) ────────────────────────────────────────────────────────
// All spacing values are multiples of 4 (xs) or 8. Never use raw pixel values.
export const spacing = {
  xs: 4,    // Icon gaps, tight nudges
  sm: 8,    // Between related elements
  md: 16,   // Standard padding
  lg: 24,   // Section gaps
  xl: 32,   // Between major sections
  xxl: 48,  // Screen top/bottom padding
  xxxl: 64, // Hero breathing room
} as const;

// ─── Border radius ─────────────────────────────────────────────────────────────
// Never fully rounded — always classical and contained.
export const borderRadius = {
  sm: 2,   // Inputs
  md: 4,   // Cards, buttons
  lg: 8,   // Modals
} as const;

// ─── Letter spacing ────────────────────────────────────────────────────────────
export const letterSpacing = {
  tight: 1,   // Subtle tracking on body display
  snug: 2,    // Secondary labels, clock
  medium: 4,  // Metric labels, section headers
  wide: 5,    // Title inscriptions (MEMENTO MORI)
  ultra: 8,   // Sparse Latin headers
} as const;

// ─── Font sizes ────────────────────────────────────────────────────────────────
// Use these instead of magic pixel values.
export const fontSize = {
  xs: 10,      // Tiny labels (e.g. WEEKS sub-metric unit)
  sm: 12,      // Small captions, progress text
  md: 14,      // Body labels, control text
  body: 16,    // Standard body
  lg: 18,      // Input values
  xl: 20,      // Section headers, screen titles
  xxl: 24,     // Sub-metric values, quote preview
  hero: 28,    // MEMENTO MORI title
  display: 56, // Clock (compact after morning complete)
  massive: 64, // Clock (expanded), Awaken main metric
  titan: 72,   // Tempus main day count
} as const;
