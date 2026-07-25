"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowRight, ShieldCheck } from "lucide-react";
import { useStore, recordAdClick } from "@/lib/store";
import { getListing } from "@/lib/data/listings";
import { AdBadge } from "@/components/app/AdBadge";
import { LogoAvatar } from "@/components/listing/LogoAvatar";

/** On-brand in-app interstitial — served once per session for a pop-up campaign. */
export function PromoPopup() {
  const { campaigns } = useStore();
  const camp = campaigns.find(
    (c) => c.status === "active" && c.placements.includes("in-app-popup"),
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!camp) return;
    if (sessionStorage.getItem(`csd-promo-seen-${camp.id}`)) return;
    const t = setTimeout(() => setShow(true), 1400);
    return () => clearTimeout(t);
  }, [camp?.id]);

  if (!camp || !show) return null;
  const listing = getListing(camp.listingId);
  if (!listing) return null;

  const dismiss = () => {
    sessionStorage.setItem(`csd-promo-seen-${camp.id}`, "1");
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-lift)]"
        style={{ animation: "fadeUp 0.2s ease-out" }}
      >
        <div className="relative bg-gradient-to-br from-navy to-navy-deep p-5 text-white">
          <button
            onClick={dismiss}
            aria-label="Close ad"
            className="absolute right-3 top-3 rounded-lg p-1 text-cream/70 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
          <AdBadge tone="dark" />
          <p className="mt-3 display text-2xl leading-tight">{camp.headline}</p>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <LogoAvatar listing={listing} size="md" />
            <div className="min-w-0">
              <p className="truncate font-bold text-navy">{listing.name}</p>
              <p className="truncate text-xs text-ink/55">{listing.city}, {listing.county} Co.</p>
            </div>
          </div>
          <Link
            href={`/app/listing/${listing.id}`}
            onClick={() => {
              recordAdClick(camp.id);
              dismiss();
            }}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-red px-5 py-3 text-sm font-semibold text-white hover:bg-red-600"
          >
            {camp.cta} <ArrowRight size={15} />
          </Link>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.65rem] text-ink/45">
            <ShieldCheck size={12} className="text-gold" /> You&apos;re seeing this because it&apos;s from a
            CSD-vetted provider.
          </p>
        </div>
      </div>
    </div>
  );
}
