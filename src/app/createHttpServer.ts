import express from "express";
import cors from "cors";

import { registerRoutes } from "../routes/registerRoutes";
import { errorMiddleware } from "../middlewares/errorMiddleware";

export function createHttpServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  registerRoutes(app);

  app.use(errorMiddleware);

  return app;
}
