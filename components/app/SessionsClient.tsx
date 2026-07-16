"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Clock,
  MapPin,
  X,
  CalendarDays,
  ArrowRight,
  Compass,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import type { SessionBooking } from "@/lib/types";
import { useStore, cancelBooking, rescheduleBooking, takenSlotIds, formatEventDate } from "@/lib/store";
import { effectiveOpenSlots, groupSlotsByDate, formatMoney, bookingStatusTone } from "@/lib/scheduling";
import { getListing } from "@/lib/data/listings";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LogoAvatar } from "@/components/listing/LogoAvatar";
import { Modal } from "@/components/ui/Modal";

export function SessionsClient() {
  const { bookings } = useStore();
  const [rescheduling, setRescheduling] = useState<SessionBooking | null>(null);

  const mine = useMemo(
    () =>
      bookings
        .filter((b) => b.parentName === "You")
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [bookings],
  );
  const upcoming = mine.filter((b) => b.status === "upcoming");
  const past = mine.filter((b) => b.status !== "upcoming");

  const spend = mine.filter((b) => b.status !== "canceled").reduce((s, b) => s + b.price, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>My sessions</Eyebrow>
          <h1 className="display mt-2 text-4xl text-navy">TRAINING SCHEDULE</h1>
          <p className="mt-1 text-ink/60">Sessions and visits you&apos;ve booked with programs and trainers.</p>
        </div>
        <Link
          href="/app/discover"
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          <Compass size={15} /> Book another
        </Link>
      </div>

      {/* summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat icon={CalendarClock} n={String(upcoming.length)} label="Upcoming" />
        <Stat icon={Clock} n={String(past.filter((b) => b.status === "completed").length)} label="Completed" />
        <Stat icon={DollarSign} n={formatMoney(spend)} label="Total booked value" />
      </div>

      {mine.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/20 p-10 text-center">
          <CalendarDays size={28} className="mx-auto text-ink/30" />
          <p className="mt-3 font-semibold text-navy">No sessions booked yet</p>
          <p className="mt-1 text-sm text-ink/55">
            Find a program or trainer and book a real time slot from their profile.
          </p>
          <Link
            href="/app/discover"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
          >
            Explore the directory <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <Section title="Upcoming">
              {upcoming.map((b) => (
                <BookingCard
                  key={b.id}
                  b={b}
                  onReschedule={() => setRescheduling(b)}
                  onCancel={() => cancelBooking(b.id)}
                />
              ))}
            </Section>
          )}
          {past.length > 0 && (
            <Section title="Past & canceled">
              {past.map((b) => (
                <BookingCard key={b.id} b={b} />
              ))}
            </Section>
          )}
        </>
      )}

      <RescheduleModal booking={rescheduling} onClose={() => setRescheduling(null)} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="eyebrow text-ink/45">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function Stat({ icon: Icon, n, label }: { icon: typeof Clock; n: string; label: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <Icon size={20} className="text-navy" />
      <p className="display mt-3 text-3xl text-navy">{n}</p>
      <p className="eyebrow mt-1 text-ink/50">{label}</p>
    </div>
  );
}

function BookingCard({
  b,
  onReschedule,
  onCancel,
}: {
  b: SessionBooking;
  onReschedule?: () => void;
  onCancel?: () => void;
}) {
  const listing = getListing(b.listingId);
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {listing ? (
            <LogoAvatar listing={listing} size="sm" />
          ) : (
            <div className="h-11 w-11 rounded-xl bg-cream" />
          )}
          <div>
            <p className="flex flex-wrap items-center gap-2 font-semibold text-navy">
              {b.sessionTypeName}
              <span
                className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold capitalize ${bookingStatusTone(
                  b.status,
                )}`}
              >
                {b.status}
              </span>
            </p>
            <Link href={`/app/listing/${b.listingId}`} className="text-sm text-ink/60 hover:text-navy">
              {b.listingName}
            </Link>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/55">
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={13} className="text-gold" /> {formatEventDate(b.date)} · {b.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} /> {b.durationMin} min
              </span>
              <span className="font-semibold text-ink/70">{formatMoney(b.price)}</span>
              {listing && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} /> {listing.city}
                </span>
              )}
            </div>
          </div>
        </div>
        {b.status === "upcoming" && (
          <div className="flex items-center gap-2">
            <Link
              href="/app/inbox"
              className="inline-flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-cream"
            >
              <MessageSquare size={13} /> Message
            </Link>
            {onReschedule && (
              <button
                onClick={onReschedule}
                className="inline-flex items-center gap-1 rounded-lg border border-navy/30 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy hover:text-white"
              >
                <CalendarClock size={13} /> Reschedule
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink/45 hover:text-red"
              >
                <X size={13} /> Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RescheduleModal({ booking, onClose }: { booking: SessionBooking | null; onClose: () => void }) {
  const { bookings, availability } = useStore();
  const days = useMemo(() => {
    if (!booking) return [];
    const taken = takenSlotIds(bookings, booking.listingId);
    // Allow keeping the current slot as an option too.
    taken.delete(booking.slotId);
    return groupSlotsByDate(effectiveOpenSlots(booking.listingId, availability, taken)).slice(0, 8);
  }, [booking, bookings, availability]);

  if (!booking) return null;

  return (
    <Modal
      open={!!booking}
      onClose={onClose}
      title={`Reschedule · ${booking.sessionTypeName}`}
      subtitle={`Currently ${formatEventDate(booking.date)} at ${booking.time}`}
    >
      {days.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/20 p-6 text-center text-sm text-ink/55">
          No other open times right now.
        </p>
      ) : (
        <div className="max-h-[52vh] space-y-4 overflow-y-auto pr-1">
          {days.map((d) => (
            <div key={d.date}>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                <CalendarDays size={14} className="text-gold" /> {d.label}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {d.times.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      rescheduleBooking(booking.id, t.id, t.date, t.time);
                      onClose();
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      t.id === booking.slotId
                        ? "border-navy bg-navy/[0.06] text-navy"
                        : "border-ink/15 text-navy hover:border-navy hover:bg-navy hover:text-white"
                    }`}
                  >
                    {t.time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
