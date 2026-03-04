import { Express } from "express";

export function registerProducerRoutes(app: Express): void {
  app.get("/producers/intervals", (_req, res) => {
    res.status(501).json({
      message: "Not implemented yet",
    });
  });
}
