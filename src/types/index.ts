// ─── Quote ─────────────────────────────────────────────────────────────────────

/** The ten thematic categories a quote can belong to. */
export type Theme =
  | 'mortality'
  | 'anger'
  | 'duty'
  | 'fatherhood'
  | 'endurance'
  | 'work'
  | 'grief'
  | 'wealth'
  | 'solitude'
  | 'legacy';

export interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;        // e.g. "Meditations 2.11"
  authorDates: string;   // e.g. "121–180 AD"
  context: string;       // 2–3 sentences of historical context
  themes: Theme[];
  discipline: 'desire' | 'action' | 'assent';
}

// ─── Journal ────────────────────────────────────────────────────────────────────

/**
 * Journal entry modes:
 * - freeform            — open-ended writing from Scriptum
 * - morning             — morning intention (stored in practice_log.intention;
 *                         not currently written as a standalone journal entry)
 * - evening_reflection  — structured evening review written by PracticeRepository.markEveningComplete
 * - prompt              — prompted journaling from a Stoic or gratitude prompt
 */
export interface JournalEntry {
  id: string;
  date: string;
  mode: 'freeform' | 'morning' | 'evening_reflection' | 'prompt';
  content: string;
  prompt_key: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Saved quotes ───────────────────────────────────────────────────────────────

export interface SavedQuoteRecord {
  id: string;
  quote_id: string;
  personal_note: string | null;
  saved_at: string;
}

// ─── Lifestyle ──────────────────────────────────────────────────────────────────

export interface LifeFactors {
  smoking: 'none' | 'former' | 'light' | 'heavy';
  drinking: 'none' | 'moderate' | 'heavy' | 'very_heavy';
  exercise: 'daily' | 'regular' | 'occasional' | 'none';
  diet: 'excellent' | 'good' | 'average' | 'poor';
  sleep: 'optimal' | 'good' | 'fair' | 'poor';
}
