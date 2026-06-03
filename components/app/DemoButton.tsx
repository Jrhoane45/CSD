"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "red" | "gold" | "primary" | "outline";

const STYLES: Record<Variant, string> = {
  red: "bg-red text-white hover:bg-red-600",
  gold: "bg-gold text-ink hover:bg-gold-300",
  primary: "bg-navy text-white hover:bg-navy-deep",
  outline: "border border-navy/30 text-navy hover:bg-navy hover:text-white",
};

/** A button that simulates an action (booking, contact, boost) without a backend. */
export function DemoButton({
  children,
  done = "Done — this is a demo",
  variant = "red",
  className = "",
}: {
  children: ReactNode;
  done?: string;
  variant?: Variant;
  className?: string;
}) {
  const [clicked, setClicked] = useState(false);

  return (
    <button
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 2200);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
        clicked ? "bg-navy text-white" : STYLES[variant]
      } ${className}`}
    >
      {clicked ? (
        <>
          <Check size={16} /> {done}
        </>
      ) : (
        children
      )}
    </button>
  );
}
