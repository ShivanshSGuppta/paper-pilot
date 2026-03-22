"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-[24px] border border-[#dfdfdf] bg-white px-4 py-3 text-sm text-[#232323] outline-none transition placeholder:text-[#b2b2b2] focus:border-[#ff9a68] focus:ring-2 focus:ring-[#ffd2bd]",
        className
      )}
      {...props}
    />
  );
});
