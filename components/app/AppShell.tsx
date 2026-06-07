"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  Compass,
  Target,
  Bookmark,
  LayoutDashboard,
  BarChart3,
  ArrowUpRight,
  UserRound,
  ScanLine,
  Inbox,
  CalendarDays,
  GraduationCap,
  Megaphone,
  ShieldCheck,
  BadgeCheck,
  Flag,
  DollarSign,
} from "lucide-react";
import { CsdBadge } from "@/components/brand/CsdBadge";
import { NotificationBell } from "@/components/app/NotificationBell";
import { useRole, setRole } from "@/lib/useRole";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const NAV: Record<Role, { href: string; label: string; icon: typeof Compass; badge?: "inbox" }[]> = {
  parent: [
    { href: "/app/profile", label: "Profile", icon: UserRound },
    { href: "/app/match", label: "Find a match", icon: Target },
    { href: "/app/prospect-iq", label: "Prospect IQ", icon: ScanLine },
    { href: "/app/discover", label: "Discover", icon: Compass },
    { href: "/app/recruiting", label: "Recruiting", icon: GraduationCap },
    { href: "/app/events", label: "Events", icon: CalendarDays },
    { href: "/app/inbox", label: "Inbox", icon: Inbox, badge: "inbox" },
    { href: "/app/saved", label: "Saved", icon: Bookmark },
  ],
  provider: [
    { href: "/app/provider", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/inbox", label: "Leads", icon: Inbox, badge: "inbox" },
    { href: "/app/promote", label: "Promote", icon: Megaphone },
    { href: "/app/provider/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/app/events", label: "Events", icon: CalendarDays },
    { href: "/app/prospect-iq", label: "Prospect IQ", icon: ScanLine },
  ],
  operator: [
    { href: "/app/operator", label: "Console", icon: ShieldCheck },
    { href: "/app/operator/providers", label: "Vetting", icon: BadgeCheck },
    { href: "/app/operator/moderation", label: "Moderation", icon: Flag },
    { href: "/app/operator/promotions", label: "Ad revenue", icon: DollarSign },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = useRole();
  const { threads } = useStore();

  const unread = useMemo(
    () => threads.filter((t) => t.unreadFor === role && (role === "provider" || !t.seeded)).length,
    [threads, role],
  );

  useEffect(() => {
    // Keep the toggle in sync with where the user actually is.
    if (pathname.startsWith("/app/operator")) setRole("operator");
    else if (pathname.startsWith("/app/provider")) setRole("provider");
  }, [pathname]);

  const links = NAV[role];

  return (
    <div className="flex min-h-screen flex-col bg-cream/40">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/app" aria-label="App home" className="flex items-center gap-2">
              <CsdBadge className="h-9 w-9" />
              <span className="display hidden text-lg text-navy sm:block">CSD</span>
            </Link>

            {/* Role toggle */}
            <div className="ml-2 flex rounded-lg bg-cream p-1 text-sm">
              {(["parent", "provider", "operator"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-md px-2.5 py-1.5 font-semibold capitalize transition-colors sm:px-3 ${
                    role === r ? "bg-navy text-white" : "text-ink/55 hover:text-navy"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              const showBadge = l.badge === "inbox" && unread > 0;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-navy/[0.07] text-navy" : "text-ink/60 hover:bg-cream hover:text-navy"
                  }`}
                >
                  <l.icon size={16} /> {l.label}
                  {showBadge && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[0.6rem] font-bold text-white">
                      {unread}
                    </span>
                  )}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-[11px] h-[3px] rounded-full bg-red" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <NotificationBell />
            <Link
              href="/"
              className="ml-1 hidden items-center gap-1 text-sm font-medium text-ink/55 hover:text-navy sm:inline-flex"
            >
              Exit <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* mobile / tablet nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-ink/10 px-4 py-2 lg:hidden">
          {links.map((l) => {
            const active = pathname === l.href;
            const showBadge = l.badge === "inbox" && unread > 0;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                  active ? "bg-navy/[0.07] text-navy" : "text-ink/60"
                }`}
              >
                <l.icon size={15} /> {l.label}
                {showBadge && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[0.6rem] font-bold text-white">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
