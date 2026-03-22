"use client";

import { Funnel, Search, RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";

export function AssignmentFilters({
  search,
  status,
  onSearch,
  onStatus,
  onReset
}: {
  search: string;
  status: string;
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="shell-card flex flex-col gap-3 rounded-[22px] px-3 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-[#f6f6f6] px-3 py-2 text-[12px] font-medium text-[#7d7d7d]">
          <Funnel className="h-3.5 w-3.5" />
          <span>Filter By</span>
        </div>
        <div className="min-w-[170px]">
          <Select value={status} onChange={(e) => onStatus(e.target.value)} className="bg-[#fbfbfb] text-[13px]">
            <option value="">All statuses</option>
            <option value="queued">Queued</option>
            <option value="generating">Generating</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 md:w-[360px]">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b3b3b3]" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search Assignment"
            className="bg-[#fbfbfb] pl-10"
          />
        </div>
        {(search || status) ? (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-11 w-11 p-0">
            <RotateCcw className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
