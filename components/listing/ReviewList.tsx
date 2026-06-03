import type { Review } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <div className="space-y-5">
      {reviews.map((r, i) => (
        <div key={i} className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/[0.08] text-sm font-bold text-navy">
                {r.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">{r.author}</p>
                <p className="text-xs text-ink/45">{r.date}</p>
              </div>
            </div>
            <StarRating value={r.rating} />
          </div>

          <h4 className="mt-4 font-semibold text-navy">{r.title}</h4>
          <p className="mt-1 text-sm text-ink/70">{r.body}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {r.dimensions.map((d) => (
              <span
                key={d.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs"
              >
                <span className="text-ink/60">{d.label}</span>
                <span className="font-semibold text-navy">{d.value.toFixed(1)}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
