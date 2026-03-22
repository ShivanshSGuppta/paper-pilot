import { AssignmentCreateInput } from "@vedaai/shared";

export function calculateTotals(questionBlueprint: AssignmentCreateInput["questionBlueprint"]) {
  return questionBlueprint.reduce(
    (acc, row) => ({
      totalQuestions: acc.totalQuestions + row.count,
      totalMarks: acc.totalMarks + row.count * row.marksPerQuestion
    }),
    { totalQuestions: 0, totalMarks: 0 }
  );
}
