import { connectMongo } from "./config/mongo";
import { logger } from "./config/logger";
import { startGenerationWorker } from "./consumers/generationConsumer";

async function bootstrap() {
  await connectMongo();
  await startGenerationWorker();
}

bootstrap().catch((error) => {
  logger.error({ error }, "worker bootstrap failed");
  process.exit(1);
});
