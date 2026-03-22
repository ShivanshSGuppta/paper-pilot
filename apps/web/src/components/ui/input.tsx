"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/cn";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-full border border-[#dfdfdf] bg-white px-4 py-3 text-sm text-[#232323] outline-none transition placeholder:text-[#b2b2b2] focus:border-[#ff9a68] focus:ring-2 focus:ring-[#ffd2bd]",
        className
      )}
      {...props}
    />
  );
});
