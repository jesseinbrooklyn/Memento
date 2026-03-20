import { getDb } from './db';
import { useQuotesStore, SavedQuoteRecord } from '../stores/quotes';

export const QuoteRepository = {
  async saveQuote(quoteId: string, personalNote: string | null = null): Promise<void> {
    const db = await getDb();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO saved_quotes (id, quote_id, personal_note, saved_at)
       VALUES (?, ?, ?, ?)`,
      [id, quoteId, personalNote, now]
    );

    useQuotesStore.getState().addOrUpdateSavedQuote({
      id,
      quote_id: quoteId,
      personal_note: personalNote,
      saved_at: now
    });
  },

  async updateNote(id: string, personalNote: string): Promise<void> {
    const db = await getDb();
    
    await db.runAsync(
      `UPDATE saved_quotes SET personal_note = ? WHERE id = ?`,
      [personalNote, id]
    );

    const quotes = useQuotesStore.getState().savedQuotes;
    const existing = quotes.find(q => q.id === id);
    if (existing) {
       useQuotesStore.getState().addOrUpdateSavedQuote({ ...existing, personal_note: personalNote });
    }
  },

  async removeQuote(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(`DELETE FROM saved_quotes WHERE id = ?`, [id]);
    useQuotesStore.getState().removeSavedQuote(id);
  },

  async loadSavedQuotes(): Promise<void> {
    const db = await getDb();
    const rows = await db.getAllAsync<SavedQuoteRecord>(
      `SELECT * FROM saved_quotes ORDER BY saved_at DESC`
    );
    useQuotesStore.getState().setSavedQuotes(rows);
  }
};
