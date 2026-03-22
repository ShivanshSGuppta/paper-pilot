import IORedis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: false
});

export async function ensureRedis() {
  if (redis.status === "wait" || redis.status === "end") {
    await redis.connect().catch(() => undefined);
  }
  return redis;
}

redis.on("error", (error) => {
  logger.error({ error }, "redis error");
});

export async function pingRedis() {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
