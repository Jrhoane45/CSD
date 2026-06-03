import {
  ArrowRight,
  Search,
  Target,
  Handshake,
  Compass,
  Store,
  Database,
  Trophy,
  Users,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  MapPin,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CsdScoreBadge } from "@/components/ui/CsdScoreBadge";
import { ListingCard } from "@/components/listing/ListingCard";
import { LISTINGS } from "@/lib/data/listings";

const featured = LISTINGS.filter((l) => l.featured).slice(0, 3);

export default function HomePage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-red/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="fade-up">
            <Eyebrow tone="light">Team Sports, Simplified</Eyebrow>
            <h1 className="display mt-5 text-5xl text-white sm:text-6xl lg:text-7xl">
              FIND THE RIGHT
              <br />
              PLACE TO{" "}
              <span className="text-gold display-italic">GROW.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/85">
              Club Sports Direct connects youth athletes to the right clubs, trainers, and
              advisers — matched on development level, not word-of-mouth. Vetted profiles,
              the proprietary CSD Score™, and real outcomes in one place.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app/match" variant="gold" size="lg">
                Find your match <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/app/provider" variant="light" size="lg">
                List your program
              </ButtonLink>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-cream/70">
              <ShieldCheck size={16} className="text-gold-300" />
              Always free for parents &amp; athletes.
            </p>
          </div>

          {/* hero product preview */}
          <div className="fade-up lg:justify-self-end">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ---------------- PROBLEM / MARKET ---------------- */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <Eyebrow>Section 01 / The Market</Eyebrow>
            <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">
              A $26B MARKET RUN ON HEARSAY.
            </h2>
            <p className="mt-5 text-lg text-ink/70">
              60M+ U.S. youth athletes and their parents navigate club selection through
              word-of-mouth, dated forums, and fragmented Facebook groups. There&apos;s no trusted,
              structured way to compare programs, coaches, or fit.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              { stat: "60M+", label: "U.S. youth athletes underserved" },
              { stat: "3×", label: "sided network: athletes · clubs · trainers" },
              { stat: "$0", label: "direct competitor at the discovery layer" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-ink/10 bg-white p-7 shadow-[var(--shadow-card)]"
              >
                <p className="display text-5xl text-navy">
                  {s.stat}
                  <span className="text-red">.</span>
                </p>
                <p className="eyebrow mt-3 text-ink/55">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <Eyebrow className="justify-center">Section 02 / How it works</Eyebrow>
          <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">SEARCH. MATCH. COMMIT.</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Search,
              step: "01",
              title: "Search",
              body: "Browse a vetted directory of clubs, trainers, camps, and advisers — filtered by sport, development level, geography, and goals.",
            },
            {
              icon: Target,
              step: "02",
              title: "Match",
              body: "The CSD Score™ and fit-based matching rank programs by substance — credentials, alumni outcomes, and developmental fit, not marketing.",
            },
            {
              icon: Handshake,
              step: "03",
              title: "Commit",
              body: "Compare on real signals, read category-specific reviews, and connect directly — no middlemen, no hidden agendas.",
            },
          ].map((s) => (
            <div key={s.step} className="relative rounded-2xl border border-ink/10 bg-white p-8">
              <span className="display absolute right-6 top-5 text-5xl text-cream">{s.step}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
                <s.icon size={22} />
              </div>
              <h3 className="display mt-5 text-2xl text-navy">{s.title}</h3>
              <p className="mt-3 text-ink/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- THREE-LAYER MODEL ---------------- */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow tone="light">Section 03 / The Platform</Eyebrow>
              <h2 className="display mt-4 text-4xl text-white sm:text-5xl">
                A THREE-LAYER
                <br />
                <span className="text-gold display-italic">BUSINESS MODEL.</span>
              </h2>
              <p className="mt-5 text-cream/75">
                Each layer is a complete product on its own — and every match feeds a data moat that
                compounds over time.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: Compass,
                  n: "01",
                  title: "Discovery",
                  body: "Vetted directory of clubs, trainers, camps, and events. The CSD Score ranks fit by sport, level, location, and goals.",
                },
                {
                  icon: Store,
                  n: "02",
                  title: "Marketplace",
                  body: "Direct booking, subscriptions, events, and promotion. Commissions and featured placements drive revenue.",
                },
                {
                  icon: Database,
                  n: "03",
                  title: "Data Moat",
                  body: "Every match feeds the model. Outcomes data becomes the most valuable asset in youth sports.",
                },
              ].map((c) => (
                <div key={c.n} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <c.icon size={24} className="text-gold" />
                  <p className="eyebrow mt-4 text-gold-300">— {c.n}</p>
                  <h3 className="mt-1 text-xl font-bold text-white">{c.title}</h3>
                  <p className="mt-2 text-sm text-cream/70">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CSD SCORE TEASER ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 rounded-3xl border border-ink/10 bg-cream-200 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <Eyebrow>The CSD Score™</Eyebrow>
            <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">
              CREDIBILITY YOU CAN ACTUALLY COMPARE.
            </h2>
            <p className="mt-5 text-ink/70">
              A proprietary, calculated credibility score applied uniformly across every listing —
              built from verified certifications, experience, alumni outcomes, and aggregated
              reviews. It&apos;s a credibility signal, not a popularity contest.
            </p>
            <ButtonLink href="/csd-score" variant="primary" className="mt-7">
              How the CSD Score works <ArrowRight size={16} />
            </ButtonLink>
          </div>
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-[var(--shadow-card)]">
            <CsdScoreBadge score={91} size="lg" showTier />
            <div className="w-full space-y-2.5">
              {[
                { label: "Alumni outcomes", w: "92%" },
                { label: "Coaching credentials", w: "88%" },
                { label: "Experience & tenure", w: "80%" },
                { label: "Review quality", w: "94%" },
              ].map((r) => (
                <div key={r.label} className="text-sm">
                  <div className="flex justify-between text-ink/70">
                    <span>{r.label}</span>
                    <span className="font-semibold text-navy">{r.w}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-cream">
                    <div className="h-2 rounded-full bg-gold" style={{ width: r.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow>Section 04 / Who you&apos;ll find</Eyebrow>
          <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">FOUR LISTING CATEGORIES.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Trophy,
                title: "Clubs & Programs",
                body: "Youth clubs, travel teams, and competitive programs — schedule, staff, alumni, and philosophy.",
                href: "/app/discover?category=club",
                live: true,
              },
              {
                icon: Users,
                title: "Trainers & Coaches",
                body: "Individual trainers and position coaches focused on physical and skill development.",
                href: "/app/discover?category=trainer",
                live: true,
              },
              {
                icon: ClipboardCheck,
                title: "Consultants & Advisers",
                body: "Recruiting navigation, collegiate pathways, eligibility, and NIL guidance.",
                href: "/app/discover?category=consultant",
                live: true,
              },
              {
                icon: Store,
                title: "B2B Marketplace",
                body: "Equipment, services, and operational tools for clubs.",
                href: "/pricing",
                live: false,
              },
            ].map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="group flex flex-col rounded-2xl border border-ink/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/[0.06] text-navy">
                    <c.icon size={20} />
                  </div>
                  {!c.live && (
                    <span className="eyebrow rounded-full bg-gold/20 px-2 py-1 text-[0.55rem] text-ink/70">
                      Phase 2
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink/65">{c.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-red">
                  Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Featured in Southern California</Eyebrow>
            <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">VETTED. RANKED. READY.</h2>
          </div>
          <ButtonLink href="/app/discover" variant="outline">
            Browse the directory <ArrowRight size={16} />
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* ---------------- WHY CSD / COMPETITIVE ---------------- */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow tone="light">Section 05 / Why CSD</Eyebrow>
              <h2 className="display mt-4 text-4xl text-white sm:text-5xl">
                WHITE SPACE.
                <br />
                <span className="text-gold display-italic">NO DIRECT COMPETITOR.</span>
              </h2>
              <p className="mt-5 text-cream/75">
                TeamSnap, SportsEngine, and GotSport own logistics — schedules and registration, not
                discovery. BSN&apos;s &quot;Club Direct&quot; is apparel procurement, not a platform.
                Club Sports Direct owns the discovery and matching layer no one else has built.
              </p>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-cream/80">
                <span className="font-semibold text-gold-300">Club Sports Direct</span> ≠ Club Direct.
                A discovery &amp; matching platform built around athlete development — independent, and
                not owned by an apparel company, equipment maker, or league.
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Developmental matching", body: "Fit by development tier — the single biggest predictor of athlete churn." },
                { title: "The CSD Score™", body: "A uniform credibility signal across every category." },
                { title: "Auto-profile engine", body: "Populated from day one — no cold-start problem." },
                { title: "Data ownership", body: "A compounding, licensable long-term asset." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <Sparkles size={18} className="text-gold" />
                  <h3 className="mt-3 font-bold text-white">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-cream/70">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CLOSING CTA ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-3xl bg-gold p-9 text-ink">
            <div>
              <Eyebrow tone="navy">For Parents &amp; Athletes</Eyebrow>
              <h3 className="display mt-3 text-3xl text-navy">FIND YOUR FIT IN MINUTES.</h3>
              <p className="mt-3 text-ink/75">
                Build an athlete profile and see ranked, fit-scored matches near you. Always free.
              </p>
            </div>
            <ButtonLink href="/app/match" variant="primary" size="lg" className="mt-7 self-start">
              Find your match <ArrowRight size={18} />
            </ButtonLink>
          </div>
          <div className="flex flex-col justify-between rounded-3xl bg-navy p-9 text-white">
            <div>
              <Eyebrow tone="light">For Clubs, Trainers &amp; Advisers</Eyebrow>
              <h3 className="display mt-3 text-3xl text-white">REACH HIGHER-FIT ATHLETES.</h3>
              <p className="mt-3 text-cream/75">
                Claim your profile, showcase outcomes, and turn the right athletes into the right
                roster — with less churn.
              </p>
            </div>
            <ButtonLink href="/app/provider" variant="gold" size="lg" className="mt-7 self-start">
              List your program <ArrowRight size={18} />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroPreview() {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white p-5 text-ink shadow-2xl">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-red">Top match</p>
        <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-ink">96% fit</span>
      </div>
      <h3 className="mt-2 text-xl font-bold text-navy">Westside Football Club</h3>
      <div className="mt-1.5 flex items-center gap-2 text-sm text-ink/60">
        <span className="font-medium text-ink/80">Soccer</span>
        <span className="inline-flex items-center gap-1">
          <MapPin size={13} /> Santa Monica, LA Co.
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-cream p-3">
        <CsdScoreBadge score={91} size="sm" />
        <div className="text-right text-xs text-ink/60">
          <p className="font-semibold text-navy">Why it matched</p>
          <p>Elite tier · 4 mi · recruiting</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { l: "Development level", v: "Elite · exact match" },
          { l: "Distance", v: "4 mi from you" },
          { l: "Goal alignment", v: "College recruiting" },
        ].map((r) => (
          <div key={r.l} className="flex items-center justify-between text-sm">
            <span className="text-ink/55">{r.l}</span>
            <span className="font-medium text-navy">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
