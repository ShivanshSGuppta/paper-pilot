import http from "http";
import { Server } from "socket.io";
import { SOCKET_EVENT_NAMES } from "@vedaai/shared";
import { env } from "./env";
import { logger } from "./logger";
import { redis } from "./redis";
import { JobProgress } from "@vedaai/shared";

export let io: Server | null = null;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: env.SOCKET_CORS_ORIGIN,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("assignment:subscribe", ({ assignmentId, jobId }) => {
      if (assignmentId) socket.join(`assignment:${assignmentId}`);
      if (jobId) socket.join(`job:${jobId}`);
    });
    socket.on("assignment:unsubscribe", ({ assignmentId, jobId }) => {
      if (assignmentId) socket.leave(`assignment:${assignmentId}`);
      if (jobId) socket.leave(`job:${jobId}`);
    });
  });

  logger.info("socket server initialized");
  return io;
}

export function emitAssignmentEvent(event: string, payload: JobProgress & { error?: string }) {
  if (!io) return;
  const assignmentRoom = `assignment:${payload.assignmentId}`;
  const jobRoom = `job:${payload.jobId}`;
  io.to(assignmentRoom).to(jobRoom).emit(event, payload);
}

export async function publishEvent(event: string, payload: JobProgress & { error?: string }) {
  await redis.publish(
    "vedaai:sockets",
    JSON.stringify({
      event,
      payload
    })
  );
}

export async function startSocketRelay() {
  const subscriber = redis.duplicate();
  subscriber.on("message", (_channel, message) => {
    try {
      const parsed = JSON.parse(message) as { event: string; payload: JobProgress & { error?: string } };
      emitAssignmentEvent(parsed.event, parsed.payload);
    } catch (error) {
      logger.error({ error }, "failed to relay socket event");
    }
  });
  await subscriber.subscribe("vedaai:sockets");
  return subscriber;
}

export const socketEventNames = SOCKET_EVENT_NAMES;
