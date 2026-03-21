export interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;
  authorDates: string;
  context: string;
  themes: string[];
  discipline: 'desire' | 'action' | 'assent';
}

export interface JournalEntry {
  id: string;
  date: string;
  mode: 'freeform' | 'morning' | 'evening_reflection' | 'prompt';
  content: string;
  prompt_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedQuoteRecord {
  id: string;
  quote_id: string;
  personal_note: string | null;
  saved_at: string;
}

export interface LifeFactors {
  smoking: 'none' | 'former' | 'light' | 'heavy';
  drinking: 'none' | 'moderate' | 'heavy' | 'very_heavy';
  exercise: 'daily' | 'regular' | 'occasional' | 'none';
  diet: 'excellent' | 'good' | 'average' | 'poor';
  sleep: 'optimal' | 'good' | 'fair' | 'poor';
}
