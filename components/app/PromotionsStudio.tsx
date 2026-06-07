"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  ShieldCheck,
  Eye,
  MousePointerClick,
  CalendarCheck,
  DollarSign,
  Sparkles,
  ArrowRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import type { Campaign } from "@/lib/types";
import { getListing } from "@/lib/data/listings";
import { useStore, endCampaign } from "@/lib/store";
import { CAMPAIGN_PLANS, PLACEMENT_LABEL, daysUntil, type CampaignPlan } from "@/lib/promotions";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AdBadge } from "@/components/app/AdBadge";
import { CampaignBuilder } from "@/components/app/CampaignBuilder";

const LISTING = getListing("hoop-prodigy")!;
const fmt = (n: number) => n.toLocaleString();
const ctr = (c: Campaign) => (c.metrics.impressions ? (c.metrics.clicks / c.metrics.impressions) * 100 : 0);

const STATUS_BADGE: Record<Campaign["status"], string> = {
  active: "bg-navy text-white",
  scheduled: "bg-gold/30 text-ink",
  ended: "bg-cream text-ink/55",
};

export function PromotionsStudio() {
  const { campaigns } = useStore();
  const mine = useMemo(() => campaigns.filter((c) => c.listingId === LISTING.id), [campaigns]);

  const totals = mine.reduce(
    (a, c) => ({
      impressions: a.impressions + c.metrics.impressions,
      clicks: a.clicks + c.metrics.clicks,
      rsvps: a.rsvps + c.metrics.rsvps,
      spend: a.spend + c.metrics.spend,
    }),
    { impressions: 0, clicks: 0, rsvps: 0, spend: 0 },
  );

  const [builder, setBuilder] = useState(false);
  const [plan, setPlan] = useState<CampaignPlan | null>(null);

  const launch = (p: CampaignPlan | null) => {
    setPlan(p);
    setBuilder(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Eyebrow>Promotions studio</Eyebrow>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-navy">PROMOTE YOUR EVENTS</h1>
          <p className="mt-1 max-w-xl text-sm text-ink/60">
            Tournaments, showcases, camps &amp; clinics — promote free on your profile, or run a paid
            campaign across the app and web. Every ad is labeled as a vetted, verified provider.
          </p>
        </div>
        <button
          onClick={() => launch(null)}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          <Plus size={16} /> New campaign
        </button>
      </div>

      {/* free vs paid framing */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <p className="font-semibold text-navy">Always free</p>
          <p className="mt-1 text-sm text-ink/60">
            Every event you publish appears on your profile and the in-network Events board.
          </p>
          <Link href="/app/provider" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-red">
            Manage events <ArrowRight size={14} />
          </Link>
        </div>
        <div className="rounded-2xl border border-gold/40 bg-gold/[0.07] p-5">
          <p className="flex items-center gap-1.5 font-semibold text-navy">
            <Megaphone size={16} className="text-gold" /> Paid reach
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Boost across Discover, banners, and pop-ups — like a boosted social post, but in front of
            vetted youth-sports families only.
          </p>
        </div>
      </div>

      {/* reporting */}
      {mine.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-navy" />
            <h2 className="display text-2xl text-navy">CAMPAIGN REPORTING</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <Kpi icon={Eye} value={fmt(totals.impressions)} label="Impressions" />
            <Kpi icon={MousePointerClick} value={fmt(totals.clicks)} label="Clicks" />
            <Kpi icon={CalendarCheck} value={fmt(totals.rsvps)} label="RSVPs driven" />
            <Kpi icon={DollarSign} value={`$${fmt(totals.spend)}`} label="Spend" />
          </div>
          <div className="mt-4 space-y-3">
            {mine.map((c) => (
              <CampaignRow key={c.id} c={c} />
            ))}
          </div>
        </section>
      )}

      {/* recommended plans */}
      <section className="mt-10">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-gold" />
          <h2 className="display text-2xl text-navy">NOT SURE? START FROM A PLAN</h2>
        </div>
        <p className="mt-1 text-sm text-ink/55">
          Recommended campaign playbooks — pick one and we&apos;ll prefill the details.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {CAMPAIGN_PLANS.map((p) => (
            <div key={p.key} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5">
              <p className="font-bold text-navy">{p.name}</p>
              <p className="mt-1 text-sm font-medium text-ink/70">{p.tagline}</p>
              <p className="mt-2 flex-1 text-xs text-ink/55">{p.rationale}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.placements.map((pl) => (
                  <span key={pl} className="rounded-full bg-cream px-2 py-0.5 text-[0.65rem] font-medium text-ink/65">
                    {PLACEMENT_LABEL[pl]}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink/45">
                {p.audience} · {p.durationDays} days
              </p>
              <button
                onClick={() => launch(p)}
                className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
              >
                Use this plan <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
        <p className="flex items-center gap-1.5 text-xs text-ink/45">
          <ShieldCheck size={13} /> Only CSD-vetted providers can advertise. Families always see the
          &quot;Vetted provider&quot; label so they know promoted content is from a trusted program.
        </p>
        <Link
          href="/app/operator/promotions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-navy"
        >
          CSD operator: ad revenue <ArrowRight size={13} />
        </Link>
      </div>

      <CampaignBuilder open={builder} onClose={() => setBuilder(false)} listing={LISTING} plan={plan} />
    </div>
  );
}

function Kpi({ icon: Icon, value, label }: { icon: typeof Eye; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <Icon size={18} className="text-navy" />
      <p className="display mt-2 text-2xl text-navy">{value}</p>
      <p className="eyebrow mt-1 text-ink/50">{label}</p>
    </div>
  );
}

function CampaignRow({ c }: { c: Campaign }) {
  const pacing = c.budget ? Math.min(100, Math.round((c.metrics.spend / c.budget) * 100)) : 0;
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AdBadge />
            <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase ${STATUS_BADGE[c.status]}`}>
              {c.status}
            </span>
          </div>
          <p className="mt-1.5 font-bold text-navy">{c.headline}</p>
          <p className="text-xs text-ink/55">
            {c.objective} · {c.audience} · {c.payment}
          </p>
          <p className="mt-0.5 text-xs text-ink/45">
            {c.startDate} → {c.endDate}
            {c.status === "scheduled" && daysUntil(c.startDate) >= 0 && (
              <span className="ml-1.5 font-semibold text-ink/60">· starts in {daysUntil(c.startDate)}d</span>
            )}
          </p>
        </div>
        {c.status !== "ended" && (
          <button
            onClick={() => endCampaign(c.id)}
            className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/60 hover:text-red"
          >
            {c.status === "scheduled" ? "Cancel" : "End campaign"}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {c.placements.map((p) => (
          <span key={p} className="rounded-full bg-cream px-2 py-0.5 text-[0.65rem] font-medium text-ink/65">
            {PLACEMENT_LABEL[p]}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Mini label="Impressions" value={fmt(c.metrics.impressions)} />
        <Mini label="Clicks" value={fmt(c.metrics.clicks)} />
        <Mini label="CTR" value={`${ctr(c).toFixed(1)}%`} />
        <Mini label="RSVPs" value={fmt(c.metrics.rsvps)} />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-ink/55">
          <span>Budget pacing</span>
          <span>
            ${fmt(c.metrics.spend)} / ${fmt(c.budget)}
          </span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-cream">
          <div className="h-2 rounded-full bg-gold" style={{ width: `${pacing}%` }} />
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-cream/50 p-3 text-center">
      <p className="text-sm font-bold text-navy">{value}</p>
      <p className="text-[0.6rem] uppercase tracking-wide text-ink/45">{label}</p>
    </div>
  );
}
