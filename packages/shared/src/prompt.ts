import { DEFAULT_CLASS_NAME, DEFAULT_DURATION_MINUTES, DEFAULT_SCHOOL_NAME, DEFAULT_SUBJECT } from "./constants";
import { BuildPromptInput, buildPromptInputSchema, normalizedGeneratedPayloadSchema, rawAssessmentPayloadSchema } from "./schemas";

export type LlmPromptBundle = {
  system: string;
  user: string;
  normalizedInput: BuildPromptInput;
  cacheKey: string;
};

export function sanitizeText(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .trim();
}

export function buildNormalizedPromptInput(input: BuildPromptInput): BuildPromptInput {
  const parsed = buildPromptInputSchema.parse({
    ...input,
    sourceText: sanitizeText(input.sourceText ?? ""),
    additionalInstructions: sanitizeText(input.additionalInstructions ?? ""),
    schoolName: input.schoolName?.trim() || DEFAULT_SCHOOL_NAME,
    subject: input.subject?.trim() || DEFAULT_SUBJECT,
    className: input.className?.trim() || DEFAULT_CLASS_NAME,
    durationMinutes: input.durationMinutes ?? DEFAULT_DURATION_MINUTES,
    maximumMarks: input.maximumMarks
  });

  return {
    ...parsed,
    sourceText: sanitizeText(parsed.sourceText ?? ""),
    additionalInstructions: sanitizeText(parsed.additionalInstructions ?? ""),
    schoolName: parsed.schoolName ?? DEFAULT_SCHOOL_NAME,
    subject: parsed.subject ?? DEFAULT_SUBJECT,
    className: parsed.className ?? DEFAULT_CLASS_NAME,
    durationMinutes: parsed.durationMinutes ?? DEFAULT_DURATION_MINUTES
  };
}

export function buildCacheSignature(input: BuildPromptInput) {
  const normalized = buildNormalizedPromptInput(input);
  const payload = {
    sourceText: normalized.sourceText,
    additionalInstructions: normalized.additionalInstructions,
    questionBlueprint: normalized.questionBlueprint,
    schoolName: normalized.schoolName,
    subject: normalized.subject,
    className: normalized.className,
    durationMinutes: normalized.durationMinutes,
    maximumMarks: normalized.maximumMarks
  };
  return JSON.stringify(payload);
}

export function buildAssessmentPrompt(input: BuildPromptInput): LlmPromptBundle {
  const normalizedInput = buildNormalizedPromptInput(input);
  const sectionsOverview = normalizedInput.questionBlueprint
    .map(
      (row, index) =>
        `${index + 1}. ${row.type} | count: ${row.count} | marks per question: ${row.marksPerQuestion}`
    )
    .join("\n");

  const system = [
    "You are an expert school assessment designer.",
    "Return JSON only. No prose, no markdown, no code fences.",
    "The JSON must match the requested structure exactly.",
    "Ensure questions are age-appropriate, original, and aligned to the input blueprint.",
    "Use difficulty values exactly: easy, medium, hard.",
    "Do not include duplicate questions."
  ].join(" ");

  const user = [
    "Create a polished school assessment paper using the data below.",
    `School: ${normalizedInput.schoolName}`,
    `Subject: ${normalizedInput.subject}`,
    `Class: ${normalizedInput.className}`,
    `DurationMinutes: ${normalizedInput.durationMinutes}`,
    `MaximumMarks: ${normalizedInput.maximumMarks ?? "derive from blueprint if omitted"}`,
    "Blueprint:",
    sectionsOverview,
    normalizedInput.sourceText ? `Reference text:\n${normalizedInput.sourceText}` : "Reference text: none",
    normalizedInput.additionalInstructions ? `Additional instructions:\n${normalizedInput.additionalInstructions}` : "Additional instructions: none",
    "Respond with JSON shaped like:",
    JSON.stringify(
      {
        title: "Assessment Title",
        schoolName: DEFAULT_SCHOOL_NAME,
        subject: DEFAULT_SUBJECT,
        className: DEFAULT_CLASS_NAME,
        durationMinutes: 45,
        maximumMarks: 20,
        instructions: ["Instruction 1"],
        sections: [
          {
            id: "section-a",
            title: "Section A",
            instruction: "Attempt all questions.",
            questions: [
              {
                id: "q1",
                text: "Question text",
                type: "short_answer",
                difficulty: "easy",
                marks: 2
              }
            ]
          }
        ],
        answerKey: [{ questionRef: "q1", answer: "Answer" }]
      },
      null,
      2
    )
  ].join("\n");

  const cacheKey = buildCacheSignature(normalizedInput);
  return { system, user, normalizedInput, cacheKey };
}

export function normalizeGeneratedPayload(input: unknown) {
  const parsed = rawAssessmentPayloadSchema.parse(input);
  const normalized = {
    title: parsed.title.trim(),
    schoolName: parsed.schoolName.trim(),
    subject: parsed.subject.trim(),
    className: parsed.className.trim(),
    durationMinutes: parsed.durationMinutes,
    maximumMarks: parsed.maximumMarks,
    instructions: [...new Set((parsed.instructions ?? []).map((item) => item.trim()).filter(Boolean))],
    sections: parsed.sections.map((section, sectionIndex) => {
      const sectionId = section.id?.trim() || `section-${sectionIndex + 1}`;
      return {
        id: sectionId,
        title: section.title.trim(),
        instruction: section.instruction.trim(),
        questions: section.questions.map((question, questionIndex) => ({
          id: question.id?.trim() || `${sectionId}-q${questionIndex + 1}`,
          text: question.text.trim(),
          type: question.type,
          difficulty: question.difficulty,
          marks: question.marks
        }))
      };
    }),
    answerKey: parsed.answerKey?.map((item, index) => ({
      questionRef: item.questionRef?.trim() || `answer-${index + 1}`,
      answer: item.answer.trim()
    }))
  };
  return normalizedGeneratedPayloadSchema.parse(normalized);
}
