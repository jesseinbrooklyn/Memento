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

export const spacing = {
  xs: 4,    // Icon gaps
  sm: 8,    // Between related elements
  md: 16,   // Standard padding
  lg: 24,   // Section gaps
  xl: 32,   // Between major sections
  xxl: 48,  // Screen top/bottom padding
  xxxl: 64, // Hero breathing room
} as const;

export const borderRadius = {
  sm: 2,   // inputs
  md: 4,   // cards, buttons
  lg: 8,   // modals
} as const;

export const letterSpacing = {
  wide: 5,
  ultra: 8,
} as const;

