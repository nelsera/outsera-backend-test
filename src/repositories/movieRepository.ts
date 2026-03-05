import type { SqliteDatabase } from "../database/sqliteDatabase";
import type { CsvMovieRow } from "../loaders/moviesCsvLoader";

export type WinnerMovieRow = {
  year: number;
  producers: string;
};

export class MovieRepository {
  constructor(private readonly database: SqliteDatabase) {}

  saveMany(movies: CsvMovieRow[]): void {
    const insert = this.database.prepare(`
      INSERT INTO movies (year, title, studios, producers, winner)
      VALUES (@year, @title, @studios, @producers, @winner)
    `);

    const insertInTransaction = this.database.transaction((rows: CsvMovieRow[]) => {
      for (const row of rows) {
        insert.run({
          ...row,
          winner: row.winner ? "yes" : null,
        });
      }
    });

    insertInTransaction(movies);
  }

  countAll(): number {
    const result = this.database.prepare(`SELECT COUNT(*) AS total FROM movies`).get() as {
      total: number;
    };

    return result.total;
  }

  /**
   * Retornar somente filmes vencedores, que são o insumo do cálculo de intervalos.
   */
  findWinnerMovies(): WinnerMovieRow[] {
    return this.database
      .prepare(
        `
        SELECT year, producers
        FROM movies
        WHERE winner = 'yes'
        ORDER BY year ASC
      `,
      )
      .all() as WinnerMovieRow[];
  }
}
