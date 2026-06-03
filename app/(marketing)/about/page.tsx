import type { Metadata } from "next";
import { Check, X, ArrowRight, Target } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About & Founder",
  description:
    "Club Sports Direct is an independent youth sports discovery and matching platform — California-built, launching in Southern California.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Help every athlete find the right place to" highlight="grow.">
        Club Sports Direct is an independent youth sports discovery, vetting, and matching platform —
        built in California, launching in Southern California.
      </PageHero>

      {/* Mission + founder */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <Eyebrow>Our mission</Eyebrow>
            <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">
              SOLVING THE MUTUAL FIT PROBLEM.
            </h2>
            <div className="mt-5 space-y-4 text-ink/70">
              <p>
                Youth sports is fragmented and opaque. Parents pick clubs and trainers on
                word-of-mouth, proximity, or marketing — not on actual fit. Athletes end up above or
                below their level. Clubs churn families before results show. There&apos;s no neutral,
                structured way to compare programs on substance.
              </p>
              <p>
                Club Sports Direct is the trusted intermediary that solves both sides at once: free,
                transparent discovery and matching for parents and athletes, and a quality-rewarding
                platform that delivers higher-fit, lower-churn leads to the supply side.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-cream-200 p-8">
            <Eyebrow>Founder</Eyebrow>
            <h3 className="mt-3 text-xl font-bold text-navy">Justin Rhoane</h3>
            <p className="text-sm text-ink/55">Founder &amp; CEO</p>
            <p className="mt-4 text-sm text-ink/70">
              Three years of conceptualization and a year of active build — informed by direct
              experience navigating the youth club sports market as a parent and coach.
            </p>
            <p className="mt-4 text-sm text-ink/70">
              CSD launches in the Southern California market, where supply density and demand signals
              are highest, before expanding metro by metro.
            </p>
          </div>
        </div>
      </section>

      {/* What CSD is / isn't */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow>Positioning</Eyebrow>
          <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">INDEPENDENT. DIRECT. A PLATFORM.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-white p-8">
              <h3 className="font-bold text-navy">What CSD is</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "A discovery & matching platform built around athlete development",
                  "Independent — not owned by an apparel company, equipment maker, or league",
                  "Direct — no middlemen between families and the programs they need",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-ink/75">
                    <Check size={20} className="mt-0.5 shrink-0 text-navy" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-8">
              <h3 className="font-bold text-navy">What CSD is not</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Not a recruiting service — we list consultants, we don't place athletes",
                  "Not a ranking site for athletes, and not a social network",
                  "Not a competitor to clubs and trainers — we're their distribution channel",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-ink/75">
                    <X size={20} className="mt-0.5 shrink-0 text-red" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Market opportunity */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Eyebrow>Market opportunity</Eyebrow>
        <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">BIG MARKET. TIGHT WEDGE.</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { v: "$26B", l: "TAM · youth sports" },
            { v: "$8B", l: "SAM · club & trainer spend" },
            { v: "$1.2B", l: "SOM · year-5 target" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-ink/10 bg-cream-200 p-7">
              <p className="display text-5xl text-navy">{s.v}</p>
              <p className="eyebrow mt-3 text-ink/55">{s.l}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink/60">
          Average family spend: $1,200–$8,000 per athlete, per year. Multi-sport households compound
          the wallet.
        </p>
      </section>

      {/* The ask */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow tone="light">The ask</Eyebrow>
              <h2 className="display mt-4 text-4xl text-white sm:text-5xl">
                PARTNER UP.
              </h2>
              <p className="display mt-4 text-6xl text-white">
                $2.5<span className="text-red">M</span>
              </p>
              <p className="eyebrow mt-2 text-gold-300">Seed · 18 months runway</p>
            </div>
            <div className="grid content-center gap-4">
              {[
                "Launch in Southern California · 500 vetted clubs onboarded",
                "Build the CSD Score™ and matching engine",
                "Reach 50K monthly active families · >$1M GMV through the marketplace",
              ].map((m) => (
                <div key={m} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Target size={20} className="mt-0.5 shrink-0 text-gold" />
                  <span className="text-cream/85">{m}</span>
                </div>
              ))}
              <ButtonLink href="mailto:info@clubsportsdirect.com" variant="gold" className="mt-2 self-start">
                Request the full deck <ArrowRight size={16} />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
