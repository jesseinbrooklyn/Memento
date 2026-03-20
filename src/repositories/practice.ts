import { getDb } from './db';
import { usePracticeStore } from '../stores/practice';
import { useJournalStore } from '../stores/journal';

function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const PracticeRepository = {
  async markMorningComplete(intention: string): Promise<void> {
    const db = await getDb();
    const today = todayString();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO practice_log (id, date, morning_complete, intention, created_at)
       VALUES (?, ?, 1, ?, ?)
       ON CONFLICT(date) DO UPDATE SET morning_complete = 1, intention = ?`,
      [id, today, intention, now, intention]
    );

    usePracticeStore.getState().setTodaysProgress(true, usePracticeStore.getState().eveningComplete, intention);
    await PracticeRepository.loadHistoricalData();
  },

  async markEveningComplete(responses: { well: string; short: string; trivial: string; gratitude: string; }): Promise<void> {
    const db = await getDb();
    const today = todayString();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const journalId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO practice_log (id, date, evening_complete, created_at)
       VALUES (?, ?, 1, ?)
       ON CONFLICT(date) DO UPDATE SET evening_complete = 1`,
      [id, today, now]
    );

    const content = `What went well:\n${responses.well}\n\nFell short:\n${responses.short}\n\nDidn't matter:\n${responses.trivial}\n\nGratitude:\n${responses.gratitude}`;
    await db.runAsync(
      `INSERT INTO journal_entries (id, date, mode, content, created_at, updated_at)
       VALUES (?, ?, 'evening_reflection', ?, ?, ?)`,
      [journalId, today, content, now, now]
    );

    useJournalStore.getState().addOrUpdateEntry({
      id: journalId,
      date: today,
      mode: 'evening_reflection',
      content,
      prompt_key: null,
      created_at: now,
      updated_at: now
    });

    usePracticeStore.getState().setTodaysProgress(usePracticeStore.getState().morningComplete, true, usePracticeStore.getState().intention);
    await PracticeRepository.loadHistoricalData();
  },

  async loadTodaysProgress(): Promise<void> {
    const db = await getDb();
    const today = todayString();
    const row = await db.getFirstAsync<{ morning_complete: number; evening_complete: number; intention: string | null }>(
      `SELECT morning_complete, evening_complete, intention FROM practice_log WHERE date = ?`,
      [today]
    );
    
    if (row) {
      usePracticeStore.getState().setTodaysProgress(!!row.morning_complete, !!row.evening_complete, row.intention);
    }
  },

  async loadHistoricalData(): Promise<void> {
    const db = await getDb();
    const totalResult = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM practice_log WHERE morning_complete = 1 AND evening_complete = 1`
    );
    const total = totalResult?.count || 0;

    const logs = await db.getAllAsync<{ date: string }>(
      `SELECT date FROM practice_log WHERE morning_complete = 1 AND evening_complete = 1 ORDER BY date DESC LIMIT 30`
    );
    const dates = logs.map(r => r.date);

    usePracticeStore.getState().setHistoricalData(total, dates);
  }
};
