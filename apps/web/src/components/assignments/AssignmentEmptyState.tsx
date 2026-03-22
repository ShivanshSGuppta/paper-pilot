import Link from "next/link";
import { Plus } from "lucide-react";
import { AssignmentsEmptyIllustration } from "./AssignmentsEmptyIllustration";

export function AssignmentEmptyState() {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[28px] px-4 text-center">
      <AssignmentsEmptyIllustration className="w-full max-w-[320px]" />
      <h3 className="mt-5 text-[28px] font-semibold tracking-tight text-[#232323]">No assignments yet</h3>
      <p className="mt-3 max-w-[430px] text-[13px] leading-6 text-[#8b8b8b]">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      <Link
        href="/create"
        className="dark-pill-ring mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1f1f1f] px-5 text-[13px] font-semibold text-white"
      >
        <Plus className="h-4 w-4" />
        Create Your First Assignment
      </Link>
    </div>
  );
}
