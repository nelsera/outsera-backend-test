import { Express } from "express";
import { producerRoutes } from "./producerRoutes";

export function registerRoutes(app: Express) {
  app.use(producerRoutes());
}
