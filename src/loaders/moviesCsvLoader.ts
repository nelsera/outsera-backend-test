import fs from "node:fs/promises";

import { parse } from "csv-parse/sync";

import { logger } from "#utils/logger";

type RawCsvMovieRecord = {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner?: string;
};

export type CsvMovieRow = {
  year: number;
  title: string;
  studios: string;
  producers: string;
  winner: boolean;
};

export async function loadMoviesFromCsv(csvPath: string): Promise<CsvMovieRow[]> {
  let fileContent: string;

  try {
    fileContent = await fs.readFile(csvPath, "utf-8");
  } catch (error) {
    logger.error({ error, csvPath }, "[csv-loader] failed to read CSV file");

    throw new Error(`Failed to read CSV file at path: ${csvPath}`, {
      cause: error,
    });
  }

  let records: RawCsvMovieRecord[];

  try {
    records = parse(fileContent, {
      columns: true,
      delimiter: ";",
      trim: true,
      skip_empty_lines: true,
    }) as RawCsvMovieRecord[];
  } catch (error) {
    logger.error({ error }, "[csv-loader] failed to parse CSV content");

    throw new Error("Failed to parse CSV content", {
      cause: error,
    });
  }

  if (!records || records.length === 0) {
    logger.warn("[csv-loader] CSV file parsed but no records were found");

    return [];
  }

  return records.map(normalizeCsvRecord);
}

function normalizeCsvRecord(record: RawCsvMovieRecord): CsvMovieRow {
  const year = Number(record.year);

  if (!record.title || !record.studios || !record.producers) {
    logger.warn(
      { record },
      "[csv-loader] record missing required fields, data will still be processed",
    );
  }

  return {
    year: Number.isNaN(year) ? 0 : year,
    title: record.title?.trim() ?? "",
    studios: record.studios?.trim() ?? "",
    producers: record.producers?.trim() ?? "",
    winner: isWinner(record.winner),
  };
}

function isWinner(rawValue: string | undefined): boolean {
  if (!rawValue) {
    return false;
  }

  return rawValue.trim().toLowerCase() === "yes";
}
