import { BadgeCheck } from "lucide-react";

/**
 * The label on every paid placement. Signals to families that the ad is from a
 * CSD-vetted, verified provider — not an outside advertiser.
 */
export function AdBadge({ tone = "light" }: { tone?: "light" | "dark" }) {
  const cls =
    tone === "dark"
      ? "bg-white/15 text-cream"
      : "bg-navy/[0.07] text-navy/80";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${cls}`}
    >
      Promoted
      <span className="opacity-50">·</span>
      <BadgeCheck size={11} className="text-gold" /> Vetted provider
    </span>
  );
}
