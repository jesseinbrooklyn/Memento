import { create } from 'zustand';

interface PracticeState {
  totalDays: number;
  lastPracticeDate: string | null;
  morningComplete: boolean;
  eveningComplete: boolean;
  intention: string | null;
  completedDates: string[];
  setTodaysProgress: (morning: boolean, evening: boolean, intention: string | null) => void;
  setHistoricalData: (total: number, dates: string[]) => void;
}

export const usePracticeStore = create<PracticeState>((set) => ({
  totalDays: 0,
  lastPracticeDate: null,
  morningComplete: false,
  eveningComplete: false,
  intention: null,
  completedDates: [],
  setTodaysProgress: (morning, evening, intention) => set({ morningComplete: morning, eveningComplete: evening, intention }),
  setHistoricalData: (total, dates) => set({ totalDays: total, completedDates: dates }),
}));
