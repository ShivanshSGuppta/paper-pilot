import IORedis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true
});

redis.on("error", (error) => {
  logger.error({ error }, "worker redis error");
});
