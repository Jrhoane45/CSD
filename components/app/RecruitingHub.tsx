"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  ListChecks,
  School,
  Compass,
} from "lucide-react";
import type { SchoolDivision, SchoolStatus } from "@/lib/types";
import { useProfile } from "@/lib/useProfile";
import {
  useStore,
  toggleRecruitingTask,
  addTargetSchool,
  setSchoolStatus,
  removeTargetSchool,
} from "@/lib/store";
import { rankMatches } from "@/lib/scoring";
import { LISTINGS, CATEGORY_LABEL } from "@/lib/data/listings";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LogoAvatar } from "@/components/listing/LogoAvatar";
import { CsdScoreBadge } from "@/components/ui/CsdScoreBadge";
import { computeCsdScore } from "@/lib/scoring";

const CURRENT_YEAR = 2026;

const PHASES = [
  {
    key: "explore",
    label: "Freshman – Sophomore",
    subtitle: "Explore & build a foundation",
    tasks: [
      { id: "ex-resume", label: "Create a sport résumé (stats, positions, club history)" },
      { id: "ex-film", label: "Start a highlight reel" },
      { id: "ex-gpa", label: "Lock in strong grades — GPA opens doors" },
      { id: "ex-camps", label: "Attend ID camps & showcases" },
    ],
  },
  {
    key: "engage",
    label: "Junior year",
    subtitle: "Engage with programs",
    tasks: [
      { id: "jr-ncaa", label: "Register with the NCAA Eligibility Center" },
      { id: "jr-test", label: "Take the SAT / ACT" },
      { id: "jr-list", label: "Build your target school list (below)" },
      { id: "jr-email", label: "Email coaches with your film & academics" },
      { id: "jr-update", label: "Refresh your highlight film each season" },
    ],
  },
  {
    key: "decide",
    label: "Senior year",
    subtitle: "Decide & commit",
    tasks: [
      { id: "sr-visits", label: "Take official & unofficial visits" },
      { id: "sr-narrow", label: "Narrow your list to best-fit programs" },
      { id: "sr-apply", label: "Apply for admission & financial aid (FAFSA)" },
      { id: "sr-review", label: "Review offers with an adviser" },
      { id: "sr-commit", label: "Commit & sign (National Letter of Intent)" },
    ],
  },
] as const;

const ALL_TASK_IDS = PHASES.flatMap((p) => p.tasks.map((t) => t.id));

const DIVISIONS: SchoolDivision[] = ["D1", "D2", "D3", "NAIA", "JUCO"];
const STATUSES: SchoolStatus[] = ["Researching", "Contacted", "Visited", "Offer"];
const STATUS_TONE: Record<SchoolStatus, string> = {
  Researching: "bg-cream text-ink/65",
  Contacted: "bg-navy/10 text-navy",
  Visited: "bg-gold/20 text-ink",
  Offer: "bg-red/10 text-red",
};

export function RecruitingHub() {
  const { profile, ready } = useProfile();
  const { recruiting } = useStore();

  const currentPhase = useMemo(() => {
    const gy = profile?.gradYear ? Number(profile.gradYear) : null;
    if (!gy) return null;
    const diff = gy - CURRENT_YEAR;
    if (diff <= 0) return "decide";
    if (diff === 1) return "engage";
    return "explore";
  }, [profile?.gradYear]);

  const done = ALL_TASK_IDS.filter((id) => recruiting.tasks[id]).length;
  const pct = Math.round((done / ALL_TASK_IDS.length) * 100);

  const advisers = useMemo(() => {
    if (profile?.sport) {
      const base = { ...profile, category: "consultant" as const };
      return rankMatches(base, LISTINGS).slice(0, 3);
    }
    return LISTINGS.filter((l) => l.category === "consultant")
      .sort((a, b) => computeCsdScore(b).score - computeCsdScore(a).score)
      .slice(0, 3)
      .map((listing) => ({ listing, fit: 0, factors: [], headline: "" }));
  }, [profile]);

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Eyebrow>Recruiting Hub</Eyebrow>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-navy">YOUR RECRUITING PLAN</h1>
          <p className="mt-1 text-sm text-ink/60">
            {profile?.firstName
              ? `A college-pathway roadmap for ${profile.firstName}${profile.gradYear ? ` · Class of ${profile.gradYear}` : ""}.`
              : "A step-by-step college-pathway roadmap. Create a profile to personalize it."}
          </p>
        </div>
        <ProgressRing pct={pct} done={done} total={ALL_TASK_IDS.length} />
      </div>

      {!profile && (
        <Link
          href="/app/profile/create"
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gold/[0.08] p-5 transition-colors hover:bg-gold/[0.14]"
        >
          <p className="text-sm font-semibold text-navy">
            Create an athlete profile to highlight your current phase and tailor adviser matches.
          </p>
          <ArrowRight size={18} className="shrink-0 text-navy" />
        </Link>
      )}

      {/* timeline */}
      <div className="mt-8 space-y-5">
        {PHASES.map((phase) => {
          const active = phase.key === currentPhase;
          return (
            <section
              key={phase.key}
              className={`rounded-2xl border bg-white p-6 ${
                active ? "border-navy shadow-[var(--shadow-card)]" : "border-ink/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={18} className={active ? "text-navy" : "text-ink/40"} />
                  <div>
                    <h2 className="font-bold text-navy">{phase.label}</h2>
                    <p className="text-xs text-ink/55">{phase.subtitle}</p>
                  </div>
                </div>
                {active && (
                  <span className="rounded-full bg-navy px-2.5 py-1 text-xs font-bold text-white">
                    You are here
                  </span>
                )}
              </div>
              <ul className="mt-4 space-y-1.5">
                {phase.tasks.map((t) => {
                  const checked = !!recruiting.tasks[t.id];
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => toggleRecruitingTask(t.id)}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-cream/60"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            checked ? "border-navy bg-navy text-white" : "border-ink/25"
                          }`}
                        >
                          {checked && <Check size={13} />}
                        </span>
                        <span className={`text-sm ${checked ? "text-ink/45 line-through" : "text-ink/80"}`}>
                          {t.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {/* target schools */}
      <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-6">
        <div className="flex items-center gap-2">
          <School size={18} className="text-navy" />
          <h2 className="font-bold text-navy">Target schools</h2>
        </div>
        <p className="mt-1 text-sm text-ink/55">Track programs from research to offer.</p>
        <SchoolForm />
        <SchoolList />
      </section>

      {/* advisers */}
      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListChecks size={18} className="text-gold" />
            <h2 className="display text-2xl text-navy">RECOMMENDED ADVISERS</h2>
          </div>
          <Link href="/app/discover?category=consultant" className="inline-flex items-center gap-1.5 text-sm font-semibold text-red">
            Browse all <ArrowRight size={15} />
          </Link>
        </div>
        <p className="mt-1 text-sm text-ink/55">
          Recruiting consultants who can navigate eligibility, outreach, and NIL.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {advisers.map(({ listing, fit }) => (
            <Link
              key={listing.id}
              href={`/app/listing/${listing.id}`}
              className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-4 transition-colors hover:border-navy/30"
            >
              <div className="flex items-start justify-between gap-2">
                <LogoAvatar listing={listing} size="sm" />
                <CsdScoreBadge score={computeCsdScore(listing).score} size="sm" />
              </div>
              <p className="font-bold leading-tight text-navy">{listing.name}</p>
              <p className="text-xs text-ink/55">
                {CATEGORY_LABEL[listing.category]} · {listing.city}
              </p>
              {fit > 0 && (
                <span className="mt-1 w-fit rounded-full bg-gold/20 px-2 py-0.5 text-xs font-bold text-ink">
                  {fit}% fit
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 flex items-center gap-1.5 text-xs text-ink/45">
        <Compass size={13} /> Your progress and target list are saved in this browser (demo).
      </p>
    </div>
  );
}

function ProgressRing({ pct, done, total }: { pct: number; done: number; total: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white px-5 py-3">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 72 72" className="h-16 w-16 -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#efe9db" strokeWidth="7" />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={pct >= 100 ? "#f5a800" : "#14264f"}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={off}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-navy">
          {pct}%
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-navy">Checklist</p>
        <p className="text-xs text-ink/55">
          {done} of {total} done
        </p>
      </div>
    </div>
  );
}

function SchoolForm() {
  const [name, setName] = useState("");
  const [division, setDivision] = useState<SchoolDivision>("D1");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        addTargetSchool(name.trim(), division);
        setName("");
      }}
      className="mt-4 flex flex-wrap gap-2"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a school…"
        className="min-w-[10rem] flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
      />
      <select
        value={division}
        onChange={(e) => setDivision(e.target.value as SchoolDivision)}
        className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-navy"
      >
        {DIVISIONS.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!name.trim()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
      >
        <Plus size={15} /> Add
      </button>
    </form>
  );
}

function SchoolList() {
  const { recruiting } = useStore();
  if (recruiting.schools.length === 0) {
    return (
      <p className="mt-4 rounded-xl border border-dashed border-ink/20 p-6 text-center text-sm text-ink/45">
        No target schools yet. Add programs you&apos;re interested in to track outreach.
      </p>
    );
  }
  return (
    <div className="mt-4 space-y-2">
      {recruiting.schools.map((s) => (
        <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 p-3">
          <span className="rounded-md bg-navy/[0.07] px-2 py-0.5 text-xs font-bold text-navy">
            {s.division}
          </span>
          <span className="flex-1 truncate text-sm font-semibold text-navy">{s.name}</span>
          <select
            value={s.status}
            onChange={(e) => setSchoolStatus(s.id, e.target.value as SchoolStatus)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold outline-none ${STATUS_TONE[s.status]}`}
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <button
            onClick={() => removeTargetSchool(s.id)}
            aria-label={`Remove ${s.name}`}
            className="text-ink/35 hover:text-red"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
