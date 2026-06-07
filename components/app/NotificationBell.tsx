"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, MessageSquare, CalendarDays, Star, Trophy, UserRound } from "lucide-react";
import type { AppNotification } from "@/lib/types";
import { useStore, markAllNotificationsRead } from "@/lib/store";
import { useRole } from "@/lib/useRole";

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

export function NotificationBell() {
  const { notifications } = useStore();
  const role = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mine = useMemo<AppNotification[]>(
    () => notifications.filter((n) => n.role === role).slice(0, 12),
    [notifications, role],
  );
  const unread = mine.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread) setTimeout(() => markAllNotificationsRead(role), 900);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        aria-label="Notifications"
        className="relative rounded-lg p-2 text-ink/55 transition-colors hover:bg-cream hover:text-navy"
      >
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[0.6rem] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[calc(100vw-1.5rem)] max-w-80 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[var(--shadow-lift)]">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <p className="text-sm font-bold text-navy">Notifications</p>
            <span className="eyebrow text-ink/45 capitalize">{role}</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {mine.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink/50">You&apos;re all caught up.</p>
            ) : (
              mine.map((n) => {
                const Icon = ICONS[n.icon] ?? Bell;
                const inner = (
                  <div
                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-cream/60 ${
                      n.read ? "" : "bg-gold/[0.06]"
                    }`}
                  >
                    <div className="mt-0.5 rounded-lg bg-navy/[0.07] p-1.5 text-navy">
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink/80">{n.text}</p>
                      <p className="mt-0.5 text-xs text-ink/45">{timeAgo(n.at)}</p>
                    </div>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red" />}
                  </div>
                );
                return n.href ? (
                  <Link key={n.id} href={n.href} onClick={() => setOpen(false)} className="block">
                    {inner}
                  </Link>
                ) : (
                  <div key={n.id}>{inner}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
