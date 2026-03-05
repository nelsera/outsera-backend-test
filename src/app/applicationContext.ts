import type { SqliteDatabase } from "../database/sqliteDatabase";

export type ApplicationContext = {
  database: SqliteDatabase;
};
