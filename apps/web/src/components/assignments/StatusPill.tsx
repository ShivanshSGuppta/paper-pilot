import { Badge } from "../ui/badge";
import { STATUS_STYLES } from "../../lib/constants";
import { cn } from "../../lib/cn";

export function StatusPill({ status }: { status: string }) {
  return <Badge className={cn("capitalize", STATUS_STYLES[status] || "bg-slate-100 text-slate-700 border-slate-200")}>{status}</Badge>;
}
