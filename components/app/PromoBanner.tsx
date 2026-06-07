"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore, recordAdClick } from "@/lib/store";
import { getListing } from "@/lib/data/listings";
import { AdBadge } from "@/components/app/AdBadge";
import { LogoAvatar } from "@/components/listing/LogoAvatar";

/** Slim in-app banner ad (events board). */
export function PromoBanner() {
  const { campaigns } = useStore();
  const camp = campaigns.find(
    (c) =>
      c.status === "active" &&
      (c.placements.includes("in-app-banner") || c.placements.includes("events-featured")),
  );
  const listing = camp ? getListing(camp.listingId) : undefined;
  if (!camp || !listing) return null;

  return (
    <Link
      href={`/app/listing/${listing.id}`}
      onClick={() => recordAdClick(camp.id)}
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-navy/20 bg-navy p-4 text-white transition-opacity hover:opacity-95"
    >
      <LogoAvatar listing={listing} size="sm" />
      <div className="min-w-0 flex-1">
        <AdBadge tone="dark" />
        <p className="mt-1 truncate font-bold">{camp.headline}</p>
        <p className="truncate text-xs text-cream/70">{listing.name} · {listing.city}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink">
        {camp.cta} <ArrowRight size={15} />
      </span>
    </Link>
  );
}
