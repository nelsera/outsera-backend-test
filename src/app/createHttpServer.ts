import cors from "cors";
import express from "express";

import { errorMiddleware } from "../middlewares/errorMiddleware";
import { registerRoutes } from "../routes/registerRoutes";

export function createHttpServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  registerRoutes(app);

  app.use(errorMiddleware);

  return app;
}
