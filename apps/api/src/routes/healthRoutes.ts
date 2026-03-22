import { Router } from "express";
import { pingRedis } from "../config/redis";
import { AssignmentModel } from "../models/Assignment";
import { llmConfigured } from "../config/env";

export const healthRoutes = Router();

healthRoutes.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "api",
    timestamp: new Date().toISOString(),
    llmOk: llmConfigured
  });
});

healthRoutes.get("/ready", async (_req, res) => {
  const [redisOk, mongoOk] = await Promise.all([
    pingRedis().catch(() => false),
    AssignmentModel.db.db?.admin().ping().then(() => true).catch(() => false)
  ]);
  if (!redisOk || !mongoOk || !llmConfigured) {
    return res.status(503).json({
      ok: false,
      redisOk,
      mongoOk,
      llmOk: llmConfigured
    });
  }
  return res.json({
    ok: true,
    redisOk,
    mongoOk,
    llmOk: llmConfigured
  });
});
