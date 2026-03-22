"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpenText, FolderOpen, Sparkles, UsersRound } from "lucide-react";
import { listAssignments } from "../../lib/api";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { formatDate } from "../../lib/date";
import { StatusPill } from "../assignments/StatusPill";

export function HomePageClient() {
  const assignmentsQuery = useQuery({
    queryKey: ["home-assignments"],
    queryFn: () => listAssignments(),
    refetchInterval: 5000
  });

  const assignments = assignmentsQuery.data?.assignments ?? [];
  const completed = assignments.filter((item) => item.status === "completed").length;
  const active = assignments.filter((item) => item.status === "queued" || item.status === "generating").length;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top_right,_rgba(255,125,69,0.14),_transparent_28%),linear-gradient(135deg,#ffffff,#f8f9fb)] p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff1e8] px-3 py-1 text-[12px] font-semibold text-[#cb5e2f]">
              <Sparkles className="h-3.5 w-3.5" />
              Teacher workspace
            </div>
            <h2 className="mt-4 text-[30px] font-semibold tracking-tight text-[#18181b] lg:text-[38px]">
              Build assessments, track progress, and move between teaching workflows without leaving the app.
            </h2>
            <p className="mt-3 max-w-[720px] text-[14px] leading-7 text-[#71717a]">
              Use the assignments flow for paper creation, jump into AI Teacher&apos;s Toolkit for completed outputs, and keep groups, library, and settings accessible from one responsive shell.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="dark">
                <Link href="/create">
                  Create Assignment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="surface">
                <Link href="/toolkit">Open AI Teacher&apos;s Toolkit</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <Card className="rounded-[24px] p-5">
              <div className="text-[12px] font-medium text-[#71717a]">Assignments</div>
              <div className="mt-2 text-[28px] font-semibold text-[#18181b]">{assignments.length}</div>
              <div className="mt-1 text-[12px] text-[#8a8a8a]">Total created papers</div>
            </Card>
            <Card className="rounded-[24px] p-5">
              <div className="text-[12px] font-medium text-[#71717a]">In progress</div>
              <div className="mt-2 text-[28px] font-semibold text-[#18181b]">{active}</div>
              <div className="mt-1 text-[12px] text-[#8a8a8a]">Queued or generating</div>
            </Card>
            <Card className="rounded-[24px] p-5">
              <div className="text-[12px] font-medium text-[#71717a]">Completed</div>
              <div className="mt-2 text-[28px] font-semibold text-[#18181b]">{completed}</div>
              <div className="mt-1 text-[12px] text-[#8a8a8a]">Ready for PDF and review</div>
            </Card>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px] p-5 lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[20px] font-semibold text-[#18181b]">Recent assignments</h3>
              <p className="mt-1 text-[13px] text-[#71717a]">Latest work moving through the teacher workflow.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/assignments">View all</Link>
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {assignments.slice(0, 4).map((assignment) => (
              <Link
                key={assignment.id}
                href={`/assignments/${assignment.id}`}
                className="flex items-center justify-between gap-4 rounded-[20px] border border-[#ececec] px-4 py-4 transition hover:bg-[#fafafa]"
              >
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-[#18181b]">
                    {assignment.title || "Untitled Assignment"}
                  </div>
                  <div className="mt-1 text-[12px] text-[#71717a]">
                    Created {formatDate(assignment.createdAt)} • Due {formatDate(assignment.dueDate)}
                  </div>
                </div>
                <StatusPill status={assignment.status} />
              </Link>
            ))}

            {!assignments.length ? (
              <div className="rounded-[20px] border border-dashed border-[#e4e4e7] px-4 py-10 text-center text-[13px] text-[#71717a]">
                No assignments yet. Create the first one to populate your workspace.
              </div>
            ) : null}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-[28px] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#f4f4f5] text-[#18181b]">
                <UsersRound className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-[#18181b]">Group overview</div>
                <div className="mt-1 text-[13px] leading-6 text-[#71717a]">
                  Keep classes, assignment load, and review rhythm in one place.
                </div>
              </div>
            </div>
            <Button asChild variant="surface" className="mt-5">
              <Link href="/my-groups">Open My Groups</Link>
            </Button>
          </Card>

          <Card className="rounded-[28px] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#fff1e8] text-[#cb5e2f]">
                <BookOpenText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-[#18181b]">Resource library</div>
                <div className="mt-1 text-[13px] leading-6 text-[#71717a]">
                  Review uploaded material and reusable source packs for faster paper creation.
                </div>
              </div>
            </div>
            <Button asChild variant="surface" className="mt-5">
              <Link href="/library">Open Library</Link>
            </Button>
          </Card>

          <Card className="rounded-[28px] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#f4f4f5] text-[#18181b]">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-[#18181b]">Toolkit jump</div>
                <div className="mt-1 text-[13px] leading-6 text-[#71717a]">
                  Open your generated papers workspace and continue review or download.
                </div>
              </div>
            </div>
            <Button asChild variant="surface" className="mt-5">
              <Link href="/toolkit">Open Toolkit</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
