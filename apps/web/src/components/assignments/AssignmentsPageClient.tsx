"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AssignmentCard } from "./AssignmentCard";
import { AssignmentEmptyState } from "./AssignmentEmptyState";
import { AssignmentFilters } from "./AssignmentFilters";
import { Card } from "../ui/card";
import { deleteAssignment, listAssignments } from "../../lib/api";
import { useUiStore } from "../../store/uiStore";

export function AssignmentsPageClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();
  const pushToast = useUiStore((state) => state.pushToast);

  const query = useQuery({
    queryKey: ["assignments", search, status],
    queryFn: () => listAssignments(search, status),
    refetchInterval: 5000
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAssignment(id),
    onSuccess: () => {
      pushToast({ title: "Assignment deleted", tone: "success" });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    }
  });

  const assignments = query.data?.assignments ?? [];

  return (
    <div className="space-y-4">
      <div className="px-1">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#232323]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#6ad16a]" />
          Assignments
        </div>
        <p className="mt-1 text-[12px] text-[#8d8d8d]">
          Manage and create assignments for your classes.
        </p>
      </div>

      <AssignmentFilters
        search={search}
        status={status}
        onSearch={setSearch}
        onStatus={setStatus}
        onReset={() => {
          setSearch("");
          setStatus("");
        }}
      />

      {query.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-[126px] animate-pulse bg-[#f8f8f8]" />
          ))}
        </div>
      ) : query.isError ? (
        <Card className="rounded-[24px] border-[#f1c4c1] bg-[#fff4f3] p-6 text-[13px] text-[#a44a42]">
          <div className="font-semibold text-[#7f2d25]">Failed to load assignments</div>
          <div className="mt-2">The list could not be fetched from the API. Check the backend and retry.</div>
        </Card>
      ) : assignments.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={{
                id: assignment.id,
                title: assignment.title,
                dueDate: assignment.dueDate,
                createdAt: String(assignment.createdAt),
                status: assignment.status,
                totalQuestions: assignment.totalQuestions,
                totalMarks: assignment.totalMarks
              }}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <AssignmentEmptyState />
      )}

      <Link
        href="/create"
        className="no-print dark-pill-ring fixed bottom-6 left-1/2 z-30 hidden h-12 -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-[#1f1f1f] px-6 text-[13px] font-semibold text-white md:inline-flex"
      >
        <Plus className="h-4 w-4" />
        Create Assignment
      </Link>

      <Link
        href="/create"
        className="no-print fixed bottom-24 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#ff7d45] shadow-[0_14px_25px_rgba(0,0,0,0.14)] md:hidden"
      >
        <Plus className="h-5 w-5" />
      </Link>
    </div>
  );
}
