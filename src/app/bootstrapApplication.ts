import type { Express } from "express";
import { createInMemoryDatabase, initializeSchema } from "../database/sqliteDatabase";
import type { ApplicationContext } from "./applicationContext";

declare module "express-serve-static-core" {
  interface Locals {
    context: ApplicationContext;
  }
}

export async function bootstrapApplication(app: Express): Promise<void> {
  console.log("[bootstrap] creating in-memory database");

  const database = createInMemoryDatabase();
  initializeSchema(database);

  app.locals.context = { database };

  console.log("[bootstrap] database ready");
}
