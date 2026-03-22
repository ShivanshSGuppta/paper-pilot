"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Download, Sparkles } from "lucide-react";
import { getPdfUrl, listAssignments } from "../../lib/api";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { formatDate } from "../../lib/date";
import { StatusPill } from "../assignments/StatusPill";

export function ToolkitPageClient() {
  const assignmentsQuery = useQuery({
    queryKey: ["toolkit-assignments"],
    queryFn: () => listAssignments(),
    refetchInterval: 5000
  });

  const completed = (assignmentsQuery.data?.assignments ?? []).filter((item) => item.status === "completed");

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] bg-[#18181b] p-6 text-white lg:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-white">
          <Sparkles className="h-3.5 w-3.5" />
          AI Teacher&apos;s Toolkit
        </div>
        <h2 className="mt-4 text-[28px] font-semibold tracking-tight lg:text-[34px]">
          Review generated papers, reopen outputs, and move quickly into downloadable question sheets.
        </h2>
        <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-white/70">
          Completed assessments appear here as your toolkit workspace. Open any paper to regenerate, inspect the answer key, or export a teacher-ready PDF.
        </p>
      </Card>

      <Card className="rounded-[28px] p-5 lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[20px] font-semibold text-[#18181b]">Generated outputs</h3>
            <p className="mt-1 text-[13px] text-[#71717a]">Live completed assignments connected to the existing backend flow.</p>
          </div>
          <Button asChild variant="surface">
            <Link href="/create">Create new paper</Link>
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {completed.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col gap-4 rounded-[22px] border border-[#ececec] px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-[16px] font-semibold text-[#18181b]">
                    {assignment.title || "Untitled Assignment"}
                  </div>
                  <StatusPill status={assignment.status} />
                </div>
                <div className="mt-1 text-[13px] text-[#71717a]">
                  Created {formatDate(assignment.createdAt)} • Due {formatDate(assignment.dueDate)}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild variant="surface">
                  <Link href={`/result/${assignment.id}`}>Open paper</Link>
                </Button>
                <Button asChild variant="dark">
                  <a href={getPdfUrl(assignment.id)} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" />
                    PDF
                  </a>
                </Button>
              </div>
            </div>
          ))}

          {!completed.length ? (
            <div className="rounded-[22px] border border-dashed border-[#e4e4e7] px-4 py-12 text-center text-[13px] text-[#71717a]">
              No completed papers yet. Generate an assignment first to populate AI Teacher&apos;s Toolkit.
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
