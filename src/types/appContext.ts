import type { Database } from "better-sqlite3";

export type AppContext = {
  database: Database;
};
