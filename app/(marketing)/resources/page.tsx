import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ARTICLES } from "@/lib/data/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides and playbooks for families and providers — choosing the right development level, understanding the CSD Score, recruiting timelines, and more.",
};

export default function ResourcesPage() {
  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
  const rest = ARTICLES.filter((a) => a.slug !== featured.slug);

  return (
    <>
      <PageHero eyebrow="Resources" title="Guides & playbooks for the youth-sports" highlight="journey.">
        Practical, no-nonsense advice for families and providers — from picking the right program to
        navigating recruiting and filling a roster.
      </PageHero>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* featured */}
        <Link
          href={`/resources/${featured.slug}`}
          className="group grid overflow-hidden rounded-3xl border border-ink/10 bg-white transition-shadow hover:shadow-[var(--shadow-lift)] lg:grid-cols-2"
        >
          <div className="flex flex-col justify-center gap-4 bg-navy p-10 text-white">
            <span className="eyebrow text-gold-300">{featured.category}</span>
            <h2 className="display text-3xl text-white sm:text-4xl">{featured.title}</h2>
            <p className="text-cream/80">{featured.excerpt}</p>
            <span className="mt-2 inline-flex items-center gap-2 text-sm text-cream/70">
              <Clock size={14} /> {featured.readMins} min read · {featured.date}
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 font-semibold text-gold">
              Read the guide <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          <div className="flex items-center justify-center bg-cream-200 p-10">
            <BookOpen size={96} className="text-navy/15" />
          </div>
        </Link>

        {/* grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={`/resources/${a.slug}`}
              className="group flex flex-col rounded-2xl border border-ink/10 bg-white p-7 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="eyebrow text-red">{a.category}</span>
              <h3 className="mt-3 text-lg font-bold text-navy">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink/65">{a.excerpt}</p>
              <span className="mt-4 flex items-center justify-between text-xs text-ink/45">
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} /> {a.readMins} min · {a.date}
                </span>
                <ArrowRight size={15} className="text-red transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
