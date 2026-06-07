"use client";

import { useSyncExternalStore } from "react";
import type {
  AppNotification,
  EventBoost,
  ListingOverride,
  PlatformEvent,
  ProviderMedia,
  RecruitingState,
  ReviewReply,
  Role,
  SavedSearch,
  SchoolDivision,
  SchoolStatus,
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
  /** Parent's saved Discover searches. */
  savedSearches: SavedSearch[];
  /** Provider-uploaded media, keyed by listingId. */
  media: Record<string, ProviderMedia>;
  /** Recruiting Hub: checklist progress + target schools. */
  recruiting: RecruitingState;
}

function seedState(): StoreState {
  return {
    threads: SEED_THREADS.map((t) => ({ ...t })),
    events: SEED_EVENTS.map((e) => ({ ...e })),
    reviews: [],
    notifications: SEED_NOTIFICATIONS.map((n) => ({ ...n })),
    replies: {},
    overrides: {},
    savedSearches: [],
    media: {},
    recruiting: { tasks: {}, schools: [] },
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
        savedSearches: saved.savedSearches ?? state.savedSearches,
        media: saved.media ?? state.media,
        recruiting: saved.recruiting ?? state.recruiting,
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
  e: Omit<
    PlatformEvent,
    "id" | "createdAt" | "rsvps" | "registered" | "registrants" | "reach" | "boost" | "createdBy"
  > &
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
    registrants: [],
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
  const events = state.events.map((e) => {
    if (e.id !== eventId) return e;
    const registrants = registering
      ? [{ id: uid(), name: "You", athlete, at: now(), self: true }, ...e.registrants]
      : e.registrants.filter((r) => !r.self);
    return {
      ...e,
      registered: registering,
      rsvps: Math.max(0, e.rsvps + (registering ? 1 : -1)),
      registrants,
    };
  });
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

export function updateEvent(eventId: string, patch: Partial<PlatformEvent>) {
  set({ events: state.events.map((e) => (e.id === eventId ? { ...e, ...patch } : e)) });
}

export function removeEvent(eventId: string) {
  set({ events: state.events.filter((e) => e.id !== eventId) });
}

/** Provider-initiated message to a registrant — opens a thread in the inbox. */
export function messageRegistrant(input: {
  listingId: string;
  listingName: string;
  listingLogo?: string;
  parentName: string;
  athlete: string;
  body: string;
}): string {
  const id = uid();
  const ts = now();
  const thread: Thread = {
    id,
    listingId: input.listingId,
    listingName: input.listingName,
    listingLogo: input.listingLogo,
    kind: "inquiry",
    parentName: input.parentName,
    athlete: input.athlete,
    status: "active",
    messages: [{ id: uid(), from: "provider", body: input.body, at: ts }],
    unreadFor: "parent",
    createdAt: ts,
    updatedAt: ts,
  };
  state = { ...state, threads: [thread, ...state.threads] };
  notify({
    role: "parent",
    icon: "message",
    text: `${input.listingName} messaged you`,
    href: "/app/inbox",
  });
  persist();
  emit();
  return id;
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

/** Push a one-off notification (used by checkout, onboarding, alerts). */
export function addNotification(n: Omit<AppNotification, "id" | "at" | "read">) {
  notify(n);
  persist();
  emit();
}

export function addSavedSearch(s: Omit<SavedSearch, "id" | "createdAt">): string {
  const id = uid();
  const search: SavedSearch = { ...s, id, createdAt: now() };
  state = { ...state, savedSearches: [search, ...state.savedSearches] };
  notify({
    role: "parent",
    icon: "trophy",
    text: `Saved search "${s.name}" — we'll alert you to new matches`,
    href: "/app/discover",
  });
  persist();
  emit();
  // Simulate a fresh match landing a moment later.
  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      if (state.savedSearches.some((x) => x.id === id)) {
        addNotification({
          role: "parent",
          icon: "trophy",
          text: `New program matches your saved search "${s.name}"`,
          href: "/app/discover",
        });
      }
    }, 4000);
  }
  return id;
}

export function removeSavedSearch(id: string) {
  set({ savedSearches: state.savedSearches.filter((s) => s.id !== id) });
}

export function setProviderMedia(listingId: string, patch: Partial<ProviderMedia>) {
  const current = state.media[listingId] ?? { photos: [], videos: [] };
  set({ media: { ...state.media, [listingId]: { ...current, ...patch } } });
}

export function toggleRecruitingTask(taskId: string) {
  const tasks = { ...state.recruiting.tasks, [taskId]: !state.recruiting.tasks[taskId] };
  set({ recruiting: { ...state.recruiting, tasks } });
}

export function addTargetSchool(name: string, division: SchoolDivision) {
  const school = {
    id: uid(),
    name,
    division,
    status: "Researching" as SchoolStatus,
    createdAt: now(),
  };
  set({ recruiting: { ...state.recruiting, schools: [school, ...state.recruiting.schools] } });
}

export function setSchoolStatus(id: string, status: SchoolStatus) {
  set({
    recruiting: {
      ...state.recruiting,
      schools: state.recruiting.schools.map((s) => (s.id === id ? { ...s, status } : s)),
    },
  });
  if (status === "Offer")
    notify({
      role: "parent",
      icon: "trophy",
      text: "Congrats — a target school is now marked as an Offer!",
      href: "/app/recruiting",
    });
}

export function removeTargetSchool(id: string) {
  set({
    recruiting: {
      ...state.recruiting,
      schools: state.recruiting.schools.filter((s) => s.id !== id),
    },
  });
}

/** Wipe all demo state (activity, profile, saved, Prospect IQ, role) and reload. */
export function resetDemo() {
  if (typeof window === "undefined") return;
  for (const k of [
    KEY,
    "csd-athlete-profile",
    "csd-saved-listings",
    "csd-piq-result",
    "csd-role",
  ]) {
    localStorage.removeItem(k);
  }
  state = seedState();
  window.location.href = "/app";
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
