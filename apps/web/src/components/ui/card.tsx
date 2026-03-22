import { cn } from "../../lib/cn";

export function Card({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("shell-card rounded-[26px]", className)}>{children}</div>;
}
