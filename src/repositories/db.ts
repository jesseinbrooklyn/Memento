import * as SQLite from 'expo-sqlite';

import { Platform } from 'react-native';

export const getDb = async () => {
  if (Platform.OS === 'web') {
    return {
      runAsync: async () => {},
      getFirstAsync: async () => null,
      getAllAsync: async () => [],
      execAsync: async () => {}
    } as unknown as SQLite.SQLiteDatabase;
  }
  return await SQLite.openDatabaseAsync('memento.db');
};

export const initDb = async () => {
  const db = await getDb();
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS practice_log (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      morning_complete INTEGER DEFAULT 0,
      evening_complete INTEGER DEFAULT 0,
      intention TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      mode TEXT NOT NULL,
      content TEXT NOT NULL,
      prompt_key TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_quotes (
      id TEXT PRIMARY KEY,
      quote_id TEXT NOT NULL,
      personal_note TEXT,
      saved_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
};
