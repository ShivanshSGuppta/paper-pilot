"use client";

import Link from "next/link";
import { Grid2X2, UsersRound, FileText, Clock3, Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";
import { MOBILE_NAV_ITEMS, ShellNavKey } from "../../lib/constants";

const iconMap = {
  home: Grid2X2,
  groups: UsersRound,
  assignments: FileText,
  library: Clock3,
  toolkit: Sparkles
} as const;

export function MobileBottomNav({ currentNav }: { currentNav: ShellNavKey }) {
  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e7eb] bg-white/96 px-2 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.key as keyof typeof iconMap];
          const active = item.key === currentNav;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-[14px] px-2 py-2 text-[10px] transition",
                active ? "bg-[#f5f5f5] text-[#18181b]" : "text-[#71717a]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
