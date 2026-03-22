import { AssignmentCreateInput } from "@vedaai/shared";

const TOPIC_HINTS = [
  "electricity",
  "fraction",
  "grammar",
  "photosynthesis",
  "data",
  "forces",
  "simple machine",
  "carbon",
  "motion"
];

export function deriveAssignmentTitle(input: {
  subject?: string;
  sourceText?: string;
  additionalInstructions?: string;
  questionBlueprint: AssignmentCreateInput["questionBlueprint"];
}) {
  const haystack = `${input.sourceText ?? ""} ${input.additionalInstructions ?? ""}`.toLowerCase();
  const matched = TOPIC_HINTS.find((item) => haystack.includes(item));
  if (matched) {
    return `Quiz on ${matched.replace(/\b\w/g, (char) => char.toUpperCase())}`;
  }

  const firstBlueprint = input.questionBlueprint[0];
  if (firstBlueprint) {
    const labelMap: Record<string, string> = {
      mcq: "Multiple Choice",
      short_answer: "Short Answer",
      diagram: "Diagram",
      numerical: "Numerical",
      long_answer: "Long Answer",
      true_false: "True/False",
      fill_blanks: "Fill in the Blanks"
    };
    return `${input.subject ?? "Assessment"} - ${labelMap[firstBlueprint.type] ?? "Mixed Questions"}`;
  }

  return `${input.subject ?? "Assessment"} Assessment`;
}
