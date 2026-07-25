"use client";

import { useState } from "react";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { useOperatorUnlocked, unlockOperator, OPERATOR_PASSCODE } from "@/lib/useOperatorAuth";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Passcode gate wrapping every /app/operator page. */
export function OperatorGate({ children }: { children: React.ReactNode }) {
  const unlocked = useOperatorUnlocked();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockOperator(code)) {
      setError(false);
      setCode("");
    } else {
      setError(true);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-white">
        <ShieldCheck size={30} className="text-gold" />
      </div>
      <Eyebrow className="mt-6">CSD operator · internal</Eyebrow>
      <h1 className="mt-3 display text-3xl text-navy">RESTRICTED AREA</h1>
      <p className="mt-2 text-sm text-ink/60">
        The operator console governs platform trust &amp; safety. Enter the operator passcode to
        continue.
      </p>

      <form onSubmit={submit} className="mt-6 w-full">
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="password"
            autoFocus
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Operator passcode"
            className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-navy ${
              error ? "border-red" : "border-ink/15"
            }`}
          />
        </div>
        {error && <p className="mt-2 text-sm font-medium text-red">Incorrect passcode. Try again.</p>}
        <button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Unlock console <ArrowRight size={15} />
        </button>
      </form>

      <p className="mt-6 rounded-lg bg-cream px-4 py-2 text-xs text-ink/55">
        Demo passcode: <span className="font-mono font-semibold text-navy">{OPERATOR_PASSCODE}</span>
      </p>
    </div>
  );
}
