import type { Metadata } from "next";
import { ArrowRight, Sparkles, UserCheck, CreditCard, TrendingUp, Megaphone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "For Clubs, Trainers & Advisers",
  description:
    "How Club Sports Direct delivers higher-fit leads to clubs, trainers, and advisers — reducing churn and acquisition cost.",
};

const STATES = [
  {
    icon: Sparkles,
    tag: "State 1",
    title: "Unclaimed",
    body: "We auto-build your profile from public data, so it's live and discoverable from day one. You see views and interest accruing — and a reason to take control.",
    tone: "border-ink/15 bg-white",
  },
  {
    icon: UserCheck,
    tag: "State 2",
    title: "Claimed-Free",
    body: "Verify ownership and edit your basics — correct misinformation and control your narrative, at no cost. The bridge to paid.",
    tone: "border-navy/20 bg-cream-200",
  },
  {
    icon: CreditCard,
    tag: "State 3",
    title: "Claimed-Paid",
    body: "Unlock analytics, lead management, event posting, and promotion. The revenue-generating tier — higher-fit athletes, less churn.",
    tone: "border-gold bg-gold/10",
  },
];

export default function ProvidersPage() {
  return (
    <>
      <PageHero
        eyebrow="For Clubs, Trainers & Advisers"
        title="Reach the athletes who actually"
        highlight="fit."
      >
        CSD is your distribution channel — not a competitor. Higher-fit leads mean lower acquisition
        cost, less churn, and a reputation built on outcomes.
      </PageHero>

      {/* Claim funnel */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Eyebrow>The claim funnel</Eyebrow>
        <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">
          FROM AUTO-PROFILE TO PAID MEMBER.
        </h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          Our Auto-Profile Engine solves the cold-start problem the way Yelp and Zillow did —
          &quot;claim your profile.&quot; Your listing is live before you ever sign up.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STATES.map((s) => (
            <div key={s.title} className={`rounded-2xl border-2 p-7 ${s.tone}`}>
              <div className="flex items-center justify-between">
                <s.icon size={24} className="text-navy" />
                <span className="eyebrow text-ink/45">{s.tag}</span>
              </div>
              <h3 className="display mt-4 text-2xl text-navy">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Why list with CSD</Eyebrow>
              <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">
                A PLATFORM THAT REWARDS QUALITY.
              </h2>
              <p className="mt-5 text-ink/70">
                General listing sites and social media reward noise. CSD rewards substance — verified
                credentials, real alumni outcomes, and category-specific reviews that surface what
                actually matters for your type of program.
              </p>
              <ButtonLink href="/pricing" variant="primary" className="mt-7">
                See pricing &amp; tiers <ArrowRight size={16} />
              </ButtonLink>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: TrendingUp, title: "Higher-fit leads", body: "Athletes matched to your level — less churn, lower acquisition cost." },
                { icon: Sparkles, title: "The CSD Score™", body: "Earn a credibility signal that puts quality programs on top." },
                { icon: Megaphone, title: "Events & promotion", body: "Post tryouts, camps, and showcases — boost reach when it counts." },
                { icon: UserCheck, title: "Own your narrative", body: "Verified profile, accurate info, direct connection to families." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-ink/10 bg-white p-5">
                  <c.icon size={20} className="text-red" />
                  <h3 className="mt-3 font-bold text-navy">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-ink/65">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-navy p-10 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h2 className="display text-3xl text-white">SEE YOUR PROVIDER DASHBOARD.</h2>
            <p className="mt-2 text-cream/75">
              Walk through the claim-to-paid journey and see the leads, events, and analytics tools.
            </p>
          </div>
          <ButtonLink href="/app/provider" variant="gold" size="lg" className="shrink-0">
            Open provider dashboard <ArrowRight size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
