"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import {
  getAssignment,
  getAssignmentResult,
  getJobStatus,
  getPdfUrl,
  regenerateAssignment
} from "../../lib/api";
import { useAssignmentRealtime } from "../../hooks/useAssignmentRealtime";
import { useJobStore } from "../../store/jobStore";
import { useUiStore } from "../../store/uiStore";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { StatusPill } from "../assignments/StatusPill";
import { ExamPaper } from "./ExamPaper";
import { ResultActionBar } from "./ResultActionBar";
import { formatLongDate } from "../../lib/date";

export function AssignmentResultClient({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const ui = useUiStore();
  const setJob = useJobStore((state) => state.setJob);
  const job = useJobStore();

  const assignmentQuery = useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignment(assignmentId)
  });

  const assignment = assignmentQuery.data?.assignment ?? null;
  const isCurrentJob = job.assignmentId === assignmentId;
  const jobId = assignment?.generationJobId || (isCurrentJob ? job.jobId : null);

  const resultQuery = useQuery({
    queryKey: ["result", assignmentId],
    queryFn: () => getAssignmentResult(assignmentId),
    enabled:
      assignment?.status === "completed" || !!assignment?.resultId || (isCurrentJob && !!job.resultId)
  });

  const statusQuery = useQuery({
    queryKey: ["job-status", jobId],
    queryFn: () => getJobStatus(jobId as string),
    enabled: Boolean(jobId && assignment && assignment.status !== "completed"),
    refetchInterval: assignment && assignment.status !== "completed" ? 4000 : false
  });

  useEffect(() => {
    if (statusQuery.data?.job) {
      setJob({
        assignmentId,
        jobId: statusQuery.data.job.jobId,
        status: statusQuery.data.job.status,
        progress: statusQuery.data.job.progress,
        error: null,
        resultId: statusQuery.data.job.resultId ?? null
      });
    }
  }, [statusQuery.data, assignmentId, setJob]);

  useAssignmentRealtime(assignmentId, jobId ?? undefined);

  const regenerateMutation = useMutation({
    mutationFn: (invalidateCache: boolean) => regenerateAssignment(assignmentId, invalidateCache),
    onSuccess: async (payload) => {
      ui.pushToast({
        title: "Regeneration queued",
        description: "The question paper will update live.",
        tone: "success"
      });
      setJob({
        assignmentId,
        jobId: payload.job.jobId,
        status: payload.job.status,
        progress: payload.job.progress,
        error: null,
        resultId: payload.job.resultId ?? null
      });
      queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
      queryClient.invalidateQueries({ queryKey: ["result", assignmentId] });
      queryClient.invalidateQueries({ queryKey: ["job-status", payload.job.jobId] });
    }
  });

  const result = resultQuery.data?.result?.normalizedPayload ?? resultQuery.data?.result ?? null;
  const liveProgress =
    (isCurrentJob ? job.progress : 0) || statusQuery.data?.job.progress || 0;
  const isGenerating =
    assignment?.status === "queued" ||
    assignment?.status === "generating" ||
    (isCurrentJob &&
      (job.status === "queued" || job.status === "progress" || job.status === "started"));

  if (assignmentQuery.isLoading) {
    return <Card className="mx-auto h-[640px] max-w-[980px] animate-pulse bg-[#f8f8f8]" />;
  }

  if (assignmentQuery.isError || resultQuery.isError || statusQuery.isError) {
    return (
      <Card className="mx-auto max-w-[860px] rounded-[24px] border-[#f1c4c1] bg-[#fff4f3] p-8 text-[13px] text-[#a44a42]">
        <div className="font-semibold text-[#7f2d25]">Unable to load the assessment</div>
        <div className="mt-2">
          The backend could not provide the assignment or result payload. Check connectivity and retry.
        </div>
        <Button className="mt-5" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Card>
    );
  }

  if (!assignment) {
    return (
      <Card className="mx-auto max-w-[860px] rounded-[24px] p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-[#d94841]" />
        <div className="mt-3 text-[20px] font-semibold text-[#232323]">Assignment not found</div>
        <Button className="mt-5" onClick={() => router.push("/assignments")}>
          Back to assignments
        </Button>
      </Card>
    );
  }

  const subject = result?.subject || assignment.subject;
  const className = result?.className || assignment.className;

  return (
    <div className="mx-auto max-w-[980px] space-y-4">
      <div className="rounded-[28px] bg-[#232323] px-4 py-4 text-white sm:px-5 sm:py-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={assignment.status} />
          <span className="text-[11px] text-white/60">
            Created {formatLongDate(assignment.createdAt)}
          </span>
        </div>

        <div className="mt-4 max-w-[720px] text-[13px] leading-6 text-white sm:text-[14px]">
          Certainly, John Doe! Here is a customized question paper for your {className} {subject}
          {" "}class based on the requested structure and marks distribution.
        </div>

        <div className="mt-4">
          <ResultActionBar
            assignmentId={assignmentId}
            pdfUrl={getPdfUrl(assignmentId)}
            onRegenerate={() => regenerateMutation.mutate(false)}
            onRetry={() => regenerateMutation.mutate(true)}
          />
        </div>

        {isGenerating ? (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-[12px] text-white/70">
              <span>Generating assessment</span>
              <span>{liveProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-[#ff7d45] transition-all"
                style={{ width: `${liveProgress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {assignment.status === "failed" ? (
        <Card className="rounded-[24px] border-[#f1c4c1] bg-[#fff4f3] px-5 py-4 text-[13px] text-[#a44a42]">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 text-[#d94841]" />
            <div>
              <div className="font-semibold text-[#7f2d25]">Generation failed</div>
              <div className="mt-1">
                Retry the job after validating the assignment inputs or replacing the reference file.
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {result ? (
        <ExamPaper result={result as never} showAnswerKey />
      ) : (
        <Card className="rounded-[28px] px-6 py-8 text-center text-[13px] text-[#8a8a8a]">
          The exam paper will render here once the worker finishes generation.
        </Card>
      )}
    </div>
  );
}
