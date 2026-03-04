import { Express } from "express";
import { registerProducerRoutes } from "./producerRoutes";

export function registerRoutes(app: Express): void {
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  registerProducerRoutes(app);
}
