import Link from "next/link";
import { MapPin, BadgeCheck, Sparkles } from "lucide-react";
import type { Listing } from "@/lib/types";
import { computeCsdScore, averageRating } from "@/lib/scoring";
import { CATEGORY_LABEL } from "@/lib/data/listings";
import { CsdScoreBadge } from "@/components/ui/CsdScoreBadge";
import { StarRating } from "@/components/ui/StarRating";

const LEVEL_TONE: Record<string, string> = {
  Recreational: "bg-cream text-ink/70",
  Intermediate: "bg-navy/10 text-navy",
  Competitive: "bg-gold/20 text-ink",
  Elite: "bg-red/10 text-red",
};

export function ListingCard({ listing }: { listing: Listing }) {
  const { score } = computeCsdScore(listing);
  const rating = averageRating(listing);

  return (
    <Link
      href={`/app/listing/${listing.id}`}
      className="group flex flex-col rounded-2xl border border-ink/10 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-red">{CATEGORY_LABEL[listing.category]}</p>
          <h3 className="mt-1.5 text-lg font-bold leading-tight text-navy group-hover:text-navy-deep">
            {listing.name}
          </h3>
        </div>
        <CsdScoreBadge score={score} size="sm" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/60">
        <span className="font-medium text-ink/80">{listing.sports.join(" · ")}</span>
        <span className="inline-flex items-center gap-1">
          <MapPin size={13} /> {listing.city}, {listing.county} Co.
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {listing.levels.map((l) => (
          <span key={l} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_TONE[l]}`}>
            {l}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3.5">
        <StarRating value={rating} count={listing.reviews.length} />
        <span className="text-xs font-medium text-ink/60">{listing.priceLabel}</span>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs">
        {listing.verified ? (
          <span className="inline-flex items-center gap-1 font-medium text-navy">
            <BadgeCheck size={14} className="text-navy" /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-medium text-gold">
            <Sparkles size={14} /> Auto-profile · unclaimed
          </span>
        )}
        {listing.claimState === "claimed-paid" && (
          <span className="rounded-full bg-gold/20 px-2 py-0.5 font-semibold text-ink">Featured</span>
        )}
      </div>
    </Link>
  );
}
