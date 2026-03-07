import type { Express } from "express";

import { createInMemoryDatabase, initializeSchema } from "#database/sqliteDatabase";
import { MovieRepository } from "#repositories/movieRepository";
import { calculateProducerIntervals } from "#services/producerIntervalService";
import type { ProducerIntervalsResponse } from "#types/producerIntervalTypes";
import { logger } from "#utils/logger";

import { type CsvMovieRow, loadMoviesFromCsv } from "../loaders/moviesCsvLoader";
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

  const movieRepository = new MovieRepository(database);

  const movies = await loadBootstrapMovies();
  persistMovies(movieRepository, movies);

  const producerIntervals = calculateBootstrapProducerIntervals(movieRepository);

  app.locals.context = {
    database,
    producerIntervals,
  };

  logger.info("[bootstrap] application context initialized");
}

async function loadBootstrapMovies(): Promise<CsvMovieRow[]> {
  logger.info("[bootstrap] loading movies from CSV");

  try {
    const movies = await loadMoviesFromCsv("data/Movielist.csv");

    if (!movies || movies.length === 0) {
      logger.error("[bootstrap] movies CSV loaded but returned 0 rows");

      throw new Error("Movies CSV is empty or could not be parsed");
    }

    return movies;
  } catch (error) {
    logger.error({ error }, "[bootstrap] failed to load movies CSV");

    throw error;
  }
}

function persistMovies(movieRepository: MovieRepository, movies: CsvMovieRow[]): void {
  try {
    movieRepository.saveMany(movies);

    const totalMovies = movieRepository.countAll();

    logger.info({ totalMovies }, "[bootstrap] movies loaded successfully");
  } catch (error) {
    logger.error({ error }, "[bootstrap] failed to persist movies in database");

    throw error;
  }
}

function calculateBootstrapProducerIntervals(
  movieRepository: MovieRepository,
): ProducerIntervalsResponse {
  logger.info("[bootstrap] calculating producer intervals");

  try {
    const producerIntervals = calculateProducerIntervals(movieRepository);

    logger.info(
      {
        minCount: producerIntervals.min.length,
        maxCount: producerIntervals.max.length,
      },
      "[bootstrap] producer intervals calculated",
    );

    return producerIntervals;
  } catch (error) {
    logger.error({ error }, "[bootstrap] failed to calculate producer intervals");

    throw error;
  }
}
