import type { Metadata } from "next";
import {
  ArrowRight,
  Video,
  Cpu,
  Trophy,
  ClipboardList,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Check,
  Crown,
  ScanLine,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Prospect IQ™ — The AI Scout",
  description:
    "Prospect IQ is CSD's premium AI scout: a guided video evaluation that scores an athlete across five pillars, places them in a national-cohort tier, and returns a development pathway and best-fit matches.",
};

const LOOP = [
  { icon: Video, t: "Capture", b: "A guided drill set — the CSD Combine — produces clean, comparable video." },
  { icon: Cpu, t: "Analyze", b: "The engine extracts mechanics, movement, and performance signals from the footage." },
  { icon: Trophy, t: "Rank", b: "A five-pillar score, normalized to a national peer cohort, assigns a tier." },
  { icon: ClipboardList, t: "Recommend", b: "Strengths, growth areas, and a prioritized development pathway." },
  { icon: Sparkles, t: "Match", b: "The enriched profile surfaces best-fit programs, trainers & consultants." },
  { icon: RefreshCw, t: "Re-evaluate", b: "Track progress over time — prompted quarterly to measure growth." },
];

const PILLARS = [
  { t: "Technical Skill", b: "Sport-specific fundamentals & mechanics" },
  { t: "Athleticism", b: "Speed, agility, explosiveness & conditioning" },
  { t: "Game IQ", b: "Decision-making, spacing & anticipation" },
  { t: "Competitive Application", b: "Execution under live, contested pressure" },
  { t: "Trajectory & Experience", b: "History & rate of development" },
];

const TIERS = [
  { t: "Beginner", p: "< 40th", b: "Developing fundamentals" },
  { t: "Intermediate", p: "40–69th", b: "Solid fundamentals" },
  { t: "Competitive", p: "70–89th", b: "Above cohort" },
  { t: "Elite", p: "90th+", b: "Top of national cohort" },
];

const PACKAGES = [
  {
    name: "Lite snapshot",
    price: "Free",
    desc: "Your tier band only — the quick read.",
    features: ["Tier result", "High-potential flag", "Upgrade to see the full report"],
    featured: false,
  },
  {
    name: "Subscription",
    price: "$19/mo",
    desc: "The full Scouting Report + progress tracking.",
    features: ["Five-pillar breakdown & radar", "Strengths & growth areas", "Development pathway", "Best-fit matches", "Quarterly re-evaluation"],
    featured: true,
  },
  {
    name: "Premium · Verified",
    price: "$149 / report",
    desc: "Validated and signed off by a certified human evaluator.",
    features: ["Everything in Subscription", "Certified human verification", "Deepest, most granular detail", "Highest confidence rating"],
    featured: false,
  },
];

export default function ProspectIQMarketing() {
  return (
    <>
      <PageHero eyebrow="Prospect IQ™ · Premium" title="Meet your athlete's" highlight="digital scout.">
        Prospect IQ analyzes an athlete&apos;s ability from video and returns a structured talent
        evaluation, a development pathway, and matches to the right programs — built on an
        expert-defined rubric, not a black box.
      </PageHero>

      {/* core loop */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">CAPTURE. ANALYZE. DEVELOP.</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LOOP.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
                  <s.icon size={20} />
                </div>
                <span className="display text-3xl text-cream">{i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">{s.t}</h3>
              <p className="mt-1.5 text-sm text-ink/65">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* five pillars */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow tone="light">The evaluation framework</Eyebrow>
          <h2 className="display mt-4 text-3xl text-white sm:text-4xl">FIVE PILLARS. ONE SCORE.</h2>
          <p className="mt-4 max-w-2xl text-cream/75">
            Every athlete is scored 0–100 on five pillars, weighted by sport, position, and age. The
            published Prospect IQ Score™ is a percentile within a national peer cohort — so &quot;Elite&quot;
            always means elite relative to comparable peers.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map((p) => (
              <div key={p.t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h3 className="font-bold text-gold">{p.t}</h3>
                <p className="mt-2 text-sm text-cream/70">{p.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {TIERS.map((t) => (
              <div key={t.t} className="rounded-xl border border-white/10 p-4">
                <p className="display text-xl text-white">{t.t}</p>
                <p className="eyebrow mt-1 text-gold-300">{t.p}</p>
                <p className="mt-1 text-xs text-cream/60">{t.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* hybrid model / trust */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Honest, defensible, safe</Eyebrow>
            <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">AI MEASURES. EXPERTS JUDGE. HUMANS VERIFY.</h2>
            <p className="mt-5 text-ink/70">
              Prospect IQ is a hybrid model. AI does the measurement at scale; an expert-defined rubric
              produces the score so every number is explainable; and certified evaluators validate the
              top premium tier. It&apos;s built for minors — with confidence ratings, cohort-relative
              framing, and &quot;development, not destiny&quot; language throughout.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Cpu, t: "AI measurement", b: "Pose & motion analysis extract objective signals." },
              { icon: ClipboardList, t: "Expert rubric", b: "Defined criteria & weights — never a black box." },
              { icon: ShieldCheck, t: "Human-verified tier", b: "Certified evaluators sign off the premium report." },
              { icon: Sparkles, t: "Confidence rating", b: "Every evaluation states how certain it is." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-ink/10 bg-white p-5">
                <c.icon size={20} className="text-red" />
                <h3 className="mt-3 font-bold text-navy">{c.t}</h3>
                <p className="mt-1.5 text-sm text-ink/65">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* packages */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow>Packaging</Eyebrow>
          <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">DEPTH SCALES WITH YOUR PLAN.</h2>
          <p className="mt-3 text-sm text-ink/55">Illustrative pricing for the demo.</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-3xl border p-8 ${
                  p.featured ? "border-navy bg-navy text-white shadow-[var(--shadow-lift)]" : "border-ink/10 bg-white"
                }`}
              >
                {p.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">Most popular</span>
                )}
                <p className={`eyebrow ${p.featured ? "text-gold-300" : "text-red"}`}>{p.name}</p>
                <p className={`display mt-3 text-4xl ${p.featured ? "text-white" : "text-navy"}`}>{p.price}</p>
                <p className={`mt-2 text-sm ${p.featured ? "text-cream/75" : "text-ink/60"}`}>{p.desc}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${p.featured ? "text-cream/85" : "text-ink/70"}`}>
                      <Check size={16} className={`mt-0.5 shrink-0 ${p.featured ? "text-gold" : "text-navy"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/app/prospect-iq" variant={p.featured ? "gold" : "primary"} className="mt-7">
                  {p.price === "Free" ? "Try the free snapshot" : "Get started"} <ArrowRight size={16} />
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-navy p-10 text-center text-white sm:flex-row sm:text-left">
          <div>
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              <Crown size={18} className="text-gold-300" />
              <span className="eyebrow text-gold-300">Launching with Basketball · ages 8–17</span>
            </p>
            <h2 className="display mt-3 text-3xl text-white">RUN THE CSD COMBINE.</h2>
            <p className="mt-2 text-cream/75">See where your athlete really stands — start with a free snapshot.</p>
          </div>
          <ButtonLink href="/app/prospect-iq" variant="gold" size="lg" className="shrink-0">
            <ScanLine size={18} /> Start Prospect IQ
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
