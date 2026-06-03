import type { Metadata } from "next";
import { ArrowRight, Search, SlidersHorizontal, Trophy, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "For Parents & Athletes",
  description:
    "How Club Sports Direct helps parents match their athlete to the right club, trainer, or adviser by development level — always free.",
};

const LEVELS = [
  {
    name: "Recreational / Beginner",
    body: "First exposure to the sport. Skill-building, fun, and social development.",
  },
  {
    name: "Intermediate",
    body: "Committed recreational or entry-level competitive. Building fundamentals.",
  },
  {
    name: "Competitive / Travel",
    body: "Year-round competitive play. Higher commitment, higher development demands.",
  },
  {
    name: "Elite",
    body: "Top-tier competitive — showcase, national, pre-collegiate. Recruiting-focused.",
  },
];

export default function ParentsPage() {
  return (
    <>
      <PageHero
        eyebrow="For Parents & Athletes"
        title="The right program for the right athlete, at the right"
        highlight="stage."
      >
        Stop guessing from word-of-mouth and Facebook groups. Match your athlete to clubs, trainers,
        and advisers on substance — credentials, outcomes, and developmental fit.
      </PageHero>

      {/* The mutual fit problem */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">
              MISMATCHED LEVELS ARE THE #1 CAUSE OF CHURN.
            </h2>
            <p className="mt-5 text-ink/70">
              When an athlete lands in a program above or below their development level, the result is
              frustration, disengagement, and stalled progress. CSD treats development level as a
              hard filter — not an afterthought — so every recommendation fits.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {LEVELS.map((l, i) => (
              <div key={l.name} className="rounded-2xl border border-ink/10 bg-cream-200 p-5">
                <span className="display text-3xl text-gold">{i + 1}</span>
                <h3 className="mt-2 font-bold text-navy">{l.name}</h3>
                <p className="mt-1.5 text-sm text-ink/65">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow>How it works for you</Eyebrow>
          <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">THREE STEPS TO THE RIGHT FIT.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: SlidersHorizontal,
                title: "Build your athlete profile",
                body: "Sport, age, development level, location, and goals — the inputs that actually drive fit.",
              },
              {
                icon: Search,
                title: "See ranked, fit-scored matches",
                body: "Programs ranked by a transparent Fit %, with the reasons behind every match.",
              },
              {
                icon: Trophy,
                title: "Compare on substance",
                body: "CSD Scores, alumni outcomes, and category-specific reviews — then connect directly.",
              },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-ink/10 bg-white p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
                  <s.icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-ink/65">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free promise + CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-navy p-10 text-center text-white sm:flex-row sm:text-left">
          <div>
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              <ShieldCheck className="text-gold-300" size={20} />
              <span className="eyebrow text-gold-300">Always free for parents &amp; athletes</span>
            </p>
            <h2 className="display mt-3 text-3xl text-white">READY TO FIND YOUR MATCH?</h2>
            <p className="mt-2 text-cream/75">It takes about two minutes. No account required for the demo.</p>
          </div>
          <ButtonLink href="/app/match" variant="gold" size="lg" className="shrink-0">
            Find your match <ArrowRight size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
