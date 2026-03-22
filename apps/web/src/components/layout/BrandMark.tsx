"use client";

import { cn } from "../../lib/cn";

export function BrandMark({
  className,
  compact = false
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-[linear-gradient(180deg,#ffb46b_0%,#c2451e_100%)] text-white shadow-[0_8px_18px_rgba(194,69,30,0.32)]",
          compact ? "h-8 w-8 text-sm" : "h-10 w-10 text-base"
        )}
      >
        <div className="absolute inset-[2px] rounded-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(255,255,255,0.04))]" />
        <span className="relative font-extrabold tracking-[-0.08em]">V</span>
      </div>
      <div className="min-w-0">
        <div className={cn("font-semibold tracking-tight text-[#232323]", compact ? "text-[1rem]" : "text-[1.05rem]")}>
          VedaAI
        </div>
      </div>
    </div>
  );
}
