import crypto from "crypto";
import { redis } from "../config/redis";
import { GeneratedResult } from "@vedaai/shared";

const CACHE_PREFIX = "vedaai:assessment-cache";

export function cacheKeyFromSignature(signature: string) {
  return `${CACHE_PREFIX}:${crypto.createHash("sha256").update(signature).digest("hex")}`;
}

export async function getCachedAssessment(signature: string) {
  const key = cacheKeyFromSignature(signature);
  const payload = await redis.get(key);
  return payload ? (JSON.parse(payload) as GeneratedResult) : null;
}

export async function setCachedAssessment(signature: string, result: GeneratedResult) {
  const key = cacheKeyFromSignature(signature);
  await redis.set(key, JSON.stringify(result), "EX", 60 * 60 * 24 * 7);
}

export async function invalidateCachedAssessment(signature: string) {
  const key = cacheKeyFromSignature(signature);
  await redis.del(key);
}
