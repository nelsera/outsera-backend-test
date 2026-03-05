import type { Request, Response } from "express";

import { MovieRepository } from "../repositories/movieRepository";
import { calculateProducerIntervals } from "../services/producerIntervalService";

export function getProducerIntervals(request: Request, response: Response): void {
  const database = request.app.locals.context.database;

  const movieRepository = new MovieRepository(database);

  const result = calculateProducerIntervals(movieRepository);

  response.status(200).json(result);
}
