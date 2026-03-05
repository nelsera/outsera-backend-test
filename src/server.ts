import { bootstrapApplication } from "./app/bootstrapApplication";
import { createHttpServer } from "./app/createHttpServer";

async function main(): Promise<void> {
  const host = process.env.HOST ?? "0.0.0.0";

  const port = Number(process.env.PORT ?? 3000);

  const app = createHttpServer();

  await bootstrapApplication(app);

  app.listen(port, () => {
    console.log(`[server] running on http://${host}:${port}`);
  });
}

main().catch((error) => {
  console.error("[server] fatal error:", error);

  process.exit(1);
});
