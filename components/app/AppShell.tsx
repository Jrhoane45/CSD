"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Compass, Target, Bookmark, LayoutDashboard, BarChart3, ArrowUpRight, UserRound, ScanLine } from "lucide-react";
import { CsdBadge } from "@/components/brand/CsdBadge";

type Role = "parent" | "provider";

const NAV: Record<Role, { href: string; label: string; icon: typeof Compass }[]> = {
  parent: [
    { href: "/app/profile", label: "Profile", icon: UserRound },
    { href: "/app/match", label: "Find a match", icon: Target },
    { href: "/app/prospect-iq", label: "Prospect IQ", icon: ScanLine },
    { href: "/app/discover", label: "Discover", icon: Compass },
    { href: "/app/saved", label: "Saved", icon: Bookmark },
  ],
  provider: [
    { href: "/app/provider", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/provider/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/app/prospect-iq", label: "Prospect IQ", icon: ScanLine },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>("parent");

  useEffect(() => {
    const saved = localStorage.getItem("csd-role") as Role | null;
    if (saved) setRole(saved);
  }, []);

  useEffect(() => {
    // Keep the toggle in sync with where the user actually is.
    if (pathname.startsWith("/app/provider")) setRole("provider");
  }, [pathname]);

  const choose = (r: Role) => {
    setRole(r);
    localStorage.setItem("csd-role", r);
  };

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
              {(["parent", "provider"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => choose(r)}
                  className={`rounded-md px-3 py-1.5 font-semibold capitalize transition-colors ${
                    role === r ? "bg-navy text-white" : "text-ink/55 hover:text-navy"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-navy/[0.07] text-navy" : "text-ink/60 hover:bg-cream hover:text-navy"
                  }`}
                >
                  <l.icon size={16} /> {l.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-ink/55 hover:text-navy"
          >
            Exit to site <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-ink/10 px-4 py-2 md:hidden">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                  active ? "bg-navy/[0.07] text-navy" : "text-ink/60"
                }`}
              >
                <l.icon size={15} /> {l.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
