import fs from "node:fs/promises";

import { parse } from "csv-parse/sync";

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
  const fileContent = await fs.readFile(csvPath, "utf-8");

  const records = parse(fileContent, {
    columns: true,
    delimiter: ";",
    trim: true,
    skip_empty_lines: true,
  }) as RawCsvMovieRecord[];

  return records.map(normalizeCsvRecord);
}

function normalizeCsvRecord(record: RawCsvMovieRecord): CsvMovieRow {
  const year = Number(record.year);

  return {
    year: Number.isNaN(year) ? 0 : year,
    title: record.title.trim(),
    studios: record.studios.trim(),
    producers: record.producers.trim(),
    winner: isWinner(record.winner),
  };
}

function isWinner(rawValue: string | undefined): boolean {
  if (!rawValue) {
    return false;
  }

  return rawValue.trim().toLowerCase() === "yes";
}
