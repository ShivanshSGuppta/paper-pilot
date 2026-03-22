import { Queue } from "bullmq";
import { nanoid } from "nanoid";
import { redis } from "./redis";

export const GRADE_QUEUE_NAME = "vedaai-generation";

export const generationQueue = new Queue(GRADE_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1500
    },
    removeOnComplete: 100,
    removeOnFail: 100
  }
});

export function createQueueJobId(assignmentId: string) {
  return `assignment:${assignmentId}:${nanoid(10)}`;
}

export function buildJobData(assignmentId: string, regenerate = false) {
  return {
    assignmentId,
    regenerate,
    requestedAt: new Date().toISOString()
  };
}
