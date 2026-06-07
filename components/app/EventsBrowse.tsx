"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Clock,
  Megaphone,
  Check,
  Plus,
  Ticket,
  Users,
} from "lucide-react";
import type { PlatformEvent, Sport } from "@/lib/types";
import { SPORTS_LIST } from "@/lib/data/listings";
import { useStore, toggleRsvp, formatEventDate } from "@/lib/store";
import { useRole } from "@/lib/useRole";
import { useProfile } from "@/lib/useProfile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EventFormModal } from "@/components/app/EventForm";
import { PromoBanner } from "@/components/app/PromoBanner";

const TYPES = ["All", "Tournament", "Showcase", "Camp", "Clinic", "Tryout", "Open House"] as const;

const BOOST_LABEL: Record<PlatformEvent["boost"], string | null> = {
  none: null,
  basic: "Promoted",
  standard: "Featured",
  premium: "Featured",
};

export function EventsBrowse() {
  const { events } = useStore();
  const role = useRole();
  const { profile } = useProfile();
  const [sport, setSport] = useState<Sport | "All">("All");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [mineOnly, setMineOnly] = useState(false);
  const [creating, setCreating] = useState(false);

  const athleteName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "An athlete";

  const list = useMemo(
    () =>
      events
        .filter((e) => sport === "All" || e.sport === sport)
        .filter((e) => type === "All" || e.type === type)
        .filter((e) => !mineOnly || e.registered)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [events, sport, type, mineOnly],
  );

  const registeredCount = events.filter((e) => e.registered).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Events board</Eyebrow>
          <h1 className="display mt-2 text-3xl text-navy sm:text-4xl">TRYOUTS, CAMPS &amp; SHOWCASES</h1>
          <p className="mt-1 text-sm text-ink/60">
            Upcoming events across Southern California — register in a tap.
          </p>
        </div>
        {role === "provider" && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <Plus size={16} /> Create event
          </button>
        )}
      </div>

      <div className="mt-5">
        <PromoBanner />
      </div>

      {/* filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value as Sport | "All")}
          className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-navy"
        >
          <option value="All">All sports</option>
          {SPORTS_LIST.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                type === t ? "border-navy bg-navy text-white" : "border-ink/15 text-ink/65 hover:border-navy/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setMineOnly((v) => !v)}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            mineOnly ? "border-gold bg-gold/20 text-ink" : "border-ink/15 text-ink/65 hover:border-navy/40"
          }`}
        >
          <Ticket size={13} /> Registered ({registeredCount})
        </button>
      </div>

      <p className="mt-4 text-sm text-ink/50">{list.length} {list.length === 1 ? "event" : "events"}</p>

      {list.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-ink/20 p-12 text-center text-sm text-ink/50">
          No events match those filters.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {list.map((e) => (
            <EventCard key={e.id} event={e} athleteName={athleteName} canRsvp={role === "parent"} />
          ))}
        </div>
      )}

      <EventFormModal
        open={creating}
        onClose={() => setCreating(false)}
        defaults={{
          listingId: "hoop-prodigy",
          listingName: "Hoop Prodigy",
          sport: "Basketball",
          city: "Fullerton",
          county: "Orange",
        }}
      />
    </div>
  );
}

function EventCard({
  event,
  athleteName,
  canRsvp,
}: {
  event: PlatformEvent;
  athleteName: string;
  canRsvp: boolean;
}) {
  const boost = BOOST_LABEL[event.boost];
  return (
    <div className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-navy/[0.07] px-2.5 py-0.5 text-xs font-semibold text-navy">
              {event.type}
            </span>
            <span className="text-xs font-medium text-ink/55">{event.sport}</span>
            {boost && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-bold text-ink">
                <Megaphone size={11} /> {boost}
              </span>
            )}
          </div>
          <h3 className="mt-2 font-bold text-navy">{event.title}</h3>
          <Link href={`/app/listing/${event.listingId}`} className="text-sm text-red hover:underline">
            {event.listingName}
          </Link>
        </div>
        <div className="rounded-xl bg-cream/70 px-3 py-2 text-center">
          <p className="display text-xl leading-none text-navy">
            {new Date(event.date + "T00:00:00").getDate()}
          </p>
          <p className="eyebrow text-ink/50">
            {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-ink/65">{event.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/55">
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={13} /> {formatEventDate(event.date)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={13} /> {event.time}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin size={13} /> {event.city}, {event.county} Co.
        </span>
        <span className="inline-flex items-center gap-1">
          <Users size={13} /> {event.rsvps} registered
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
        <span className="text-sm font-semibold text-navy">{event.priceLabel}</span>
        {canRsvp ? (
          <button
            onClick={() => toggleRsvp(event.id, athleteName)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              event.registered
                ? "bg-navy text-white hover:bg-navy-deep"
                : "border border-navy/30 text-navy hover:bg-navy hover:text-white"
            }`}
          >
            {event.registered ? (
              <>
                <Check size={15} /> Registered
              </>
            ) : (
              "Register"
            )}
          </button>
        ) : (
          <span className="text-xs text-ink/45">Switch to Parent to register</span>
        )}
      </div>
    </div>
  );
}
