import type { Request, Response } from "express";

import { MovieRepository } from "../repositories/movieRepository";
import { calculateProducerIntervals } from "../services/producerIntervalService";
import { createAppError } from "../errors/appError";
import type { AppContext } from "../types/appContext";

export function getProducerIntervals(request: Request, response: Response): void {
  const context = request.app.locals.context as AppContext | undefined;

  if (!context || !context.database) {
    throw createAppError("Banco de dados não inicializado", "DATABASE_NOT_READY", 503);
  }

  const movieRepository = new MovieRepository(context.database);

  const result = calculateProducerIntervals(movieRepository);

  response.status(200).json(result);
}
