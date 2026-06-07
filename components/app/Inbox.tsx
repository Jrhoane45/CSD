"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Inbox as InboxIcon,
  Send,
  ArrowLeft,
  CalendarClock,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import type { Role, Thread } from "@/lib/types";
import { useStore, appendMessage, markThreadRead, formatEventDate } from "@/lib/store";
import { useRole } from "@/lib/useRole";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

export function Inbox() {
  const { threads } = useStore();
  const role = useRole();
  const [selected, setSelected] = useState<string | null>(null);

  const visible = useMemo<Thread[]>(
    () =>
      threads
        .filter((t) => role === "provider" || !t.seeded)
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [threads, role],
  );

  // Initialize selection from a deep link (/app/inbox?thread=<id>) or, on a
  // wide screen, the first conversation.
  useEffect(() => {
    if (selected) return;
    const id = new URLSearchParams(window.location.search).get("thread");
    if (id && threads.some((t) => t.id === id)) {
      setSelected(id);
    } else if (visible.length && window.innerWidth >= 1024) {
      setSelected(visible[0].id);
    }
  }, [selected, threads, visible]);

  const active = visible.find((t) => t.id === selected) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl text-navy sm:text-4xl">
            {role === "provider" ? "LEADS & MESSAGES" : "YOUR MESSAGES"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {role === "provider"
              ? "Inbound families, ranked by fit. Reply to convert higher-fit leads."
              : "Conversations with programs you've contacted."}
          </p>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState role={role} />
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-[330px_1fr]">
          {/* thread list */}
          <div className={`space-y-2 ${active ? "hidden lg:block" : "block"}`}>
            {visible.map((t) => (
              <ThreadRow
                key={t.id}
                thread={t}
                role={role}
                active={t.id === selected}
                onClick={() => setSelected(t.id)}
              />
            ))}
          </div>

          {/* conversation */}
          <div className={`${active ? "block" : "hidden lg:block"}`}>
            {active ? (
              <Conversation
                key={active.id}
                thread={active}
                role={role}
                onBack={() => setSelected(null)}
              />
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-ink/15 text-sm text-ink/45">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ThreadRow({
  thread,
  role,
  active,
  onClick,
}: {
  thread: Thread;
  role: Role;
  active: boolean;
  onClick: () => void;
}) {
  const last = thread.messages[thread.messages.length - 1];
  const unread = thread.unreadFor === role;
  const title = role === "provider" ? thread.parentName : thread.listingName;
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
        active ? "border-navy bg-navy/[0.04]" : "border-ink/10 bg-white hover:border-navy/30"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 truncate font-semibold text-navy">
          {thread.kind === "booking" ? (
            <CalendarClock size={14} className="shrink-0 text-gold" />
          ) : (
            <MessageSquare size={14} className="shrink-0 text-ink/40" />
          )}
          {title}
        </span>
        <span className="shrink-0 text-xs text-ink/40">{timeAgo(thread.updatedAt)}</span>
      </div>
      <p className="mt-0.5 truncate text-xs text-ink/55">
        {role === "provider" ? thread.athlete : thread.athlete}
        {thread.fit !== undefined && role === "provider" && (
          <span className="ml-1.5 rounded-full bg-gold/20 px-1.5 py-0.5 font-bold text-ink">
            {thread.fit}%
          </span>
        )}
      </p>
      <p className={`mt-1.5 truncate text-sm ${unread ? "font-semibold text-navy" : "text-ink/55"}`}>
        {last.from === role ? "You: " : ""}
        {last.body}
      </p>
      {unread && <span className="mt-1 inline-block h-2 w-2 rounded-full bg-red" />}
    </button>
  );
}

function Conversation({
  thread,
  role,
  onBack,
}: {
  thread: Thread;
  role: Role;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markThreadRead(thread.id, role);
  }, [thread.id, role, thread.messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages.length]);

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    appendMessage(
      thread.id,
      role,
      body,
      role === "provider"
        ? { role: "parent", icon: "message", text: `${thread.listingName} replied`, href: "/app/inbox" }
        : { role: "provider", icon: "message", text: `${thread.parentName} replied`, href: "/app/inbox" },
    );
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-ink/10 bg-white">
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 p-4">
        <div className="flex min-w-0 items-center gap-2">
          <button onClick={onBack} className="rounded-lg p-1 text-ink/45 hover:bg-cream lg:hidden">
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <p className="truncate font-bold text-navy">
              {role === "provider" ? thread.parentName : thread.listingName}
            </p>
            <p className="truncate text-xs text-ink/55">{thread.athlete}</p>
          </div>
        </div>
        <Link
          href={`/app/listing/${thread.listingId}`}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-red hover:underline"
        >
          View profile <ExternalLink size={12} />
        </Link>
      </div>

      {thread.kind === "booking" && thread.bookingDate && (
        <div className="flex items-center gap-2 border-b border-gold/30 bg-gold/[0.08] px-4 py-2.5 text-sm">
          <CalendarClock size={15} className="text-gold" />
          <span className="text-ink/75">
            Visit requested · <span className="font-semibold text-navy">{formatEventDate(thread.bookingDate)}</span>
            {thread.bookingTime && ` at ${thread.bookingTime}`}
          </span>
        </div>
      )}

      {/* messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {thread.messages.map((m) => {
          const mine = m.from === role;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${
                  mine ? "bg-navy text-white" : "bg-cream text-ink/85"
                }`}
              >
                <p>{m.body}</p>
                <p className={`mt-1 text-[0.65rem] ${mine ? "text-cream/60" : "text-ink/40"}`}>
                  {timeAgo(m.at)} ago
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* composer */}
      <div className="flex items-end gap-2 border-t border-ink/10 p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder={role === "provider" ? "Reply to this family…" : "Write a message…"}
          className="max-h-32 flex-1 resize-none rounded-xl border border-ink/15 px-3.5 py-2.5 text-sm outline-none focus:border-navy"
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ role }: { role: Role }) {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-ink/20 p-12 text-center">
      <InboxIcon size={36} className="mx-auto text-ink/30" />
      <p className="mt-4 font-semibold text-navy">No messages yet</p>
      <p className="mt-1 text-sm text-ink/55">
        {role === "provider"
          ? "When families contact your program, their inquiries land here."
          : "Contact a program from its profile to start a conversation."}
      </p>
      <Link
        href={role === "provider" ? "/app/provider" : "/app/discover"}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
      >
        {role === "provider" ? "Go to dashboard" : "Browse the directory"}
      </Link>
    </div>
  );
}
