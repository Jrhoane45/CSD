"use client";

import { useState } from "react";
import {
  Calendar,
  Megaphone,
  Pencil,
  Users,
  Trash2,
  Eye,
  Send,
  Check,
} from "lucide-react";
import type { EventBoost, EventRegistrant, Listing, PlatformEvent } from "@/lib/types";
import {
  useStore,
  boostEvent,
  removeEvent,
  formatEventDate,
  messageRegistrant,
} from "@/lib/store";
import { EventFormModal } from "@/components/app/EventForm";
import { Modal } from "@/components/ui/Modal";

const BOOST_BADGE: Record<EventBoost, { label: string; cls: string }> = {
  none: { label: "In-network", cls: "bg-cream text-ink/60" },
  basic: { label: "Promoted", cls: "bg-gold/15 text-ink" },
  standard: { label: "Featured", cls: "bg-gold/25 text-ink" },
  premium: { label: "Featured+", cls: "bg-gold/40 text-ink" },
};

const BOOST_TIERS: { tier: EventBoost; label: string }[] = [
  { tier: "basic", label: "Basic $19" },
  { tier: "standard", label: "Standard $39" },
  { tier: "premium", label: "Premium $79" },
];

const eventViews = (e: PlatformEvent) => Math.max(e.rsvps, Math.round(e.reach * 0.16));
const conversion = (e: PlatformEvent) => {
  const v = eventViews(e);
  return v ? Math.round((e.rsvps / v) * 100) : 0;
};

export function ProviderEvents({ listing }: { listing: Listing }) {
  const { events } = useStore();
  const myEvents = events
    .filter((e) => e.listingId === listing.id)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<PlatformEvent | null>(null);
  const [roster, setRoster] = useState<PlatformEvent | null>(null);

  // Keep the open roster modal in sync with live store updates.
  const rosterLive = roster ? events.find((e) => e.id === roster.id) ?? null : null;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-navy" />
          <h3 className="font-semibold text-navy">Events &amp; promotions</h3>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          + New event
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {myEvents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink/15 p-4 text-center text-sm text-ink/45">
            No events yet. Post a tryout, camp, or showcase.
          </p>
        ) : (
          myEvents.map((e) => (
            <div key={e.id} className="rounded-xl border border-ink/10 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy">{e.title}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BOOST_BADGE[e.boost].cls}`}>
                  {BOOST_BADGE[e.boost].label}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink/55">
                {formatEventDate(e.date)} · {e.city}
              </p>

              {/* per-event analytics */}
              <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-cream/50 p-2 text-center">
                <Stat icon={Eye} value={eventViews(e).toLocaleString()} label="Views" />
                <Stat icon={Users} value={String(e.rsvps)} label="RSVPs" />
                <Stat icon={Megaphone} value={`${conversion(e)}%`} label="Conv." />
              </div>

              {/* boosts */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {BOOST_TIERS.map((b) => (
                  <button
                    key={b.tier}
                    onClick={() => boostEvent(e.id, b.tier)}
                    disabled={e.boost === b.tier}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                      e.boost === b.tier ? "bg-navy text-white" : "bg-gold text-ink hover:bg-gold-300"
                    }`}
                  >
                    <Megaphone size={11} /> {b.label}
                  </button>
                ))}
              </div>

              {/* management actions */}
              <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-2">
                <button
                  onClick={() => setRoster(e)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                >
                  <Users size={13} /> Registrants ({e.rsvps})
                </button>
                <button
                  onClick={() => setEditing(e)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Cancel "${e.title}"? This removes it from the Events board.`)) removeEvent(e.id);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ink/50 hover:text-red"
                >
                  <Trash2 size={13} /> Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <EventFormModal
        open={creating}
        onClose={() => setCreating(false)}
        defaults={{
          listingId: listing.id,
          listingName: listing.name,
          sport: "Basketball",
          city: listing.city,
          county: listing.county,
        }}
      />
      {editing && (
        <EventFormModal
          open
          onClose={() => setEditing(null)}
          defaults={{ listingId: listing.id, listingName: listing.name }}
          event={editing}
        />
      )}

      <Modal
        open={!!rosterLive}
        onClose={() => setRoster(null)}
        title="Registrants"
        subtitle={rosterLive?.title}
      >
        {rosterLive && <Roster event={rosterLive} listing={listing} />}
      </Modal>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Eye;
  value: string;
  label: string;
}) {
  return (
    <div>
      <Icon size={13} className="mx-auto text-ink/40" />
      <p className="mt-0.5 text-sm font-bold text-navy">{value}</p>
      <p className="text-[0.6rem] uppercase tracking-wide text-ink/45">{label}</p>
    </div>
  );
}

function Roster({ event, listing }: { event: PlatformEvent; listing: Listing }) {
  const named = event.registrants;
  return (
    <div>
      <p className="text-sm text-ink/60">
        {named.length > 0 ? (
          <>
            Showing <span className="font-semibold text-navy">{named.length}</span> of{" "}
            <span className="font-semibold text-navy">{event.rsvps}</span> RSVPs
          </>
        ) : (
          <>
            <span className="font-semibold text-navy">{event.rsvps}</span> RSVPs — no named registrants yet.
          </>
        )}
      </p>
      <div className="mt-4 space-y-2">
        {named.map((r) => (
          <RegistrantRow key={r.id} registrant={r} listing={listing} />
        ))}
      </div>
    </div>
  );
}

function RegistrantRow({
  registrant: r,
  listing,
}: {
  registrant: EventRegistrant;
  listing: Listing;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(
    `Hi ${r.name.split(" ")[0]} — thanks for registering! Here are a few details to help you prepare…`,
  );
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-xl border border-ink/10 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy">
            {r.name}
            {r.self && <span className="ml-1.5 text-xs font-normal text-ink/45">(you)</span>}
          </p>
          {r.athlete && <p className="truncate text-xs text-ink/55">{r.athlete}</p>}
        </div>
        {sent ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy">
            <Check size={13} /> Sent
          </span>
        ) : (
          !r.self && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-navy/30 px-2.5 py-1 text-xs font-semibold text-navy hover:bg-navy hover:text-white"
            >
              <Send size={12} /> Message
            </button>
          )
        )}
      </div>
      {open && !sent && (
        <div className="mt-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
          <div className="mt-1.5 flex justify-end">
            <button
              onClick={() => {
                if (!draft.trim()) return;
                messageRegistrant({
                  listingId: listing.id,
                  listingName: listing.name,
                  listingLogo: listing.logo,
                  parentName: r.name,
                  athlete: r.athlete ?? "Registrant",
                  body: draft.trim(),
                });
                setSent(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              <Send size={13} /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
