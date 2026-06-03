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
import Link from "next/link";
import { ArrowLeft, Eye, Inbox, TrendingUp, Crown } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const NAVY = "#14264f";
const GOLD = "#f5a800";
const RED = "#c8102e";

const TREND = [
  { m: "Jan", views: 1120, impressions: 3400, leads: 9 },
  { m: "Feb", views: 1480, impressions: 4100, leads: 12 },
  { m: "Mar", views: 1950, impressions: 5200, leads: 16 },
  { m: "Apr", views: 2600, impressions: 6800, leads: 21 },
  { m: "May", views: 3210, impressions: 8100, leads: 24 },
  { m: "Jun", views: 3910, impressions: 9400, leads: 27 },
];

const FUNNEL = [
  { stage: "Impressions", v: 9400 },
  { stage: "Profile views", v: 3910 },
  { stage: "Leads", v: 27 },
  { stage: "Conversations", v: 18 },
  { stage: "Enrollments", v: 7 },
];

const FIT = [
  { name: "Great fit (85+)", v: 58, c: GOLD },
  { name: "Good fit (70–84)", v: 31, c: NAVY },
  { name: "Fair fit (<70)", v: 11, c: "#c9c3b4" },
];

export function AnalyticsDashboard() {
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
        {[
          { icon: Eye, v: "3,910", l: "Profile views (30d)", d: "+22% MoM" },
          { icon: Inbox, v: "27", l: "Leads (30d)", d: "+12% MoM" },
          { icon: TrendingUp, v: "38%", l: "Lead → enrollment", d: "+4 pts" },
        ].map((k) => (
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

      <p className="mt-6 text-xs text-ink/45">
        Sample analytics for demonstration. In production these reflect real platform activity.
      </p>
    </div>
  );
}
