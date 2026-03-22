import { Request, Response } from "express";
import { z } from "zod";
import {
  AssignmentCreateInput,
  assignmentCreateInputSchema,
  listAssignmentsQuerySchema,
  regenerateInputSchema
} from "@vedaai/shared";
import { AssignmentModel } from "../models/Assignment";
import { GeneratedResultModel } from "../models/GeneratedResult";
import { JobStateModel } from "../models/JobState";
import { calculateTotals } from "../utils/totals";
import { deriveAssignmentTitle } from "../utils/title";
import { extractTextFromUpload } from "../services/extractText";
import { buildAssessmentPrompt } from "@vedaai/shared";
import { generationQueue, buildJobData, createQueueJobId } from "../config/queue";
import { getCachedAssessment, invalidateCachedAssessment } from "../services/cache";
import { setJobProgress } from "../services/jobState";
import { renderAssessmentHtml, htmlToPdfBuffer } from "../services/pdf";
import { withId } from "../utils/serialize";
import { publishEvent } from "../config/socket";

const formFieldSchema = z.object({
  title: z.string().optional(),
  dueDate: z.string().min(1),
  questionBlueprint: z.string().min(1).transform((value, ctx) => {
    try {
      return parseQuestionBlueprint(value);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Question blueprint must be valid JSON."
      });
      return z.NEVER;
    }
  }),
  additionalInstructions: z.string().optional().default(""),
  teacherName: z.string().optional().default("John Doe"),
  teacherEmail: z.string().optional().default("john.doe@vedaai.school"),
  schoolName: z.string().optional(),
  subject: z.string().optional(),
  className: z.string().optional(),
  durationMinutes: z.string().optional(),
  maximumMarks: z.string().optional()
});

function parseQuestionBlueprint(raw: string) {
  const parsed = JSON.parse(raw) as unknown;
  return z.array(
    z.object({
      type: z.enum(["mcq", "short_answer", "diagram", "numerical", "long_answer", "true_false", "fill_blanks"]),
      count: z.number().int().positive(),
      marksPerQuestion: z.number().int().positive()
    })
  ).parse(parsed);
}

export async function createAssignment(req: Request, res: Response) {
  const body = formFieldSchema.parse(req.body);
  const blueprint = body.questionBlueprint;
  const dueDate = new Date(body.dueDate).toISOString();
  const totals = calculateTotals(blueprint);
  const upload = await extractTextFromUpload(
    req.file
      ? {
          fileName: req.file.originalname,
          fileType: req.file.mimetype === "application/pdf" ? "pdf" : "txt",
          originalUploadPath: req.file.path,
          buffer: req.file.buffer
        }
      : null
  );

  const assignmentInput: AssignmentCreateInput = assignmentCreateInputSchema.parse({
    title: body.title,
    dueDate,
    source: upload,
    questionBlueprint: blueprint,
    additionalInstructions: body.additionalInstructions,
    teacherName: body.teacherName,
    teacherEmail: body.teacherEmail,
    schoolName: body.schoolName,
    subject: body.subject,
    className: body.className,
    durationMinutes: body.durationMinutes ? Number(body.durationMinutes) : undefined,
    maximumMarks: body.maximumMarks ? Number(body.maximumMarks) : totals.totalMarks
  });

  const promptBundle = buildAssessmentPrompt({
    dueDate,
    sourceText: upload.extractedText,
    questionBlueprint: blueprint,
    additionalInstructions: body.additionalInstructions,
    schoolName: body.schoolName,
    subject: body.subject,
    className: body.className,
    durationMinutes: body.durationMinutes ? Number(body.durationMinutes) : undefined,
    maximumMarks: body.maximumMarks ? Number(body.maximumMarks) : totals.totalMarks
  });

  const title =
    body.title?.trim() ||
    deriveAssignmentTitle({
      subject: assignmentInput.subject,
      sourceText: upload.extractedText,
      additionalInstructions: body.additionalInstructions,
      questionBlueprint: blueprint
    });

  const cached = await getCachedAssessment(promptBundle.cacheKey);
  const assignment = await AssignmentModel.create({
    title,
    dueDate,
    source: upload,
    questionBlueprint: blueprint,
    additionalInstructions: body.additionalInstructions,
    totalQuestions: totals.totalQuestions,
    totalMarks: totals.totalMarks,
    teacherName: body.teacherName,
    teacherEmail: body.teacherEmail,
    schoolName: assignmentInput.schoolName,
    subject: assignmentInput.subject,
    className: assignmentInput.className,
    durationMinutes: assignmentInput.durationMinutes,
    maximumMarks: assignmentInput.maximumMarks,
    status: cached ? "completed" : "queued",
    generationJobId: null,
    resultId: cached ? cached.id : null,
    promptSignature: promptBundle.cacheKey
  });

  if (cached) {
    const jobId = `cached-${assignment.id}`;
    const cachedPayload = (cached.normalizedPayload ?? cached) as any;
    const cachedResult = await GeneratedResultModel.create({
      assignmentId: assignment.id,
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
    await AssignmentModel.findByIdAndUpdate(assignment.id, {
      status: "completed",
      resultId: cachedResult.id,
      generationJobId: jobId
    });
    await JobStateModel.findOneAndUpdate(
      { jobId },
      {
        jobId,
        assignmentId: assignment.id,
        status: "completed",
        progress: 100,
        message: "Result reused from cache.",
        resultId: cachedResult.id
      },
      { upsert: true, new: true }
    );
    await setJobProgress({
      jobId,
      assignmentId: assignment.id,
      status: "completed",
      progress: 100,
      message: "Result reused from cache.",
      resultId: cachedResult.id
    });
    await publishEvent("job:completed", {
      jobId,
      assignmentId: assignment.id,
      status: "completed",
      progress: 100,
      message: "Result reused from cache.",
      resultId: cachedResult.id
    });
    const refreshedAssignment = await AssignmentModel.findById(assignment.id).lean();
    return res.status(201).json({
      assignment: refreshedAssignment ? withId(refreshedAssignment as never) : null,
      job: {
        jobId,
        assignmentId: assignment.id,
        status: "completed",
        progress: 100,
        message: "Result reused from cache.",
        resultId: cachedResult.id
      },
      cached: true
    });
  }

  const jobId = createQueueJobId(assignment.id);
  await AssignmentModel.findByIdAndUpdate(assignment.id, {
    generationJobId: jobId,
    status: "queued"
  });
  await JobStateModel.findOneAndUpdate(
    { jobId },
    {
      jobId,
      assignmentId: assignment.id,
      status: "queued",
      progress: 0,
      message: "Queued for generation"
    },
    { upsert: true, new: true }
  );
  await setJobProgress({
    jobId,
    assignmentId: assignment.id,
    status: "queued",
    progress: 0,
    message: "Queued for generation"
  });
  await publishEvent("job:queued", {
    jobId,
    assignmentId: assignment.id,
    status: "queued",
    progress: 0,
    message: "Queued for generation"
  });
  await generationQueue.add(jobId, buildJobData(assignment.id, false), {
    jobId
  });

  const updatedAssignment = await AssignmentModel.findById(assignment.id).lean();
  return res.status(201).json({
    assignment: updatedAssignment ? withId(updatedAssignment as never) : null,
    job: {
      jobId,
      assignmentId: assignment.id,
      status: "queued",
      progress: 0,
      message: "Queued for generation"
    },
    cached: false
  });
}

export async function listAssignments(req: Request, res: Response) {
  const query = listAssignmentsQuerySchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { additionalInstructions: { $regex: query.search, $options: "i" } }
    ];
  }
  const assignments = await AssignmentModel.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ assignments: assignments.map((item) => withId(item as never)) });
}

export async function getAssignment(req: Request, res: Response) {
  const assignment = await AssignmentModel.findById(req.params.id).lean();
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }
  res.json({ assignment: withId(assignment as never) });
}

export async function getAssignmentResult(req: Request, res: Response) {
  const result = await GeneratedResultModel.findOne({ assignmentId: req.params.id }).lean();
  if (!result) {
    return res.status(404).json({ message: "Generated result not found" });
  }
  res.json({ result: withId(result as never) });
}

export async function regenerateAssignment(req: Request, res: Response) {
  const { invalidateCache } = regenerateInputSchema.parse(req.body ?? {});
  const assignment = await AssignmentModel.findById(req.params.id);
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }
  if (invalidateCache) {
    await invalidateCachedAssessment(assignment.promptSignature);
  }

  const jobId = createQueueJobId(assignment.id);
  assignment.status = "queued";
  assignment.generationJobId = jobId;
  await assignment.save();
  await JobStateModel.findOneAndUpdate(
    { jobId },
    {
      jobId,
      assignmentId: assignment.id,
      status: "queued",
      progress: 0,
      message: "Re-queued for generation"
    },
    { upsert: true, new: true }
  );
  await setJobProgress({
    jobId,
    assignmentId: assignment.id,
    status: "queued",
    progress: 0,
    message: "Re-queued for generation"
  });
  await publishEvent("job:queued", {
    jobId,
    assignmentId: assignment.id,
    status: "queued",
    progress: 0,
    message: "Re-queued for generation"
  });
  await generationQueue.add(jobId, buildJobData(assignment.id, true), { jobId });
  return res.json({
    job: {
      jobId,
      assignmentId: assignment.id,
      status: "queued",
      progress: 0,
      message: "Re-queued for generation"
    }
  });
}

export async function deleteAssignment(req: Request, res: Response) {
  const assignment = await AssignmentModel.findByIdAndDelete(req.params.id);
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }
  await GeneratedResultModel.deleteMany({ assignmentId: assignment.id });
  await JobStateModel.deleteMany({ assignmentId: assignment.id });
  res.status(204).send();
}

export async function getJobStatus(req: Request, res: Response) {
  const state = await JobStateModel.findOne({ jobId: req.params.jobId }).lean();
  if (!state) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.json({ job: state });
}

export async function downloadPdf(req: Request, res: Response) {
  const assignment = await AssignmentModel.findById(req.params.id).lean();
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }
  const assignmentId = String((assignment as { _id: unknown })._id);
  const result = await GeneratedResultModel.findOne({ assignmentId }).lean();
  if (!result) {
    return res.status(404).json({ message: "Generated result not found" });
  }

  const html = renderAssessmentHtml((result.normalizedPayload ?? result) as never, {
    teacherMode: req.query.mode === "teacher",
    includeAnswerKey: req.query.answerKey === "true"
  });
  const pdf = await htmlToPdfBuffer(html);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${assignment.title.replace(/[^a-z0-9]+/gi, "_")}.pdf"`);
  res.send(pdf);
}
