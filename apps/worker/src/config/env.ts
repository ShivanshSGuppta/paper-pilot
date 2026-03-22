import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  LLM_PROVIDER: z.enum(["gemini"]).default("gemini"),
  LLM_API_KEY: z.string().min(1, "LLM_API_KEY is required"),
  LLM_BASE_URL: z.string().url().default("https://generativelanguage.googleapis.com/v1beta"),
  LLM_MODEL: z.string().default("gemini-2.5-flash")
});

export const env = envSchema.parse(process.env);
