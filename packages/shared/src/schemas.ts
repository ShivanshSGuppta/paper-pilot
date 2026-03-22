import { z } from "zod";
import {
  ASSIGNMENT_STATUSES,
  DIFFICULTY_LEVELS,
  JOB_STATUSES,
  QUESTION_TYPE_VALUES
} from "./constants";

export const questionTypeValueSchema = z.enum(QUESTION_TYPE_VALUES);
export const difficultySchema = z.enum(DIFFICULTY_LEVELS);
export const assignmentStatusSchema = z.enum(ASSIGNMENT_STATUSES);
export const jobStatusSchema = z.enum(JOB_STATUSES);

export const questionBlueprintRowSchema = z.object({
  type: questionTypeValueSchema,
  count: z.number().int().positive(),
  marksPerQuestion: z.number().int().positive()
});

export const assignmentSourceSchema = z
  .object({
    fileName: z.string().optional().nullable(),
    fileType: z.enum(["pdf", "txt"]).optional().nullable(),
    extractedText: z.string().optional().nullable(),
    originalUploadPath: z.string().optional().nullable(),
    storageKey: z.string().optional().nullable()
  })
  .default({});

export const assignmentCreateInputSchema = z.object({
  title: z.string().trim().min(1).optional(),
  dueDate: z.string().datetime().or(z.coerce.date()).transform((value) =>
    typeof value === "string" ? new Date(value).toISOString() : value.toISOString()
  ),
  source: assignmentSourceSchema.optional(),
  questionBlueprint: z.array(questionBlueprintRowSchema).min(1),
  additionalInstructions: z.string().trim().max(4000).optional().default(""),
  teacherName: z.string().trim().min(1).optional(),
  teacherEmail: z.string().trim().email().optional().nullable(),
  schoolName: z.string().trim().min(1).optional(),
  subject: z.string().trim().min(1).optional(),
  className: z.string().trim().min(1).optional(),
  durationMinutes: z.number().int().positive().optional(),
  maximumMarks: z.number().int().positive().optional()
});

export const assignmentDocumentSchema = assignmentCreateInputSchema
  .extend({
    _id: z.string(),
    status: assignmentStatusSchema,
    totalQuestions: z.number().int().nonnegative(),
    totalMarks: z.number().int().nonnegative(),
    generationJobId: z.string().nullable().optional(),
    resultId: z.string().nullable().optional(),
    createdAt: z.string().or(z.date()),
    updatedAt: z.string().or(z.date())
  })
  .passthrough();

export const rawGeneratedQuestionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1),
  type: questionTypeValueSchema,
  difficulty: difficultySchema,
  marks: z.number().int().positive()
});

export const rawGeneratedSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  instruction: z.string().min(1),
  questions: z.array(rawGeneratedQuestionSchema).min(1)
});

export const answerKeySchema = z
  .object({
    questionRef: z.string().min(1).optional(),
    answer: z.string().min(1)
  })
  .array()
  .optional();

export const rawAssessmentPayloadSchema = z.object({
  title: z.string().min(1),
  schoolName: z.string().min(1),
  subject: z.string().min(1),
  className: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  maximumMarks: z.number().int().positive(),
  instructions: z.array(z.string()).optional().default([]),
  sections: z.array(rawGeneratedSectionSchema).min(1),
  answerKey: answerKeySchema
});

export const generatedQuestionSchema = rawGeneratedQuestionSchema.extend({
  id: z.string()
});

export const generatedSectionSchema = rawGeneratedSectionSchema.extend({
  id: z.string()
});

export const normalizedGeneratedPayloadSchema = z.object({
  title: z.string().min(1),
  schoolName: z.string().min(1),
  subject: z.string().min(1),
  className: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  maximumMarks: z.number().int().positive(),
  instructions: z.array(z.string()).default([]),
  sections: z.array(generatedSectionSchema).min(1),
  answerKey: answerKeySchema
});

export const generatedResultSchema = normalizedGeneratedPayloadSchema
  .extend({
    _id: z.string(),
    assignmentId: z.string(),
    rawModelResponse: z.string().nullable().optional(),
    normalizedPayload: normalizedGeneratedPayloadSchema,
    createdAt: z.string().or(z.date()),
    updatedAt: z.string().or(z.date())
  })
  .passthrough();

export const buildPromptInputSchema = z.object({
  assignmentId: z.string().optional(),
  title: z.string().optional(),
  dueDate: z.string(),
  sourceText: z.string().optional().default(""),
  questionBlueprint: z.array(questionBlueprintRowSchema),
  additionalInstructions: z.string().optional().default(""),
  schoolName: z.string().optional(),
  subject: z.string().optional(),
  className: z.string().optional(),
  durationMinutes: z.number().int().positive().optional(),
  maximumMarks: z.number().int().positive().optional()
});

export const jobProgressSchema = z.object({
  jobId: z.string(),
  assignmentId: z.string(),
  status: jobStatusSchema,
  progress: z.number().min(0).max(100),
  message: z.string().optional(),
  resultId: z.string().optional().nullable()
});

export const socketEventSchema = z.discriminatedUnion("event", [
  z.object({
    event: z.literal("job:queued"),
    payload: jobProgressSchema
  }),
  z.object({
    event: z.literal("job:started"),
    payload: jobProgressSchema
  }),
  z.object({
    event: z.literal("job:progress"),
    payload: jobProgressSchema
  }),
  z.object({
    event: z.literal("job:completed"),
    payload: jobProgressSchema
  }),
  z.object({
    event: z.literal("job:failed"),
    payload: jobProgressSchema.extend({
      error: z.string().optional()
    })
  })
]);

export const listAssignmentsQuerySchema = z.object({
  search: z.string().optional(),
  status: assignmentStatusSchema.optional()
});

export const regenerateInputSchema = z.object({
  invalidateCache: z.boolean().optional().default(false)
});

export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional()
});

export type QuestionTypeValue = z.infer<typeof questionTypeValueSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type AssignmentStatus = z.infer<typeof assignmentStatusSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type AssignmentCreateInput = z.infer<typeof assignmentCreateInputSchema>;
export type AssignmentDocument = z.infer<typeof assignmentDocumentSchema>;
export type GeneratedResult = z.infer<typeof generatedResultSchema>;
export type BuildPromptInput = z.infer<typeof buildPromptInputSchema>;
export type JobProgress = z.infer<typeof jobProgressSchema>;
export type GeneratedSection = z.infer<typeof generatedSectionSchema>;
export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
export type RawAssessmentPayload = z.infer<typeof rawAssessmentPayloadSchema>;
