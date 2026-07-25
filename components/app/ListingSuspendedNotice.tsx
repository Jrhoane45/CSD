"use client";

import { ShieldAlert } from "lucide-react";
import { useStore, vettingStatusFor } from "@/lib/store";

/**
 * Live suspended-state banner on a listing page. Reflects operator vetting
 * actions immediately — a suspended provider is hidden from discovery and
 * flagged here so any direct visitor sees its status.
 */
export function ListingSuspendedNotice({
  listingId,
  verified,
}: {
  listingId: string;
  verified: boolean;
}) {
  const { vetting } = useStore();
  if (vettingStatusFor({ id: listingId, verified }, vetting) !== "suspended") return null;

  return (
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red/30 bg-red/[0.06] p-5">
      <ShieldAlert size={20} className="mt-0.5 shrink-0 text-red" />
      <div>
        <p className="font-semibold text-navy">This provider is currently suspended.</p>
        <p className="text-sm text-ink/65">
          CSD has temporarily removed this program from search while a trust &amp; safety review is
          underway. Details below may be incomplete or unverified.
        </p>
      </div>
    </div>
  );
}
