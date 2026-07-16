"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, MessageSquare, CalendarDays, Star, Trophy, UserRound, CheckCheck, ArrowRight } from "lucide-react";
import type { AppNotification } from "@/lib/types";
import { useStore, markAllNotificationsRead } from "@/lib/store";
import { useRole } from "@/lib/useRole";
import { Eyebrow } from "@/components/ui/Eyebrow";

const ICONS = {
  message: MessageSquare,
  calendar: CalendarDays,
  star: Star,
  trophy: Trophy,
  user: UserRound,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function NotificationsClient() {
  const { notifications } = useStore();
  const role = useRole();
  const [tab, setTab] = useState<"all" | "unread">("all");

  const mine = useMemo(
    () =>
      notifications
        .filter((n) => n.role === role)
        .sort((a, b) => +new Date(b.at) - +new Date(a.at)),
    [notifications, role],
  );
  const unreadCount = mine.filter((n) => !n.read).length;
  const list = tab === "unread" ? mine.filter((n) => !n.read) : mine;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-navy" />
            <Eyebrow>Activity</Eyebrow>
          </div>
          <h1 className="display mt-2 text-4xl text-navy">NOTIFICATIONS</h1>
          <p className="mt-1 text-sm text-ink/60 capitalize">{role} · {mine.length} total</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead(role)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* tabs */}
      <div className="mt-5 flex rounded-lg bg-cream p-1 text-sm font-semibold">
        {(["all", "unread"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 capitalize transition-colors ${
              tab === t ? "bg-navy text-white" : "text-ink/55 hover:text-navy"
            }`}
          >
            {t} {t === "unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center">
            <Bell size={26} className="mx-auto text-ink/30" />
            <p className="mt-3 font-semibold text-navy">
              {tab === "unread" ? "No unread notifications" : "Nothing here yet"}
            </p>
            <p className="mt-1 text-sm text-ink/55">Activity across the platform will show up here.</p>
          </div>
        ) : (
          list.map((n) => <Row key={n.id} n={n} />)
        )}
      </div>
    </div>
  );
}

function Row({ n }: { n: AppNotification }) {
  const Icon = ICONS[n.icon] ?? Bell;
  const inner = (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
        n.read ? "border-ink/10 bg-white hover:bg-cream/40" : "border-gold/40 bg-gold/[0.06] hover:bg-gold/[0.1]"
      }`}
    >
      <div className="mt-0.5 rounded-lg bg-navy/[0.07] p-2 text-navy">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink/85">{n.text}</p>
        <p className="mt-0.5 text-xs text-ink/45">{timeAgo(n.at)}</p>
      </div>
      {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red" />}
      {n.href && <ArrowRight size={15} className="mt-1 shrink-0 text-ink/30" />}
    </div>
  );
  return n.href ? (
    <Link href={n.href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}
