import { Worker, Job } from "bullmq";
import { GRADE_QUEUE_NAME } from "../config/queue";
import { redis } from "../config/redis";
import { logger } from "../config/logger";
import { AssignmentModel } from "../models/Assignment";
import { GeneratedResultModel } from "../models/GeneratedResult";
import { buildAssessmentPrompt, JobProgress } from "@vedaai/shared";
import { getAssessmentLlmProvider } from "../services/llm";
import { parseAssessmentPayload } from "../services/parseAssessment";
import { getCachedAssessment, setCachedAssessment } from "../services/cache";
import { setJobProgress } from "../services/jobState";
import { publishEvent } from "../services/publishEvent";

type JobData = {
  assignmentId: string;
  regenerate: boolean;
  requestedAt: string;
};

async function emit(event: string, payload: JobProgress & { error?: string }) {
  await publishEvent(event, payload);
}

export async function startGenerationWorker() {
  const provider = getAssessmentLlmProvider();

  const worker = new Worker<JobData>(
    GRADE_QUEUE_NAME,
    async (job: Job<JobData>) => {
      const assignment = await AssignmentModel.findById(job.data.assignmentId).lean();
      if (!assignment) {
        throw new Error("Assignment not found");
      }
      const assignmentId = String((assignment as { _id: unknown })._id);

      const progressBase = {
        jobId: job.id!,
        assignmentId,
        resultId: null
      };

      await setJobProgress({ ...progressBase, status: "started", progress: 10, message: "Generation started" });
      await emit("job:started", { ...progressBase, status: "started", progress: 10, message: "Generation started" });

      const promptBundle = buildAssessmentPrompt({
        assignmentId,
        title: assignment.title,
        dueDate: assignment.dueDate,
        sourceText: assignment.source?.extractedText ?? "",
        questionBlueprint: assignment.questionBlueprint,
        additionalInstructions: assignment.additionalInstructions,
        schoolName: assignment.schoolName,
        subject: assignment.subject,
        className: assignment.className,
        durationMinutes: assignment.durationMinutes,
        maximumMarks: assignment.maximumMarks
      });

      const cached = await getCachedAssessment(promptBundle.cacheKey);
      if (cached) {
        const cachedPayload = (cached.normalizedPayload ?? cached) as any;
        const resultDoc = await GeneratedResultModel.create({
          assignmentId,
          title: cachedPayload.title,
          schoolName: cachedPayload.schoolName,
          subject: cachedPayload.subject,
          className: cachedPayload.className,
          durationMinutes: cachedPayload.durationMinutes,
          maximumMarks: cachedPayload.maximumMarks,
          instructions: cachedPayload.instructions,
          sections: cachedPayload.sections,
          answerKey: cachedPayload.answerKey,
          rawModelResponse: cached.rawModelResponse ?? null,
          normalizedPayload: cachedPayload
        });
        await AssignmentModel.findByIdAndUpdate(assignmentId, {
          status: "completed",
          resultId: resultDoc.id,
          generationJobId: job.id
        });
        await setJobProgress({ ...progressBase, status: "completed", progress: 100, message: "Completed from cache", resultId: resultDoc.id });
        await emit("job:completed", { ...progressBase, status: "completed", progress: 100, message: "Completed from cache", resultId: resultDoc.id });
        return { resultId: resultDoc.id };
      }

      await setJobProgress({ ...progressBase, status: "progress", progress: 35, message: "Calling LLM provider" });
      await emit("job:progress", { ...progressBase, status: "progress", progress: 35, message: "Calling LLM provider" });

      const llmResult = await provider.generate(promptBundle);
      await setJobProgress({ ...progressBase, status: "progress", progress: 60, message: "Parsing structured response" });
      await emit("job:progress", { ...progressBase, status: "progress", progress: 60, message: "Parsing structured response" });

      const normalized = parseAssessmentPayload(llmResult.text, assignmentId);
      const resultDoc = await GeneratedResultModel.create({
        ...normalized,
        assignmentId,
        rawModelResponse: llmResult.text,
        normalizedPayload: normalized
      });
      await setCachedAssessment(promptBundle.cacheKey, resultDoc.toJSON() as never);
      await AssignmentModel.findByIdAndUpdate(assignmentId, {
        status: "completed",
        resultId: resultDoc.id,
        generationJobId: job.id
      });
      await setJobProgress({ ...progressBase, status: "completed", progress: 100, message: "Assessment generated", resultId: resultDoc.id });
      await emit("job:completed", { ...progressBase, status: "completed", progress: 100, message: "Assessment generated", resultId: resultDoc.id });
      return { resultId: resultDoc.id };
    },
    {
      connection: redis,
      concurrency: 2
    }
  );

  worker.on("failed", async (job, error) => {
    if (!job) return;
    logger.error({ error, jobId: job.id }, "generation job failed");
    await AssignmentModel.findByIdAndUpdate(job.data.assignmentId, {
      status: "failed"
    });
    await setJobProgress({
      jobId: job.id!,
      assignmentId: job.data.assignmentId,
      status: "failed",
      progress: 100,
      message: error.message,
      error: error.message
    });
    await emit("job:failed", {
      jobId: job.id!,
      assignmentId: job.data.assignmentId,
      status: "failed",
      progress: 100,
      message: error.message,
      error: error.message
    });
  });

  logger.info("generation worker started");
  return worker;
}
