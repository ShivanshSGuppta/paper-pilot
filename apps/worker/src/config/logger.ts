import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const level = process.env.LOG_LEVEL || "info";

const loggerOptions = { level };
let loggerInstance = pino(loggerOptions);

if (isDev && process.env.PINO_PRETTY === "true") {
  loggerInstance = pino({
    level,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard"
      }
    }
  });
}

export const logger = loggerInstance;
