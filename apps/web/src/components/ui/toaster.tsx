"use client";

import { useEffect } from "react";
import { cn } from "../../lib/cn";
import { useUiStore } from "../../store/uiStore";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismissToast } = useUiStore();

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismissToast(toast.id), 3500)
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, dismissToast]);

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(100vw-2rem,380px)] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-3xl border bg-white p-4 shadow-soft",
            toast.tone === "success" && "border-emerald-200",
            toast.tone === "error" && "border-rose-200"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">{toast.title}</div>
              {toast.description ? <div className="mt-1 text-sm text-slate-600">{toast.description}</div> : null}
            </div>
            <button onClick={() => dismissToast(toast.id)} className="rounded-full p-1 text-slate-500 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
