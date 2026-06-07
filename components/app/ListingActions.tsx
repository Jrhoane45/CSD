"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Mail, CalendarPlus, Check, ArrowRight, Info } from "lucide-react";
import type { Listing } from "@/lib/types";
import { useProfile } from "@/lib/useProfile";
import { matchListing } from "@/lib/scoring";
import { startThread } from "@/lib/store";
import { SaveButton } from "@/components/app/SaveButton";
import { Modal } from "@/components/ui/Modal";

function athleteLabel(p: ReturnType<typeof useProfile>["profile"]): string {
  if (!p) return "";
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ") || "Athlete";
  const bits = [p.age ? `${p.age}` : null, p.level || null].filter(Boolean);
  return bits.length ? `${name}, ${bits.join(" · ")}` : name;
}

const TIMES = ["3:30 PM", "4:30 PM", "5:30 PM", "6:30 PM", "Weekend AM"];

export function ListingActions({ listing }: { listing: Listing }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<"inquiry" | "booking" | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);

  const fit = useMemo(() => {
    if (!profile?.sport) return undefined;
    return matchListing(profile, listing).fit;
  }, [profile, listing]);

  const parentName = profile?.parentName || profile?.firstName
    ? profile?.parentName || `${profile?.firstName}'s parent`
    : "Guest Parent";
  const athlete = athleteLabel(profile) || "Prospective athlete";

  const close = () => {
    setMode(null);
    setSentId(null);
  };

  const submit = (message: string, bookingDate?: string, bookingTime?: string) => {
    const id = startThread({
      listingId: listing.id,
      listingName: listing.name,
      listingLogo: listing.logo,
      kind: mode === "booking" ? "booking" : "inquiry",
      parentName,
      athlete,
      fit,
      message,
      bookingDate,
      bookingTime,
    });
    setSentId(id);
  };

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => setMode("inquiry")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
        >
          <Mail size={16} /> Request info
        </button>
        <button
          onClick={() => setMode("booking")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy/30 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <CalendarPlus size={16} /> Book a visit
        </button>
        <SaveButton id={listing.id} />
      </div>

      <Modal
        open={mode !== null}
        onClose={close}
        title={
          sentId
            ? "Message sent"
            : mode === "booking"
              ? `Book a visit · ${listing.name}`
              : `Contact ${listing.name}`
        }
        subtitle={
          sentId
            ? undefined
            : mode === "booking"
              ? "Request a time to see a session in person."
              : "Send a question — they typically reply within a day."
        }
      >
        {sentId ? (
          <Sent listingName={listing.name} threadId={sentId} booking={mode === "booking"} onClose={close} />
        ) : (
          <ContactForm
            mode={mode === "booking" ? "booking" : "inquiry"}
            listing={listing}
            hasProfile={!!profile?.firstName}
            athlete={athlete}
            fit={fit}
            onSubmit={submit}
          />
        )}
      </Modal>
    </>
  );
}

function ContactForm({
  mode,
  listing,
  hasProfile,
  athlete,
  fit,
  onSubmit,
}: {
  mode: "inquiry" | "booking";
  listing: Listing;
  hasProfile: boolean;
  athlete: string;
  fit?: number;
  onSubmit: (message: string, date?: string, time?: string) => void;
}) {
  const defaultMsg =
    mode === "booking"
      ? `Hi ${listing.name} team — we'd love to visit and see a session. Looking forward to it!`
      : `Hi ${listing.name} team — we're interested in your ${listing.sports[0]} program. Could you share availability and next steps?`;
  const [message, setMessage] = useState(defaultMsg);
  const [date, setDate] = useState(() => new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));
  const [time, setTime] = useState(TIMES[2]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(message.trim(), mode === "booking" ? date : undefined, mode === "booking" ? time : undefined);
      }}
      className="space-y-4"
    >
      <div className="rounded-xl bg-cream/60 p-3 text-sm">
        <p className="font-semibold text-navy">
          {athlete}
          {fit !== undefined && (
            <span className="ml-2 rounded-full bg-gold/25 px-2 py-0.5 text-xs font-bold text-ink">
              {fit}% fit
            </span>
          )}
        </p>
        {!hasProfile && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/55">
            <Info size={13} /> Sending as a guest.{" "}
            <Link href="/app/profile/create" className="font-semibold text-red hover:underline">
              Create a profile
            </Link>{" "}
            to personalize and track this.
          </p>
        )}
      </div>

      {mode === "booking" && (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="eyebrow text-ink/50">Preferred date</span>
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
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
            >
              {TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <label className="block">
        <span className="eyebrow text-ink/50">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1.5 w-full resize-none rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </label>

      <button
        type="submit"
        disabled={!message.trim()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-deep disabled:opacity-40"
      >
        {mode === "booking" ? "Request visit" : "Send message"} <ArrowRight size={16} />
      </button>
    </form>
  );
}

function Sent({
  listingName,
  threadId,
  booking,
  onClose,
}: {
  listingName: string;
  threadId: string;
  booking: boolean;
  onClose: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
        <Check size={28} />
      </div>
      <p className="mt-4 font-semibold text-navy">
        {booking ? "Visit request sent" : "Message sent"} to {listingName}
      </p>
      <p className="mt-1 text-sm text-ink/60">
        It&apos;s in your inbox — they&apos;ll reply shortly. (This is a demo, so a reply is simulated.)
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <Link
          href={`/app/inbox?thread=${threadId}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Open conversation <ArrowRight size={15} />
        </Link>
        <button
          onClick={onClose}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-ink/60 hover:text-navy"
        >
          Keep browsing
        </button>
      </div>
    </div>
  );
}
