"use client";

import { Bell, ChevronDown, ChevronLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { Button } from "../ui/button";
import { ShellNavKey } from "../../lib/constants";
import { useUiStore } from "../../store/uiStore";

export function TopBar({
  currentNav: _currentNav,
  title,
  subtitle,
  showBack = false
}: {
  currentNav: ShellNavKey;
  title: string;
  subtitle?: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <>
      <header className="no-print sticky top-0 z-30 hidden h-[84px] items-center justify-between border-b border-[#e7e7e7] bg-[#f3f4f6]/95 px-8 backdrop-blur lg:flex">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#232323] shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : null}
            <div>
              <h1 className="text-[20px] font-semibold tracking-tight text-[#18181b]">{title}</h1>
              {subtitle ? <p className="mt-1 text-[13px] text-[#737373]">{subtitle}</p> : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2b2b2b] shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
          >
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#ff7d45]" />
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe9de] text-[12px] font-semibold text-[#232323]">
              JD
            </div>
            <span className="text-[13px] font-medium text-[#232323]">John Doe</span>
            <ChevronDown className="h-4 w-4 text-[#8d8d8d]" />
          </div>
        </div>
      </header>

      <header className="no-print sticky top-0 z-30 border-b border-[#e7e7e7] bg-[#f3f4f6]/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <BrandMark compact />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2b2b2b]"
            >
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff7d45]" />
              <Bell className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffe9de] text-[12px] font-semibold text-[#232323]"
            >
              JD
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 rounded-full bg-white p-0 shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 pb-3">
          {showBack ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#232323]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-[#18181b]">{title}</div>
            {subtitle ? <div className="truncate text-[12px] text-[#737373]">{subtitle}</div> : null}
          </div>
        </div>
      </header>
    </>
  );
}
