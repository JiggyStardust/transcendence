import { upServer, env } from "./app";

async function main() {
  const app = await upServer();

  const stop = async () => {
    app.log.info("Shutting down...");
    await app.close();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  await app.listen({ host: env.HOST, port: env.PORT });
  app.log.info(`Gateway listening on https://${env.HOST}:${env.PORT}`);
  console.log(`Gateway listening on https://${env.HOST}:${env.PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
