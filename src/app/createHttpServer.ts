import express from "express";
import cors from "cors";
import { registerRoutes } from "../routes/registerRoutes";

export function createHttpServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  /*
   * Todas as rotas da aplicação são registradas aqui.
   */
  registerRoutes(app);

  return app;
}
