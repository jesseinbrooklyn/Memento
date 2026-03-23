import { create } from 'zustand';
import { LifeFactors } from '../utils/lifeCalculator';

export interface PreferencesState {
  hasSeenIntro: boolean;
  birthDate: string | null;
  morningBellTime: string | null;
  eveningBellTime: string | null;
  use24HourTime: boolean;
  lifeFactors: LifeFactors;
  setHasSeenIntro: (val: boolean) => void;
  setBirthDate: (date: string) => void;
  setUse24HourTime: (val: boolean) => void;
  setPreferences: (prefs: Partial<PreferencesState>) => void;
  setLifeFactors: (factors: Partial<LifeFactors>) => void;
}

const defaultLifeFactors: LifeFactors = {
  smoking: 'none',
  drinking: 'moderate',
  exercise: 'occasional',
  diet: 'average',
  sleep: 'fair',
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  hasSeenIntro: false,
  birthDate: null,
  morningBellTime: '06:30',
  eveningBellTime: '20:00',
  use24HourTime: false,
  lifeFactors: defaultLifeFactors,
  setHasSeenIntro: (hasSeenIntro) => set({ hasSeenIntro }),
  setBirthDate: (birthDate) => set({ birthDate }),
  setUse24HourTime: (use24HourTime) => set({ use24HourTime }),
  setPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
  setLifeFactors: (factors) => set((state) => ({ 
    lifeFactors: { ...state.lifeFactors, ...factors } 
  })),
}));
