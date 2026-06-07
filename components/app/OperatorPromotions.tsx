"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Megaphone,
  Users,
  Eye,
  MousePointerClick,
  ArrowLeft,
} from "lucide-react";
import type { AdPlacement, Campaign } from "@/lib/types";
import { getListing } from "@/lib/data/listings";
import { useStore } from "@/lib/store";
import { PLACEMENTS, PLACEMENT_LABEL } from "@/lib/promotions";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LogoAvatar } from "@/components/listing/LogoAvatar";

const fmt = (n: number) => n.toLocaleString();
const money = (n: number) => `$${fmt(Math.round(n))}`;
const PER_DAY = Object.fromEntries(PLACEMENTS.map((p) => [p.id, p.perDay])) as Record<AdPlacement, number>;

export function OperatorPromotions() {
  const { campaigns } = useStore();

  const stats = useMemo(() => {
    const revenue = campaigns.reduce((s, c) => s + c.metrics.spend, 0);
    const committed = campaigns.reduce((s, c) => s + c.budget, 0);
    const impressions = campaigns.reduce((s, c) => s + c.metrics.impressions, 0);
    const clicks = campaigns.reduce((s, c) => s + c.metrics.clicks, 0);
    const active = campaigns.filter((c) => c.status === "active");
    const advertisers = new Set(campaigns.map((c) => c.listingId)).size;

    // Daily run-rate from active flights → monthly projection.
    const dailyRunRate = active.reduce((s, c) => s + (c.durationDays ? c.budget / c.durationDays : 0), 0);

    // Distribute each campaign's spend across its placements by day-rate weight.
    const byPlacement: Record<string, number> = {};
    for (const c of campaigns) {
      const total = c.placements.reduce((s, p) => s + PER_DAY[p], 0) || 1;
      for (const p of c.placements) byPlacement[p] = (byPlacement[p] ?? 0) + (c.metrics.spend * PER_DAY[p]) / total;
    }

    // Spend by advertiser.
    const byAdvertiser: Record<string, { listingId: string; name: string; spend: number; count: number }> = {};
    for (const c of campaigns) {
      const a = (byAdvertiser[c.listingId] ??= { listingId: c.listingId, name: c.listingName, spend: 0, count: 0 });
      a.spend += c.metrics.spend;
      a.count += 1;
    }

    return {
      revenue,
      committed,
      impressions,
      clicks,
      activeCount: active.length,
      advertisers,
      dailyRunRate,
      ctr: impressions ? (clicks / impressions) * 100 : 0,
      byPlacement,
      advertisersList: Object.values(byAdvertiser).sort((a, b) => b.spend - a.spend),
    };
  }, [campaigns]);

  const maxPlacement = Math.max(1, ...Object.values(stats.byPlacement));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/app/promote" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-navy">
        <ArrowLeft size={15} /> Back to Promotions
      </Link>
      <Eyebrow className="mt-4">CSD operator · internal</Eyebrow>
      <h1 className="mt-3 display text-4xl text-navy">AD REVENUE</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/60">
        Platform-wide performance of the promotions marketplace — recognized revenue, committed
        budget, and delivery across every vetted advertiser.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={DollarSign} value={money(stats.revenue)} label="Recognized revenue" accent />
        <Kpi icon={TrendingUp} value={money(stats.committed)} label="Committed budget" />
        <Kpi icon={Megaphone} value={String(stats.activeCount)} label="Active campaigns" />
        <Kpi icon={Users} value={String(stats.advertisers)} label="Advertisers" />
        <Kpi icon={Eye} value={fmt(stats.impressions)} label="Impressions served" />
        <Kpi icon={MousePointerClick} value={fmt(stats.clicks)} label="Clicks" />
        <Kpi icon={TrendingUp} value={`${stats.ctr.toFixed(1)}%`} label="Blended CTR" />
        <Kpi icon={DollarSign} value={money(stats.dailyRunRate * 30)} label="Projected monthly run-rate" />
      </div>

      {/* revenue by placement */}
      <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-semibold text-navy">Revenue by placement</h2>
        <div className="mt-4 space-y-3">
          {PLACEMENTS.map((p) => {
            const v = stats.byPlacement[p.id] ?? 0;
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/70">{p.label}</span>
                  <span className="font-semibold text-navy">{money(v)}</span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-cream">
                  <div className="h-2.5 rounded-full bg-navy" style={{ width: `${(v / maxPlacement) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* top advertisers */}
      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-semibold text-navy">Top advertisers</h2>
        <div className="mt-4 space-y-2">
          {stats.advertisersList.map((a, i) => {
            const listing = getListing(a.listingId);
            return (
              <div key={a.listingId} className="flex items-center gap-3 rounded-xl border border-ink/10 p-3">
                <span className="w-5 text-center text-sm font-bold text-ink/35">{i + 1}</span>
                {listing && <LogoAvatar listing={listing} size="sm" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{a.name}</p>
                  <p className="text-xs text-ink/50">{a.count} campaign{a.count > 1 ? "s" : ""}</p>
                </div>
                <span className="font-bold text-navy">{money(a.spend)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* all campaigns */}
      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-semibold text-navy">All campaigns</h2>
        <div className="mt-4 space-y-2">
          {campaigns.map((c) => (
            <CampaignLine key={c.id} c={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Kpi({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: typeof DollarSign;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-gold/50 bg-gold/[0.08]" : "border-ink/10 bg-white"}`}>
      <Icon size={18} className={accent ? "text-gold" : "text-navy"} />
      <p className="display mt-2 text-2xl text-navy">{value}</p>
      <p className="eyebrow mt-1 text-ink/50">{label}</p>
    </div>
  );
}

const LINE_BADGE: Record<Campaign["status"], string> = {
  active: "bg-navy text-white",
  scheduled: "bg-gold/30 text-ink",
  ended: "bg-cream text-ink/55",
};

function CampaignLine({ c }: { c: Campaign }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-ink/10 p-3 text-sm">
      <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase ${LINE_BADGE[c.status]}`}>
        {c.status}
      </span>
      <span className="min-w-0 flex-1 truncate font-semibold text-navy">{c.headline}</span>
      <span className="text-xs text-ink/50">{c.listingName}</span>
      <span className="flex flex-wrap gap-1">
        {c.placements.map((p) => (
          <span key={p} className="rounded-full bg-cream px-1.5 py-0.5 text-[0.6rem] text-ink/55">
            {PLACEMENT_LABEL[p]}
          </span>
        ))}
      </span>
      <span className="ml-auto font-bold text-navy">{money(c.metrics.spend)}</span>
    </div>
  );
}
