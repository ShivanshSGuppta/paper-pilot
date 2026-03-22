import { format, parseISO } from "date-fns";

export function formatDate(value: string | Date | undefined | null) {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd MMM yyyy");
}

export function formatLongDate(value: string | Date | undefined | null) {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd MMM yyyy, hh:mm a");
}
