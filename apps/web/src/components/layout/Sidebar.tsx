"use client";

import Link from "next/link";
import {
  Grid2X2,
  UsersRound,
  FileText,
  Sparkles,
  Clock3,
  Settings,
  Plus,
  X
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  SHELL_FOOTER_ITEMS,
  SHELL_NAV_ITEMS,
  ShellNavKey
} from "../../lib/constants";
import { cn } from "../../lib/cn";
import { useUiStore } from "../../store/uiStore";
import { BrandMark } from "./BrandMark";

const iconMap = {
  home: Grid2X2,
  groups: UsersRound,
  assignments: FileText,
  toolkit: Sparkles,
  library: Clock3,
  settings: Settings
} as const;

function SidebarLink({
  label,
  itemKey,
  active,
  href,
  onNavigate
}: {
  label: string;
  itemKey: ShellNavKey;
  active: boolean;
  href: string;
  onNavigate?: () => void;
}) {
  const Icon = iconMap[itemKey];

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-[13px] transition",
        active
          ? "bg-[#f4f4f5] font-semibold text-[#18181b]"
          : "text-[#71717a] hover:bg-[#f8f8f8] hover:text-[#18181b]"
      )}
      {...(onNavigate ? { onClick: onNavigate } : {})}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
      {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ff7d45]" /> : null}
    </Link>
  );
}

function matchesNav(currentNav: ShellNavKey, pathname: string, itemKey: ShellNavKey) {
  if (currentNav === itemKey) return true;
  if (itemKey === "toolkit" && (pathname.startsWith("/result/") || pathname.startsWith("/assignments/"))) {
    return currentNav === "toolkit";
  }
  return false;
}

function SidebarPanel({
  currentNav,
  mobile = false,
  onNavigate
}: {
  currentNav: ShellNavKey;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-white",
        mobile ? "w-[290px] rounded-[28px] border border-[#ececec] p-4 shadow-[0_24px_48px_rgba(15,23,42,0.12)]" : "p-5"
      )}
    >
      <BrandMark compact />

      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          router.push("/create");
        }}
        className="dark-pill-ring mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-[#252525] text-[14px] font-semibold text-white"
      >
        <Plus className="h-4 w-4" />
        Create Assignment
      </button>

      <div className="mt-8 space-y-1.5">
        {SHELL_NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.key}
            itemKey={item.key}
            label={item.label}
            href={item.href}
            active={matchesNav(currentNav, pathname, item.key)}
            {...(onNavigate ? { onNavigate } : {})}
          />
        ))}
      </div>

      <div className="mt-auto space-y-3 pt-6">
        {SHELL_FOOTER_ITEMS.map((item) => (
          <SidebarLink
            key={item.key}
            itemKey={item.key}
            label={item.label}
            href={item.href}
            active={matchesNav(currentNav, pathname, item.key)}
            {...(onNavigate ? { onNavigate } : {})}
          />
        ))}

        <div className="rounded-[18px] bg-[#f6f6f7] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#ffe9de] text-xl">
              🧑‍🏫
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-[#18181b]">Delhi Public School</div>
              <div className="truncate text-[11px] text-[#71717a]">Bokaro Steel City</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ currentNav }: { currentNav: ShellNavKey }) {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <>
      <aside className="no-print hidden w-[260px] shrink-0 lg:block">
        <div className="sidebar-card sticky top-0 h-screen">
          <SidebarPanel currentNav={currentNav} />
        </div>
      </aside>

      {sidebarOpen ? (
        <div className="no-print fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] lg:hidden">
          <div className="flex h-full max-w-[320px] flex-col p-3">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#232323]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarPanel currentNav={currentNav} mobile onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
