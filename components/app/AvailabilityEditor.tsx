"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarClock, CalendarOff, Clock, Plus, X, Check, Eye } from "lucide-react";
import {
  useStore,
  toggleAvailabilityTime,
  setAvailabilityDay,
  toggleBlockedDate,
  takenSlotIds,
} from "@/lib/store";
import { formatEventDate } from "@/lib/store";
import {
  ALL_TIMES,
  WEEKDAYS,
  effectiveOpenSlots,
  groupSlotsByDate,
} from "@/lib/scheduling";
import { Eyebrow } from "@/components/ui/Eyebrow";

const LISTING_ID = "hoop-prodigy";
const WEEKDAY_DEFAULT = ["4:30 PM", "5:30 PM", "6:30 PM"];

export function AvailabilityEditor() {
  const { availability, bookings } = useStore();
  const avail = availability[LISTING_ID] ?? { weekly: {}, blockedDates: [] };
  const [newDate, setNewDate] = useState("");

  const weeklyTotal = useMemo(
    () => Object.values(avail.weekly).reduce((s, t) => s + (t?.length ?? 0), 0),
    [avail.weekly],
  );

  const preview = useMemo(() => {
    const taken = takenSlotIds(bookings, LISTING_ID);
    return groupSlotsByDate(effectiveOpenSlots(LISTING_ID, availability, taken)).slice(0, 5);
  }, [availability, bookings]);

  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/app/provider"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-navy"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock size={20} className="text-navy" />
            <Eyebrow>Availability</Eyebrow>
          </div>
          <h1 className="display mt-2 text-4xl text-navy">SET YOUR HOURS</h1>
          <p className="mt-1 text-ink/60">
            Choose the times families can book each week. Changes apply to your booking page instantly.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/[0.06] px-3 py-1.5 text-sm font-semibold text-navy">
          <Clock size={15} /> {weeklyTotal} weekly slots
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* weekly grid */}
        <div className="space-y-3">
          {WEEKDAYS.map((d) => {
            const times = avail.weekly[d.idx] ?? [];
            return (
              <div key={d.idx} className="rounded-2xl border border-ink/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-navy">{d.label}</h3>
                    <span className="text-xs text-ink/45">
                      {times.length ? `${times.length} open` : "Closed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <button
                      onClick={() => setAvailabilityDay(LISTING_ID, d.idx, WEEKDAY_DEFAULT)}
                      className="text-ink/50 hover:text-navy"
                    >
                      Default
                    </button>
                    {times.length > 0 && (
                      <button
                        onClick={() => setAvailabilityDay(LISTING_ID, d.idx, [])}
                        className="text-ink/50 hover:text-red"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ALL_TIMES.map((t) => {
                    const on = times.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleAvailabilityTime(LISTING_ID, d.idx, t)}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          on
                            ? "border-navy bg-navy text-white"
                            : "border-ink/15 text-ink/55 hover:border-navy/40 hover:text-navy"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* sidebar: blocked dates + preview */}
        <aside className="space-y-6">
          {/* blocked dates */}
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="flex items-center gap-2">
              <CalendarOff size={18} className="text-navy" />
              <h3 className="font-semibold text-navy">Block dates</h3>
            </div>
            <p className="mt-1 text-xs text-ink/55">Holidays, travel, or one-off closures.</p>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="date"
                value={newDate}
                min={todayISO}
                onChange={(e) => setNewDate(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-ink/15 px-2.5 py-1.5 text-sm outline-none focus:border-navy"
              />
              <button
                onClick={() => {
                  if (newDate) {
                    if (!avail.blockedDates.includes(newDate)) toggleBlockedDate(LISTING_ID, newDate);
                    setNewDate("");
                  }
                }}
                disabled={!newDate}
                className="inline-flex items-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
              >
                <Plus size={14} /> Block
              </button>
            </div>
            {avail.blockedDates.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {avail.blockedDates.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleBlockedDate(LISTING_ID, d)}
                    className="inline-flex items-center gap-1 rounded-full bg-red/10 px-2.5 py-1 text-xs font-semibold text-red hover:bg-red/20"
                  >
                    {formatEventDate(d)} <X size={12} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-ink/45">No blocked dates.</p>
            )}
          </div>

          {/* preview */}
          <div className="rounded-2xl border border-gold/40 bg-gold/[0.06] p-5">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-navy" />
              <h3 className="font-semibold text-navy">What families see</h3>
            </div>
            <p className="mt-1 text-xs text-ink/55">Your next open slots, live.</p>
            <div className="mt-3 space-y-2.5">
              {preview.length === 0 ? (
                <p className="rounded-lg border border-dashed border-ink/20 p-3 text-center text-xs text-ink/50">
                  No open slots — add some times.
                </p>
              ) : (
                preview.map((day) => (
                  <div key={day.date}>
                    <p className="text-xs font-semibold text-navy">{day.label}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {day.times.map((t) => (
                        <span
                          key={t.id}
                          className="rounded border border-ink/15 bg-white px-2 py-0.5 text-[0.7rem] text-ink/70"
                        >
                          {t.time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link
              href="/app/listing/hoop-prodigy"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-red hover:underline"
            >
              View booking page →
            </Link>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-ink/45">
            <Check size={13} className="text-navy/50" /> Changes save automatically.
          </p>
        </aside>
      </div>
    </div>
  );
}
