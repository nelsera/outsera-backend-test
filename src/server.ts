import { createHttpServer } from "./app/createHttpServer";
import { bootstrapApplication } from "./app/bootstrapApplication";

async function main(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);

  const app = createHttpServer();

  await bootstrapApplication(app);

  app.listen(port, () => {
    console.log(`[server] running on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error("[server] fatal error:", error);
  process.exit(1);
});
