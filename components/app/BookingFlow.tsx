"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Clock,
  CalendarDays,
  Lock,
  ShieldCheck,
  Info,
  CalendarCheck,
} from "lucide-react";
import type { Listing } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { useStore, bookSession, takenSlotIds } from "@/lib/store";
import {
  sessionMenu,
  effectiveOpenSlots,
  groupSlotsByDate,
  formatMoney,
  type SessionType,
  type OpenSlot,
} from "@/lib/scheduling";

type Step = "type" | "slot" | "confirm" | "processing" | "done";

export function BookingFlow({
  open,
  onClose,
  listing,
  athlete,
  parentName,
  fit,
  hasProfile,
}: {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  athlete: string;
  parentName: string;
  fit?: number;
  hasProfile: boolean;
}) {
  const { bookings, availability } = useStore();
  const menu = sessionMenu(listing);

  const [step, setStep] = useState<Step>("type");
  const [type, setType] = useState<SessionType | null>(null);
  const [slot, setSlot] = useState<OpenSlot | null>(null);
  const [note, setNote] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);

  const days = useMemo(() => {
    const taken = takenSlotIds(bookings, listing.id);
    return groupSlotsByDate(effectiveOpenSlots(listing.id, availability, taken)).slice(0, 8);
  }, [bookings, availability, listing.id]);

  const reset = () => {
    setStep("type");
    setType(null);
    setSlot(null);
    setNote("");
    setBookingId(null);
    onClose();
  };

  const confirm = () => {
    if (!type || !slot) return;
    setStep("processing");
    setTimeout(() => {
      const id = bookSession({
        listingId: listing.id,
        listingName: listing.name,
        listingLogo: listing.logo,
        slotId: slot.id,
        sessionTypeId: type.id,
        sessionTypeName: type.name,
        date: slot.date,
        time: slot.time,
        durationMin: type.durationMin,
        price: type.price,
        athlete,
        parentName,
        fit,
        message: note.trim() || undefined,
      });
      setBookingId(id);
      setStep("done");
    }, type.price > 0 ? 1300 : 700);
  };

  const title =
    step === "done"
      ? "Session booked"
      : step === "confirm" || step === "processing"
        ? "Confirm your booking"
        : `Book a session · ${listing.name}`;

  const subtitle =
    step === "type"
      ? "Choose a session type, then pick an open time."
      : step === "slot"
        ? `${type?.name} · ${type?.durationMin} min · ${formatMoney(type?.price ?? 0)}`
        : undefined;

  return (
    <Modal open={open} onClose={reset} title={title} subtitle={subtitle}>
      {/* progress */}
      {step !== "done" && step !== "processing" && (
        <div className="mb-4 flex items-center gap-1.5">
          {["type", "slot", "confirm"].map((s, i) => (
            <span
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                ["type", "slot", "confirm"].indexOf(step) >= i ? "bg-navy" : "bg-ink/10"
              }`}
            />
          ))}
        </div>
      )}

      {step === "type" && (
        <div className="space-y-3">
          {menu.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setType(s);
                setStep("slot");
              }}
              className="flex w-full items-start justify-between gap-3 rounded-xl border border-ink/15 p-4 text-left transition-colors hover:border-navy/40 hover:bg-cream/50"
            >
              <div>
                <p className="font-semibold text-navy">{s.name}</p>
                <p className="mt-0.5 text-xs text-ink/55">{s.desc}</p>
                <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-ink/60">
                  <Clock size={12} /> {s.durationMin} min
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-gold/20 px-3 py-1 text-sm font-bold text-ink">
                {formatMoney(s.price)}
              </span>
            </button>
          ))}
        </div>
      )}

      {step === "slot" && (
        <div>
          <button
            onClick={() => setStep("type")}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-navy"
          >
            <ArrowLeft size={15} /> Session type
          </button>
          {days.length === 0 ? (
            <p className="rounded-xl border border-dashed border-ink/20 p-6 text-center text-sm text-ink/55">
              No open availability in the next few weeks — send an inquiry and they&apos;ll reach out.
            </p>
          ) : (
            <div className="max-h-[46vh] space-y-4 overflow-y-auto pr-1">
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
                          setSlot(t);
                          setStep("confirm");
                        }}
                        className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-medium text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
                      >
                        {t.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === "confirm" && type && slot && (
        <div className="space-y-4">
          <div className="rounded-xl bg-cream/60 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-navy">{type.name}</p>
              <span className="rounded-full bg-gold/25 px-2.5 py-0.5 text-sm font-bold text-ink">
                {formatMoney(type.price)}
              </span>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-ink/70">
              <li className="flex items-center gap-2">
                <CalendarDays size={14} className="text-navy" /> {slot.label} · {slot.time}
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-navy" /> {type.durationMin} minutes
              </li>
              <li className="flex items-center gap-2">
                <CalendarCheck size={14} className="text-navy" /> {athlete}
                {fit !== undefined && (
                  <span className="ml-1 rounded-full bg-gold/25 px-2 py-0.5 text-xs font-bold text-ink">
                    {fit}% fit
                  </span>
                )}
              </li>
            </ul>
            {!hasProfile && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/55">
                <Info size={13} /> Booking as a guest.{" "}
                <Link href="/app/profile/create" className="font-semibold text-red hover:underline">
                  Create a profile
                </Link>{" "}
                to track it.
              </p>
            )}
          </div>

          <label className="block">
            <span className="eyebrow text-ink/50">Note to the provider (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Anything they should know before the session?"
              className="mt-1.5 w-full resize-none rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
            />
          </label>

          {type.price > 0 && (
            <label className="block">
              <span className="eyebrow text-ink/50">Card number</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ink/15 px-3 py-2 focus-within:border-navy">
                <Lock size={14} className="text-ink/40" />
                <input
                  defaultValue="4242 4242 4242 4242"
                  inputMode="numeric"
                  className="w-full text-sm outline-none"
                />
              </div>
            </label>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep("slot")}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-ink/55 hover:text-navy"
            >
              Back
            </button>
            <button
              onClick={confirm}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              {type.price > 0 ? `Pay ${formatMoney(type.price)} & book` : "Confirm booking"}{" "}
              <ArrowRight size={16} />
            </button>
          </div>
          {type.price > 0 && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-ink/45">
              <ShieldCheck size={13} /> Simulated secure checkout · no real charge
            </p>
          )}
        </div>
      )}

      {step === "processing" && (
        <div className="py-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-navy/20 border-t-navy" />
          <p className="mt-4 text-sm font-medium text-ink/60">
            {type && type.price > 0 ? "Processing payment…" : "Confirming your slot…"}
          </p>
        </div>
      )}

      {step === "done" && type && slot && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
            <Check size={28} />
          </div>
          <p className="mt-4 font-semibold text-navy">
            {type.name} booked with {listing.name}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {slot.label} at {slot.time}. It&apos;s on your schedule and in your inbox.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/app/sessions"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              View my sessions <ArrowRight size={15} />
            </Link>
            {bookingId && (
              <Link
                href="/app/inbox"
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-ink/60 hover:text-navy"
              >
                Open the conversation
              </Link>
            )}
            <button
              onClick={reset}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-ink/50 hover:text-navy"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
