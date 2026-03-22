import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  WEB_APP_URL: z.string().url().default("http://localhost:3000"),
  SOCKET_CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
  UPLOAD_DIR: z.string().default("./uploads"),
  LLM_PROVIDER: z.enum(["gemini"]).default("gemini"),
  LLM_API_KEY: z.string().min(1, "LLM_API_KEY is required"),
  LLM_BASE_URL: z.string().url().default("https://generativelanguage.googleapis.com/v1beta"),
  LLM_MODEL: z.string().default("gemini-2.5-flash"),
  SEED_DEMO_DATA: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .default("false")
});

export const env = envSchema.parse(process.env);

export const isSeedEnabled =
  env.NODE_ENV === "development" &&
  (env.SEED_DEMO_DATA === true || env.SEED_DEMO_DATA === "true");
export const llmConfigured = Boolean(env.LLM_API_KEY);
