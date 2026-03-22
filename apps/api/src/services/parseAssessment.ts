import { jsonrepair } from "jsonrepair";
import { normalizeGeneratedPayload } from "@vedaai/shared";

function extractJsonSubstring(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) return trimmed.slice(first, last + 1);
  return trimmed;
}

export function parseAssessmentPayload(raw: string, fallbackContext: { assignmentId: string }) {
  const candidate = extractJsonSubstring(raw);
  let parsed: unknown;

  try {
    parsed = JSON.parse(candidate);
  } catch {
    const repaired = jsonrepair(candidate);
    parsed = JSON.parse(repaired);
  }

  const normalized = normalizeGeneratedPayload(parsed);
  return {
    ...normalized,
    answerKey: normalized.answerKey?.map((item, index) => ({
      questionRef: item.questionRef ?? `${fallbackContext.assignmentId}-${index + 1}`,
      answer: item.answer
    }))
  };
}

export function ensureAssessmentMetadata(parsed: ReturnType<typeof parseAssessmentPayload>) {
  return {
    ...parsed,
    title: parsed.title.trim(),
    instructions: parsed.instructions.map((item) => item.trim()).filter(Boolean)
  };
}
