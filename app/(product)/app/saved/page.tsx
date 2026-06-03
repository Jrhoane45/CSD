"use client";

import Link from "next/link";
import { Bookmark, Target, Compass } from "lucide-react";
import { useSaved } from "@/lib/useSaved";
import { LISTINGS } from "@/lib/data/listings";
import { ListingCard } from "@/components/listing/ListingCard";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function SavedPage() {
  const { ids, ready } = useSaved();
  const saved = LISTINGS.filter((l) => ids.includes(l.id));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Eyebrow>Your shortlist</Eyebrow>
      <h1 className="display mt-3 text-4xl text-navy">SAVED PROGRAMS</h1>
      <p className="mt-2 text-ink/60">
        Everything you&apos;ve saved, in one place — compare and come back any time.
      </p>

      {!ready ? null : saved.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-ink/20 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream">
            <Bookmark size={24} className="text-ink/40" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-navy">Nothing saved yet</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-ink/55">
            Find programs you like and tap Save — they&apos;ll show up here for easy comparison.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/app/match"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              <Target size={16} /> Find your match
            </Link>
            <Link
              href="/app/discover"
              className="inline-flex items-center gap-2 rounded-lg border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
            >
              <Compass size={16} /> Browse the directory
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-ink/55">
            <span className="font-semibold text-navy">{saved.length}</span> saved
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
