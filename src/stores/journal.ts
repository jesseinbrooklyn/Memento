import { create } from 'zustand';
import { JournalEntry } from '../types';

export type { JournalEntry };

interface JournalState {
  entries: JournalEntry[];
  setEntries: (entries: JournalEntry[]) => void;
  addOrUpdateEntry: (entry: JournalEntry) => void;
  removeEntry: (id: string) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  addOrUpdateEntry: (newEntry) => set((state) => {
    const exists = state.entries.some(e => e.id === newEntry.id);
    if (exists) {
      return { entries: state.entries.map(e => e.id === newEntry.id ? newEntry : e) };
    }
    const newArr = [newEntry, ...state.entries];
    newArr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { entries: newArr };
  }),
  removeEntry: (id) => set((state) => ({ 
    entries: state.entries.filter((e) => e.id !== id) 
  })),
}));
