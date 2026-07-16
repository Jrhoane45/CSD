"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  MessageSquare,
  Ticket,
  Bookmark,
  Target,
  Compass,
  ScanLine,
  GraduationCap,
  CalendarDays,
  Settings,
  Receipt,
  Sparkles,
  MapPin,
  Clock,
  Trophy,
  Share2,
} from "lucide-react";
import type { AthleteProfile } from "@/lib/types";
import { useStore, formatEventDate } from "@/lib/store";
import { useProspectIQ } from "@/lib/useProspectIQ";
import { usePiqHistory } from "@/lib/usePiqHistory";
import { rankMatches } from "@/lib/scoring";
import { formatMoney } from "@/lib/scheduling";
import { LISTINGS, CATEGORY_LABEL, getListing } from "@/lib/data/listings";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AthleteAvatar } from "@/components/app/AthleteAvatar";
import { LogoAvatar } from "@/components/listing/LogoAvatar";
import { PiqProgress } from "@/components/app/PiqProgress";
import { OverridableText } from "@/components/app/OverridableText";

export function AthleteHome({ profile }: { profile: AthleteProfile }) {
  const { threads, events, bookings, recruiting } = useStore();
  const { result: piq } = useProspectIQ();
  const { history } = usePiqHistory();

  const firstName = profile.firstName || "there";
  const fullName = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || "Your athlete";

  const myThreads = useMemo(() => threads.filter((t) => !t.seeded), [threads]);
  const unread = myThreads.filter((t) => t.unreadFor === "parent").length;
  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => b.parentName === "You" && b.status === "upcoming")
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [bookings],
  );
  const nextSession = upcoming[0];
  const registeredEvents = useMemo(
    () => events.filter((e) => e.registered).sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [events],
  );

  const matches = useMemo(() => rankMatches(profile, LISTINGS).slice(0, 3), [profile]);

  const recruitingDone = Object.values(recruiting.tasks).filter(Boolean).length;
  const targetSchools = recruiting.schools.length;

  const stats = [
    { icon: MessageSquare, n: myThreads.length, label: "Conversations", href: "/app/inbox", badge: unread },
    { icon: CalendarClock, n: upcoming.length, label: "Upcoming sessions", href: "/app/sessions" },
    { icon: Ticket, n: registeredEvents.length, label: "Events", href: "/app/events" },
    { icon: GraduationCap, n: targetSchools, label: "Target schools", href: "/app/recruiting" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <AthleteAvatar photo={profile.photo} firstName={profile.firstName} lastName={profile.lastName} size={64} />
          <div>
            <Eyebrow>Your dashboard</Eyebrow>
            <h1 className="display mt-1 text-3xl text-navy sm:text-4xl">Welcome back, {firstName}.</h1>
            <p className="mt-1 text-sm text-ink/60">
              {fullName} · {profile.sport || "—"}
              {profile.level && <span className="ml-1 text-ink/45">· {profile.level}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/athlete"
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy/25 px-3 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            <Share2 size={15} /> Share
          </Link>
          <Link
            href="/app/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-2 text-sm font-semibold text-ink/70 hover:text-navy"
          >
            <Receipt size={15} /> Orders
          </Link>
          <Link
            href="/app/settings"
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-2 text-sm font-semibold text-ink/70 hover:text-navy"
          >
            <Settings size={15} /> Settings
          </Link>
        </div>
      </div>

      {/* quick actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <QuickAction href="/app/match" icon={Target} title="Find a match" tone="navy" />
        <QuickAction href="/app/discover" icon={Compass} title="Discover" />
        <QuickAction href="/app/prospect-iq" icon={ScanLine} title="Prospect IQ" tone="gold" />
        <QuickAction href="/app/rankings" icon={Trophy} title="Rankings" />
        <QuickAction href="/app/sessions" icon={CalendarClock} title="My sessions" />
      </div>

      {/* stat row */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group relative flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5 transition-colors hover:border-navy/30"
          >
            <div>
              <p className="display text-3xl text-navy">{s.n}</p>
              <p className="eyebrow mt-1 text-ink/50">{s.label}</p>
            </div>
            <s.icon size={22} className="text-ink/30 transition-colors group-hover:text-navy" />
            {!!s.badge && s.badge > 0 && (
              <span className="absolute right-4 top-4 flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1 text-[0.65rem] font-bold text-white">
                {s.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* left column */}
        <div className="space-y-6">
          {/* next session */}
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock size={18} className="text-navy" />
                <h3 className="font-semibold text-navy">Next session</h3>
              </div>
              <Link href="/app/sessions" className="text-sm font-semibold text-red hover:underline">
                All sessions
              </Link>
            </div>
            {nextSession ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-cream/60 p-4">
                <div className="flex items-center gap-3">
                  {getListing(nextSession.listingId) && (
                    <LogoAvatar listing={getListing(nextSession.listingId)!} size="sm" />
                  )}
                  <div>
                    <p className="font-semibold text-navy">{nextSession.sessionTypeName}</p>
                    <p className="text-sm text-ink/60">{nextSession.listingName}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/55">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={12} className="text-gold" /> {formatEventDate(nextSession.date)} · {nextSession.time}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} /> {nextSession.durationMin} min
                      </span>
                      <span className="font-semibold text-ink/70">{formatMoney(nextSession.price)}</span>
                    </p>
                  </div>
                </div>
                <Link
                  href="/app/inbox"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-3 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
                >
                  <MessageSquare size={14} /> Message
                </Link>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-ink/20 p-4">
                <p className="text-sm text-ink/60">No sessions booked yet — find a program and reserve a real time slot.</p>
                <Link
                  href="/app/discover"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
                >
                  Book one <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Prospect IQ */}
          {history.length > 0 ? (
            <PiqProgress history={history} compact />
          ) : (
            <Link
              href="/app/prospect-iq"
              className="flex items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gold/[0.08] p-6 transition-colors hover:bg-gold/[0.14]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
                  <ScanLine size={20} />
                </div>
                <div>
                  <p className="font-bold text-navy">Evaluate your game with Prospect IQ™</p>
                  <p className="text-sm text-ink/60">
                    {piq ? "Re-evaluate to start charting progress." : "Get a tier, five-pillar breakdown & development plan."}
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="shrink-0 text-navy" />
            </Link>
          )}

          {/* recommended programs */}
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-gold" />
                <h3 className="font-semibold text-navy">Recommended for {firstName}</h3>
              </div>
              <Link href="/app/match" className="text-sm font-semibold text-red hover:underline">
                Refine
              </Link>
            </div>
            {matches.length === 0 ? (
              <p className="mt-4 text-sm text-ink/55">Add a sport to your profile to see matches.</p>
            ) : (
              <div className="mt-4 space-y-2.5">
                {matches.map((m) => (
                  <Link
                    key={m.listing.id}
                    href={`/app/listing/${m.listing.id}`}
                    className="group flex items-center gap-4 rounded-xl border border-ink/10 p-3 transition-colors hover:border-navy/30"
                  >
                    <LogoAvatar listing={m.listing} size="sm" />
                    <div className="flex-1 min-w-0">
                      <OverridableText
                        as="p"
                        listingId={m.listing.id}
                        field="name"
                        fallback={m.listing.name}
                        className="truncate font-semibold text-navy"
                      />
                      <p className="flex items-center gap-1 truncate text-xs text-ink/55">
                        <MapPin size={11} /> {CATEGORY_LABEL[m.listing.category]} · {m.listing.city}
                      </p>
                    </div>
                    <span className="rounded-full bg-gold/20 px-2.5 py-1 text-sm font-bold text-ink">{m.fit}%</span>
                    <ArrowRight size={15} className="text-ink/30 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* right column */}
        <div className="space-y-6">
          {/* upcoming events */}
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-navy" />
              <h3 className="font-semibold text-navy">Your events</h3>
            </div>
            {registeredEvents.length === 0 ? (
              <div className="mt-3">
                <p className="text-sm text-ink/55">Not registered for anything yet.</p>
                <Link href="/app/events" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-red">
                  Browse events <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {registeredEvents.slice(0, 4).map((e) => (
                  <li key={e.id} className="rounded-xl border border-ink/10 p-3">
                    <p className="text-sm font-semibold text-navy">{e.title}</p>
                    <p className="mt-0.5 text-xs text-ink/55">
                      {formatEventDate(e.date)} · {e.city} · {e.priceLabel}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* recruiting snapshot */}
          <div className="rounded-2xl border border-ink/10 bg-navy p-6 text-white">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-gold" />
              <h3 className="font-semibold text-white">Recruiting</h3>
            </div>
            <div className="mt-4 flex gap-6">
              <div>
                <p className="display text-3xl text-gold">{recruitingDone}</p>
                <p className="eyebrow mt-1 text-[0.5rem] text-cream/60">Checklist done</p>
              </div>
              <div>
                <p className="display text-3xl text-gold">{targetSchools}</p>
                <p className="eyebrow mt-1 text-[0.5rem] text-cream/60">Target schools</p>
              </div>
            </div>
            <Link
              href="/app/recruiting"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold-300"
            >
              Open Recruiting Hub <ArrowRight size={14} />
            </Link>
          </div>

          {/* saved searches / shortcuts */}
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <div className="flex items-center gap-2">
              <Bookmark size={18} className="text-navy" />
              <h3 className="font-semibold text-navy">Shortcuts</h3>
            </div>
            <div className="mt-3 space-y-1.5 text-sm">
              <Shortcut href="/app/saved" label="Saved programs" />
              <Shortcut href="/app/rankings" label="Prospect IQ rankings" />
              <Shortcut href="/app/profile" label="Edit athlete profile" />
              <Shortcut href="/app/orders" label="Orders & receipts" />
              <Shortcut href="/app/help" label="Help & support" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  tone,
}: {
  href: string;
  icon: typeof Target;
  title: string;
  tone?: "navy" | "gold";
}) {
  const cls =
    tone === "navy"
      ? "bg-navy text-white hover:bg-navy-deep"
      : tone === "gold"
        ? "border border-gold/40 bg-gold/[0.08] text-navy hover:bg-gold/[0.16]"
        : "border border-ink/10 bg-white text-navy hover:bg-cream";
  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-2 rounded-2xl p-4 text-sm font-semibold transition-colors ${cls}`}
    >
      <span className="flex items-center gap-2.5">
        <Icon size={18} className={tone === "navy" ? "text-gold" : "text-navy"} />
        {title}
      </span>
      <ArrowRight size={16} className="opacity-60" />
    </Link>
  );
}

function Shortcut({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg px-3 py-2 text-ink/70 transition-colors hover:bg-cream hover:text-navy"
    >
      {label}
      <ArrowRight size={14} className="text-ink/30" />
    </Link>
  );
}
