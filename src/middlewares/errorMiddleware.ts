import type { Request, Response, NextFunction } from "express";

import type { AppError } from "../errors/appError";

export function errorMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  void next;

  if (isAppError(error)) {
    console.error("[http] request failed", {
      method: request.method,
      path: request.path,
      code: error.code,
      message: error.message,
    });

    response.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });

    return;
  }

  console.error("[http] unexpected error", error);

  response.status(500).json({
    error: "UNEXPECTED_ERROR",
    message: "Erro inesperado",
  });
}

function isAppError(error: unknown): error is AppError {
  if (typeof error !== "object") {
    return false;
  }

  if (error === null) {
    return false;
  }

  if (!("name" in error)) {
    return false;
  }

  return (error as AppError).name === "AppError";
}
