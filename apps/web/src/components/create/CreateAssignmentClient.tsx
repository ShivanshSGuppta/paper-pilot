"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { FileUploadCard } from "./FileUploadCard";
import { QuestionRowEditor } from "./QuestionRowEditor";
import { createAssignment } from "../../lib/api";
import { useAssignmentFormStore } from "../../store/assignmentFormStore";
import { useUiStore } from "../../store/uiStore";
import { useJobStore } from "../../store/jobStore";
import { z } from "zod";

const createFormSchema = z.object({
  title: z.string().trim().min(1).optional(),
  dueDate: z.string().min(1, "Due date is required"),
  questionRows: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(["mcq", "short_answer", "diagram", "numerical", "long_answer", "true_false", "fill_blanks"]),
        count: z.number().int().positive(),
        marksPerQuestion: z.number().int().positive()
      })
    )
    .min(1, "At least one question type is required"),
  additionalInstructions: z.string().max(4000).optional()
});

export function CreateAssignmentClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const ui = useUiStore();
  const setJob = useJobStore((state) => state.setJob);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    title,
    dueDate,
    questionRows,
    additionalInstructions,
    fileMeta,
    totalQuestions,
    totalMarks,
    setDueDate,
    setInstructions,
    setFileMeta,
    addQuestionRow,
    updateQuestionRow,
    removeQuestionRow,
    setSubmitting
  } = useAssignmentFormStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = createFormSchema.parse({ title, dueDate, questionRows, additionalInstructions });
      const formData = new FormData();
      formData.set("title", parsed.title || "");
      formData.set("dueDate", new Date(parsed.dueDate).toISOString());
      formData.set(
        "questionBlueprint",
        JSON.stringify(
          parsed.questionRows.map((row) => ({
            type: row.type,
            count: row.count,
            marksPerQuestion: row.marksPerQuestion
          }))
        )
      );
      formData.set("additionalInstructions", parsed.additionalInstructions || "");
      formData.set("teacherName", "John Doe");
      formData.set("teacherEmail", "john.doe@vedaai.school");
      formData.set("schoolName", "Delhi Public School Sector-4, Bokaro");
      formData.set("subject", "English");
      formData.set("className", "5th");
      formData.set("durationMinutes", "45");
      formData.set("maximumMarks", String(totalMarks));
      if (selectedFile) {
        formData.set("file", selectedFile);
      }
      return createAssignment(formData);
    },
    onMutate: () => setSubmitting(true),
    onSuccess: (payload) => {
      setSubmitting(false);
      setJob({
        assignmentId: payload.assignment.id,
        jobId: payload.job.jobId,
        status: payload.job.status,
        progress: payload.job.progress,
        error: null,
        resultId: payload.job.resultId ?? null
      });
      ui.pushToast({
        title: payload.cached ? "Cached assessment reused" : "Assignment queued",
        description: payload.cached
          ? "A validated result was reused from Redis cache."
          : "Generation job started in the queue.",
        tone: "success"
      });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      router.push(`/assignments/${payload.assignment.id}`);
    },
    onError: (error: Error) => {
      setSubmitting(false);
      ui.pushToast({
        title: "Unable to create assignment",
        description: error.message,
        tone: "error"
      });
    }
  });

  const onFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setFileMeta({
        name: file.name,
        type: file.name.endsWith(".pdf") ? "pdf" : "txt",
        size: file.size
      });
    } else {
      setFileMeta(null);
    }
  };

  const validation = useMemo(() => {
    const result = createFormSchema.safeParse({
      title,
      dueDate,
      questionRows,
      additionalInstructions
    });
    return result.success ? null : result.error.flatten();
  }, [title, dueDate, questionRows, additionalInstructions]);

  return (
    <div className="mx-auto max-w-[980px] space-y-4">
      <div className="px-1">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#232323]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#6ad16a]" />
          Create Assignment
        </div>
        <p className="mt-1 text-[12px] text-[#8d8d8d]">Set up a new assignment for your students.</p>
      </div>

      <div className="h-1.5 w-full rounded-full bg-[#dbdbdb]">
        <div className="h-1.5 w-[44%] rounded-full bg-[#464646]" />
      </div>

      <Card className="rounded-[30px] px-4 py-5 sm:px-6 sm:py-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] font-semibold tracking-tight text-[#232323]">Assignment Details</h2>
            <p className="mt-1 text-[12px] text-[#8d8d8d]">Basic information about your assignment.</p>
          </div>

          <FileUploadCard fileMeta={fileMeta} onChange={onFileChange} />

          <div>
            <div className="mb-2 text-[12px] font-semibold text-[#232323]">Due Date</div>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-[#fbfbfb]" />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-[12px] font-semibold text-[#232323]">
              <span>Question Type</span>
              <div className="hidden items-center gap-4 pr-8 text-[11px] font-medium text-[#8d8d8d] md:flex">
                <span className="w-[116px] text-center">No. of Questions</span>
                <span className="w-[94px] text-center">Marks</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {questionRows.map((row) => (
                <QuestionRowEditor
                  key={row.id}
                  row={row}
                  onUpdate={(patch) => updateQuestionRow(row.id, patch)}
                  onRemove={() => removeQuestionRow(row.id)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addQuestionRow}
              className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium text-[#232323]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f1f1f] text-white">
                <Plus className="h-4 w-4" />
              </span>
              Add Question Type
            </button>
          </div>

          <div className="flex justify-end">
            <div className="text-right text-[13px] text-[#4b4b4b]">
              <div>Total Questions : {totalQuestions}</div>
              <div className="mt-1">Total Marks : {totalMarks}</div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[12px] font-semibold text-[#232323]">
              Additional Information (For better output)
            </div>
            <Textarea
              value={additionalInstructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Generate a question paper for a 3-hour exam duration."
              className="min-h-[120px] bg-[#fbfbfb]"
            />
          </div>

          {validation ? (
            <div className="rounded-[20px] border border-[#f1c4c1] bg-[#fff4f3] px-4 py-3 text-[13px] text-[#a44a42]">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4" />
                Please fix the highlighted values before generating.
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      <div className="flex items-center justify-between gap-3 pb-16 md:pb-0">
        <Button
          type="button"
          variant="surface"
          className="h-11 px-5 text-[13px] font-semibold"
          onClick={() => router.push("/assignments")}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          type="button"
          variant="dark"
          className="h-11 px-6 text-[13px] font-semibold"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !!validation}
        >
          {mutation.isPending ? "Generating..." : "Next"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
