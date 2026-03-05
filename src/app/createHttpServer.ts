import cors from "cors";
import express from "express";

import { logger } from "#utils/logger";

import { errorMiddleware } from "../middlewares/errorMiddleware";
import { requestLogger } from "../middlewares/requestLogger";
import { registerRoutes } from "../routes/registerRoutes";

export function createHttpServer() {
  const app = express();

  app.use(requestLogger);

  app.use(cors());

  app.use(express.json());

  registerRoutes(app);
  logger.info("[http] routes registered");

  app.use(errorMiddleware);

  return app;
}
