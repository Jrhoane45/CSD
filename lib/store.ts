"use client";

import { useSyncExternalStore } from "react";
import type {
  AppNotification,
  EventBoost,
  ListingOverride,
  PlatformEvent,
  ReviewReply,
  Role,
  Thread,
  ThreadKind,
  UserReview,
} from "./types";
import { SEED_THREADS, SEED_EVENTS, SEED_NOTIFICATIONS } from "./data/activity";

/*
  A tiny reactive store (Zustand-lite) backing the demo's "live" platform
  activity — messages, bookings, events, reviews, and notifications.
  Persists to localStorage and broadcasts changes so every screen stays in
  sync. Still 100% client-side: no backend, but it behaves like one.
*/

const KEY = "csd-activity-v1";

export interface StoreState {
  threads: Thread[];
  events: PlatformEvent[];
  reviews: UserReview[];
  notifications: AppNotification[];
  /** Provider responses to reviews, keyed by `${listingId}::${reviewKey}`. */
  replies: Record<string, ReviewReply>;
  /** Provider-edited listing fields, keyed by listingId. */
  overrides: Record<string, ListingOverride>;
}

function seedState(): StoreState {
  return {
    threads: SEED_THREADS.map((t) => ({ ...t })),
    events: SEED_EVENTS.map((e) => ({ ...e })),
    reviews: [],
    notifications: SEED_NOTIFICATIONS.map((n) => ({ ...n })),
    replies: {},
    overrides: {},
  };
}

let state: StoreState = seedState();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / privacy errors */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<StoreState>;
      state = {
        threads: saved.threads ?? state.threads,
        events: saved.events ?? state.events,
        reviews: saved.reviews ?? state.reviews,
        notifications: saved.notifications ?? state.notifications,
        replies: saved.replies ?? state.replies,
        overrides: saved.overrides ?? state.overrides,
      };
      emit();
    }
  } catch {
    /* ignore corrupt data */
  }
}

function set(next: Partial<StoreState>) {
  state = { ...state, ...next };
  persist();
  emit();
}

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

function notify(n: Omit<AppNotification, "id" | "at" | "read">) {
  state = {
    ...state,
    notifications: [
      { ...n, id: uid(), at: now(), read: false },
      ...state.notifications,
    ],
  };
}

// --- Actions ---------------------------------------------------------------

const PROVIDER_REPLIES = [
  "Thanks for reaching out! We'd love to have your athlete come check us out. What days work best for a visit?",
  "Great to hear from you. We have an opening in our next evaluation block — happy to share details.",
  "Appreciate the interest! Our staff will tailor a plan to your athlete's goals. Want to set up a quick call?",
];

export interface StartThreadInput {
  listingId: string;
  listingName: string;
  listingLogo?: string;
  kind: ThreadKind;
  parentName: string;
  athlete: string;
  fit?: number;
  message: string;
  bookingDate?: string;
  bookingTime?: string;
}

export function startThread(input: StartThreadInput): string {
  const id = uid();
  const ts = now();
  const thread: Thread = {
    id,
    listingId: input.listingId,
    listingName: input.listingName,
    listingLogo: input.listingLogo,
    kind: input.kind,
    parentName: input.parentName,
    athlete: input.athlete,
    fit: input.fit,
    bookingDate: input.bookingDate,
    bookingTime: input.bookingTime,
    status: input.kind === "booking" ? "scheduled" : "new",
    messages: [{ id: uid(), from: "parent", body: input.message, at: ts }],
    unreadFor: "provider",
    createdAt: ts,
    updatedAt: ts,
  };
  state = { ...state, threads: [thread, ...state.threads] };
  notify({
    role: "provider",
    icon: input.kind === "booking" ? "calendar" : "message",
    text:
      input.kind === "booking"
        ? `${input.parentName} requested a visit — ${input.athlete}`
        : `New inquiry from ${input.parentName} — ${input.athlete}`,
    href: "/app/inbox",
  });
  persist();
  emit();
  scheduleAutoReply(id, input.parentName, input.listingName);
  return id;
}

/** Simulate the provider replying a moment later so the inbox feels alive. */
function scheduleAutoReply(threadId: string, parentName: string, listingName: string) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    const t = state.threads.find((x) => x.id === threadId);
    if (!t) return;
    const reply = PROVIDER_REPLIES[Math.floor(Math.random() * PROVIDER_REPLIES.length)];
    appendMessage(threadId, "provider", reply, {
      icon: "message",
      role: "parent",
      text: `${listingName} replied to ${parentName.split(" ")[0]}`,
      href: "/app/inbox",
    });
  }, 2600);
}

export function appendMessage(
  threadId: string,
  from: Role,
  body: string,
  notification?: Omit<AppNotification, "id" | "at" | "read">,
) {
  const ts = now();
  const threads = state.threads.map((t) =>
    t.id === threadId
      ? {
          ...t,
          messages: [...t.messages, { id: uid(), from, body, at: ts }],
          unreadFor: (from === "parent" ? "provider" : "parent") as Role,
          status: t.status === "new" ? ("active" as const) : t.status,
          updatedAt: ts,
        }
      : t,
  );
  state = { ...state, threads };
  if (notification) notify(notification);
  persist();
  emit();
}

export function markThreadRead(threadId: string, role: Role) {
  let changed = false;
  const threads = state.threads.map((t) => {
    if (t.id === threadId && t.unreadFor === role) {
      changed = true;
      return { ...t, unreadFor: null };
    }
    return t;
  });
  if (changed) set({ threads });
}

export function createEvent(
  e: Omit<PlatformEvent, "id" | "createdAt" | "rsvps" | "registered" | "reach" | "boost" | "createdBy"> &
    Partial<Pick<PlatformEvent, "boost" | "reach">>,
): string {
  const id = uid();
  const reach = e.reach ?? 280;
  const event: PlatformEvent = {
    ...e,
    id,
    boost: e.boost ?? "none",
    reach,
    rsvps: 0,
    registered: false,
    createdBy: "provider",
    createdAt: now(),
  };
  set({ events: [event, ...state.events] });
  return id;
}

const BOOST_REACH: Record<EventBoost, number> = {
  none: 280,
  basic: 1200,
  standard: 2600,
  premium: 5400,
};

export function boostEvent(eventId: string, boost: EventBoost) {
  const events = state.events.map((e) =>
    e.id === eventId ? { ...e, boost, reach: BOOST_REACH[boost] } : e,
  );
  set({ events });
}

export function toggleRsvp(eventId: string, athlete: string) {
  const ev = state.events.find((e) => e.id === eventId);
  if (!ev) return;
  const registering = !ev.registered;
  const events = state.events.map((e) =>
    e.id === eventId
      ? { ...e, registered: registering, rsvps: Math.max(0, e.rsvps + (registering ? 1 : -1)) }
      : e,
  );
  state = { ...state, events };
  if (registering) {
    notify({
      role: "provider",
      icon: "calendar",
      text: `${athlete} registered for "${ev.title}"`,
      href: "/app/provider",
    });
    notify({
      role: "parent",
      icon: "calendar",
      text: `You're registered for "${ev.title}" — ${formatEventDate(ev.date)}`,
      href: "/app/events",
    });
  }
  persist();
  emit();
}

export function addReview(review: Omit<UserReview, "id">) {
  const full: UserReview = { ...review, id: uid() };
  state = { ...state, reviews: [full, ...state.reviews] };
  notify({
    role: "provider",
    icon: "star",
    text: `New ${review.rating}★ review from ${review.author}`,
    href: "/app/provider",
  });
  persist();
  emit();
}

export const replyKey = (listingId: string, reviewKey: string) => `${listingId}::${reviewKey}`;

export function addReviewReply(
  listingId: string,
  listingName: string,
  reviewKey: string,
  body: string,
) {
  state = {
    ...state,
    replies: { ...state.replies, [replyKey(listingId, reviewKey)]: { body, at: now() } },
  };
  notify({
    role: "parent",
    icon: "star",
    text: `${listingName} responded to a review`,
    href: `/app/listing/${listingId}`,
  });
  persist();
  emit();
}

export function setOverride(listingId: string, patch: ListingOverride) {
  const next = { ...(state.overrides[listingId] ?? {}), ...patch };
  set({ overrides: { ...state.overrides, [listingId]: next } });
}

export function markAllNotificationsRead(role: Role) {
  const notifications = state.notifications.map((n) =>
    n.role === role ? { ...n, read: true } : n,
  );
  set({ notifications });
}

export function resetActivity() {
  state = seedState();
  persist();
  emit();
}

// --- Helpers ---------------------------------------------------------------

export function formatEventDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// --- React bindings --------------------------------------------------------

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => state;
const serverState = seedState();
const getServerSnapshot = () => serverState;

export function useStore(): StoreState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
