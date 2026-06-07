"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, X, ArrowRight } from "lucide-react";
import type { Category, County, Listing } from "@/lib/types";
import { computeCsdScore, averageRating } from "@/lib/scoring";
import { CATEGORY_LABEL } from "@/lib/data/listings";
import { CsdScoreBadge } from "@/components/ui/CsdScoreBadge";
import { StarRating } from "@/components/ui/StarRating";
import { LogoAvatar } from "@/components/listing/LogoAvatar";
import { OverridableText } from "@/components/app/OverridableText";

// Rough relative positions (percent) for a stylized SoCal layout.
const CENTROID: Record<County, { x: number; y: number }> = {
  Ventura: { x: 14, y: 26 },
  "Los Angeles": { x: 31, y: 45 },
  "San Bernardino": { x: 67, y: 27 },
  Riverside: { x: 64, y: 53 },
  Orange: { x: 44, y: 61 },
  "San Diego": { x: 57, y: 86 },
};

const PIN_COLOR: Record<Category, string> = {
  club: "#14264f",
  trainer: "#f5a800",
  consultant: "#c8102e",
};

// Deterministic jitter so a county's pins fan out instead of stacking.
function offset(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  const a = ((h % 1000) / 1000) * 2 - 1;
  const b = (((h >> 5) % 1000) / 1000) * 2 - 1;
  return { dx: a * 8, dy: b * 7 };
}

export function MapView({ listings }: { listings: Listing[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = listings.find((l) => l.id === selectedId) ?? null;

  return (
    <div>
      <div
        className="relative h-[460px] w-full overflow-hidden rounded-3xl border border-ink/10 sm:h-[560px]"
        style={{ background: "linear-gradient(160deg,#eef3f6 0%,#f2ede0 55%,#e7eef2 100%)" }}
        onClick={() => setSelectedId(null)}
      >
        {/* stylized coastline accent */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 bottom-[-30%] h-[70%] w-[60%] rotate-[18deg] rounded-[50%] bg-[#dbe7ee]/70" />
          <span className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-wider text-[#8aa0ad]">
            Pacific Ocean
          </span>
        </div>

        {/* county labels */}
        {(Object.keys(CENTROID) as County[]).map((c) => (
          <span
            key={c}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[0.65rem] font-semibold uppercase tracking-wider text-ink/30"
            style={{ left: `${CENTROID[c].x}%`, top: `${CENTROID[c].y - 11}%` }}
          >
            {c}
          </span>
        ))}

        {/* pins */}
        {listings.map((l) => {
          const c = CENTROID[l.county];
          const { dx, dy } = offset(l.id);
          const active = l.id === selectedId;
          const score = computeCsdScore(l).score;
          return (
            <button
              key={l.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(l.id);
              }}
              aria-label={l.name}
              className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:z-20 hover:scale-125"
              style={{ left: `${c.x + dx}%`, top: `${c.y + dy}%`, zIndex: active ? 30 : 10 }}
            >
              <MapPin
                size={active ? 30 : 22}
                fill={PIN_COLOR[l.category]}
                strokeWidth={active ? 2 : 1.5}
                className={active ? "text-white drop-shadow" : "text-white/80"}
                style={{ color: score >= 80 ? "#fff" : undefined }}
              />
            </button>
          );
        })}

        {/* legend */}
        <div className="absolute right-3 top-3 rounded-xl border border-ink/10 bg-white/90 p-3 text-xs backdrop-blur">
          <p className="mb-1.5 font-semibold text-navy">{listings.length} programs</p>
          {(["club", "trainer", "consultant"] as Category[]).map((c) => (
            <p key={c} className="flex items-center gap-1.5 text-ink/65">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIN_COLOR[c] }} />
              {CATEGORY_LABEL[c].split(" ")[0]}
            </p>
          ))}
        </div>

        {/* selected card */}
        {selected && (
          <div
            className="absolute bottom-4 left-1/2 w-[min(92%,380px)] -translate-x-1/2 rounded-2xl border border-ink/10 bg-white p-4 shadow-[var(--shadow-lift)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedId(null)}
              aria-label="Close"
              className="absolute right-3 top-3 text-ink/40 hover:text-navy"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3 pr-6">
              <LogoAvatar listing={selected} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="eyebrow text-red">{CATEGORY_LABEL[selected.category]}</p>
                <OverridableText
                  as="p"
                  listingId={selected.id}
                  field="name"
                  fallback={selected.name}
                  className="truncate font-bold text-navy"
                />
                <p className="flex items-center gap-1 text-xs text-ink/55">
                  <MapPin size={12} /> {selected.city}, {selected.county} Co.
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StarRating value={averageRating(selected)} count={selected.reviews.length} />
                  <CsdScoreBadge score={computeCsdScore(selected).score} size="sm" />
                </div>
              </div>
            </div>
            <Link
              href={`/app/listing/${selected.id}`}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              View profile <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-ink/45">
        Tap a pin for details. Positions are approximate (stylized SoCal layout).
      </p>
    </div>
  );
}
