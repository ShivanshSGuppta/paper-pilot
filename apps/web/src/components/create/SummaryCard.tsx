import { Card } from "../ui/card";

export function SummaryCard({ totalQuestions, totalMarks }: { totalQuestions: number; totalMarks: number }) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Total Questions</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">{totalQuestions}</div>
        </div>
        <div className="rounded-2xl bg-orange-50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-orange-400">Total Marks</div>
          <div className="mt-2 text-3xl font-semibold text-orange-700">{totalMarks}</div>
        </div>
      </div>
    </Card>
  );
}
