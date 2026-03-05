import type { Express } from "express";

import { createInMemoryDatabase, initializeSchema } from "#database/sqliteDatabase";
import { MovieRepository } from "#repositories/movieRepository";
import { logger } from "#utils/logger";

import { loadMoviesFromCsv } from "../loaders/moviesCsvLoader";
import type { ApplicationContext } from "./applicationContext";

declare module "express-serve-static-core" {
  interface Locals {
    context: ApplicationContext;
  }
}

export async function bootstrapApplication(app: Express): Promise<void> {
  logger.info("[bootstrap] creating in-memory database");

  const database = createInMemoryDatabase();
  initializeSchema(database);

  app.locals.context = { database };

  const movieRepository = new MovieRepository(database);

  logger.info("[bootstrap] loading movies from CSV");

  let movies;

  try {
    movies = await loadMoviesFromCsv("data/Movielist.csv");
  } catch (error) {
    logger.error({ error }, "[bootstrap] failed to load movies CSV");

    throw error;
  }

  if (!movies || movies.length === 0) {
    logger.error("[bootstrap] movies CSV loaded but returned 0 rows");

    throw new Error("Movies CSV is empty or could not be parsed");
  }

  movieRepository.saveMany(movies);

  const totalMovies = movieRepository.countAll();

  logger.info({ totalMovies }, "[bootstrap] movies loaded successfully");

  logger.info("[bootstrap] database ready");
}
