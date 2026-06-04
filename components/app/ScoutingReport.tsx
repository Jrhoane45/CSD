"use client";

import Link from "next/link";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import {
  Lock,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CircleCheck,
  Target,
  RefreshCw,
  Crown,
  MapPin,
} from "lucide-react";
import type { AthleteProfile, DevLevel } from "@/lib/types";
import {
  PILLARS,
  PILLAR_NAME,
  TIER_META,
  pillarBand,
  developmentPathway,
  strengths,
  type PiqResult,
  type PillarKey,
} from "@/lib/prospectiq";
import { rankMatches } from "@/lib/scoring";
import { LISTINGS, CATEGORY_LABEL } from "@/lib/data/listings";
import { LogoAvatar } from "@/components/listing/LogoAvatar";

const NAVY = "#14264f";
const GOLD = "#f5a800";

const TIER_TO_LEVEL: Record<string, DevLevel> = {
  Beginner: "Recreational",
  Intermediate: "Intermediate",
  Competitive: "Competitive",
  Elite: "Elite",
};

const SHORT: Record<PillarKey, string> = {
  T: "Technical",
  A: "Athleticism",
  G: "Game IQ",
  C: "Compete",
  E: "Trajectory",
};

export function ScoutingReport({
  result,
  profile,
  locked = false,
  onUnlock,
  onVerify,
  onReevaluate,
}: {
  result: PiqResult;
  profile?: AthleteProfile | null;
  locked?: boolean;
  onUnlock?: () => void;
  onVerify?: () => void;
  onReevaluate?: () => void;
}) {
  const tm = TIER_META[result.tier];
  const radar = PILLARS.map((p) => ({ pillar: SHORT[p.key], value: result.pillars[p.key] }));
  const str = strengths(result);
  const pathway = developmentPathway(result);
  const growth = pathway.map((p) => p.pillar);

  const matchProfile: AthleteProfile = {
    sport: result.sport,
    age: result.age,
    level: TIER_TO_LEVEL[result.tier],
    county: profile?.county ?? "",
    zip: profile?.zip,
    maxMiles: profile?.maxMiles ?? 30,
    priceMax: profile?.priceMax ?? 0,
    category: "any",
    goals: profile?.goals ?? ["Skill development"],
  };
  const matches = rankMatches(matchProfile, LISTINGS).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* headline */}
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-navy text-white">
        <div className="flex flex-wrap items-center justify-between gap-4 p-7">
          <div>
            <p className="eyebrow text-gold-300">Prospect IQ™ Scouting Report</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="display text-6xl text-white">{result.tier}</span>
              {result.verified ? (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-ink">
                  <ShieldCheck size={13} /> Human-verified
                </span>
              ) : (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-cream/80">
                  AI evaluation
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-cream/75">
              {result.sport} · {result.position} · Age {result.age} — {tm.blurb}
            </p>
          </div>
          <div className="flex gap-6">
            <Stat label="Cohort percentile" value={`${result.percentile}th`} />
            <Stat label="PIQ composite" value={`${result.composite}`} />
            <Stat label="Confidence" value={`${result.confidence}%`} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-7 py-3 text-xs text-cream/70">
          {result.highPotential && (
            <span className="inline-flex items-center gap-1 font-semibold text-gold-300">
              <Sparkles size={13} /> High-potential flag
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" /> National cohort · beta-seeded benchmarks
          </span>
          <span className="text-cream/50">Development, not destiny — guidance only, not a guarantee.</span>
        </div>
      </div>

      {/* locked = lite snapshot */}
      {locked ? (
        <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-7">
          <div className="pointer-events-none blur-[6px]">
            <RadarBlock radar={radar} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/55 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
              <Lock size={24} />
            </div>
            <h3 className="display text-2xl text-navy">UNLOCK THE FULL SCOUTING REPORT</h3>
            <p className="max-w-md text-sm text-ink/65">
              See the five-pillar breakdown, strengths &amp; growth areas, a personalized development
              pathway, and your best-fit program matches.
            </p>
            <button
              onClick={onUnlock}
              className="mt-1 inline-flex items-center gap-2 rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-red-600"
            >
              Unlock full report <ArrowRight size={16} />
            </button>
            <p className="text-xs text-ink/45">Included with a Prospect IQ subscription</p>
          </div>
        </div>
      ) : (
        <>
          {/* pillars: radar + bars */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-ink/10 bg-white p-6">
              <h3 className="font-semibold text-navy">Five-pillar breakdown</h3>
              <RadarBlock radar={radar} />
            </div>
            <div className="rounded-3xl border border-ink/10 bg-white p-6">
              <h3 className="font-semibold text-navy">Pillar scores</h3>
              <div className="mt-4 space-y-3.5">
                {PILLARS.map((p) => {
                  const v = result.pillars[p.key];
                  return (
                    <div key={p.key}>
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-medium text-navy">{p.name}</span>
                        <span className="text-ink/60">
                          <span className="font-semibold text-navy">{v}</span> · {pillarBand(v)}
                        </span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-cream">
                        <div className="h-2 rounded-full bg-navy" style={{ width: `${v}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-ink/45">{p.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* strengths & growth */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <h3 className="flex items-center gap-2 font-semibold text-navy">
                <CircleCheck size={18} className="text-green-600" /> Strengths
              </h3>
              <ul className="mt-3 space-y-2">
                {str.map((k) => (
                  <li key={k} className="flex items-center justify-between text-sm">
                    <span className="text-ink/75">{PILLAR_NAME[k]}</span>
                    <span className="font-semibold text-navy">{result.pillars[k]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <h3 className="flex items-center gap-2 font-semibold text-navy">
                <TrendingUp size={18} className="text-red" /> Growth areas
              </h3>
              <ul className="mt-3 space-y-2">
                {growth.map((k) => (
                  <li key={k} className="flex items-center justify-between text-sm">
                    <span className="text-ink/75">{PILLAR_NAME[k]}</span>
                    <span className="font-semibold text-navy">{result.pillars[k]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* development pathway */}
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <h3 className="flex items-center gap-2 font-semibold text-navy">
              <Target size={18} className="text-navy" /> Development pathway
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {pathway.map((item) => (
                <div key={item.pillar} className="rounded-xl bg-cream/60 p-4">
                  <p className="text-sm font-bold text-navy">{item.pillarName}</p>
                  <p className="mt-1 text-sm text-ink/70">{item.focus}</p>
                  <ul className="mt-2 space-y-1">
                    {item.drills.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-xs text-ink/60">
                        <span className="inline-block h-1 w-1 rounded-full bg-gold" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* matches */}
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-gold" />
              <h3 className="font-semibold text-navy">Best-fit matches for this evaluation</h3>
            </div>
            <div className="mt-4 space-y-3">
              {matches.map((m) => (
                <Link
                  key={m.listing.id}
                  href={`/app/listing/${m.listing.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-ink/10 p-3 transition-colors hover:border-navy/30"
                >
                  <LogoAvatar listing={m.listing} size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold text-navy">{m.listing.name}</p>
                    <p className="text-xs text-ink/55">
                      {CATEGORY_LABEL[m.listing.category]} ·{" "}
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin size={11} /> {m.listing.city}
                      </span>
                    </p>
                  </div>
                  <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-bold text-ink">{m.fit}% fit</span>
                  <ArrowRight size={15} className="text-ink/30 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* premium verify + re-eval */}
          <div className="grid gap-4 sm:grid-cols-2">
            {!result.verified && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/[0.08] p-5">
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-navy">
                    <Crown size={16} className="text-gold" /> Get it human-verified
                  </p>
                  <p className="mt-1 text-xs text-ink/60">A certified CSD evaluator reviews & signs off.</p>
                </div>
                <button
                  onClick={onVerify}
                  className="shrink-0 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
                >
                  Request
                </button>
              </div>
            )}
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-5">
              <div>
                <p className="flex items-center gap-1.5 font-semibold text-navy">
                  <RefreshCw size={16} className="text-navy" /> Track progress
                </p>
                <p className="mt-1 text-xs text-ink/60">Re-evaluate to measure development over time.</p>
              </div>
              <button
                onClick={onReevaluate}
                className="shrink-0 rounded-lg border border-navy/30 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
              >
                Re-evaluate
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="display text-3xl text-gold">{value}</p>
      <p className="eyebrow text-[0.55rem] text-cream/55">{label}</p>
    </div>
  );
}

function RadarBlock({ radar }: { radar: { pillar: string; value: number }[] }) {
  return (
    <div className="mt-2 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radar} outerRadius="72%">
          <PolarGrid stroke="#e7e1d3" />
          <PolarAngleAxis dataKey="pillar" tick={{ fill: "#6b6b6b", fontSize: 11 }} />
          <Radar dataKey="value" stroke={NAVY} fill={GOLD} fillOpacity={0.45} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
