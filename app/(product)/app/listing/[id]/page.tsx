import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  BadgeCheck,
  Sparkles,
  ArrowLeft,
  Trophy,
  GraduationCap,
  Award,
  Dumbbell,
  Clock,
  DollarSign,
} from "lucide-react";
import { LISTINGS, getListing, CATEGORY_LABEL } from "@/lib/data/listings";
import { computeCsdScore, derivedGoals } from "@/lib/scoring";
import { CsdScoreBadge } from "@/components/ui/CsdScoreBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LogoAvatar } from "@/components/listing/LogoAvatar";
import { ScoreBreakdown } from "@/components/listing/ScoreBreakdown";
import { ListingReviews } from "@/components/listing/ListingReviews";
import { ListingHeadlineRating } from "@/components/listing/ListingHeadlineRating";
import { ListingActions } from "@/components/app/ListingActions";
import { OverridableText } from "@/components/app/OverridableText";
import { ListingSuspendedNotice } from "@/components/app/ListingSuspendedNotice";
import { ListingVerifiedBadge } from "@/components/app/ListingVerifiedBadge";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) return { title: "Listing not found" };
  return {
    title: listing.name,
    description: listing.philosophy,
  };
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  const { score, parts } = computeCsdScore(listing);

  const alumniTotal =
    listing.alumni.pro + listing.alumni.d1 + listing.alumni.d2 + listing.alumni.d3;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Link
        href="/app/discover"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-navy"
      >
        <ArrowLeft size={15} /> Back to directory
      </Link>

      <ListingSuspendedNotice listingId={listing.id} verified={listing.verified} />

      {/* claim banner */}
      {listing.claimState === "unclaimed" && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/50 bg-gold/[0.08] p-5">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="mt-0.5 text-gold" />
            <div>
              <p className="font-semibold text-navy">This is an auto-built profile.</p>
              <p className="text-sm text-ink/65">
                Built from public data. Is this your program? Claim it to control your narrative.
              </p>
            </div>
          </div>
          <Link
            href="/app/provider"
            className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            Claim this profile
          </Link>
        </div>
      )}

      {/* header */}
      <div className="mt-5 grid gap-6 rounded-3xl border border-ink/10 bg-white p-7 lg:grid-cols-[1fr_auto] lg:p-9">
        <div className="flex items-start gap-4">
          <LogoAvatar listing={listing} size="lg" className="mt-1" />
          <div className="flex-1">
          <div className="flex items-center gap-3">
            <Eyebrow tone="red">{CATEGORY_LABEL[listing.category]}</Eyebrow>
            <ListingVerifiedBadge listingId={listing.id} verified={listing.verified} />
          </div>
          <OverridableText
            as="h1"
            listingId={listing.id}
            field="name"
            fallback={listing.name}
            className="display mt-2 text-4xl text-navy"
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink/65">
            <span className="font-semibold text-ink/85">{listing.sports.join(" · ")}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} /> {listing.city}, {listing.county} County
            </span>
            <ListingHeadlineRating listingId={listing.id} seedReviews={listing.reviews} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {listing.levels.map((l) => (
              <span key={l} className="rounded-full bg-navy/[0.07] px-3 py-1 text-xs font-medium text-navy">
                {l}
              </span>
            ))}
            {listing.specialties.map((s) => (
              <span key={s} className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-ink/75">
                {s}
              </span>
            ))}
          </div>
          <ListingActions listing={listing} />
          </div>
        </div>

        <div className="flex flex-row items-center gap-4 lg:flex-col lg:items-end lg:justify-center">
          <CsdScoreBadge score={score} size="lg" />
          <p className="eyebrow text-ink/45">CSD Score™</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* main column */}
        <div className="space-y-6">
          {/* overview */}
          <section className="rounded-2xl border border-ink/10 bg-white p-7">
            <h2 className="display text-2xl text-navy">OVERVIEW</h2>
            <OverridableText
              as="p"
              listingId={listing.id}
              field="philosophy"
              fallback={listing.philosophy}
              className="mt-3 text-ink/70"
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {listing.goals.map((g) => (
                <div key={g} className="flex items-center gap-2 rounded-lg bg-cream/60 px-3 py-2 text-sm">
                  <Award size={15} className="text-gold" /> {g}
                </div>
              ))}
              {derivedGoals(listing).map((g) => (
                <div
                  key={g}
                  className="flex items-center gap-2 rounded-lg border border-navy/15 bg-navy/[0.04] px-3 py-2 text-sm"
                  title="Matched from this program's specialties"
                >
                  <Dumbbell size={15} className="text-navy" /> {g}
                </div>
              ))}
            </div>
          </section>

          {/* alumni outcomes */}
          <section className="rounded-2xl border border-ink/10 bg-white p-7">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-gold" />
              <h2 className="display text-2xl text-navy">ALUMNI OUTCOMES</h2>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { l: "Pro", v: listing.alumni.pro },
                { l: "D1", v: listing.alumni.d1 },
                { l: "D2", v: listing.alumni.d2 },
                { l: "D3", v: listing.alumni.d3 },
              ].map((a) => (
                <div key={a.l} className="rounded-xl bg-cream/60 p-4 text-center">
                  <p className="display text-3xl text-navy">{a.v}</p>
                  <p className="eyebrow mt-1 text-ink/50">{a.l}</p>
                </div>
              ))}
            </div>
            {alumniTotal === 0 && (
              <p className="mt-4 text-sm text-ink/55">
                No verified placements on file yet — common for newer or recreational programs.
              </p>
            )}
            {listing.notableAthletes.length > 0 && (
              <div className="mt-5">
                <p className="eyebrow text-ink/50">Notable</p>
                <ul className="mt-2 space-y-1.5">
                  {listing.notableAthletes.map((n) => (
                    <li key={n} className="flex items-center gap-2 text-sm text-ink/75">
                      <GraduationCap size={15} className="text-navy" /> {n}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* reviews (live — merges user-submitted reviews) */}
          <ListingReviews
            listingId={listing.id}
            listingName={listing.name}
            category={listing.category}
            seedReviews={listing.reviews}
          />
        </div>

        {/* sidebar */}
        <aside className="space-y-6">
          <div className="sticky top-28 space-y-6">
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <p className="eyebrow text-ink/50">CSD Score™ breakdown</p>
              <div className="mt-3 flex items-center gap-3">
                <CsdScoreBadge score={score} size="md" showTier />
              </div>
              <div className="mt-5">
                <ScoreBreakdown parts={parts} />
              </div>
              <Link
                href="/csd-score"
                className="mt-4 inline-block text-sm font-semibold text-red hover:underline"
              >
                How is this calculated?
              </Link>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <p className="eyebrow text-ink/50">Quick facts</p>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex items-center gap-2.5 text-ink/75">
                  <Clock size={16} className="text-navy" /> {listing.yearsInOperation} years operating
                </li>
                <li className="flex items-center gap-2.5 text-ink/75">
                  <DollarSign size={16} className="text-navy" />{" "}
                  <OverridableText listingId={listing.id} field="priceLabel" fallback={listing.priceLabel} />
                </li>
                {listing.certifications.map((c) => (
                  <li key={c} className="flex items-center gap-2.5 text-ink/75">
                    <BadgeCheck size={16} className="text-navy" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
