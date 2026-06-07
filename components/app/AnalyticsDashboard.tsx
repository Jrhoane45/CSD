"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Inbox, TrendingUp, Crown, Activity } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useStore } from "@/lib/store";

const NAVY = "#14264f";
const GOLD = "#f5a800";
const MUTED = "#c9c3b4";

const LISTING_ID = "hoop-prodigy";

// Realistic baseline history; the current month and KPIs blend in live activity
// generated in this session so the funnel and fit mix react to real leads.
const BASE_TREND = [
  { m: "Jan", views: 1120, impressions: 3400, leads: 9 },
  { m: "Feb", views: 1480, impressions: 4100, leads: 12 },
  { m: "Mar", views: 1950, impressions: 5200, leads: 16 },
  { m: "Apr", views: 2600, impressions: 6800, leads: 21 },
  { m: "May", views: 3210, impressions: 8100, leads: 24 },
];
const BASE = {
  views: 3910,
  impressions: 9400,
  leads: 23,
  conversations: 15,
  enrollments: 7,
};
const SEED_FIT = { great: 58, good: 31, fair: 11 };

export function AnalyticsDashboard() {
  const { threads, events, reviews } = useStore();

  const live = useMemo(() => {
    const leads = threads.filter((t) => t.listingId === LISTING_ID);
    const conversations = leads.filter((t) => t.messages.length > 1).length;
    const enrollments = leads.filter((t) => t.kind === "booking").length;
    const rsvps = events
      .filter((e) => e.listingId === LISTING_ID)
      .reduce((s, e) => s + e.rsvps, 0);
    const reviewCount = reviews.filter((r) => r.listingId === LISTING_ID).length;

    const fitVals = leads.map((l) => l.fit).filter((f): f is number => f !== undefined);
    return { count: leads.length, conversations, enrollments, rsvps, reviewCount, fitVals };
  }, [threads, events, reviews]);

  const views = BASE.views + live.rsvps * 6 + live.count * 5;
  const impressions = BASE.impressions + live.rsvps * 20 + live.count * 12;
  const leads = BASE.leads + live.count;
  const conversations = BASE.conversations + live.conversations;
  const enrollments = BASE.enrollments + live.enrollments;
  const enrollRate = leads > 0 ? Math.round((enrollments / leads) * 100) : 0;

  const TREND = [
    ...BASE_TREND,
    { m: "Jun", views, impressions, leads },
  ];

  const FUNNEL = [
    { stage: "Impressions", v: impressions },
    { stage: "Profile views", v: views },
    { stage: "Leads", v: leads },
    { stage: "Conversations", v: conversations },
    { stage: "Enrollments", v: enrollments },
  ];

  const FIT = useMemo(() => {
    let great = SEED_FIT.great;
    let good = SEED_FIT.good;
    let fair = SEED_FIT.fair;
    if (live.fitVals.length) {
      const total = live.fitVals.length;
      const g = live.fitVals.filter((f) => f >= 85).length;
      const m = live.fitVals.filter((f) => f >= 70 && f < 85).length;
      great = Math.round((g / total) * 100);
      good = Math.round((m / total) * 100);
      fair = Math.max(0, 100 - great - good);
    }
    return [
      { name: "Great fit (85+)", v: great, c: GOLD },
      { name: "Good fit (70–84)", v: good, c: NAVY },
      { name: "Fair fit (<70)", v: fair, c: MUTED },
    ];
  }, [live.fitVals]);

  const KPIS = [
    { icon: Eye, v: views.toLocaleString(), l: "Profile views (30d)", d: "+22% MoM" },
    { icon: Inbox, v: String(leads), l: "Leads (30d)", d: live.count ? `+${live.count} live` : "+12% MoM" },
    { icon: TrendingUp, v: `${enrollRate}%`, l: "Lead → enrollment", d: "+4 pts" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/app/provider"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-navy"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Eyebrow>Analytics · Premium</Eyebrow>
          <h1 className="display mt-2 text-4xl text-navy">HOOP PRODIGY</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1.5 text-sm font-semibold text-ink">
          <Crown size={15} /> Paid tier
        </span>
      </div>

      {/* KPI row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {KPIS.map((k) => (
          <div key={k.l} className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <k.icon size={20} className="text-navy" />
              <span className="text-xs font-semibold text-green-600">{k.d}</span>
            </div>
            <p className="display mt-3 text-4xl text-navy">{k.v}</p>
            <p className="eyebrow mt-1 text-ink/50">{k.l}</p>
          </div>
        ))}
      </div>

      {/* views trend */}
      <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <h3 className="font-semibold text-navy">Profile views &amp; impressions</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="g-views" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NAVY} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={NAVY} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g-imp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e1d3" vertical={false} />
              <XAxis dataKey="m" stroke="#cfc8b8" tick={{ fill: "#6b6b6b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b6b6b", fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="impressions" stroke={GOLD} fill="url(#g-imp)" strokeWidth={2} />
              <Area type="monotone" dataKey="views" stroke={NAVY} fill="url(#g-views)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* funnel */}
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <h3 className="font-semibold text-navy">Lead funnel (30d)</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FUNNEL} layout="vertical" margin={{ left: 24, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e1d3" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6b6b6b", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="stage"
                  width={92}
                  tick={{ fill: "#6b6b6b", fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="v" fill={NAVY} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* fit quality */}
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <h3 className="font-semibold text-navy">Lead fit quality</h3>
          <p className="text-sm text-ink/55">Higher-fit leads mean lower churn.</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="h-52 w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={FIT} dataKey="v" nameKey="name" innerRadius={42} outerRadius={72} paddingAngle={2}>
                    {FIT.map((f) => (
                      <Cell key={f.name} fill={f.c} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-1/2 space-y-2">
              {FIT.map((f) => (
                <li key={f.name} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-full" style={{ background: f.c }} />
                  <span className="text-ink/70">{f.name}</span>
                  <span className="ml-auto font-semibold text-navy">{f.v}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-xs text-ink/45">
        <Activity size={13} className="text-navy/50" />
        Baseline history is illustrative; KPIs, the funnel, and fit mix update live with the leads,
        bookings, and event RSVPs generated in this demo session.
      </p>
    </div>
  );
}
