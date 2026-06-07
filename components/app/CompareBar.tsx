"use client";

import { useState } from "react";
import Link from "next/link";
import { X, GitCompareArrows, ArrowRight } from "lucide-react";
import type { Listing } from "@/lib/types";
import { computeCsdScore, averageRating } from "@/lib/scoring";
import { CATEGORY_LABEL } from "@/lib/data/listings";
import { CsdScoreBadge } from "@/components/ui/CsdScoreBadge";
import { StarRating } from "@/components/ui/StarRating";
import { LogoAvatar } from "@/components/listing/LogoAvatar";
import { OverridableText } from "@/components/app/OverridableText";
import { Modal } from "@/components/ui/Modal";

export function CompareBar({
  listings,
  onRemove,
  onClear,
}: {
  listings: Listing[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (listings.length === 0) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
            <GitCompareArrows size={16} /> Compare
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {listings.map((l) => (
              <span
                key={l.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs font-medium text-navy"
              >
                {l.name}
                <button onClick={() => onRemove(l.id)} aria-label={`Remove ${l.name}`} className="text-ink/40 hover:text-red">
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
          <button onClick={onClear} className="text-xs font-medium text-ink/50 hover:text-navy">
            Clear
          </button>
          <button
            onClick={() => setOpen(true)}
            disabled={listings.length < 2}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
          >
            Compare {listings.length} <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Compare programs" maxWidth="max-w-4xl">
        <CompareTable listings={listings} />
      </Modal>
    </>
  );
}

function CompareTable({ listings }: { listings: Listing[] }) {
  const rows: { label: string; render: (l: Listing) => React.ReactNode }[] = [
    {
      label: "CSD Score™",
      render: (l) => <CsdScoreBadge score={computeCsdScore(l).score} size="sm" />,
    },
    { label: "Rating", render: (l) => <StarRating value={averageRating(l)} count={l.reviews.length} /> },
    { label: "Category", render: (l) => CATEGORY_LABEL[l.category] },
    { label: "Levels", render: (l) => l.levels.join(", ") },
    { label: "Location", render: (l) => `${l.city}, ${l.county} Co.` },
    { label: "Price", render: (l) => l.priceLabel },
    { label: "Experience", render: (l) => `${l.yearsInOperation} yrs` },
    {
      label: "Alumni (D1 / total)",
      render: (l) => {
        const total = l.alumni.pro + l.alumni.d1 + l.alumni.d2 + l.alumni.d3;
        return `${l.alumni.d1} / ${total}`;
      },
    },
    { label: "Status", render: (l) => (l.verified ? "Verified" : "Unclaimed") },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-32" />
            {listings.map((l) => (
              <th key={l.id} className="p-3 text-left align-bottom">
                <div className="flex flex-col items-start gap-2">
                  <LogoAvatar listing={l} size="sm" />
                  <Link href={`/app/listing/${l.id}`} className="font-bold text-navy hover:underline">
                    <OverridableText as="span" listingId={l.id} field="name" fallback={l.name} />
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-ink/10">
              <td className="p-3 align-top text-xs font-semibold uppercase tracking-wide text-ink/45">
                {r.label}
              </td>
              {listings.map((l) => (
                <td key={l.id} className="p-3 align-top text-ink/80">
                  {r.render(l)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
