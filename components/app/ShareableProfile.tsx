"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Ruler,
  Weight,
  GraduationCap,
  ScanLine,
  ShieldCheck,
  Share2,
  Check,
  Copy,
  Mail,
  Trophy,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { useProfile } from "@/lib/useProfile";
import { useProspectIQ } from "@/lib/useProspectIQ";
import { useStore } from "@/lib/store";
import { PILLAR_NAME, TIER_META } from "@/lib/prospectiq";
import { formatHeight } from "@/lib/location";
import { AthleteAvatar } from "@/components/app/AthleteAvatar";
import { MediaUploader } from "@/components/app/MediaUploader";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ShareableProfile() {
  const { profile, ready } = useProfile();
  const { result: piq } = useProspectIQ();
  const { recruiting } = useStore();
  const [copied, setCopied] = useState(false);

  if (!ready) return <div className="min-h-[60vh]" />;

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream">
          <UserPlus size={26} className="text-navy" />
        </div>
        <h1 className="display mt-5 text-3xl text-navy">NO PROFILE TO SHARE YET</h1>
        <p className="mx-auto mt-2 max-w-md text-ink/60">
          Create an athlete profile and it&apos;ll get its own shareable page you can send to coaches.
        </p>
        <Link
          href="/app/profile/create"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-red-600"
        >
          Create a profile <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const fullName = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || "Your athlete";
  const offers = recruiting.schools.filter((s) => s.status === "Offer").length;
  const targets = recruiting.schools.length;

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* owner share bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/[0.08] p-4">
        <p className="flex items-center gap-2 text-sm text-ink/70">
          <Share2 size={16} className="text-navy" />
          Your athlete&apos;s public recruiting page — send it to any coach.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={share}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Link copied" : "Copy link"}
          </button>
          <Link
            href="/app/profile"
            className="rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* hero */}
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-navy text-white">
        <div className="flex flex-wrap items-center gap-6 p-8">
          <AthleteAvatar
            photo={profile.photo}
            firstName={profile.firstName}
            lastName={profile.lastName}
            size={104}
            className="ring-4 ring-white/10"
          />
          <div className="flex-1">
            <Eyebrow tone="light">Recruiting profile</Eyebrow>
            <h1 className="display mt-1 text-4xl text-white sm:text-5xl">{fullName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {profile.sport && <Chip>{profile.sport}</Chip>}
              {piq?.position && <Chip>{piq.position}</Chip>}
              {profile.level && <Chip gold>{profile.level}</Chip>}
              {profile.gradYear && <Chip>Class of {profile.gradYear}</Chip>}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-cream/75">
              {profile.county && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} /> {profile.zip ? `${profile.zip} · ` : ""}
                  {profile.county} County
                </span>
              )}
              {profile.age != null && <span>Age {profile.age}</span>}
              {profile.gender && <span>{profile.gender}</span>}
            </div>
          </div>
        </div>

        {/* physical stat strip */}
        <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
          <Stat icon={Ruler} label="Height" value={formatHeight(profile.heightIn)} />
          <Stat icon={Weight} label="Weight" value={profile.weightLb ? `${profile.weightLb} lbs` : "—"} />
          <Stat icon={GraduationCap} label="School" value={profile.school || "—"} />
          <Stat icon={Trophy} label="Offers" value={offers ? String(offers) : targets ? `${targets} targets` : "—"} />
        </div>
      </div>

      {/* Prospect IQ */}
      {piq && (
        <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ScanLine size={18} className="text-navy" />
              <h2 className="font-semibold text-navy">Prospect IQ™ evaluation</h2>
              {piq.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-navy/[0.07] px-2 py-0.5 text-[0.6rem] font-bold text-navy">
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
            </div>
            <div className="flex gap-5 text-right">
              <Metric v={`${piq.percentile}th`} l="Percentile" />
              <Metric v={String(piq.composite)} l="PIQ" />
              <Metric v={piq.tier} l="Tier" />
            </div>
          </div>
          <p className="mt-2 text-sm text-ink/60">{TIER_META[piq.tier].blurb}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(["T", "A", "G", "C", "E"] as const).map((k) => (
              <div key={k} className="rounded-xl bg-cream/60 p-3">
                <p className="text-xs text-ink/55">{PILLAR_NAME[k]}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-navy" style={{ width: `${piq.pillars[k]}%` }} />
                  </div>
                  <span className="text-sm font-bold text-navy">{piq.pillars[k]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* media */}
      {((profile.photos?.length ?? 0) > 0 || (profile.videos?.length ?? 0) > 0) && (
        <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-semibold text-navy">Highlights</h2>
          <div className="mt-4">
            <MediaUploader photos={profile.photos ?? []} videos={profile.videos ?? []} editable={false} />
          </div>
        </section>
      )}

      {/* contact */}
      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-cream-200 p-8">
        <div>
          <h2 className="display text-2xl text-navy">INTERESTED IN {fullName.split(" ")[0].toUpperCase()}?</h2>
          <p className="mt-1 text-sm text-ink/65">Reach out — recruiting inquiries welcome.</p>
        </div>
        {profile.email ? (
          <a
            href={`mailto:${profile.email}?subject=Recruiting inquiry — ${fullName}`}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <Mail size={16} /> Contact
          </a>
        ) : (
          <Link
            href="/app/inbox"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <Mail size={16} /> Contact via CSD
          </Link>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-ink/45">
        Demo — a shared link opens the profile saved in this browser. Powered by{" "}
        <Link href="/" className="font-semibold text-navy hover:underline">
          Club Sports Direct
        </Link>
        .
      </p>
    </div>
  );
}

function Chip({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        gold ? "bg-gold text-ink" : "bg-white/10 text-white"
      }`}
    >
      {children}
    </span>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Ruler; label: string; value: string }) {
  return (
    <div className="bg-navy p-4">
      <Icon size={16} className="text-gold" />
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
      <p className="eyebrow mt-0.5 text-[0.5rem] text-cream/55">{label}</p>
    </div>
  );
}

function Metric({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <p className="display text-2xl text-navy">{v}</p>
      <p className="eyebrow text-[0.5rem] text-ink/50">{l}</p>
    </div>
  );
}
