import type { ScorePart } from "@/lib/scoring";

export function ScoreBreakdown({ parts }: { parts: ScorePart[] }) {
  return (
    <div className="space-y-3">
      {parts.map((p) => (
        <div key={p.label}>
          <div className="flex justify-between text-sm">
            <span className="text-ink/70">{p.label}</span>
            <span className="font-semibold text-navy">
              {p.points}
              <span className="text-ink/40">/{p.max}</span>
            </span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-cream">
            <div
              className="h-2 rounded-full bg-navy"
              style={{ width: `${Math.round((p.points / p.max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
