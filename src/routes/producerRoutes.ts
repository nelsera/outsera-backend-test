import { Router } from "express";

import { getProducerIntervals } from "../controllers/producerController";

export function producerRoutes() {
  const router = Router();

  router.get("/producers/intervals", getProducerIntervals);

  return router;
}
