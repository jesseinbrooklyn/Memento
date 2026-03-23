import { getDb } from './db';
import { usePreferencesStore } from '../stores/preferences';
import { LifeFactors } from '../utils/lifeCalculator';

export const PreferencesRepository = {
  async savePreference(key: string, value: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO preferences (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = ?`,
      [key, value, value]
    );
  },

  async loadPreferences(): Promise<void> {
    const db = await getDb();
    const rows = await db.getAllAsync<{ key: string; value: string }>(
      `SELECT * FROM preferences`
    );

    const prefs: Record<string, string> = {};
    for (const row of rows) {
      prefs[row.key] = row.value;
    }

    const { setPreferences, setLifeFactors } = usePreferencesStore.getState();

    if (prefs['hasSeenIntro'] === 'true') {
      usePreferencesStore.getState().setHasSeenIntro(true);
    }
    if (prefs['birthDate']) setPreferences({ birthDate: prefs['birthDate'] });
    if (prefs['morningBellTime']) setPreferences({ morningBellTime: prefs['morningBellTime'] });
    if (prefs['eveningBellTime']) setPreferences({ eveningBellTime: prefs['eveningBellTime'] });
    if (prefs['use24HourTime'] !== undefined) setPreferences({ use24HourTime: prefs['use24HourTime'] === 'true' });

    const factors: Partial<LifeFactors> = {};
    if (prefs['lifestyle_smoking']) factors.smoking = prefs['lifestyle_smoking'] as LifeFactors['smoking'];
    if (prefs['lifestyle_drinking']) factors.drinking = prefs['lifestyle_drinking'] as LifeFactors['drinking'];
    if (prefs['lifestyle_exercise']) factors.exercise = prefs['lifestyle_exercise'] as LifeFactors['exercise'];
    if (prefs['lifestyle_diet']) factors.diet = prefs['lifestyle_diet'] as LifeFactors['diet'];
    if (prefs['lifestyle_sleep']) factors.sleep = prefs['lifestyle_sleep'] as LifeFactors['sleep'];
    
    if (Object.keys(factors).length > 0) {
      setLifeFactors(factors);
    }
  },

  async updateLifeFactor(key: keyof LifeFactors, value: string): Promise<void> {
    const dbKey = `lifestyle_${key}`;
    await this.savePreference(dbKey, value);
    usePreferencesStore.getState().setLifeFactors({ [key]: value });
  },

  async updateBirthDate(date: string): Promise<void> {
    await this.savePreference('birthDate', date);
    usePreferencesStore.getState().setBirthDate(date);
  },

  async updateUse24HourTime(val: boolean): Promise<void> {
    await this.savePreference('use24HourTime', String(val));
    usePreferencesStore.getState().setUse24HourTime(val);
  },

  async markOnboardingComplete(): Promise<void> {
    await this.savePreference('hasSeenIntro', 'true');
    usePreferencesStore.getState().setHasSeenIntro(true);
  }
};
