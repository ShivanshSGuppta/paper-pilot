import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ error }, "request failed");

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      issues: error.flatten()
    });
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  if (
    message.includes("Only PDF and text files are allowed") ||
    message.includes("Question blueprint must be valid JSON") ||
    message.includes("Unable to extract text from uploaded file")
  ) {
    return res.status(400).json({
      message,
      code: "BAD_REQUEST"
    });
  }
  return res.status(500).json({
    message,
    code: "SERVER_ERROR"
  });
}
