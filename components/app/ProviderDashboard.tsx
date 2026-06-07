"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Lock,
  Eye,
  Search,
  Star,
  TrendingUp,
  Megaphone,
  Inbox,
  Calendar,
  BarChart3,
  Check,
  ArrowRight,
  Crown,
} from "lucide-react";
import type { ClaimState } from "@/lib/types";
import { getListing, CATEGORY_LABEL } from "@/lib/data/listings";
import { computeCsdScore } from "@/lib/scoring";
import { CsdScoreBadge } from "@/components/ui/CsdScoreBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DemoButton } from "@/components/app/DemoButton";
import { LogoAvatar } from "@/components/listing/LogoAvatar";
import { MediaUploader } from "@/components/app/MediaUploader";
import { ImagePlus, Images, MessageSquare, CalendarClock, Pencil } from "lucide-react";
import type { EventBoost, ProfileVideo } from "@/lib/types";
import { useStore, boostEvent, formatEventDate, setOverride } from "@/lib/store";
import { EventFormModal } from "@/components/app/EventForm";

const LISTING = getListing("hoop-prodigy")!;
const SCORE = computeCsdScore(LISTING).score;

const STATES: { value: ClaimState; label: string }[] = [
  { value: "unclaimed", label: "Unclaimed" },
  { value: "claimed-free", label: "Claimed-Free" },
  { value: "claimed-paid", label: "Claimed-Paid" },
];

export function ProviderDashboard() {
  const [state, setState] = useState<ClaimState>("unclaimed");
  const { overrides } = useStore();
  const displayName = overrides[LISTING.id]?.name ?? LISTING.name;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Eyebrow>Provider dashboard</Eyebrow>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <LogoAvatar listing={LISTING} size="lg" />
          <div>
            <h1 className="display text-4xl text-navy">{displayName}</h1>
            <p className="mt-1 text-sm text-ink/60">
              {CATEGORY_LABEL[LISTING.category]} · {LISTING.city}, {LISTING.county} County
            </p>
          </div>
        </div>
        <CsdScoreBadge score={SCORE} size="md" showTier />
      </div>

      {/* state switcher (demo control) */}
      <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-4">
        <p className="eyebrow mb-2 text-ink/45">Demo control · view each claim state</p>
        <div className="flex flex-wrap gap-2">
          {STATES.map((s) => (
            <button
              key={s.value}
              onClick={() => setState(s.value)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                state === s.value ? "bg-navy text-white" : "bg-cream text-ink/60 hover:text-navy"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {state === "unclaimed" && <Unclaimed onClaim={() => setState("claimed-free")} />}
        {state === "claimed-free" && <ClaimedFree onUpgrade={() => setState("claimed-paid")} />}
        {state === "claimed-paid" && <ClaimedPaid />}
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
  locked = false,
}: {
  icon: typeof Eye;
  value: string;
  label: string;
  locked?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <Icon size={20} className={locked ? "text-ink/30" : "text-navy"} />
      <p className={`display mt-3 text-3xl ${locked ? "text-ink/30" : "text-navy"}`}>
        {locked ? "—" : value}
      </p>
      <p className="eyebrow mt-1 text-ink/50">{label}</p>
    </div>
  );
}

function LogoSlot() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2">
        <ImagePlus size={18} className="text-navy" />
        <h3 className="font-semibold text-navy">Business logo</h3>
      </div>
      <p className="mt-1 text-sm text-ink/55">
        Your thumbnail logo represents you across your profile, search results, and athlete matches.
      </p>
      <div className="mt-4 flex items-center gap-4">
        <LogoAvatar listing={LISTING} size="lg" />
        <div>
          <DemoButton variant="primary" done="Uploaded (demo)">
            <ImagePlus size={15} /> Upload logo
          </DemoButton>
          <p className="mt-2 text-xs text-ink/45">PNG, JPG, or SVG · square · at least 200×200px</p>
        </div>
      </div>
    </div>
  );
}

function ProviderMediaSlot() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<ProfileVideo[]>([]);
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2">
        <Images size={18} className="text-navy" />
        <h3 className="font-semibold text-navy">Photos &amp; video</h3>
      </div>
      <p className="mt-1 text-sm text-ink/55">
        Showcase your facility, training, and highlights — up to 6 photos and 2 videos.
      </p>
      <div className="mt-4">
        <MediaUploader photos={photos} videos={videos} onPhotos={setPhotos} onVideos={setVideos} />
      </div>
    </div>
  );
}

function EditProfileCard() {
  const { overrides } = useStore();
  const ov = overrides[LISTING.id] ?? {};
  const [name, setName] = useState(ov.name ?? LISTING.name);
  const [philosophy, setPhilosophy] = useState(ov.philosophy ?? LISTING.philosophy);
  const [priceLabel, setPriceLabel] = useState(ov.priceLabel ?? LISTING.priceLabel);
  const [saved, setSaved] = useState(false);

  const dirty =
    name !== (ov.name ?? LISTING.name) ||
    philosophy !== (ov.philosophy ?? LISTING.philosophy) ||
    priceLabel !== (ov.priceLabel ?? LISTING.priceLabel);

  const save = () => {
    setOverride(LISTING.id, { name: name.trim() || LISTING.name, philosophy, priceLabel });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2">
        <Pencil size={18} className="text-navy" />
        <h3 className="font-semibold text-navy">Edit your profile</h3>
      </div>
      <p className="mt-1 text-sm text-ink/55">
        Control your narrative — changes show on your public listing immediately.
      </p>
      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="eyebrow text-ink/50">Program name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/50">Philosophy</span>
          <textarea
            value={philosophy}
            onChange={(e) => setPhilosophy(e.target.value)}
            rows={3}
            className="mt-1.5 w-full resize-none rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/50">Pricing</span>
          <input
            value={priceLabel}
            onChange={(e) => setPriceLabel(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={!dirty}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
        >
          {saved ? (
            <>
              <Check size={15} /> Saved
            </>
          ) : (
            "Save changes"
          )}
        </button>
        <Link href={`/app/listing/${LISTING.id}`} className="text-sm font-semibold text-red hover:underline">
          View public profile
        </Link>
      </div>
    </div>
  );
}

function Unclaimed({ onClaim }: { onClaim: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/50 bg-gold/[0.08] p-6">
        <div className="flex items-start gap-3">
          <Sparkles size={22} className="mt-0.5 text-gold" />
          <div>
            <h2 className="text-lg font-bold text-navy">We built this profile for you.</h2>
            <p className="text-sm text-ink/65">
              Auto-generated from public data — and it&apos;s already getting attention. Claim it to
              control your narrative, respond to reviews, and reach the right athletes.
            </p>
          </div>
        </div>
        <button
          onClick={onClaim}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Claim this profile <ArrowRight size={16} />
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-navy">Interest is accruing — without you</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-4">
          <Metric icon={Eye} value="1,284" label="Profile views (30d)" />
          <Metric icon={Search} value="312" label="Searches appeared in" />
          <Metric icon={Star} value="6" label="Reviews posted" />
          <Metric icon={TrendingUp} value="48" label="Saves by parents" />
        </div>
        <p className="mt-3 text-sm text-ink/55">
          Every day unclaimed is a day a competitor&apos;s claimed profile ranks above yours.
        </p>
      </div>
    </div>
  );
}

function ClaimedFree({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy/20 bg-navy/[0.04] p-6">
        <div className="flex items-center gap-3">
          <Check size={22} className="text-navy" />
          <div>
            <h2 className="text-lg font-bold text-navy">Profile claimed — you&apos;re verified.</h2>
            <p className="text-sm text-ink/65">
              You can edit your basics and respond to reviews. Upgrade to unlock leads, events,
              analytics, and featured placement.
            </p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-gold-300"
        >
          <Crown size={16} /> Upgrade to Premium
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Metric icon={Eye} value="1,284" label="Profile views (30d)" />
        <Metric icon={Search} value="312" label="Searches appeared in" />
        <Metric icon={Inbox} value="0" label="Leads" locked />
        <Metric icon={BarChart3} value="0" label="Analytics" locked />
      </div>

      <EditProfileCard />

      <LogoSlot />

      <ProviderMediaSlot />

      <LockedFeatures onUpgrade={onUpgrade} />
    </div>
  );
}

function LockedFeatures({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2">
        <Lock size={18} className="text-ink/40" />
        <h3 className="font-semibold text-navy">Unlock with a paid subscription</h3>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          { icon: Inbox, t: "Lead inbox & management", b: "See and respond to higher-fit families." },
          { icon: Calendar, t: "Event & promotional posts", b: "Post tryouts, camps — boost for reach." },
          { icon: BarChart3, t: "Advanced analytics", b: "Views, impressions, and lead quality over time." },
          { icon: Megaphone, t: "Featured placement", b: "Rise to the top of relevant searches." },
        ].map((f) => (
          <div key={f.t} className="flex items-start gap-3 rounded-xl bg-cream/60 p-4 opacity-90">
            <f.icon size={18} className="mt-0.5 text-ink/45" />
            <div>
              <p className="text-sm font-semibold text-ink/70">{f.t}</p>
              <p className="text-xs text-ink/50">{f.b}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onUpgrade}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
      >
        See plans <ArrowRight size={15} />
      </button>
    </div>
  );
}

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

function ClaimedPaid() {
  const { threads, events } = useStore();
  const [creating, setCreating] = useState(false);

  const leads = threads
    .filter((t) => t.listingId === LISTING.id)
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  const myEvents = events
    .filter((e) => e.listingId === LISTING.id)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const unread = leads.filter((l) => l.unreadFor === "provider").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold bg-gold/[0.1] p-5">
        <div className="flex items-center gap-3">
          <Crown size={22} className="text-gold" />
          <div>
            <h2 className="font-bold text-navy">Premium · featured placement active</h2>
            <p className="text-sm text-ink/65">Full access to leads, events, and analytics.</p>
          </div>
        </div>
        <Link
          href="/app/provider/analytics"
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          <BarChart3 size={15} /> Full analytics
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Metric icon={Eye} value="3,910" label="Profile views (30d)" />
        <Metric icon={Inbox} value={String(leads.length)} label="Active leads" />
        <Metric icon={TrendingUp} value="38%" label="Lead conversion" />
        <Metric icon={Star} value="4.6" label="Avg rating" />
      </div>

      <EditProfileCard />

      <LogoSlot />

      <ProviderMediaSlot />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* leads — live from the inbox */}
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={18} className="text-navy" />
              <h3 className="font-semibold text-navy">Recent leads</h3>
            </div>
            {unread > 0 && (
              <span className="rounded-full bg-red px-2 py-0.5 text-xs font-bold text-white">
                {unread} new
              </span>
            )}
          </div>
          <div className="mt-4 space-y-2.5">
            {leads.length === 0 ? (
              <p className="rounded-xl border border-dashed border-ink/15 p-4 text-center text-sm text-ink/45">
                No leads yet.
              </p>
            ) : (
              leads.slice(0, 5).map((l) => (
                <Link
                  key={l.id}
                  href={`/app/inbox?thread=${l.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 p-3 transition-colors hover:border-navy/30"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                      {l.kind === "booking" ? (
                        <CalendarClock size={13} className="text-gold" />
                      ) : (
                        <MessageSquare size={13} className="text-ink/40" />
                      )}
                      {l.parentName} · <span className="font-normal text-ink/60">{l.athlete}</span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink/50">
                      {l.messages[l.messages.length - 1].body}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {l.unreadFor === "provider" && <span className="h-2 w-2 rounded-full bg-red" />}
                    {l.fit !== undefined && (
                      <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-bold text-ink">
                        {l.fit}%
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
          <Link
            href="/app/inbox"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            <Inbox size={15} /> Open inbox
          </Link>
        </div>

        {/* events — live, with real boosts */}
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
          <div className="mt-4 space-y-2.5">
            {myEvents.map((e) => (
              <div key={e.id} className="rounded-xl border border-ink/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-navy">{e.title}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BOOST_BADGE[e.boost].cls}`}>
                    {BOOST_BADGE[e.boost].label}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-ink/55">
                  <span>{formatEventDate(e.date)}</span>
                  <span>Reach: {e.reach.toLocaleString()} · {e.rsvps} RSVPs</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {BOOST_TIERS.map((b) => (
                    <button
                      key={b.tier}
                      onClick={() => boostEvent(e.id, b.tier)}
                      disabled={e.boost === b.tier}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                        e.boost === b.tier
                          ? "bg-navy text-white"
                          : "bg-gold text-ink hover:bg-gold-300"
                      }`}
                    >
                      <Megaphone size={11} /> {b.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EventFormModal
        open={creating}
        onClose={() => setCreating(false)}
        defaults={{
          listingId: LISTING.id,
          listingName: LISTING.name,
          sport: "Basketball",
          city: LISTING.city,
          county: LISTING.county,
        }}
      />
    </div>
  );
}
