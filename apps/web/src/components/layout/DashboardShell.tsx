import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { TopBar } from "./TopBar";
import { ShellNavKey } from "../../lib/constants";

export function DashboardShell({
  currentNav,
  title,
  subtitle,
  showBack = false,
  children
}: {
  currentNav: ShellNavKey;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="shell-page min-h-screen lg:flex">
      <Sidebar currentNav={currentNav} />
      <div className="min-w-0 flex-1">
        <TopBar
          currentNav={currentNav}
          title={title}
          showBack={showBack}
          {...(subtitle !== undefined ? { subtitle } : {})}
        />
        <main className="min-w-0 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6">
          {children}
        </main>
      </div>
      <MobileBottomNav currentNav={currentNav} />
    </div>
  );
}
