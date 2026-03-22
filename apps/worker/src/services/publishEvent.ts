import { redis } from "../config/redis";
import { JobProgress } from "@vedaai/shared";

export async function publishEvent(event: string, payload: JobProgress & { error?: string }) {
  await redis.publish(
    "vedaai:sockets",
    JSON.stringify({
      event,
      payload
    })
  );
}
