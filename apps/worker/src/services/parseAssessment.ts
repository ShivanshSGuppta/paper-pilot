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

export function parseAssessmentPayload(raw: string, assignmentId: string) {
  const candidate = extractJsonSubstring(raw);
  let parsed: unknown;

  try {
    parsed = JSON.parse(candidate);
  } catch {
    parsed = JSON.parse(jsonrepair(candidate));
  }

  const normalized = normalizeGeneratedPayload(parsed);
  return {
    ...normalized,
    answerKey: normalized.answerKey?.map((item, index) => ({
      questionRef: item.questionRef ?? `${assignmentId}-${index + 1}`,
      answer: item.answer
    }))
  };
}
