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

// Approximate lat/lng for the SoCal cities in the dataset — projected onto the
// stylized map so pins land in roughly the right place relative to each other.
const BOUNDS = { latMin: 32.5, latMax: 34.7, lngMin: -119.5, lngMax: -116.7 };
const CITY_LATLNG: Record<string, [number, number]> = {
  Ventura: [34.27, -119.29],
  Oxnard: [34.2, -119.18],
  "Thousand Oaks": [34.17, -118.84],
  "Santa Monica": [34.02, -118.49],
  "Culver City": [34.02, -118.39],
  "West Hollywood": [34.09, -118.36],
  "El Segundo": [33.92, -118.42],
  Torrance: [33.84, -118.34],
  Carson: [33.83, -118.28],
  "Long Beach": [33.77, -118.19],
  Burbank: [34.18, -118.31],
  Pasadena: [34.15, -118.14],
  Anaheim: [33.84, -117.91],
  Fullerton: [33.87, -117.92],
  "Costa Mesa": [33.64, -117.92],
  Irvine: [33.68, -117.83],
  "Mission Viejo": [33.6, -117.67],
  "San Diego": [32.72, -117.16],
  Riverside: [33.95, -117.4],
  Corona: [33.88, -117.57],
  "San Bernardino": [34.11, -117.29],
  "Rancho Cucamonga": [34.11, -117.59],
  Ontario: [34.06, -117.65],
  Victorville: [34.54, -117.29],
  Hesperia: [34.43, -117.3],
};

function project(lat: number, lng: number) {
  const x = 8 + ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * 84;
  const y = 8 + ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * 84;
  return { x, y };
}

// Deterministic jitter so co-located pins fan out instead of stacking.
function offset(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  const a = ((h % 1000) / 1000) * 2 - 1;
  const b = (((h >> 5) % 1000) / 1000) * 2 - 1;
  return { dx: a, dy: b };
}

function position(city: string, county: County, id: string) {
  const { dx, dy } = offset(id);
  const ll = CITY_LATLNG[city];
  if (ll) {
    const p = project(ll[0], ll[1]);
    return { x: p.x + dx * 2.6, y: p.y + dy * 2.4 };
  }
  const c = CENTROID[county];
  return { x: c.x + dx * 8, y: c.y + dy * 7 };
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
          const pos = position(l.city, l.county, l.id);
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
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: active ? 30 : 10 }}
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
