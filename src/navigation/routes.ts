/**
 * Single source of truth for all route names.
 * Import ROUTES wherever you navigate — never use raw string literals.
 *
 * Usage:
 *   navigation.navigate(ROUTES.MorningQuote)
 *   navigation.navigate(ROUTES.QuoteDetail, { quote })
 */

// ─── Root stack ────────────────────────────────────────────────────────────────
export const ROUTES = {
  // Root-level screens
  Onboarding: 'Onboarding',
  Tabs: 'Tabs',
  MorningQuote: 'MorningQuote',
  MorningIntention: 'MorningIntention',
  EveningReflection: 'EveningReflection',

  // Bottom tabs
  TabAwaken: 'AWAKEN',
  TabSapientia: 'SAPIENTIA',
  TabTempus: 'TEMPUS',
  TabScriptum: 'SCRIPTUM',
  TabVirtus: 'VIRTUS',

  // Sapientia stack
  SapientiaHome: 'SapientiaHome',
  QuoteLibrary: 'QuoteLibrary',
  QuoteDetail: 'QuoteDetail',
  CommonplaceBook: 'CommonplaceBook',

  // Scriptum stack
  ScriptumHome: 'ScriptumHome',
  JournalEditor: 'JournalEditor',

  // Virtus stack (v2)
  StreakHistory: 'StreakHistory',
  Settings: 'Settings',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];

