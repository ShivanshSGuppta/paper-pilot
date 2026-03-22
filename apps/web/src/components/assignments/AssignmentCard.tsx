"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Card } from "../ui/card";
import { formatDate } from "../../lib/date";
import { StatusPill } from "./StatusPill";

export function AssignmentCard({
  assignment,
  onDelete
}: {
  assignment: {
    id: string;
    title: string | undefined;
    dueDate: string;
    createdAt: string;
    status: string;
    totalQuestions: number;
    totalMarks: number;
  };
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="relative overflow-visible rounded-[22px] px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-semibold tracking-tight text-[#232323]">
            {assignment.title || "Untitled Assignment"}
          </h3>
          {assignment.status !== "completed" ? (
            <div className="mt-2">
              <StatusPill status={assignment.status} />
            </div>
          ) : null}
        </div>

        <details className="relative shrink-0">
          <summary className="list-none cursor-pointer rounded-full p-1.5 text-[#8b8b8b] transition hover:bg-[#f3f3f3]">
            <MoreVertical className="h-4 w-4" />
          </summary>
          <div className="absolute right-0 top-9 z-20 min-w-[140px] overflow-hidden rounded-[16px] border border-[#ededed] bg-white shadow-[0_18px_28px_rgba(0,0,0,0.08)]">
            <Link
              href={`/assignments/${assignment.id}`}
              className="block px-4 py-3 text-[13px] text-[#2b2b2b] transition hover:bg-[#f8f8f8]"
            >
              View Assignment
            </Link>
            <button
              onClick={() => onDelete(assignment.id)}
              className="block w-full px-4 py-3 text-left text-[13px] text-[#d94841] transition hover:bg-[#fff4f3]"
            >
              Delete
            </button>
          </div>
        </details>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 text-[12px] font-medium text-[#5a5a5a]">
        <div className="min-w-0">
          <span className="font-semibold text-[#1f1f1f]">Assigned on:</span>{" "}
          <span className="text-[#7f7f7f]">{formatDate(assignment.createdAt)}</span>
        </div>
        <div className="shrink-0">
          <span className="font-semibold text-[#1f1f1f]">Due:</span>{" "}
          <span className="text-[#7f7f7f]">{formatDate(assignment.dueDate)}</span>
        </div>
      </div>
    </Card>
  );
}
