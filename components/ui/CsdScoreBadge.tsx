import { scoreTier } from "@/lib/scoring";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { box: string; num: string; label: string }> = {
  sm: { box: "h-12 w-12", num: "text-lg", label: "text-[0.5rem]" },
  md: { box: "h-16 w-16", num: "text-2xl", label: "text-[0.55rem]" },
  lg: { box: "h-24 w-24", num: "text-4xl", label: "text-[0.6rem]" },
};

export function CsdScoreBadge({
  score,
  size = "md",
  showTier = false,
}: {
  score: number;
  size?: Size;
  showTier?: boolean;
}) {
  const s = SIZES[size];
  const tier = scoreTier(score);
  const ring =
    tier.tone === "gold"
      ? "border-gold bg-gold/10"
      : tier.tone === "navy"
        ? "border-navy bg-navy/[0.06]"
        : "border-ink/25 bg-ink/[0.03]";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex flex-col items-center justify-center rounded-full border-2 ${ring} ${s.box}`}
        title={`CSD Score ${score}/100 — ${tier.label}`}
      >
        <span className={`display ${s.num} text-navy leading-none`}>{score}</span>
        <span className={`eyebrow ${s.label} text-ink/50 leading-none mt-0.5`}>CSD</span>
      </div>
      {showTier && (
        <div className="leading-tight">
          <p className="eyebrow text-ink/40 text-[0.55rem]">CSD Score™</p>
          <p className="text-sm font-semibold text-navy">{tier.label}</p>
        </div>
      )}
    </div>
  );
}
