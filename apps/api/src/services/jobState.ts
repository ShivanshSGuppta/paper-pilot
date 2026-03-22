import { JobStateModel } from "../models/JobState";
import { redis } from "../config/redis";
import { JobProgress } from "@vedaai/shared";

const JOB_PREFIX = "vedaai:job";

export async function setJobProgress(progress: JobProgress & { error?: string }) {
  await redis.hset(`${JOB_PREFIX}:${progress.jobId}`, {
    assignmentId: progress.assignmentId,
    status: progress.status,
    progress: `${progress.progress}`,
    message: progress.message ?? "",
    resultId: progress.resultId ?? ""
  });
  await redis.expire(`${JOB_PREFIX}:${progress.jobId}`, 60 * 60 * 24 * 7);

  await JobStateModel.findOneAndUpdate(
    { jobId: progress.jobId },
    {
      jobId: progress.jobId,
      assignmentId: progress.assignmentId,
      status: progress.status,
      progress: progress.progress,
      message: progress.message ?? "",
      resultId: progress.resultId ?? null,
      error: progress.error ?? null
    },
    { upsert: true, new: true }
  );
}

export async function getJobProgress(jobId: string) {
  const redisState = await redis.hgetall(`${JOB_PREFIX}:${jobId}`);
  if (Object.keys(redisState).length) {
    return {
      jobId,
      assignmentId: redisState.assignmentId,
      status: redisState.status,
      progress: Number(redisState.progress ?? 0),
      message: redisState.message || "",
      resultId: redisState.resultId || null
    };
  }

  const doc = await JobStateModel.findOne({ jobId }).lean();
  if (!doc) return null;
  return {
    jobId: doc.jobId,
    assignmentId: doc.assignmentId,
    status: doc.status,
    progress: doc.progress,
    message: doc.message || "",
    resultId: doc.resultId || null
  };
}
