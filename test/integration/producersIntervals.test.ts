import type { Express } from "express";
import request from "supertest";

import { bootstrapApplication } from "../../src/app/bootstrapApplication";
import { createHttpServer } from "../../src/app/createHttpServer";

type ProducerInterval = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

type ProducerIntervalsResponse = {
  min: ProducerInterval[];
  max: ProducerInterval[];
};

function isValidIntervalItem(value: unknown): value is ProducerInterval {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.producer === "string" &&
    typeof record.interval === "number" &&
    typeof record.previousWin === "number" &&
    typeof record.followingWin === "number"
  );
}

function assertValidIntervalsResponse(body: unknown): asserts body is ProducerIntervalsResponse {
  if (typeof body !== "object" || body === null) {
    throw new Error("Response body should be an object");
  }

  const record = body as Record<string, unknown>;

  if (!Array.isArray(record.min)) {
    throw new Error("Response body.min should be an array");
  }

  if (!Array.isArray(record.max)) {
    throw new Error("Response body.max should be an array");
  }

  for (const item of record.min) {
    if (!isValidIntervalItem(item)) {
      throw new Error("Invalid item found in response body.min");
    }
  }

  for (const item of record.max) {
    if (!isValidIntervalItem(item)) {
      throw new Error("Invalid item found in response body.max");
    }
  }
}

describe("GET /producers/intervals", () => {
  let app: Express;

  beforeAll(async () => {
    app = createHttpServer();

    await bootstrapApplication(app);
  });

  it("should return 200", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);
  });

  it("should return JSON content type", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.headers["content-type"]).toContain("application/json");
  });

  it("should include min and max arrays", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("min");

    expect(response.body).toHaveProperty("max");

    expect(Array.isArray(response.body.min)).toBe(true);

    expect(Array.isArray(response.body.max)).toBe(true);
  });

  it("should return non-empty min and max arrays for the default dataset", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    assertValidIntervalsResponse(response.body);

    expect(response.body.min.length).toBeGreaterThan(0);

    expect(response.body.max.length).toBeGreaterThan(0);
  });

  it("should match the expected result for the default dataset", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      min: [
        {
          producer: "Joel Silver",
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: "Matthew Vaughn",
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    });
  });

  it("should return the same cached result across multiple calls", async () => {
    const firstResponse = await request(app).get("/producers/intervals");

    const secondResponse = await request(app).get("/producers/intervals");

    expect(firstResponse.status).toBe(200);

    expect(secondResponse.status).toBe(200);

    expect(secondResponse.body).toEqual(firstResponse.body);
  });

  it("should return items with the expected fields and types", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    assertValidIntervalsResponse(response.body);
  });

  it("should return intervals greater than zero", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    assertValidIntervalsResponse(response.body);

    const allItems = [...response.body.min, ...response.body.max];

    for (const item of allItems) {
      expect(item.interval).toBeGreaterThan(0);
    }
  });

  it("should keep year ordering consistent within each interval item", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    assertValidIntervalsResponse(response.body);

    const allItems = [...response.body.min, ...response.body.max];

    for (const item of allItems) {
      expect(item.followingWin).toBeGreaterThan(item.previousWin);

      expect(item.interval).toBe(item.followingWin - item.previousWin);
    }
  });

  it("should keep all min items with the same interval value", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    assertValidIntervalsResponse(response.body);

    const [firstMin] = response.body.min;

    for (const item of response.body.min) {
      expect(item.interval).toBe(firstMin.interval);
    }
  });

  it("should keep all max items with the same interval value", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    assertValidIntervalsResponse(response.body);

    const [firstMax] = response.body.max;

    for (const item of response.body.max) {
      expect(item.interval).toBe(firstMax.interval);
    }
  });

  it("should keep min interval less than or equal to max interval", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    assertValidIntervalsResponse(response.body);

    const minInterval = response.body.min[0]?.interval;

    const maxInterval = response.body.max[0]?.interval;

    expect(minInterval).toBeLessThanOrEqual(maxInterval);
  });

  it("should keep min intervals ordered deterministically", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    assertValidIntervalsResponse(response.body);

    const { min } = response.body;

    for (let index = 1; index < min.length; index++) {
      const previous = min[index - 1];

      const current = min[index];

      const producerComparison = previous.producer.localeCompare(current.producer);

      if (producerComparison === 0) {
        if (previous.previousWin === current.previousWin) {
          expect(previous.followingWin).toBeLessThanOrEqual(current.followingWin);
        } else {
          expect(previous.previousWin).toBeLessThanOrEqual(current.previousWin);
        }
      } else {
        expect(producerComparison).toBeLessThanOrEqual(0);
      }
    }
  });

  it("should keep max intervals ordered deterministically", async () => {
    const response = await request(app).get("/producers/intervals");

    expect(response.status).toBe(200);

    assertValidIntervalsResponse(response.body);

    const { max } = response.body;

    for (let index = 1; index < max.length; index++) {
      const previous = max[index - 1];

      const current = max[index];

      const producerComparison = previous.producer.localeCompare(current.producer);

      if (producerComparison === 0) {
        if (previous.previousWin === current.previousWin) {
          expect(previous.followingWin).toBeLessThanOrEqual(current.followingWin);
        } else {
          expect(previous.previousWin).toBeLessThanOrEqual(current.previousWin);
        }
      } else {
        expect(producerComparison).toBeLessThanOrEqual(0);
      }
    }
  });

  it("should expose cached intervals in application context after bootstrap", async () => {
    const context = app.locals.context as
      | {
          producerIntervals?: ProducerIntervalsResponse;
        }
      | undefined;

    expect(context).toBeDefined();

    expect(context?.producerIntervals).toBeDefined();

    expect(context?.producerIntervals).toEqual({
      min: [
        {
          producer: "Joel Silver",
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: "Matthew Vaughn",
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    });
  });

  it("should return 503 when database context is not initialized", async () => {
    const appWithoutBootstrap = createHttpServer();

    const response = await request(appWithoutBootstrap).get("/producers/intervals");

    expect(response.status).toBe(503);

    expect(response.body).toEqual({
      error: "DATABASE_NOT_READY",
      message: "Database not initialized",
    });
  });

  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/does-not-exist");

    expect(response.status).toBe(404);
  });
});
