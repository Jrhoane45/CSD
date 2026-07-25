"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Check, X, Clock, DollarSign, SlidersHorizontal } from "lucide-react";
import type { Listing } from "@/lib/types";
import { useStore, cancelBooking, completeBooking } from "@/lib/store";
import { formatMoney, bookingStatusTone } from "@/lib/scheduling";
import { formatEventDate } from "@/lib/store";

export function ProviderSchedule({ listing }: { listing: Pick<Listing, "id" | "name"> }) {
  const { bookings } = useStore();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const mine = useMemo(
    () =>
      bookings
        .filter((b) => b.listingId === listing.id)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [bookings, listing.id],
  );

  const upcoming = mine.filter((b) => b.status === "upcoming");
  const past = mine.filter((b) => b.status !== "upcoming");
  const list = tab === "upcoming" ? upcoming : past;

  const revenue = mine
    .filter((b) => b.status !== "canceled")
    .reduce((s, b) => s + b.price, 0);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarClock size={18} className="text-navy" />
            <h3 className="font-semibold text-navy">Session schedule</h3>
          </div>
          <Link
            href="/app/provider/availability"
            className="inline-flex items-center gap-1 rounded-lg border border-ink/15 px-2.5 py-1 text-xs font-semibold text-navy hover:bg-navy hover:text-white"
          >
            <SlidersHorizontal size={12} /> Availability
          </Link>
        </div>
        <div className="flex rounded-lg bg-cream p-1 text-xs font-semibold">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 capitalize transition-colors ${
                tab === t ? "bg-navy text-white" : "text-ink/55 hover:text-navy"
              }`}
            >
              {t} {t === "upcoming" ? `(${upcoming.length})` : `(${past.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-ink/60">
          <Clock size={14} className="text-navy" /> {upcoming.length} upcoming
        </span>
        <span className="inline-flex items-center gap-1.5 text-ink/60">
          <DollarSign size={14} className="text-navy" /> {formatMoney(revenue)} booked value
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {list.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink/15 p-4 text-center text-sm text-ink/45">
            No {tab} sessions.
          </p>
        ) : (
          list.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 p-3.5"
            >
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-navy">
                  {b.sessionTypeName}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold capitalize ${bookingStatusTone(
                      b.status,
                    )}`}
                  >
                    {b.status}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-ink/55">
                  {b.parentName} · {b.athlete}
                </p>
                <p className="mt-0.5 text-xs text-ink/50">
                  {formatEventDate(b.date)} · {b.time} · {b.durationMin} min · {formatMoney(b.price)}
                  {b.fit !== undefined && (
                    <span className="ml-1.5 rounded-full bg-gold/20 px-1.5 py-0.5 font-bold text-ink">
                      {b.fit}% fit
                    </span>
                  )}
                </p>
              </div>
              {b.status === "upcoming" && (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => completeBooking(b.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-deep"
                  >
                    <Check size={13} /> Complete
                  </button>
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/55 hover:text-red"
                  >
                    <X size={13} /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
