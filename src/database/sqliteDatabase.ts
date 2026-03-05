import Database from "better-sqlite3";

export type SqliteDatabase = Database.Database;

export function createInMemoryDatabase(): SqliteDatabase {
  const database = new Database(":memory:");

  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");

  return database;
}

export function initializeSchema(database: SqliteDatabase): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      studios TEXT NOT NULL,
      producers TEXT NOT NULL,
      winner TEXT
    );
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_movies_winner ON movies(winner);
  `);
}
