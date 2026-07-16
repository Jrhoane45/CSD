import type { Metadata } from "next";
import {
  ArrowRight,
  Target,
  ScanLine,
  Compass,
  CalendarCheck,
  CalendarDays,
  Megaphone,
  Trophy,
  GraduationCap,
  Star,
  ShieldCheck,
  LayoutDashboard,
  CreditCard,
  Users,
  Search,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything inside Club Sports Direct — developmental matching, the CSD Score, Prospect IQ, session booking, events, rankings, recruiting, and full provider tools.",
};

const CAPABILITIES = [
  { icon: Target, title: "Developmental matching", body: "Ranked, Fit-scored programs weighted on development level first — with the reasons behind every match.", href: "/app/match" },
  { icon: ScanLine, title: "Prospect IQ™", body: "An AI-style talent evaluation across five pillars, with a national-cohort tier and a development pathway.", href: "/app/prospect-iq" },
  { icon: Compass, title: "Vetted discovery", body: "A searchable, filterable directory with CSD Scores, a map view, and side-by-side compare.", href: "/app/discover" },
  { icon: CalendarCheck, title: "Session booking", body: "Book a real time slot from a provider's live availability — reschedule, cancel, and message in one place.", href: "/app/sessions" },
  { icon: CalendarDays, title: "Events board", body: "Tryouts, camps, showcases, and clinics with one-tap RSVP; providers post and boost their own.", href: "/app/events" },
  { icon: Trophy, title: "Prospect IQ rankings", body: "A regional leaderboard by sport, age, and region — see exactly where an athlete stands.", href: "/app/rankings" },
  { icon: GraduationCap, title: "Recruiting Hub", body: "A grade-by-grade roadmap, a target-school tracker, and matched advisers.", href: "/app/recruiting" },
  { icon: Star, title: "Reviews you can trust", body: "Verified-customer badges, category-specific ratings, helpful votes, photos, and provider responses.", href: "/app/discover" },
  { icon: Megaphone, title: "Promotions", body: "Paid, on-brand event advertising with reach estimates, native placements, and live campaign reporting.", href: "/app/promote" },
  { icon: Search, title: "Global search", body: "A ⌘K command palette that finds programs, events, and pages instantly from anywhere in the app.", href: "/app" },
  { icon: Users, title: "Roster & teams", body: "Providers build teams and rosters, and import prospects straight from bookings and event registrants.", href: "/app/provider/roster" },
  { icon: ShieldCheck, title: "Trust & safety", body: "Operator vetting, content moderation, and consequential actions that keep the marketplace credible.", href: "/app/operator" },
];

const SPOTLIGHTS = [
  {
    eyebrow: "The matching engine",
    title: "Fit is a science, not a guess.",
    body: "Every recommendation is scored on the inputs that actually predict success — development level (a hard filter), distance, goals, credibility, and sport. Families see a transparent Fit %, and the reasons behind it, before they ever reach out.",
    points: ["Development-level fit weighted first", "Transparent Fit % with reasons", "Powered by the CSD Score"],
    cta: { href: "/app/match", label: "Find your match" },
  },
  {
    eyebrow: "The marketplace",
    title: "From discovery to done — in one place.",
    body: "Discovery is only half the story. Families book real sessions against live availability, register for events, and pay through a simulated, on-platform checkout — while providers manage leads, schedules, billing, and rosters from a single dashboard.",
    points: ["Real session booking & scheduling", "Events, RSVPs & promotions", "Provider billing, analytics & rosters"],
    cta: { href: "/app/discover", label: "Explore the directory" },
  },
];

const AUDIENCES = [
  { icon: Target, title: "For parents & athletes", body: "Match on substance, evaluate talent, book sessions, and navigate recruiting — always free.", href: "/how-it-works/parents", cta: "For parents" },
  { icon: LayoutDashboard, title: "For clubs, trainers & advisers", body: "Claim your profile, capture higher-fit leads, run events, and grow with analytics and promotions.", href: "/how-it-works/providers", cta: "For providers" },
  { icon: ShieldCheck, title: "For operators", body: "Vet providers, moderate content, and track ad revenue — the trust layer that keeps it all credible.", href: "/app/operator", cta: "Operator console" },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero eyebrow="The platform" title="Everything you need, from discovery to" highlight="development.">
        Club Sports Direct is a complete youth-sports platform — matching, evaluation, booking,
        events, recruiting, and the tools clubs need to grow. Here&apos;s what&apos;s inside.
      </PageHero>

      {/* capabilities grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Eyebrow>What&apos;s inside</Eyebrow>
        <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">ONE PLATFORM, EVERY LAYER.</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group flex flex-col rounded-2xl border border-ink/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/[0.06] text-navy">
                <c.icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink/65">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-red">
                Open <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* spotlights */}
      {SPOTLIGHTS.map((s, i) => (
        <section key={s.title} className={i % 2 === 1 ? "bg-cream" : ""}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <Eyebrow>{s.eyebrow}</Eyebrow>
              <h2 className="display mt-4 text-3xl text-navy sm:text-4xl">{s.title}</h2>
              <p className="mt-5 text-ink/70">{s.body}</p>
              <ButtonLink href={s.cta.href} variant="primary" className="mt-7">
                {s.cta.label} <ArrowRight size={16} />
              </ButtonLink>
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <div className="space-y-3 rounded-3xl border border-ink/10 bg-white p-6 shadow-[var(--shadow-card)]">
                {s.points.map((p) => (
                  <div key={p} className="flex items-center gap-3 rounded-xl bg-cream/60 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                      <ShieldCheck size={16} />
                    </span>
                    <span className="text-sm font-semibold text-navy">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* provider tools band */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow tone="light">Built for providers</Eyebrow>
          <h2 className="display mt-4 text-4xl text-white sm:text-5xl">A REAL BUSINESS TOOLKIT.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageSquare, t: "Lead inbox", b: "Respond to inbound families with fit scores attached." },
              { icon: BarChart3, t: "Analytics", b: "Views, lead funnel, and fit quality that update live." },
              { icon: CreditCard, t: "Billing & plans", b: "Free / Pro / Elite tiers, usage, and invoices." },
              { icon: Users, t: "Roster & teams", b: "Manage teams and import prospects from activity." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <c.icon size={22} className="text-gold" />
                <h3 className="mt-4 font-bold text-white">{c.t}</h3>
                <p className="mt-1.5 text-sm text-cream/70">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* audiences */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Eyebrow>Built for everyone in the game</Eyebrow>
        <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">THREE SIDES, ONE MARKETPLACE.</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
                <a.icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink/65">{a.body}</p>
              <ButtonLink href={a.href} variant="outline" size="sm" className="mt-5 self-start">
                {a.cta} <ArrowRight size={14} />
              </ButtonLink>
            </div>
          ))}
        </div>
      </section>

      {/* closing CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gold p-10 text-center text-ink sm:flex-row sm:text-left">
          <div>
            <h2 className="display text-3xl text-navy">SEE IT ALL IN THE LIVE DEMO.</h2>
            <p className="mt-2 text-ink/75">Explore both sides of the platform — no account required.</p>
          </div>
          <ButtonLink href="/app" variant="primary" size="lg" className="shrink-0">
            Launch the app <ArrowRight size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
