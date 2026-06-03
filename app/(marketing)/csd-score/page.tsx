import type { Metadata } from "next";
import { Check, X, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CsdScoreBadge } from "@/components/ui/CsdScoreBadge";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "The CSD Score™",
  description:
    "The CSD Score is a proprietary, calculated credibility score applied uniformly across every Club Sports Direct listing.",
};

const INPUTS = [
  { label: "Alumni outcomes", max: 28, body: "Pro, D1, D2, and D3 placements — weighted heaviest." },
  { label: "Coaching credentials", max: 18, body: "Verified certifications and licenses." },
  { label: "Review quality", max: 18, body: "Aggregated rating across verified reviews." },
  { label: "Experience & tenure", max: 16, body: "Years in operation and coaching experience." },
  { label: "Notable athletes developed", max: 12, body: "Athletes trained who advanced." },
  { label: "Verified engagement", max: 8, body: "Volume of verified reviews and activity." },
];

export default function CsdScorePage() {
  return (
    <>
      <PageHero eyebrow="The CSD Score™" title="Credibility on substance," highlight="not hype.">
        A proprietary, calculated score from 0–100, applied uniformly across clubs, trainers, and
        advisers — so families can compare programs on what actually matters.
      </PageHero>

      {/* Inputs + worked example */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>What goes into it</Eyebrow>
            <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">SIX VERIFIED INPUTS.</h2>
            <p className="mt-4 text-ink/70">
              The score is calculated, not crowdsourced. Two listings with similar review counts can
              have very different CSD Scores if their outcomes, certifications, or experience differ.
            </p>
            <ul className="mt-8 space-y-4">
              {INPUTS.map((i) => (
                <li key={i.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-navy">{i.label}</span>
                    <span className="eyebrow text-ink/40">up to {i.max} pts</span>
                  </div>
                  <p className="text-sm text-ink/60">{i.body}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-cream">
                    <div className="h-1.5 rounded-full bg-gold" style={{ width: `${(i.max / 28) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Worked example */}
          <div>
            <div className="sticky top-24 rounded-3xl border border-ink/10 bg-cream-200 p-8">
              <Eyebrow>Worked example</Eyebrow>
              <div className="mt-5 flex items-center gap-5">
                <CsdScoreBadge score={91} size="lg" showTier />
              </div>
              <p className="mt-5 text-sm text-ink/65">
                Westside Football Club — 14 years operating, 2 pro and 9 D1 alumni, two verified
                licenses, and a 4.7★ verified review average.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { l: "Alumni outcomes", p: 28, m: 28 },
                  { l: "Coaching credentials", p: 12, m: 18 },
                  { l: "Review quality", p: 17, m: 18 },
                  { l: "Experience & tenure", p: 15, m: 16 },
                  { l: "Notable athletes", p: 8, m: 12 },
                  { l: "Verified engagement", p: 8, m: 8 },
                ].map((r) => (
                  <div key={r.l}>
                    <div className="flex justify-between text-sm text-ink/70">
                      <span>{r.l}</span>
                      <span className="font-semibold text-navy">
                        {r.p}/{r.m}
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-white">
                      <div className="h-2 rounded-full bg-navy" style={{ width: `${(r.p / r.m) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What it is / isn't */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
              <h3 className="display text-2xl text-gold">WHAT IT IS</h3>
              <ul className="mt-5 space-y-3">
                {[
                  "A credibility signal for evaluating unfamiliar programs",
                  "Calculated uniformly across all listing categories",
                  "Weighted toward verified outcomes and certifications",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-cream/85">
                    <Check size={20} className="mt-0.5 shrink-0 text-gold" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
              <h3 className="display text-2xl text-red">WHAT IT IS NOT</h3>
              <ul className="mt-5 space-y-3">
                {[
                  "A popularity contest driven by review volume",
                  "A competitive ranking of individual athletes",
                  "A pay-to-win number — you can't buy a higher score",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-cream/85">
                    <X size={20} className="mt-0.5 shrink-0 text-red" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/app/discover" variant="gold" size="lg">
              See CSD Scores in the directory <ArrowRight size={18} />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
