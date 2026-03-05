import { logger } from "#utils/logger";

import { bootstrapApplication } from "./app/bootstrapApplication";
import { createHttpServer } from "./app/createHttpServer";

async function main(): Promise<void> {
  const host = process.env.HOST ?? "0.0.0.0";

  const port = Number(process.env.PORT ?? 3000);

  const app = createHttpServer();

  logger.info("[server] starting application");

  await bootstrapApplication(app);

  app.listen(port, host, () => {
    logger.info({ host, port }, "[server] http server running");
  });
}

main().catch((error) => {
  logger.error({ error }, "[server] fatal error during startup");

  process.exit(1);
});
