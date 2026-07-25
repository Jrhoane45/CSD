"use client";

import Link from "next/link";
import {
  UserPlus,
  Pencil,
  MapPin,
  Ruler,
  Weight,
  GraduationCap,
  Target,
  ArrowRight,
  Sparkles,
  Wallet,
  Compass,
  Images,
  ScanLine,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { MessageSquare, CalendarCheck, Ticket } from "lucide-react";
import { useProfile } from "@/lib/useProfile";
import { useProspectIQ } from "@/lib/useProspectIQ";
import { useStore } from "@/lib/store";
import { PILLAR_NAME, TIER_META } from "@/lib/prospectiq";
import { rankMatches, PRICE_LABEL } from "@/lib/scoring";
import { formatHeight } from "@/lib/location";
import { LISTINGS, CATEGORY_LABEL } from "@/lib/data/listings";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AthleteAvatar } from "@/components/app/AthleteAvatar";
import { LogoAvatar } from "@/components/listing/LogoAvatar";
import { MediaUploader } from "@/components/app/MediaUploader";
import { OverridableText } from "@/components/app/OverridableText";

export default function ProfilePage() {
  const { profile, ready } = useProfile();
  const { result: piq } = useProspectIQ();
  const { threads, events } = useStore();

  if (!ready) return null;

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream">
          <UserPlus size={26} className="text-navy" />
        </div>
        <h1 className="display mt-5 text-3xl text-navy">CREATE YOUR ATHLETE PROFILE</h1>
        <p className="mx-auto mt-2 max-w-md text-ink/60">
          Set up a free profile with your athlete&apos;s basics and matching criteria — then get
          ranked, fit-scored programs tailored to them.
        </p>
        <Link
          href="/app/profile/create"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-red-600"
        >
          Get started <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const matches = rankMatches(profile, LISTINGS).slice(0, 4);
  const fullName = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || "Your athlete";

  const myThreads = threads.filter((t) => !t.seeded);
  const bookings = myThreads.filter((t) => t.kind === "booking").length;
  const registered = events.filter((e) => e.registered).length;
  const activity = [
    { icon: MessageSquare, n: myThreads.length, label: "Conversations", href: "/app/inbox" },
    { icon: CalendarCheck, n: bookings, label: "Visits booked", href: "/app/inbox" },
    { icon: Ticket, n: registered, label: "Events registered", href: "/app/events" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <Eyebrow>Athlete profile</Eyebrow>
        <div className="flex items-center gap-2">
          <Link
            href="/athlete"
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            <Share2 size={14} /> Share profile
          </Link>
          <Link
            href="/app/profile/create"
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            <Pencil size={14} /> Edit profile
          </Link>
        </div>
      </div>

      {/* identity card */}
      <div className="mt-4 flex flex-wrap items-center gap-5 rounded-3xl border border-ink/10 bg-white p-7">
        <AthleteAvatar photo={profile.photo} firstName={profile.firstName} lastName={profile.lastName} size={92} />
        <div className="flex-1">
          <h1 className="display text-4xl text-navy">{fullName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/65">
            <span className="font-semibold text-ink/85">{profile.sport || "—"}</span>
            <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-ink">{profile.level || "—"}</span>
            {profile.age && <span>Age {profile.age}</span>}
            {profile.gender && <span>{profile.gender}</span>}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* athlete details */}
        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-semibold text-navy">Athlete details</h2>
          <dl className="mt-4 space-y-3">
            <Row icon={Ruler} label="Height" value={formatHeight(profile.heightIn)} />
            <Row icon={Weight} label="Weight" value={profile.weightLb ? `${profile.weightLb} lbs` : "—"} />
            <Row icon={GraduationCap} label="School" value={profile.school || "—"} />
            <Row icon={GraduationCap} label="Graduation year" value={profile.gradYear || "—"} />
          </dl>
        </section>

        {/* matching criteria */}
        <section className="rounded-2xl border border-navy/20 bg-navy/[0.03] p-6">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-navy" />
            <h2 className="font-semibold text-navy">Matching criteria</h2>
          </div>
          <p className="mt-1 text-xs text-ink/55">These base inputs drive the matching engine.</p>
          <dl className="mt-4 space-y-3">
            <Row icon={MapPin} label="Location" value={profile.zip ? `${profile.zip} · ${profile.county} Co.` : profile.county} />
            <Row icon={Compass} label="Travel radius" value={`${profile.maxMiles} miles`} />
            <Row icon={Wallet} label="Budget" value={PRICE_LABEL[profile.priceMax ?? 0]} />
            <Row icon={Target} label="Looking for" value={profile.category === "any" ? "Any provider" : CATEGORY_LABEL[profile.category]} />
          </dl>
          {profile.goals.length > 0 && (
            <div className="mt-4">
              <p className="eyebrow text-ink/45">Goals</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.goals.map((g) => (
                  <span key={g} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-navy">{g}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* live activity */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {activity.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="group flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5 transition-colors hover:border-navy/30"
          >
            <div>
              <p className="display text-3xl text-navy">{a.n}</p>
              <p className="eyebrow mt-1 text-ink/50">{a.label}</p>
            </div>
            <a.icon size={22} className="text-ink/30 transition-colors group-hover:text-navy" />
          </Link>
        ))}
      </div>

      {/* Prospect IQ */}
      {piq ? (
        <section className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-navy text-white">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="eyebrow text-gold-300">Prospect IQ™ · {piq.sport}</p>
              <div className="mt-1.5 flex items-end gap-2">
                <span className="display text-4xl text-white">{piq.tier}</span>
                {piq.verified && (
                  <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-bold text-ink">
                    <ShieldCheck size={11} /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-cream/70">{TIER_META[piq.tier].blurb}</p>
            </div>
            <div className="flex gap-5 text-right">
              <div>
                <p className="display text-2xl text-gold">{piq.percentile}th</p>
                <p className="eyebrow text-[0.5rem] text-cream/55">Percentile</p>
              </div>
              <div>
                <p className="display text-2xl text-gold">{piq.composite}</p>
                <p className="eyebrow text-[0.5rem] text-cream/55">PIQ</p>
              </div>
              <div>
                <p className="display text-2xl text-gold">{piq.confidence}%</p>
                <p className="eyebrow text-[0.5rem] text-cream/55">Confidence</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-3">
            <div className="flex flex-wrap gap-3 text-xs text-cream/70">
              {(["T", "A", "G", "C", "E"] as const).map((k) => (
                <span key={k}>
                  {PILLAR_NAME[k].split(" ")[0]} <span className="font-semibold text-white">{piq.pillars[k]}</span>
                </span>
              ))}
            </div>
            <Link href="/app/prospect-iq" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300">
              View / re-evaluate <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      ) : (
        <Link
          href="/app/prospect-iq"
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gold/[0.08] p-6 transition-colors hover:bg-gold/[0.14]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
              <ScanLine size={20} />
            </div>
            <div>
              <p className="font-bold text-navy">Evaluate your game with Prospect IQ™</p>
              <p className="text-sm text-ink/60">The premium AI scout — get a tier, five-pillar breakdown, and a development plan.</p>
            </div>
          </div>
          <ArrowRight size={18} className="shrink-0 text-navy" />
        </Link>
      )}

      {/* media gallery */}
      {((profile.photos?.length ?? 0) > 0 || (profile.videos?.length ?? 0) > 0) && (
        <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center gap-2">
            <Images size={18} className="text-navy" />
            <h2 className="font-semibold text-navy">Photos &amp; video</h2>
          </div>
          <div className="mt-4">
            <MediaUploader photos={profile.photos ?? []} videos={profile.videos ?? []} editable={false} />
          </div>
        </section>
      )}

      {/* matches driven by the profile */}
      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-gold" />
              <h2 className="display text-2xl text-navy">YOUR TOP MATCHES</h2>
            </div>
            <p className="mt-1 text-sm text-ink/55">Generated from your profile criteria.</p>
          </div>
          <Link href="/app/match" className="inline-flex items-center gap-1.5 text-sm font-semibold text-red">
            Refine in match tool <ArrowRight size={15} />
          </Link>
        </div>

        {matches.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-ink/20 p-8 text-center text-ink/55">
            No matches for this sport/category yet — try editing your criteria.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {matches.map((m, i) => (
              <Link
                key={m.listing.id}
                href={`/app/listing/${m.listing.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 transition-colors hover:border-navy/30"
              >
                <span className="display w-6 text-xl text-ink/30">{i + 1}</span>
                <LogoAvatar listing={m.listing} size="sm" />
                <div className="flex-1">
                  <OverridableText
                    as="p"
                    listingId={m.listing.id}
                    field="name"
                    fallback={m.listing.name}
                    className="font-bold text-navy"
                  />
                  <p className="text-xs text-ink/55">
                    {CATEGORY_LABEL[m.listing.category]} · {m.listing.city}, {m.listing.county} Co.
                  </p>
                </div>
                <span className="rounded-full bg-gold/20 px-3 py-1 text-sm font-bold text-ink">{m.fit}% fit</span>
                <ArrowRight size={16} className="text-ink/30 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="inline-flex items-center gap-2 text-ink/60">
        <Icon size={15} className="text-navy" /> {label}
      </span>
      <span className="font-semibold text-navy">{value || "—"}</span>
    </div>
  );
}
