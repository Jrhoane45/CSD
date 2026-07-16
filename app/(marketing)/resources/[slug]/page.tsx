import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Check } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { ARTICLES, getArticle } from "@/lib/data/resources";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const more = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-14">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-navy"
        >
          <ArrowLeft size={15} /> All resources
        </Link>

        <div className="mt-6">
          <Eyebrow tone="red">{article.category}</Eyebrow>
          <h1 className="display mt-3 text-4xl text-navy sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg text-ink/70">{article.excerpt}</p>
          <p className="mt-4 flex items-center gap-3 text-sm text-ink/50">
            <span>{article.author}</span>
            <span className="h-1 w-1 rounded-full bg-ink/30" />
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {article.readMins} min read
            </span>
            <span className="h-1 w-1 rounded-full bg-ink/30" />
            <span>{article.date}</span>
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {article.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h2 className="display text-2xl text-navy">{s.heading}</h2>}
              <div className={s.heading ? "mt-3 space-y-4" : "space-y-4"}>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="text-ink/75 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              {s.bullets && (
                <ul className="mt-4 space-y-2.5">
                  {s.bullets.map((b, k) => (
                    <li key={k} className="flex items-start gap-2.5 text-ink/75">
                      <Check size={17} className="mt-0.5 shrink-0 text-navy" /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* inline CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl bg-navy p-7 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h3 className="display text-2xl text-white">PUT IT INTO PRACTICE.</h3>
            <p className="mt-1 text-sm text-cream/75">Build a profile and see your fit-scored matches — free.</p>
          </div>
          <ButtonLink href="/app/match" variant="gold" className="shrink-0">
            Find your match <ArrowRight size={16} />
          </ButtonLink>
        </div>
      </article>

      {/* more reading */}
      <section className="border-t border-ink/10 bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <Eyebrow>Keep reading</Eyebrow>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {more.map((a) => (
              <Link
                key={a.slug}
                href={`/resources/${a.slug}`}
                className="group rounded-2xl border border-ink/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="eyebrow text-red">{a.category}</span>
                <h3 className="mt-2 font-bold text-navy">{a.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-red">
                  Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
