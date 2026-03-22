"use client";

import { Minus, Plus, X } from "lucide-react";
import { Select } from "../ui/select";
import { cn } from "../../lib/cn";
import { QUESTION_TYPE_OPTIONS } from "../../lib/constants";
import { QuestionRow } from "../../store/assignmentFormStore";

function Counter({
  value,
  onChange,
  label
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="rounded-full bg-[#f7f7f7] px-3 py-2">
      <div className="mb-1 text-center text-[10px] font-medium text-[#8a8a8a]">{label}</div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#6b6b6b] shadow-[0_4px_10px_rgba(0,0,0,0.05)]"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-[20px] text-center text-[14px] font-semibold text-[#232323]">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#6b6b6b] shadow-[0_4px_10px_rgba(0,0,0,0.05)]"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function QuestionRowEditor({
  row,
  onUpdate,
  onRemove
}: {
  row: QuestionRow;
  onUpdate: (patch: Partial<QuestionRow>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-[20px] bg-white p-3 shadow-[0_8px_18px_rgba(0,0,0,0.04)] md:rounded-none md:bg-transparent md:p-0 md:shadow-none">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_24px_116px_94px] md:items-center">
        <Select
          value={row.type}
          onChange={(e) => onUpdate({ type: e.target.value as QuestionRow["type"] })}
          className="rounded-[16px] bg-[#fbfbfb] md:rounded-full"
        >
          {QUESTION_TYPE_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>

        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-[#8d8d8d] transition hover:bg-[#f4f4f4] hover:text-[#232323]",
            "md:justify-self-center"
          )}
        >
          <X className="h-4 w-4" />
        </button>

        <Counter
          value={row.count}
          onChange={(next) => onUpdate({ count: next })}
          label="No. of Questions"
        />
        <Counter
          value={row.marksPerQuestion}
          onChange={(next) => onUpdate({ marksPerQuestion: next })}
          label="Marks"
        />
      </div>
    </div>
  );
}
