"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import type { County, EventType, PlatformEvent, Sport } from "@/lib/types";
import { SPORTS_LIST, COUNTIES_LIST } from "@/lib/data/listings";
import { createEvent, updateEvent } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";

const TYPES: EventType[] = ["Tournament", "Showcase", "Camp", "Clinic", "Tryout", "Open House"];

export interface EventDefaults {
  listingId?: string;
  listingName: string;
  sport?: Sport;
  city?: string;
  county?: County;
}

export function EventFormModal({
  open,
  onClose,
  defaults,
  event,
}: {
  open: boolean;
  onClose: () => void;
  defaults: EventDefaults;
  /** When provided, the form edits this event instead of creating a new one. */
  event?: PlatformEvent;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={event ? "Edit event" : "Create an event"}
      subtitle={event ? "Update the details — changes are live immediately." : "Post a tryout, camp, showcase, or clinic."}
      maxWidth="max-w-xl"
    >
      <EventForm defaults={defaults} onClose={onClose} event={event} />
    </Modal>
  );
}

function EventForm({
  defaults,
  onClose,
  event,
}: {
  defaults: EventDefaults;
  onClose: () => void;
  event?: PlatformEvent;
}) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [type, setType] = useState<EventType>(event?.type ?? "Tryout");
  const [sport, setSport] = useState<Sport>(event?.sport ?? defaults.sport ?? "Basketball");
  const [date, setDate] = useState(
    () => event?.date ?? new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  );
  const [time, setTime] = useState(event?.time ?? "9:00 AM – 12:00 PM");
  const [city, setCity] = useState(event?.city ?? defaults.city ?? "");
  const [county, setCounty] = useState<County>(event?.county ?? defaults.county ?? "Los Angeles");
  const [price, setPrice] = useState(event?.priceLabel ?? "Free");
  const [description, setDescription] = useState(event?.description ?? "");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
          <Check size={28} />
        </div>
        <p className="mt-4 font-semibold text-navy">{event ? "Event updated" : "Event published"}</p>
        <p className="mt-1 text-sm text-ink/60">
          {event
            ? "Your changes are live on the Events board."
            : "It's live on the Events board (in-network reach). Boost it for wider distribution."}
        </p>
        <button onClick={onClose} className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep">
          Done
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fields = {
          title: title.trim() || `${sport} ${type}`,
          type,
          sport,
          date,
          time: time.trim() || "TBD",
          city: city.trim() || "—",
          county,
          description: description.trim() || `${type} hosted by ${defaults.listingName}.`,
          priceLabel: price.trim() || "Free",
        };
        if (event) {
          updateEvent(event.id, fields);
        } else {
          createEvent({ listingId: defaults.listingId, listingName: defaults.listingName, ...fields });
        }
        setSent(true);
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className="eyebrow text-ink/50">Event title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Fall Tryouts — 14U & 16U"
          className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="eyebrow text-ink/50">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="eyebrow text-ink/50">Sport</span>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value as Sport)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          >
            {SPORTS_LIST.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="eyebrow text-ink/50">Date</span>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/50">Time</span>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </label>
      </div>

      <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
        <label className="block">
          <span className="eyebrow text-ink/50">City</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/50">County</span>
          <select
            value={county}
            onChange={(e) => setCounty(e.target.value as County)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          >
            {COUNTIES_LIST.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="eyebrow text-ink/50">Price</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1.5 w-24 rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </label>
      </div>

      <label className="block">
        <span className="eyebrow text-ink/50">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="What to expect, what to bring, who it's for…"
          className="mt-1.5 w-full resize-none rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </label>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
      >
        {event ? "Save changes" : "Publish event"} <ArrowRight size={16} />
      </button>
    </form>
  );
}
