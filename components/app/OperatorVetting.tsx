"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Ban, RotateCcw, MapPin } from "lucide-react";
import type { Listing, VettingStatus } from "@/lib/types";
import { LISTINGS } from "@/lib/data/listings";
import { useStore, setVetting, vettingStatusFor } from "@/lib/store";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LogoAvatar } from "@/components/listing/LogoAvatar";

type Filter = "pending" | "verified" | "suspended" | "all";
const FILTERS: Filter[] = ["pending", "verified", "suspended", "all"];

const STATUS_BADGE: Record<VettingStatus, string> = {
  verified: "bg-navy text-white",
  pending: "bg-gold/30 text-ink",
  suspended: "bg-red/15 text-red",
};

const CLAIM_LABEL: Record<Listing["claimState"], string> = {
  unclaimed: "Unclaimed",
  "claimed-free": "Claimed · Free",
  "claimed-paid": "Claimed · Premium",
};

export function OperatorVetting() {
  const { vetting } = useStore();
  const [filter, setFilter] = useState<Filter>("pending");

  const withStatus = useMemo(
    () => LISTINGS.map((l) => ({ listing: l, status: vettingStatusFor(l, vetting) })),
    [vetting],
  );

  const counts = useMemo(() => {
    const c = { pending: 0, verified: 0, suspended: 0, all: LISTINGS.length };
    for (const { status } of withStatus) c[status]++;
    return c;
  }, [withStatus]);

  const rows = withStatus.filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Eyebrow>CSD operator</Eyebrow>
      <h1 className="mt-3 display text-4xl text-navy">PROVIDER VETTING</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/60">
        Approve new providers, verify credentials, and suspend programs that fail trust &amp; safety
        checks. Only verified providers appear to families.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition-colors ${
              filter === f ? "bg-navy text-white" : "bg-cream text-ink/60 hover:text-navy"
            }`}
          >
            {f} <span className="opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink/15 p-6 text-center text-sm text-ink/45">
            Nothing here. Queue clear.
          </p>
        ) : (
          rows.map(({ listing, status }) => (
            <div key={listing.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4">
              <LogoAvatar listing={listing} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-navy">{listing.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase ${STATUS_BADGE[status]}`}>
                    {status}
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/55">
                  <MapPin size={11} /> {listing.city}, {listing.county} Co. · {listing.sports.join(", ")} ·{" "}
                  {CLAIM_LABEL[listing.claimState]}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {status !== "verified" && (
                  <button
                    onClick={() => setVetting(listing.id, "verified")}
                    className="inline-flex items-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-deep"
                  >
                    {status === "suspended" ? <RotateCcw size={13} /> : <BadgeCheck size={13} />}
                    {status === "suspended" ? "Reinstate" : "Verify"}
                  </button>
                )}
                {status !== "suspended" && (
                  <button
                    onClick={() => setVetting(listing.id, "suspended")}
                    className="inline-flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/60 hover:border-red/40 hover:text-red"
                  >
                    <Ban size={13} /> Suspend
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
