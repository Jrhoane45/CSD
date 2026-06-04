import Link from "next/link";
import { Target, Compass, LayoutDashboard, BarChart3, ArrowRight, UserRound } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LISTINGS } from "@/lib/data/listings";

export default function AppHome() {
  const counts = {
    clubs: LISTINGS.filter((l) => l.category === "club").length,
    trainers: LISTINGS.filter((l) => l.category === "trainer").length,
    consultants: LISTINGS.filter((l) => l.category === "consultant").length,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Eyebrow>Welcome to the demo</Eyebrow>
      <h1 className="display mt-3 text-4xl text-navy sm:text-5xl">WHERE DO YOU WANT TO START?</h1>
      <p className="mt-3 max-w-2xl text-ink/65">
        Explore both sides of the platform. Switch between Parent and Provider any time using the
        toggle up top.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Parent side */}
        <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-[var(--shadow-card)]">
          <Eyebrow tone="red">Parents &amp; Athletes</Eyebrow>
          <h2 className="display mt-3 text-2xl text-navy">FIND THE RIGHT FIT</h2>
          <p className="mt-2 text-sm text-ink/60">
            Build an athlete profile for ranked matches, or browse the vetted directory.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/app/profile"
              className="group flex items-center justify-between rounded-xl border border-ink/10 p-4 transition-colors hover:bg-cream"
            >
              <span className="flex items-center gap-3">
                <UserRound size={20} className="text-navy" />
                <span>
                  <span className="block font-semibold text-navy">Create your athlete profile</span>
                  <span className="block text-xs text-ink/55">Sign up · stats, photo &amp; matching criteria</span>
                </span>
              </span>
              <ArrowRight size={18} className="text-ink/40 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/app/match"
              className="group flex items-center justify-between rounded-xl bg-navy p-4 text-white transition-colors hover:bg-navy-deep"
            >
              <span className="flex items-center gap-3">
                <Target size={20} className="text-gold" />
                <span>
                  <span className="block font-semibold">Find your match</span>
                  <span className="block text-xs text-cream/70">AI-style fit scoring · ~2 min</span>
                </span>
              </span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/app/discover"
              className="group flex items-center justify-between rounded-xl border border-ink/10 p-4 transition-colors hover:bg-cream"
            >
              <span className="flex items-center gap-3">
                <Compass size={20} className="text-navy" />
                <span>
                  <span className="block font-semibold text-navy">Browse the directory</span>
                  <span className="block text-xs text-ink/55">
                    {LISTINGS.length} listings across Southern California
                  </span>
                </span>
              </span>
              <ArrowRight size={18} className="text-ink/40 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Provider side */}
        <div className="rounded-3xl border border-ink/10 bg-navy p-8 text-white shadow-[var(--shadow-card)]">
          <Eyebrow tone="light">Clubs, Trainers &amp; Advisers</Eyebrow>
          <h2 className="display mt-3 text-2xl text-white">MANAGE YOUR LISTING</h2>
          <p className="mt-2 text-sm text-cream/70">
            Walk the claim-to-paid journey and explore leads, events, and analytics.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/app/provider"
              className="group flex items-center justify-between rounded-xl bg-gold p-4 text-ink transition-colors hover:bg-gold-300"
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard size={20} className="text-navy" />
                <span>
                  <span className="block font-semibold">Provider dashboard</span>
                  <span className="block text-xs text-ink/70">Claim → upgrade → paid</span>
                </span>
              </span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/app/provider/analytics"
              className="group flex items-center justify-between rounded-xl border border-white/15 p-4 transition-colors hover:bg-white/[0.06]"
            >
              <span className="flex items-center gap-3">
                <BarChart3 size={20} className="text-gold" />
                <span>
                  <span className="block font-semibold text-white">Leads &amp; analytics</span>
                  <span className="block text-xs text-cream/60">Paid-tier view</span>
                </span>
              </span>
              <ArrowRight size={18} className="text-cream/50 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* quick stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { n: counts.clubs, l: "Clubs & Programs" },
          { n: counts.trainers, l: "Trainers & Coaches" },
          { n: counts.consultants, l: "Consultants & Advisers" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="display text-3xl text-navy">{s.n}</p>
            <p className="eyebrow mt-1 text-ink/50">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
