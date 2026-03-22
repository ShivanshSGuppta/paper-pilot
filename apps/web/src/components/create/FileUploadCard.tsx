"use client";

import { FileText, UploadCloud, X } from "lucide-react";
import { Button } from "../ui/button";
import { FileMeta } from "../../store/assignmentFormStore";

export function FileUploadCard({
  fileMeta,
  onChange
}: {
  fileMeta: FileMeta | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#d7d7d7] bg-[#fbfbfb] px-4 py-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#232323] shadow-[0_6px_16px_rgba(0,0,0,0.05)]">
        <UploadCloud className="h-5 w-5" />
      </div>
      <div className="mt-4 text-[14px] font-medium text-[#232323]">
        Choose a file or drag & drop it here
      </div>
      <div className="mt-1 text-[11px] text-[#a0a0a0]">PDF, TXT up to 10MB</div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#232323] shadow-[0_8px_16px_rgba(0,0,0,0.06)]">
          Browse Files
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              onChange(file);
            }}
          />
        </label>

        {fileMeta ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <X className="h-4 w-4" />
            Remove
          </Button>
        ) : null}
      </div>

      <div className="mt-4 text-[11px] text-[#9f9f9f]">
        Upload your preferred document to guide the generated question paper.
      </div>

      {fileMeta ? (
        <div className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full bg-[#fff2ea] px-3 py-2 text-[12px] font-medium text-[#cb5e2f]">
          <FileText className="h-4 w-4 shrink-0" />
          <span className="truncate">{fileMeta.name}</span>
        </div>
      ) : null}
    </div>
  );
}
