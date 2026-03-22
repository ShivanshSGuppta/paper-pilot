export const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer",
  "True/False",
  "Fill in the Blanks"
] as const;

export const QUESTION_TYPE_VALUES = [
  "mcq",
  "short_answer",
  "diagram",
  "numerical",
  "long_answer",
  "true_false",
  "fill_blanks"
] as const;

export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"] as const;

export const ASSIGNMENT_STATUSES = [
  "draft",
  "queued",
  "generating",
  "completed",
  "failed"
] as const;

export const JOB_STATUSES = [
  "queued",
  "started",
  "progress",
  "completed",
  "failed",
  "retrying"
] as const;

export const DEFAULT_SCHOOL_NAME = "Delhi Public School Sector-4, Bokaro";
export const DEFAULT_SUBJECT = "English";
export const DEFAULT_CLASS_NAME = "5th";
export const DEFAULT_DURATION_MINUTES = 45;

export const SOCKET_EVENT_NAMES = {
  JOB_QUEUED: "job:queued",
  JOB_STARTED: "job:started",
  JOB_PROGRESS: "job:progress",
  JOB_COMPLETED: "job:completed",
  JOB_FAILED: "job:failed"
} as const;
