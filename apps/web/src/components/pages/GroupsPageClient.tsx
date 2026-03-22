"use client";

import { BookCopy, UsersRound } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export function GroupsPageClient() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] p-6 lg:p-8">
        <h2 className="text-[28px] font-semibold tracking-tight text-[#18181b]">Class groups</h2>
        <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#71717a]">
          Keep class sections, subjects, and assignment load visible while backend group management catches up.
        </p>
      </Card>

      <Card className="rounded-[24px] border-dashed border-[#e4e4e7] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f4f4f5] text-[#18181b]">
          <UsersRound className="h-6 w-6" />
        </div>
        <div className="mt-4 text-[18px] font-semibold text-[#18181b]">No class groups yet</div>
        <div className="mt-2 text-[13px] text-[#71717a]">
          Group management will appear here once you start creating classes for students.
        </div>
        <Button variant="surface" className="mt-5">
          <BookCopy className="h-4 w-4" />
          Create first group
        </Button>
      </Card>
    </div>
  );
}
