"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  BadgeCheck,
  Flag,
  DollarSign,
  Building2,
  CalendarDays,
  Inbox,
  AlertTriangle,
  ArrowRight,
  Lock,
} from "lucide-react";
import { LISTINGS } from "@/lib/data/listings";
import { SEED_MODERATION } from "@/lib/data/activity";
import { useStore, vettingStatusFor } from "@/lib/store";
import { lockOperator } from "@/lib/useOperatorAuth";
import { Eyebrow } from "@/components/ui/Eyebrow";

const fmt = (n: number) => n.toLocaleString();

export function OperatorConsole() {
  const { threads, events, campaigns, vetting, moderation } = useStore();

  const m = useMemo(() => {
    let verified = 0;
    let pending = 0;
    let suspended = 0;
    for (const l of LISTINGS) {
      const s = vettingStatusFor(l, vetting);
      if (s === "verified") verified++;
      else if (s === "pending") pending++;
      else suspended++;
    }
    const openMod = SEED_MODERATION.filter((i) => !moderation[i.id]).length;
    const adRevenue = campaigns.reduce((s, c) => s + c.metrics.spend, 0);
    const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
    return { verified, pending, suspended, openMod, adRevenue, activeCampaigns };
  }, [vetting, moderation, campaigns]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>CSD operator · internal</Eyebrow>
          <h1 className="mt-3 display text-4xl text-navy">OPERATOR CONSOLE</h1>
          <p className="mt-1 max-w-xl text-sm text-ink/60">
            Platform health at a glance — provider vetting, content moderation, and the promotions
            marketplace, all in one place.
          </p>
        </div>
        <button
          onClick={() => lockOperator()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-2 text-xs font-semibold text-ink/60 hover:border-navy/40 hover:text-navy"
        >
          <Lock size={14} /> Lock console
        </button>
      </div>

      {/* platform KPIs */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Building2} value={String(LISTINGS.length)} label="Providers" />
        <Kpi icon={BadgeCheck} value={String(m.verified)} label="Verified" />
        <Kpi icon={Inbox} value={String(threads.length)} label="Active leads" />
        <Kpi icon={CalendarDays} value={String(events.length)} label="Live events" />
      </div>

      {/* action queues */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <QueueCard
          href="/app/operator/providers"
          icon={BadgeCheck}
          title="Provider vetting"
          count={m.pending}
          countLabel="awaiting review"
          note={m.suspended > 0 ? `${m.suspended} suspended` : "All clear"}
          urgent={m.pending > 0}
        />
        <QueueCard
          href="/app/operator/moderation"
          icon={Flag}
          title="Content moderation"
          count={m.openMod}
          countLabel="open reports"
          note={m.openMod > 0 ? "Needs attention" : "Queue clear"}
          urgent={m.openMod > 0}
        />
        <QueueCard
          href="/app/operator/promotions"
          icon={DollarSign}
          title="Ad revenue"
          count={`$${fmt(m.adRevenue)}`}
          countLabel="recognized"
          note={`${m.activeCampaigns} active campaigns`}
        />
      </div>

      <div className="mt-8 flex items-center gap-2 rounded-2xl border border-ink/10 bg-white p-5">
        <ShieldCheck size={20} className="shrink-0 text-gold" />
        <p className="text-sm text-ink/60">
          The operator role governs trust &amp; safety across CSD: only vetted, verified providers
          appear to families and can advertise. Use the queues above to keep the marketplace clean.
        </p>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, value, label }: { icon: typeof Building2; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <Icon size={18} className="text-navy" />
      <p className="display mt-2 text-2xl text-navy">{value}</p>
      <p className="eyebrow mt-1 text-ink/50">{label}</p>
    </div>
  );
}

function QueueCard({
  href,
  icon: Icon,
  title,
  count,
  countLabel,
  note,
  urgent,
}: {
  href: string;
  icon: typeof Flag;
  title: string;
  count: number | string;
  countLabel: string;
  note: string;
  urgent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-2xl border bg-white p-5 transition-shadow hover:shadow-[var(--shadow-lift)] ${
        urgent ? "border-gold/50" : "border-ink/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <Icon size={20} className="text-navy" />
        {urgent && <AlertTriangle size={16} className="text-gold" />}
      </div>
      <p className="mt-3 font-semibold text-navy">{title}</p>
      <p className="mt-1 display text-3xl text-navy">{count}</p>
      <p className="text-xs text-ink/50">{countLabel}</p>
      <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3 text-xs">
        <span className="text-ink/55">{note}</span>
        <ArrowRight size={14} className="text-ink/40 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
