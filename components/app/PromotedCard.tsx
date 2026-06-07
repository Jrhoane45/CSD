"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore, recordAdClick } from "@/lib/store";
import { getListing } from "@/lib/data/listings";
import { AdBadge } from "@/components/app/AdBadge";
import { LogoAvatar } from "@/components/listing/LogoAvatar";

/** Native sponsored card shown at the top of Discover results. */
export function PromotedCard() {
  const { campaigns } = useStore();
  const camp = campaigns.find(
    (c) => c.status === "active" && c.placements.includes("discover-spotlight"),
  );
  const listing = camp ? getListing(camp.listingId) : undefined;
  if (!camp || !listing) return null;

  return (
    <Link
      href={`/app/listing/${listing.id}`}
      onClick={() => recordAdClick(camp.id)}
      className="mb-6 block rounded-2xl border border-gold/50 bg-gradient-to-br from-gold/[0.1] to-white p-5 transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-center justify-between">
        <AdBadge />
        <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-ink/40">Sponsored</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <LogoAvatar listing={listing} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-navy">{camp.headline}</p>
          <p className="truncate text-sm text-ink/55">
            {listing.name} · {listing.city}, {listing.county} Co.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">
          {camp.cta} <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}
