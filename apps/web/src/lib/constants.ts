export const QUESTION_TYPE_OPTIONS = [
  { value: "mcq", label: "Multiple Choice Questions" },
  { value: "short_answer", label: "Short Questions" },
  { value: "diagram", label: "Diagram/Graph-Based Questions" },
  { value: "numerical", label: "Numerical Problems" },
  { value: "long_answer", label: "Long Answer" },
  { value: "true_false", label: "True/False" },
  { value: "fill_blanks", label: "Fill in the Blanks" }
] as const;

export const QUESTION_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  QUESTION_TYPE_OPTIONS.map((item) => [item.value, item.label])
) as Record<string, string>;

export const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-orange-200 bg-orange-50 text-orange-700",
  hard: "border-rose-200 bg-rose-50 text-rose-700"
};

export const STATUS_STYLES: Record<string, string> = {
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  queued: "border-amber-200 bg-amber-50 text-amber-700",
  generating: "border-orange-200 bg-orange-50 text-orange-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700"
};

export type ShellNavKey =
  | "home"
  | "groups"
  | "assignments"
  | "toolkit"
  | "library"
  | "settings";

export type ShellNavItem = {
  key: ShellNavKey;
  label: string;
  href: string;
};

export const SHELL_NAV_ITEMS: ShellNavItem[] = [
  { key: "home", label: "Home", href: "/home" },
  { key: "groups", label: "My Groups", href: "/my-groups" },
  { key: "assignments", label: "Assignments", href: "/assignments" },
  { key: "toolkit", label: "AI Teacher's Toolkit", href: "/toolkit" },
  { key: "library", label: "My Library", href: "/library" }
];

export const SHELL_FOOTER_ITEMS: ShellNavItem[] = [
  { key: "settings", label: "Settings", href: "/settings" }
];

export const MOBILE_NAV_ITEMS: ShellNavItem[] = [
  { key: "home", label: "Home", href: "/home" },
  { key: "groups", label: "Groups", href: "/my-groups" },
  { key: "assignments", label: "Assignments", href: "/assignments" },
  { key: "library", label: "Library", href: "/library" },
  { key: "toolkit", label: "AI Toolkit", href: "/toolkit" }
];
