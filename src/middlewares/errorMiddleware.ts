import type { NextFunction, Request, Response } from "express";

import { logger } from "#utils/logger";

import type { AppError } from "../errors/appError";

export function errorMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  void next;

  if (isAppError(error)) {
    logger.error(
      {
        method: request.method,
        path: request.path,
        code: error.code,
        statusCode: error.statusCode,
      },
      error.message,
    );

    response.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });

    return;
  }

  logger.error(
    {
      method: request.method,
      path: request.path,
    },
    "unexpected error",
  );

  response.status(500).json({
    error: "UNEXPECTED_ERROR",
    message: "Erro inesperado",
  });
}

function isAppError(error: unknown): error is AppError {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if (!("name" in error)) {
    return false;
  }

  return (error as AppError).name === "AppError";
}
