import { create } from 'zustand';

export interface SavedQuoteRecord {
  id: string;
  quote_id: string;
  personal_note: string | null;
  saved_at: string;
}

interface QuotesState {
  savedQuotes: SavedQuoteRecord[];
  setSavedQuotes: (quotes: SavedQuoteRecord[]) => void;
  addOrUpdateSavedQuote: (quote: SavedQuoteRecord) => void;
  removeSavedQuote: (id: string) => void;
}

export const useQuotesStore = create<QuotesState>((set) => ({
  savedQuotes: [],
  setSavedQuotes: (quotes) => set({ savedQuotes: quotes }),
  addOrUpdateSavedQuote: (newQuote) => set((state) => {
    const exists = state.savedQuotes.some(q => q.id === newQuote.id);
    if (exists) {
      return { savedQuotes: state.savedQuotes.map(q => q.id === newQuote.id ? newQuote : q) };
    }
    return { savedQuotes: [...state.savedQuotes, newQuote] };
  }),
  removeSavedQuote: (id) => set((state) => ({ 
    savedQuotes: state.savedQuotes.filter((q) => q.id !== id) 
  })),
}));
