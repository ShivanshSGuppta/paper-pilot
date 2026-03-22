"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/cn";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-full border border-[#dfdfdf] bg-white px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#ff9a68] focus:ring-2 focus:ring-[#ffd2bd]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
