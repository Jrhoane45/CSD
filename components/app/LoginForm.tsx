"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRound, Building2, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import type { Role } from "@/lib/types";
import { useSession } from "@/lib/auth/useSession";
import { Eyebrow } from "@/components/ui/Eyebrow";

type SignupRole = Extract<Role, "parent" | "provider">;

const ROLES: { value: SignupRole; label: string; sub: string; icon: typeof UserRound; home: string }[] = [
  {
    value: "parent",
    label: "Parent / Athlete",
    sub: "Find and compare programs, get matched, book sessions.",
    icon: UserRound,
    home: "/app",
  },
  {
    value: "provider",
    label: "Provider",
    sub: "Manage your listing, leads, events, and promotions.",
    icon: Building2,
    home: "/app/provider",
  },
];

export function LoginForm() {
  const router = useRouter();
  const { signIn, setRole, mode } = useSession();

  const [role, setRoleChoice] = useState<SignupRole>("parent");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await signIn({ email: email.trim() || `demo@${role}.csd`, name: name.trim() || undefined });
      if (mode === "supabase") {
        // Real backend: a magic link was emailed; the session lands on return.
        setSent(true);
        return;
      }
      setRole(role);
      router.push(ROLES.find((r) => r.value === role)?.home ?? "/app");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
          <Mail size={26} />
        </div>
        <h1 className="mt-4 display text-2xl text-navy">CHECK YOUR EMAIL</h1>
        <p className="mt-1 text-sm text-ink/60">
          We sent a magic sign-in link to <span className="font-semibold text-navy">{email}</span>.
          Open it on this device to finish signing in.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <Eyebrow>Welcome to Club Sports Direct</Eyebrow>
      <h1 className="mt-3 display text-3xl text-navy">SIGN IN</h1>
      <p className="mt-1 text-sm text-ink/60">
        Choose how you&apos;ll use CSD. This is a demo sign-in — no password required.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div>
          <p className="eyebrow text-ink/50">I&apos;m a…</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {ROLES.map((r) => {
              const on = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRoleChoice(r.value)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    on ? "border-navy bg-navy/[0.05]" : "border-ink/15 hover:border-navy/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                    <r.icon size={15} /> {r.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink/55">{r.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="eyebrow text-ink/50">Display name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jordan Rivera"
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
        </label>

        <label className="block">
          <span className="eyebrow text-ink/50">Email</span>
          <div className="relative mt-1.5">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-ink/15 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-navy"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Continue"} <ArrowRight size={15} />
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between text-xs text-ink/50">
        <Link href="/app" className="font-medium hover:text-navy">
          Continue as guest
        </Link>
        <span className="inline-flex items-center gap-1">
          <ShieldCheck size={12} className="text-gold" /> Demo — no real account
        </span>
      </div>
    </div>
  );
}
