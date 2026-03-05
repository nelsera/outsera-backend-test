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
  const movies = await loadMoviesFromCsv("data/Movielist.csv");

  movieRepository.saveMany(movies);
  logger.info(`[bootstrap] movies loaded: ${movieRepository.countAll()}`);

  logger.info("[bootstrap] database ready");
}
