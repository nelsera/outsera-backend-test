import type { Express } from "express";

import { createInMemoryDatabase, initializeSchema } from "#database/sqliteDatabase";
import { MovieRepository } from "#repositories/movieRepository";

import { loadMoviesFromCsv } from "../loaders/moviesCsvLoader";
import type { ApplicationContext } from "./applicationContext";

declare module "express-serve-static-core" {
  interface Locals {
    context: ApplicationContext;
  }
}

export async function bootstrapApplication(app: Express): Promise<void> {
  console.log("[bootstrap] creating in-memory database");

  const database = createInMemoryDatabase();
  initializeSchema(database);

  app.locals.context = { database };

  const movieRepository = new MovieRepository(database);

  console.log("[bootstrap] loading movies from CSV");
  const movies = await loadMoviesFromCsv("data/Movielist.csv");

  movieRepository.saveMany(movies);
  console.log(`[bootstrap] movies loaded: ${movieRepository.countAll()}`);

  console.log("[bootstrap] database ready");
}
