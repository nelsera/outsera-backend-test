import type { Request, Response } from "express";

import { MovieRepository } from "#repositories/movieRepository";
import { calculateProducerIntervals } from "#services/producerIntervalService";
import type { AppContext } from "#types/appContext";
import { logger } from "#utils/logger";

import { createAppError } from "../errors/appError";

export function getProducerIntervals(request: Request, response: Response): void {
  const context = request.app.locals.context as AppContext | undefined;

  if (!context?.database) {
    logger.error("[producers] database not initialized");

    throw createAppError("Database not initialized", "DATABASE_NOT_READY", 503);
  }

  const movieRepository = new MovieRepository(context.database);

  const result = calculateProducerIntervals(movieRepository);

  logger.info(result, "[producers] intervals calculated");

  response.status(200).json(result);
}
