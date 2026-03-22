import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

let connected = false;

export async function connectMongo() {
  if (connected) return mongoose;
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI);
  connected = true;
  logger.info("worker mongo connected");
  return mongoose;
}
