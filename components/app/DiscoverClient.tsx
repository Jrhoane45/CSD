"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, GitCompareArrows, Check, BookmarkPlus, Bell, LayoutGrid, Map } from "lucide-react";
import type { Category, SavedSearch } from "@/lib/types";
import { computeCsdScore, averageRating } from "@/lib/scoring";
import {
  LISTINGS,
  SPORTS_LIST,
  COUNTIES_LIST,
  LEVELS_LIST,
  CATEGORY_PLURAL,
} from "@/lib/data/listings";
import { ListingCard } from "@/components/listing/ListingCard";
import { CompareBar } from "@/components/app/CompareBar";
import { MapView } from "@/components/app/MapView";
import { useStore, addSavedSearch, removeSavedSearch } from "@/lib/store";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Sort = "score" | "rating" | "name";

const SCORED = LISTINGS.map((l) => ({
  listing: l,
  score: computeCsdScore(l).score,
  rating: averageRating(l),
}));

export function DiscoverClient({ initialCategory }: { initialCategory?: Category }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">(initialCategory ?? "all");
  const [sport, setSport] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [county, setCounty] = useState<string>("all");
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<Sort>("score");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleCompare = (id: string) =>
    setCompareIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= 3 ? ids : [...ids, id],
    );
  const compareListings = LISTINGS.filter((l) => compareIds.includes(l.id));

  const { savedSearches } = useStore();

  const searchName = () => {
    const parts = [
      sport !== "all" ? sport : null,
      level !== "all" ? level : null,
      county !== "all" ? `${county} Co.` : null,
      category !== "all" ? CATEGORY_PLURAL[category as Category].split(" ")[0] : null,
      minScore > 0 ? `${minScore}+ CSD` : null,
      query ? `"${query}"` : null,
    ].filter(Boolean);
    return parts.length ? parts.join(" · ") : "All programs";
  };

  const saveCurrent = () =>
    addSavedSearch({ name: searchName(), query, category, sport, level, county, minScore, sort });

  const applySearch = (s: SavedSearch) => {
    setQuery(s.query);
    setCategory(s.category as Category | "all");
    setSport(s.sport);
    setLevel(s.level);
    setCounty(s.county);
    setMinScore(s.minScore);
    setSort(s.sort as Sort);
  };

  const results = useMemo(() => {
    return SCORED.filter(({ listing, score }) => {
      if (category !== "all" && listing.category !== category) return false;
      if (sport !== "all" && !listing.sports.includes(sport as never)) return false;
      if (level !== "all" && !listing.levels.includes(level as never)) return false;
      if (county !== "all" && listing.county !== county) return false;
      if (score < minScore) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !listing.name.toLowerCase().includes(q) &&
          !listing.city.toLowerCase().includes(q) &&
          !listing.specialties.join(" ").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    }).sort((a, b) => {
      if (sort === "score") return b.score - a.score;
      if (sort === "rating") return b.rating - a.rating;
      return a.listing.name.localeCompare(b.listing.name);
    });
  }, [query, category, sport, level, county, minScore, sort]);

  const reset = () => {
    setQuery("");
    setCategory("all");
    setSport("all");
    setLevel("all");
    setCounty("all");
    setMinScore(0);
  };

  const Filters = (
    <div className="space-y-5">
      <Select label="Category" value={category} onChange={(v) => setCategory(v as Category | "all")}>
        <option value="all">All categories</option>
        <option value="club">{CATEGORY_PLURAL.club}</option>
        <option value="trainer">{CATEGORY_PLURAL.trainer}</option>
        <option value="consultant">{CATEGORY_PLURAL.consultant}</option>
      </Select>
      <Select label="Sport" value={sport} onChange={setSport}>
        <option value="all">All sports</option>
        {SPORTS_LIST.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
      <Select label="Development level" value={level} onChange={setLevel}>
        <option value="all">All levels</option>
        {LEVELS_LIST.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </Select>
      <Select label="County" value={county} onChange={setCounty}>
        <option value="all">All counties</option>
        {COUNTIES_LIST.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
      <div>
        <label className="eyebrow text-ink/50">Minimum CSD Score · {minScore}</label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="mt-2 w-full accent-navy"
        />
      </div>
      <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-medium text-red">
        <X size={14} /> Reset filters
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Eyebrow>Discovery</Eyebrow>
      <h1 className="display mt-3 text-4xl text-navy">FIND A PROGRAM</h1>

      {/* search + sort bar */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, or specialty…"
            className="w-full rounded-xl border border-ink/15 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-navy"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-navy"
        >
          <option value="score">Sort: CSD Score</option>
          <option value="rating">Sort: Rating</option>
          <option value="name">Sort: Name</option>
        </select>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm font-medium text-navy lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
        <button
          onClick={saveCurrent}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/30 bg-white px-4 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <BookmarkPlus size={16} /> Save search
        </button>
        <div className="flex rounded-xl border border-ink/15 bg-white p-1">
          {([
            { v: "list", icon: LayoutGrid, label: "List" },
            { v: "map", icon: Map, label: "Map" },
          ] as const).map((o) => (
            <button
              key={o.v}
              onClick={() => setView(o.v)}
              aria-label={o.label}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                view === o.v ? "bg-navy text-white" : "text-ink/55 hover:text-navy"
              }`}
            >
              <o.icon size={16} /> <span className="hidden sm:inline">{o.label}</span>
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* saved searches */}
      {savedSearches.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/55">
            <Bell size={13} /> Saved &amp; alerting:
          </span>
          {savedSearches.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-navy"
            >
              <button onClick={() => applySearch(s)} className="hover:underline">
                {s.name}
              </button>
              <button
                onClick={() => removeSavedSearch(s.id)}
                aria-label={`Remove saved search ${s.name}`}
                className="text-ink/40 hover:text-red"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* sidebar filters (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-ink/10 bg-white p-6">{Filters}</div>
        </aside>

        {/* mobile filters */}
        {showFilters && (
          <div className="rounded-2xl border border-ink/10 bg-white p-6 lg:hidden">{Filters}</div>
        )}

        <div>
          <p className="mb-4 text-sm text-ink/55">
            <span className="font-semibold text-navy">{results.length}</span> results
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/20 p-12 text-center text-ink/50">
              No programs match those filters. Try widening your search.
            </div>
          ) : view === "map" ? (
            <div className={compareIds.length ? "pb-24" : undefined}>
              <MapView listings={results.map((r) => r.listing)} />
            </div>
          ) : (
            <div className="grid gap-6 pb-20 sm:grid-cols-2 xl:grid-cols-3">
              {results.map(({ listing }) => {
                const selected = compareIds.includes(listing.id);
                const disabled = !selected && compareIds.length >= 3;
                return (
                  <div key={listing.id} className="flex flex-col gap-2">
                    <ListingCard listing={listing} />
                    <button
                      onClick={() => toggleCompare(listing.id)}
                      disabled={disabled}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                        selected
                          ? "border-navy bg-navy text-white"
                          : "border-ink/15 text-ink/60 hover:border-navy/40 hover:text-navy"
                      }`}
                    >
                      {selected ? (
                        <>
                          <Check size={13} /> Comparing
                        </>
                      ) : (
                        <>
                          <GitCompareArrows size={13} /> Compare
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CompareBar
        listings={compareListings}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="eyebrow text-ink/50">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy"
      >
        {children}
      </select>
    </div>
  );
}
