"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, LogOut, ChevronDown } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";

const ROLE_LABEL: Record<string, string> = {
  parent: "Parent / Athlete",
  provider: "Provider",
  operator: "Operator",
};

/** Header account control — sign in, identity, and sign out. Demo-backed today. */
export function AccountMenu() {
  const { user, signedIn, role, ready, signOut } = useSession();
  const [open, setOpen] = useState(false);

  // Reserve space until hydrated so the header doesn't shift.
  if (!ready) return <span className="inline-block h-8 w-8" aria-hidden />;

  if (!signedIn) {
    return (
      <Link
        href="/app/login"
        className="inline-flex items-center gap-1.5 rounded-lg border border-navy/25 px-3 py-1.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
      >
        <LogIn size={15} /> Sign in
      </Link>
    );
  }

  const name = user?.name ?? "Member";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg p-1 pr-2 text-sm font-medium text-ink/70 hover:bg-cream"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[8rem] truncate sm:inline">{name}</span>
        <ChevronDown size={14} className="text-ink/40" />
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-ink/10 bg-white p-2 shadow-[var(--shadow-lift)]">
            <div className="px-3 py-2">
              <p className="truncate text-sm font-semibold text-navy">{name}</p>
              {user?.email && <p className="truncate text-xs text-ink/50">{user.email}</p>}
              <span className="mt-1.5 inline-block rounded-full bg-cream px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-ink/60">
                {ROLE_LABEL[role] ?? role}
              </span>
            </div>
            <div className="my-1 border-t border-ink/10" />
            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-cream hover:text-red"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
