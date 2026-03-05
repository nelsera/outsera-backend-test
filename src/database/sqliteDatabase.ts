import Database from "better-sqlite3";

import { logger } from "#utils/logger";

export type SqliteDatabase = Database.Database;

export function createInMemoryDatabase(): SqliteDatabase {
  logger.info("[database] creating in-memory sqlite database");

  const database = new Database(":memory:");

  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");

  return database;
}

export function initializeSchema(database: SqliteDatabase): void {
  logger.info("[database] initializing schema");

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

  logger.info("[database] schema initialized");
}
