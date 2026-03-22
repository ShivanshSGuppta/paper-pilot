import http from "http";
import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { apiRoutes } from "./routes";
import { env, isSeedEnabled } from "./config/env";
import { logger } from "./config/logger";
import { connectMongo } from "./config/mongo";
import { ensureRedis } from "./config/redis";
import { initSocket, startSocketRelay } from "./config/socket";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { seedDemoData } from "./services/seedDemoData";

async function bootstrap() {
  await connectMongo();
  await ensureRedis();

  const uploadDir = path.resolve(env.UPLOAD_DIR);
  fs.mkdirSync(uploadDir, { recursive: true });

  if (isSeedEnabled) {
    await seedDemoData();
  }

  const app = express();
  app.use(
    cors({
      origin: env.WEB_APP_URL,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    pinoHttp({
      logger
    })
  );

  app.use(apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  const server = http.createServer(app);
  initSocket(server);
  startSocketRelay().catch((error) => {
    logger.error({ error }, "socket relay failed to start");
  });

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "api listening");
  });
}

bootstrap().catch((error) => {
  logger.error({ error }, "api bootstrap failed");
  process.exit(1);
});
