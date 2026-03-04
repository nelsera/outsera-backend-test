import { Express } from "express";

export async function bootstrapApplication(_app: Express): Promise<void> {
  console.log("[bootstrap] starting application bootstrap");
}
