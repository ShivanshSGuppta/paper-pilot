import { Badge } from "../ui/badge";
import { DIFFICULTY_STYLES } from "../../lib/constants";
import { cn } from "../../lib/cn";

export function DifficultyBadge({ value }: { value: string }) {
  return <Badge className={cn("capitalize", DIFFICULTY_STYLES[value] || "bg-slate-100 text-slate-700 border-slate-200")}>{value}</Badge>;
}
