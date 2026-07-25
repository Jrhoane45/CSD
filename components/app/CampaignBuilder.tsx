"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Megaphone,
  Compass,
  LayoutPanelTop,
  MonitorSmartphone,
  CreditCard,
  ShieldCheck,
  Eye,
  MousePointerClick,
  CalendarCheck,
} from "lucide-react";
import type {
  AdPlacement,
  AudienceReach,
  CampaignObjective,
  Listing,
  PaymentMethod,
} from "@/lib/types";
import {
  PLACEMENTS,
  AUDIENCE_MULT,
  PAYMENT_METHODS,
  estimateCampaign,
  todayISO,
  addDaysISO,
  type CampaignPlan,
} from "@/lib/promotions";
import { useStore, createCampaign } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";
import { AdBadge } from "@/components/app/AdBadge";
import { LogoAvatar } from "@/components/listing/LogoAvatar";

const OBJECTIVES: CampaignObjective[] = ["Fill an event", "Grow awareness", "Drive profile visits"];
const AUDIENCES: AudienceReach[] = ["Local", "Regional", "Statewide"];

const PLACEMENT_ICON: Record<AdPlacement, typeof Megaphone> = {
  "events-featured": Megaphone,
  "discover-spotlight": Compass,
  "in-app-banner": LayoutPanelTop,
  "in-app-popup": MonitorSmartphone,
};

const PAYMENT_ICON: Record<PaymentMethod, string> = {
  Card: "💳",
  PayPal: "🅿️",
  "Apple Pay": "",
  "Bank (ACH)": "🏦",
};

const fmt = (n: number) => n.toLocaleString();

export function CampaignBuilder({
  open,
  onClose,
  listing,
  plan,
  initialEventId,
}: {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  plan?: CampaignPlan | null;
  /** Pre-target a specific event (e.g. "Promote" on the events panel). */
  initialEventId?: string;
}) {
  const { events } = useStore();
  const myEvents = events.filter((e) => e.listingId === listing.id);

  const [step, setStep] = useState(0);
  const [objective, setObjective] = useState<CampaignObjective>(plan?.objective ?? "Fill an event");
  const [eventId, setEventId] = useState<string>(initialEventId ?? myEvents[0]?.id ?? "");
  const [placements, setPlacements] = useState<AdPlacement[]>(plan?.placements ?? ["events-featured"]);
  const [audience, setAudience] = useState<AudienceReach>(plan?.audience ?? "Local");
  const [duration, setDuration] = useState(plan?.durationDays ?? 7);
  const [startDate, setStartDate] = useState(todayISO());
  const [payment, setPayment] = useState<PaymentMethod>("Card");
  const [stage, setStage] = useState<"build" | "processing" | "done">("build");

  const selectedEvent = myEvents.find((e) => e.id === eventId);
  const headline = selectedEvent ? selectedEvent.title : `${listing.name} — now enrolling`;
  const cta =
    objective === "Fill an event" ? "Reserve a spot" : objective === "Grow awareness" ? "Learn more" : "View profile";

  const est = useMemo(
    () => estimateCampaign(placements, audience, duration),
    [placements, audience, duration],
  );

  const togglePlacement = (p: AdPlacement) =>
    setPlacements((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const reset = () => {
    setStep(0);
    setStage("build");
    onClose();
  };

  const pay = () => {
    setStage("processing");
    setTimeout(() => {
      createCampaign({
        listingId: listing.id,
        listingName: listing.name,
        listingLogo: listing.logo,
        eventId: selectedEvent?.id,
        eventTitle: selectedEvent?.title,
        objective,
        placements,
        audience,
        durationDays: duration,
        startDate,
        budget: est.budget,
        payment,
        headline,
        cta,
        estImpressions: est.impressions,
        estClicks: est.clicks,
        estRsvps: est.rsvps,
      });
      setStage("done");
    }, 1500);
  };

  return (
    <Modal
      open={open}
      onClose={reset}
      title={stage === "done" ? "Campaign launched" : "Promote across Club Sports Direct"}
      subtitle={stage === "done" ? undefined : "Reach vetted families in-app and on the web. Demo checkout — no real charge."}
      maxWidth="max-w-2xl"
    >
      {stage === "done" ? (
        <Launched headline={headline} est={est} onClose={reset} />
      ) : (
        <div className="space-y-5">
          <Steps step={step} />

          {step === 0 && (
            <div className="space-y-5">
              <div>
                <p className="eyebrow text-ink/50">Objective</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {OBJECTIVES.map((o) => (
                    <button
                      key={o}
                      onClick={() => setObjective(o)}
                      className={`rounded-xl border p-3 text-left text-sm font-semibold transition-colors ${
                        objective === o ? "border-navy bg-navy/[0.05] text-navy" : "border-ink/15 text-ink/70 hover:border-navy/40"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow text-ink/50">What are you promoting?</p>
                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-navy"
                >
                  <option value="">My profile (general awareness)</option>
                  {myEvents.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.type}: {e.title}
                    </option>
                  ))}
                </select>
                {myEvents.length === 0 && (
                  <p className="mt-1.5 text-xs text-ink/50">
                    Tip: create an event first to promote a specific tournament, showcase, camp, or clinic.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="eyebrow text-ink/50">Placements</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {PLACEMENTS.map((p) => {
                    const Icon = PLACEMENT_ICON[p.id];
                    const on = placements.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePlacement(p.id)}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors ${
                          on ? "border-navy bg-navy/[0.05]" : "border-ink/15 hover:border-navy/40"
                        }`}
                      >
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${on ? "border-navy bg-navy text-white" : "border-ink/25"}`}>
                          {on && <Check size={13} />}
                        </span>
                        <span>
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                            <Icon size={14} /> {p.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-ink/55">{p.desc}</span>
                          <span className="mt-1 block text-xs font-semibold text-ink/70">${p.perDay}/day</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="eyebrow text-ink/50">Audience reach</p>
                  <div className="mt-2 flex rounded-lg border border-ink/15 p-1">
                    {AUDIENCES.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAudience(a)}
                        className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
                          audience === a ? "bg-navy text-white" : "text-ink/55 hover:text-navy"
                        }`}
                      >
                        {a}
                        <span className="block text-[0.6rem] font-normal opacity-70">×{AUDIENCE_MULT[a]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="eyebrow text-ink/50">Duration · {duration} days</p>
                  <input
                    type="range"
                    min={3}
                    max={30}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="mt-3 w-full accent-navy"
                  />
                </div>
              </div>

              <div>
                <p className="eyebrow text-ink/50">Start date</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <input
                    type="date"
                    value={startDate}
                    min={todayISO()}
                    onChange={(e) => setStartDate(e.target.value || todayISO())}
                    className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-navy"
                  />
                  <span className="text-xs text-ink/55">
                    Flight: {startDate} → {addDaysISO(startDate, duration)}
                    {startDate > todayISO() && (
                      <span className="ml-1.5 rounded-full bg-cream px-2 py-0.5 font-semibold text-ink/60">
                        scheduled
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <AdPreview listing={listing} headline={headline} cta={cta} meta={selectedEvent?.type ?? "Featured"} />

              <EstimateRow est={est} disabled={placements.length === 0} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-xl bg-cream/60 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-navy">Total</span>
                  <span className="display text-3xl text-navy">${fmt(est.budget)}</span>
                </div>
                <p className="text-xs text-ink/55">
                  {placements.length} placement{placements.length > 1 ? "s" : ""} · {audience} · {duration} days
                </p>
              </div>
              <div>
                <p className="eyebrow text-ink/50">Payment method</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setPayment(m)}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-colors ${
                        payment === m ? "border-navy bg-navy/[0.05] text-navy" : "border-ink/15 text-ink/70 hover:border-navy/40"
                      }`}
                    >
                      <span className="text-base">{m === "Apple Pay" ? "" : PAYMENT_ICON[m]}</span> {m}
                    </button>
                  ))}
                </div>
              </div>
              {payment === "Card" && (
                <div className="flex items-center gap-2 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/60">
                  <CreditCard size={15} /> 4242 4242 4242 4242 · 12/28 · 123
                </div>
              )}
              <p className="flex items-center justify-center gap-1.5 text-xs text-ink/45">
                <ShieldCheck size={13} /> Simulated secure checkout · no real charge
              </p>
            </div>
          )}

          {/* nav */}
          <div className="flex items-center justify-between border-t border-ink/10 pt-4">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 disabled:opacity-0"
            >
              <ArrowLeft size={15} /> Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && placements.length === 0}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
              >
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={pay}
                disabled={stage === "processing"}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
              >
                {stage === "processing" ? "Processing…" : `Pay $${fmt(est.budget)} & launch`}
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Steps({ step }: { step: number }) {
  const labels = ["Goal", "Placements", "Payment"];
  return (
    <div className="flex items-center gap-2">
      {labels.map((l, i) => (
        <div key={l} className="flex flex-1 flex-col gap-1.5">
          <div className={`h-1.5 rounded-full ${i <= step ? "bg-navy" : "bg-ink/15"}`} />
          <span className={`text-xs font-medium ${i === step ? "text-navy" : "text-ink/40"}`}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function EstimateRow({ est, disabled }: { est: { impressions: number; clicks: number; rsvps: number }; disabled: boolean }) {
  return (
    <div className={`grid grid-cols-3 gap-2 rounded-xl border border-ink/10 p-3 text-center ${disabled ? "opacity-40" : ""}`}>
      <Est icon={Eye} value={fmt(est.impressions)} label="Est. impressions" />
      <Est icon={MousePointerClick} value={fmt(est.clicks)} label="Est. clicks" />
      <Est icon={CalendarCheck} value={fmt(est.rsvps)} label="Est. RSVPs" />
    </div>
  );
}

function Est({ icon: Icon, value, label }: { icon: typeof Eye; value: string; label: string }) {
  return (
    <div>
      <Icon size={14} className="mx-auto text-ink/40" />
      <p className="mt-0.5 text-sm font-bold text-navy">{value}</p>
      <p className="text-[0.6rem] uppercase tracking-wide text-ink/45">{label}</p>
    </div>
  );
}

export function AdPreview({
  listing,
  headline,
  cta,
  meta,
}: {
  listing: Listing;
  headline: string;
  cta: string;
  meta: string;
}) {
  return (
    <div>
      <p className="eyebrow mb-1.5 text-ink/45">Ad preview</p>
      <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-cream/60 to-white p-4">
        <div className="flex items-center justify-between">
          <AdBadge />
          <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-ink/40">{meta}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <LogoAvatar listing={listing} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-bold text-navy">{headline}</p>
            <p className="truncate text-xs text-ink/55">{listing.name} · {listing.city}</p>
          </div>
        </div>
        <button className="mt-3 w-full rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">{cta}</button>
      </div>
    </div>
  );
}

function Launched({
  headline,
  est,
  onClose,
}: {
  headline: string;
  est: { impressions: number };
  onClose: () => void;
}) {
  return (
    <div className="py-2 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
        <Check size={28} />
      </div>
      <p className="mt-4 font-semibold text-navy">Your campaign is live</p>
      <p className="mt-1 text-sm text-ink/60">
        “{headline}” is now serving across vetted-provider ad slots — projected ~{fmt(est.impressions)} impressions.
        Track performance in your Promotions reporting.
      </p>
      <button
        onClick={onClose}
        className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
      >
        View reporting
      </button>
    </div>
  );
}
