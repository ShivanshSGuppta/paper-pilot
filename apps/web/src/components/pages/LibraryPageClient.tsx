"use client";

import { BookOpenText, FileStack, Search } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export function LibraryPageClient() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight text-[#18181b]">Teaching library</h2>
            <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#71717a]">
              Keep reusable source material, rubric references, and question bank assets within reach while the backend library workflow catches up.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#ececec] bg-white px-4 py-2 text-[13px] text-[#71717a]">
            <Search className="h-4 w-4" />
            Search resources
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[24px] border-dashed border-[#e4e4e7] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#fff1e8] text-[#cb5e2f]">
            <BookOpenText className="h-6 w-6" />
          </div>
          <div className="mt-4 text-[18px] font-semibold text-[#18181b]">No resources yet</div>
          <div className="mt-2 text-[13px] text-[#71717a]">
            Uploaded packs and reusable references will appear here once storage workflows are enabled.
          </div>
          <Button variant="surface" className="mt-5">
            <FileStack className="h-4 w-4" />
            Upload first resource
          </Button>
        </Card>

        <Card className="rounded-[24px] p-5 lg:p-6">
          <div className="text-[18px] font-semibold text-[#18181b]">Suggested workflow</div>
          <div className="mt-2 text-[13px] leading-6 text-[#71717a]">
            Upload a chapter extract in Create Assignment, add rubric notes in Additional Information, then reopen the generated paper from AI Teacher&apos;s Toolkit for export or refinement.
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-[18px] bg-[#f8f8f8] p-4">
              <div className="text-[12px] font-medium text-[#71717a]">Reference packs</div>
              <div className="mt-1 text-[24px] font-semibold text-[#18181b]">0</div>
            </div>
            <div className="rounded-[18px] bg-[#f8f8f8] p-4">
              <div className="text-[12px] font-medium text-[#71717a]">Best for</div>
              <div className="mt-1 text-[15px] font-semibold text-[#18181b]">Faster structured prompt building</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
