import type { Metadata } from "next";
import { Check, Minus, ArrowRight, Megaphone, Repeat, Building2, Database } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Club Sports Direct listing tiers for clubs, trainers, and advisers — plus à-la-carte event promotion. Parents are always free.",
};

type Cell = boolean | string;
const TIERS = [
  { name: "Claimed-Free", price: "$0", period: "forever", cta: "Claim your profile", featured: false },
  { name: "Standard", price: "$49", period: "/ month", cta: "Start Standard", featured: true },
  { name: "Premium", price: "$149", period: "/ month", cta: "Go Premium", featured: false },
];

const ROWS: { label: string; cells: [Cell, Cell, Cell] }[] = [
  { label: "Verified, editable profile", cells: [true, true, true] },
  { label: "Appear in search & matches", cells: [true, true, true] },
  { label: "Respond to reviews", cells: [false, true, true] },
  { label: "Lead inbox & management", cells: [false, "Basic", "Advanced"] },
  { label: "Analytics dashboard", cells: [false, "Basic", "Advanced"] },
  { label: "Event & promotional posts", cells: ["In-network", true, true] },
  { label: "Included monthly boosts", cells: [false, "1", "4"] },
  { label: "Featured placement", cells: [false, false, true] },
  { label: "Priority support", cells: [false, false, true] },
];

function CellView({ value }: { value: Cell }) {
  if (value === true) return <Check size={18} className="mx-auto text-navy" />;
  if (value === false) return <Minus size={16} className="mx-auto text-ink/25" />;
  return <span className="text-xs font-medium text-ink/70">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Recurring for the supply side." highlight="Free for families.">
        Clubs, trainers, and advisers subscribe to reach higher-fit athletes. Parents and athletes
        use Club Sports Direct free, always.
      </PageHero>

      {/* Tier cards */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {TIERS.map((t, ti) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                t.featured
                  ? "border-navy bg-navy text-white shadow-[var(--shadow-lift)]"
                  : "border-ink/10 bg-white"
              }`}
            >
              {t.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">
                  Most popular
                </span>
              )}
              <p className={`eyebrow ${t.featured ? "text-gold-300" : "text-red"}`}>{t.name}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`display text-5xl ${t.featured ? "text-white" : "text-navy"}`}>
                  {t.price}
                </span>
                <span className={t.featured ? "text-cream/70" : "text-ink/50"}>{t.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {ROWS.filter((r) => r.cells[ti] !== false).map((r) => (
                  <li
                    key={r.label}
                    className={`flex items-start gap-2 text-sm ${
                      t.featured ? "text-cream/85" : "text-ink/70"
                    }`}
                  >
                    <Check size={16} className={`mt-0.5 shrink-0 ${t.featured ? "text-gold" : "text-navy"}`} />
                    <span>
                      {r.label}
                      {typeof r.cells[ti] === "string" && (
                        <span className="opacity-60"> · {r.cells[ti]}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/app/provider"
                variant={t.featured ? "gold" : "primary"}
                className="mt-7"
              >
                {t.cta} <ArrowRight size={16} />
              </ButtonLink>
            </div>
          ))}
        </div>

        {/* Full matrix */}
        <div className="mt-14 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="bg-cream-200">
                <th className="p-4 text-sm font-semibold text-navy">Compare every feature</th>
                {TIERS.map((t) => (
                  <th key={t.name} className="p-4 text-center text-sm font-semibold text-navy">
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, ri) => (
                <tr key={r.label} className={ri % 2 ? "bg-white" : "bg-cream/40"}>
                  <td className="p-4 text-sm text-ink/75">{r.label}</td>
                  {r.cells.map((c, ci) => (
                    <td key={ci} className="p-4 text-center">
                      <CellView value={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* à la carte */}
        <div className="mt-10 rounded-2xl border border-gold/40 bg-gold/[0.07] p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold text-ink">
              <Megaphone size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy">À-la-carte Event Boosts</h3>
              <p className="mt-1 text-sm text-ink/65">
                A distinct revenue stream from subscriptions. Promote tryouts, camps, and showcases
                with broader reach — per post, when seasonality demands it.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { n: "Basic Boost", p: "$19" },
                  { n: "Standard Boost", p: "$39" },
                  { n: "Premium Boost", p: "$79" },
                ].map((b) => (
                  <span key={b.n} className="rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm">
                    <span className="font-semibold text-navy">{b.n}</span>{" "}
                    <span className="text-ink/55">{b.p} / post</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four revenue pillars */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow tone="light">For investors</Eyebrow>
          <h2 className="display mt-4 text-3xl text-white sm:text-4xl">FOUR REVENUE PILLARS.</h2>
          <p className="mt-4 max-w-2xl text-cream/75">
            Layered and diversifying — subscriptions stabilize the base while promotion, advertising,
            and data compound on the same user base.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Repeat, n: "01", t: "Subscriptions", b: "Recurring monthly listing fees — the predictable base." },
              { icon: Megaphone, n: "02", t: "Event & Promo Posts", b: "High-margin à-la-carte upsell on seasonality." },
              { icon: Building2, n: "03", t: "B2B Advertising", b: "High-intent surface for vendors at scale." },
              { icon: Database, n: "04", t: "Data Licensing", b: "Anonymized outcomes data — a compounding asset." },
            ].map((p) => (
              <div key={p.n} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <p.icon size={24} className="text-gold" />
                <p className="eyebrow mt-4 text-gold-300">— {p.n}</p>
                <h3 className="mt-1 font-bold text-white">{p.t}</h3>
                <p className="mt-2 text-sm text-cream/70">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
