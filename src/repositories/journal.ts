import { getDb } from './db';
import { useJournalStore, JournalEntry } from '../stores/journal';

function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const JournalRepository = {
  async createEntry(mode: JournalEntry['mode'], content: string, promptKey: string | null = null): Promise<void> {
    const db = await getDb();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const date = todayString();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO journal_entries (id, date, mode, content, prompt_key, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, date, mode, content, promptKey, now, now]
    );

    useJournalStore.getState().addOrUpdateEntry({
      id, date, mode, content, prompt_key: promptKey, created_at: now, updated_at: now
    });
  },

  async updateEntry(id: string, content: string): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();

    await db.runAsync(
      `UPDATE journal_entries SET content = ?, updated_at = ? WHERE id = ?`,
      [content, now, id]
    );

    const store = useJournalStore.getState();
    const existing = store.entries.find(e => e.id === id);
    if (existing) {
      store.addOrUpdateEntry({ ...existing, content, updated_at: now });
    }
  },

  async deleteEntry(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(`DELETE FROM journal_entries WHERE id = ?`, [id]);
    useJournalStore.getState().removeEntry(id);
  },

  async loadEntries(): Promise<void> {
    const db = await getDb();
    const rows = await db.getAllAsync<JournalEntry>(
      `SELECT * FROM journal_entries ORDER BY created_at DESC LIMIT 500`
    );
    useJournalStore.getState().setEntries(rows);
  }
};
