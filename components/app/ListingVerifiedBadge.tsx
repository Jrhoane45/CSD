"use client";

import { BadgeCheck, Sparkles, ShieldAlert } from "lucide-react";
import { useStore, vettingStatusFor } from "@/lib/store";

/**
 * The verification chip in the listing header, driven by live operator vetting
 * rather than the static seed flag — so a suspended provider never shows
 * "Verified", and reinstating one flips it back immediately.
 */
export function ListingVerifiedBadge({
  listingId,
  verified,
}: {
  listingId: string;
  verified: boolean;
}) {
  const { vetting } = useStore();
  const status = vettingStatusFor({ id: listingId, verified }, vetting);

  if (status === "suspended") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red">
        <ShieldAlert size={13} /> Suspended
      </span>
    );
  }
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy">
        <BadgeCheck size={14} /> Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold">
      <Sparkles size={13} /> Unclaimed
    </span>
  );
}
