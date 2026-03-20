import { create } from 'zustand';
import { LifeFactors } from '../utils/lifeCalculator';

export interface PreferencesState {
  hasSeenIntro: boolean;
  birthDate: string | null;
  morningBellTime: string | null;
  eveningBellTime: string | null;
  lifeFactors: LifeFactors;
  setHasSeenIntro: (val: boolean) => void;
  setBirthDate: (date: string) => void;
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
  lifeFactors: defaultLifeFactors,
  setHasSeenIntro: (hasSeenIntro) => set({ hasSeenIntro }),
  setBirthDate: (birthDate) => set({ birthDate }),
  setPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
  setLifeFactors: (factors) => set((state) => ({ 
    lifeFactors: { ...state.lifeFactors, ...factors } 
  })),
}));
