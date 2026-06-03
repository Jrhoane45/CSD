"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import type { AthleteProfile, Category, DevLevel, Sport } from "@/lib/types";
import { rankMatches } from "@/lib/scoring";
import {
  LISTINGS,
  SPORTS_LIST,
  COUNTIES_LIST,
  GOALS_LIST,
  CATEGORY_LABEL,
} from "@/lib/data/listings";
import { CsdScoreBadge } from "@/components/ui/CsdScoreBadge";
import { computeCsdScore } from "@/lib/scoring";
import { SaveButton } from "@/components/app/SaveButton";

const LEVELS: { value: DevLevel; blurb: string }[] = [
  { value: "Recreational", blurb: "First exposure — fun and fundamentals." },
  { value: "Intermediate", blurb: "Building fundamentals, entry competitive." },
  { value: "Competitive", blurb: "Year-round travel and competition." },
  { value: "Elite", blurb: "Showcase, national, pre-collegiate." },
];

const STEPS = ["Sport", "Level", "Location", "Goals"];

const EMPTY: AthleteProfile = {
  sport: "",
  age: null,
  level: "",
  county: "",
  maxMiles: 30,
  category: "any",
  goals: [],
};

export function MatchFlow() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<AthleteProfile>(EMPTY);
  const [done, setDone] = useState(false);

  const set = (patch: Partial<AthleteProfile>) => setProfile((p) => ({ ...p, ...patch }));
  const toggleGoal = (g: string) =>
    set({
      goals: profile.goals.includes(g)
        ? profile.goals.filter((x) => x !== g)
        : [...profile.goals, g],
    });

  const canNext =
    (step === 0 && profile.sport) ||
    (step === 1 && profile.level) ||
    step === 2 ||
    step === 3;

  const results = useMemo(
    () => (done ? rankMatches(profile, LISTINGS).slice(0, 6) : []),
    [done, profile],
  );

  if (done) {
    return (
      <Results
        profile={profile}
        results={results}
        onRestart={() => {
          setProfile(EMPTY);
          setStep(0);
          setDone(false);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Ribbon />

      {/* progress */}
      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col gap-1.5">
            <div
              className={`h-1.5 rounded-full ${i <= step ? "bg-navy" : "bg-ink/15"}`}
            />
            <span className={`text-xs font-medium ${i === step ? "text-navy" : "text-ink/40"}`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-7 sm:p-9">
        {step === 0 && (
          <Step title="What's the sport?" subtitle="Pick the sport your athlete plays.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SPORTS_LIST.map((s) => (
                <Choice
                  key={s}
                  selected={profile.sport === s}
                  onClick={() => set({ sport: s as Sport })}
                >
                  {s}
                </Choice>
              ))}
            </div>
            <div className="mt-6">
              <label className="eyebrow text-ink/50">Athlete age (optional)</label>
              <input
                type="number"
                min={5}
                max={18}
                value={profile.age ?? ""}
                onChange={(e) => set({ age: e.target.value ? Number(e.target.value) : null })}
                placeholder="e.g. 14"
                className="mt-2 w-32 rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
              />
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step
            title="What's their development level?"
            subtitle="This is the single biggest driver of fit — and of churn when it's wrong."
          >
            <div className="space-y-3">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => set({ level: l.value })}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                    profile.level === l.value
                      ? "border-navy bg-navy/[0.05]"
                      : "border-ink/15 hover:border-navy/40"
                  }`}
                >
                  <span>
                    <span className="block font-semibold text-navy">{l.value}</span>
                    <span className="block text-sm text-ink/55">{l.blurb}</span>
                  </span>
                  {profile.level === l.value && <Check size={20} className="text-navy" />}
                </button>
              ))}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title="Where are you?" subtitle="We'll prioritize programs within range.">
            <label className="eyebrow text-ink/50">County</label>
            <select
              value={profile.county}
              onChange={(e) => set({ county: e.target.value as AthleteProfile["county"] })}
              className="mt-2 w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
            >
              <option value="">Select a county…</option>
              {COUNTIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c} County
                </option>
              ))}
            </select>
            <div className="mt-6">
              <label className="eyebrow text-ink/50">
                Willing to travel · {profile.maxMiles} miles
              </label>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={profile.maxMiles}
                onChange={(e) => set({ maxMiles: Number(e.target.value) })}
                className="mt-2 w-full accent-navy"
              />
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="What are you looking for?" subtitle="Pick a category and the goals that matter.">
            <label className="eyebrow text-ink/50">Type of provider</label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(["any", "club", "trainer", "consultant"] as (Category | "any")[]).map((c) => (
                <Choice key={c} selected={profile.category === c} onClick={() => set({ category: c })}>
                  {c === "any" ? "Any" : CATEGORY_LABEL[c].split(" ")[0]}
                </Choice>
              ))}
            </div>
            <label className="eyebrow mt-6 block text-ink/50">Goals</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {GOALS_LIST.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGoal(g)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    profile.goals.includes(g)
                      ? "border-navy bg-navy text-white"
                      : "border-ink/15 text-ink/70 hover:border-navy/40"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </Step>
        )}

        {/* nav */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 disabled:opacity-0"
          >
            <ArrowLeft size={16} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-deep disabled:opacity-40"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => setDone(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              See my matches <Sparkles size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Ribbon() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/[0.1] px-4 py-1.5 text-xs font-medium text-ink/70">
      <Sparkles size={14} className="text-gold" />
      <span>
        <span className="font-semibold text-navy">Intelligence Layer</span> · AI Matching Engine —
        coming next. This preview uses CSD&apos;s fit logic on sample data.
      </span>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy">{title}</h2>
      <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
        selected ? "border-navy bg-navy text-white" : "border-ink/15 text-navy hover:border-navy/40"
      }`}
    >
      {children}
    </button>
  );
}

function Results({
  profile,
  results,
  onRestart,
}: {
  profile: AthleteProfile;
  results: ReturnType<typeof rankMatches>;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Ribbon />
          <h1 className="display mt-4 text-4xl text-navy">YOUR MATCHES</h1>
          <p className="mt-2 text-sm text-ink/60">
            {profile.sport} · {profile.level || "Any level"}
            {profile.county && ` · ${profile.county} County`} ·{" "}
            {results.length} fit-scored {results.length === 1 ? "result" : "results"}
          </p>
        </div>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
        >
          <RefreshCw size={15} /> Start over
        </button>
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/20 p-12 text-center text-ink/55">
          No programs matched those inputs. Try a different sport or widen your range.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {results.map((m, i) => (
            <MatchCard key={m.listing.id} match={m} rank={i + 1} top={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchCard({
  match,
  rank,
  top,
}: {
  match: ReturnType<typeof rankMatches>[number];
  rank: number;
  top: boolean;
}) {
  const { listing, fit, factors } = match;
  const score = computeCsdScore(listing).score;
  const topFactors = [...factors].sort((a, b) => b.points / b.max - a.points / a.max).slice(0, 3);

  return (
    <div
      className={`rounded-2xl border bg-white p-6 ${
        top ? "border-gold shadow-[var(--shadow-lift)]" : "border-ink/10"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <FitRing fit={fit} />
          <div>
            {top && <span className="eyebrow text-gold">Top match</span>}
            <Link
              href={`/app/listing/${listing.id}`}
              className="block text-lg font-bold text-navy hover:underline"
            >
              {rank}. {listing.name}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/60">
              <span className="font-medium text-ink/80">{CATEGORY_LABEL[listing.category]}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} /> {listing.city}, {listing.county} Co.
              </span>
            </div>
          </div>
        </div>
        <CsdScoreBadge score={score} size="sm" />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {topFactors.map((f) => (
          <div key={f.label} className="rounded-lg bg-cream/60 px-3 py-2">
            <p className="text-xs font-semibold text-navy">{f.label}</p>
            <p className="text-xs text-ink/60">{f.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <Link
          href={`/app/listing/${listing.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          View profile <ArrowRight size={15} />
        </Link>
        <SaveButton id={listing.id} />
      </div>
    </div>
  );
}

function FitRing({ fit }: { fit: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const off = c - (fit / 100) * c;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#efe9db" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={fit >= 80 ? "#f5a800" : "#14264f"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="display text-lg leading-none text-navy">{fit}</span>
        <span className="text-[0.5rem] font-semibold uppercase tracking-wide text-ink/45">fit</span>
      </div>
    </div>
  );
}
