"use client";

import { useEffect, useState } from "react";
import { Info, X, RotateCcw } from "lucide-react";
import { resetDemo } from "@/lib/store";

export function DemoBanner() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem("csd-demo-banner") === "dismissed");
  }, []);

  if (hidden) return null;

  return (
    <div className="relative z-50 bg-ink text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs">
        <Info size={14} className="shrink-0 text-gold" />
        <p>
          <span className="font-semibold text-gold">Interactive demo</span> — sample data for
          illustration. Not a live product, no real bookings or payments.
        </p>
        <button
          onClick={() => {
            if (confirm("Reset the demo? This clears your profile, messages, reviews, and saved items.")) {
              resetDemo();
            }
          }}
          className="ml-1 inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold text-cream/80 hover:bg-white/10 hover:text-gold"
        >
          <RotateCcw size={12} /> Reset
        </button>
        <button
          aria-label="Dismiss demo notice"
          onClick={() => {
            localStorage.setItem("csd-demo-banner", "dismissed");
            setHidden(true);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
