import type { SqliteDatabase } from "#database/sqliteDatabase";
import type { ProducerIntervalsResponse } from "#types/producerIntervalTypes";

export type ApplicationContext = {
  database: SqliteDatabase;
  producerIntervals: ProducerIntervalsResponse;
};
