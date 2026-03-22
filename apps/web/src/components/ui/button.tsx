"use client";

import { cloneElement, forwardRef, isValidElement, type ReactElement } from "react";
import { cn } from "../../lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark" | "surface";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", asChild = false, children, ...props },
  ref
) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-[#ff7d45] text-white shadow-[0_10px_18px_rgba(255,125,69,0.25)] hover:bg-[#f36d33]",
    variant === "secondary" && "border border-[#e8e8e8] bg-[#f6f6f6] text-[#2a2a2a] hover:bg-[#efefef]",
    variant === "ghost" && "bg-transparent text-[#555] hover:bg-[#efefef]",
    variant === "dark" && "bg-[#242424] text-white hover:bg-[#111]",
    variant === "surface" && "border border-[#e8e8e8] bg-white text-[#2a2a2a] hover:bg-[#fafafa]",
    size === "sm" && "px-3.5 py-2 text-[13px]",
    size === "md" && "px-4.5 py-2.5 text-sm",
    size === "lg" && "px-6 py-3 text-base",
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(styles, child.props.className)
    });
  }

  return (
    <button
      ref={ref}
      className={styles}
      {...props}
    >
      {children}
    </button>
  );
});
