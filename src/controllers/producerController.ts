import type { Request, Response } from "express";

import { logger } from "#utils/logger";

import type { ApplicationContext } from "../app/applicationContext";
import { createAppError } from "../errors/appError";

export function getProducerIntervals(request: Request, response: Response): void {
  const context = request.app.locals.context as ApplicationContext | undefined;

  if (!context?.database) {
    logger.error("[producers] database not initialized");

    throw createAppError("Database not initialized", "DATABASE_NOT_READY", 503);
  }

  logger.info(context.producerIntervals, "[producers] returning cached intervals");

  response.status(200).json(context.producerIntervals);
}
