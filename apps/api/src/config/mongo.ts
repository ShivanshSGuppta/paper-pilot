import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

let connected = false;

export async function connectMongo() {
  if (connected) return mongoose;
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: true
  });
  connected = true;
  logger.info({ uri: env.MONGODB_URI }, "mongo connected");
  return mongoose;
}

export async function disconnectMongo() {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
}
