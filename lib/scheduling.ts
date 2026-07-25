import type { Category, Listing, ProviderAvailability } from "./types";

/*
  Session booking — the "transaction loop" layer.
  Providers publish a small menu of session types and open availability; families
  book a real slot. Slots are generated deterministically per-listing so the demo
  is stable across reloads, and a booked slot disappears from availability.
  100% client-side, no backend — but it behaves like a real scheduler.
*/

export interface SessionType {
  id: string;
  name: string;
  durationMin: number;
  price: number; // dollars, 0 = free
  desc: string;
}

const MENU: Record<Category, SessionType[]> = {
  trainer: [
    { id: "1on1", name: "1-on-1 Skills Session", durationMin: 60, price: 90, desc: "Private, fully individualized training focused on your athlete's goals." },
    { id: "group", name: "Small-Group Training", durationMin: 75, price: 45, desc: "2–4 athletes, position-specific reps and live competition." },
    { id: "assessment", name: "Skills Assessment", durationMin: 45, price: 60, desc: "Baseline evaluation with a written development plan to take home." },
  ],
  club: [
    { id: "tryout", name: "Tryout / Evaluation", durationMin: 90, price: 0, desc: "Get evaluated for placement on a level-appropriate team." },
    { id: "practice", name: "Practice Visit", durationMin: 60, price: 0, desc: "Sit in on a live team practice and meet the coaching staff." },
    { id: "clinic", name: "Skills Clinic", durationMin: 90, price: 35, desc: "Open clinic — position work and small-sided games, all levels." },
  ],
  consultant: [
    { id: "strategy", name: "Recruiting Strategy Call", durationMin: 45, price: 120, desc: "Map your recruiting timeline, target list, and next steps." },
    { id: "film", name: "Film & Profile Review", durationMin: 60, price: 150, desc: "Highlight-reel breakdown and a full recruiting-profile audit." },
    { id: "intro", name: "Intro Consultation", durationMin: 30, price: 0, desc: "A free 30-minute fit call before you commit to anything." },
  ],
};

export function sessionMenu(listing: Pick<Listing, "category">): SessionType[] {
  return MENU[listing.category];
}

export function sessionTypeById(listing: Pick<Listing, "category">, id: string): SessionType | undefined {
  return MENU[listing.category].find((s) => s.id === id);
}

const WEEKDAY_TIMES = ["3:30 PM", "4:30 PM", "5:30 PM", "6:30 PM", "7:30 PM"];
const WEEKEND_TIMES = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM"];

/** The full set of bookable start times, in chronological order (for the editor). */
export const ALL_TIMES = [
  "9:00 AM",
  "10:30 AM",
  "12:00 PM",
  "1:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:30 PM",
  "5:30 PM",
  "6:30 PM",
  "7:30 PM",
];

/** Weekdays in a display-friendly order (Mon-first), with getDay() indices. */
export const WEEKDAYS = [
  { idx: 1, label: "Monday", short: "Mon" },
  { idx: 2, label: "Tuesday", short: "Tue" },
  { idx: 3, label: "Wednesday", short: "Wed" },
  { idx: 4, label: "Thursday", short: "Thu" },
  { idx: 5, label: "Friday", short: "Fri" },
  { idx: 6, label: "Saturday", short: "Sat" },
  { idx: 0, label: "Sunday", short: "Sun" },
];

/** Sort a list of times into chronological order. */
export function sortTimes(times: string[]): string[] {
  return [...times].sort((a, b) => ALL_TIMES.indexOf(a) - ALL_TIMES.indexOf(b));
}

export interface OpenSlot {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  time: string;
  /** e.g. "Tue, Jul 21" */
  label: string;
  weekday: string; // "Tue"
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Local YYYY-MM-DD (avoids UTC day-shift from toISOString). */
export function localISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Deterministically generate a listing's open availability for the next `days`,
 * excluding any slot ids already taken by a booking.
 */
export function openSlotsFor(listingId: string, takenIds: Set<string>, days = 21): OpenSlot[] {
  const out: OpenSlot[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let d = 1; d <= days; d++) {
    const date = new Date(today.getTime() + d * 86400000);
    const dow = date.getDay(); // 0 Sun … 6 Sat
    const iso = localISODate(date);
    const weekend = dow === 0 || dow === 6;
    // Providers keep some days off — deterministic per listing+date.
    if (hashStr(listingId + iso) % 100 < 22) continue;
    const times = weekend ? WEEKEND_TIMES : WEEKDAY_TIMES;
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    for (const t of times) {
      // ~45% of the day's times are open.
      if (hashStr(listingId + iso + t) % 100 >= 45) continue;
      const id = `${listingId}:${iso}:${t}`;
      if (takenIds.has(id)) continue;
      out.push({ id, date: iso, time: t, label, weekday });
    }
  }
  return out;
}

/**
 * Generate open slots from a provider's explicit availability template
 * (weekly open times minus blocked dates and already-booked slots).
 */
export function slotsFromAvailability(
  listingId: string,
  avail: ProviderAvailability,
  takenIds: Set<string>,
  days = 21,
): OpenSlot[] {
  const out: OpenSlot[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const blocked = new Set(avail.blockedDates);
  for (let d = 1; d <= days; d++) {
    const date = new Date(today.getTime() + d * 86400000);
    const iso = localISODate(date);
    if (blocked.has(iso)) continue;
    const times = avail.weekly[date.getDay()] ?? [];
    if (times.length === 0) continue;
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    for (const t of sortTimes(times)) {
      const id = `${listingId}:${iso}:${t}`;
      if (takenIds.has(id)) continue;
      out.push({ id, date: iso, time: t, label, weekday });
    }
  }
  return out;
}

/**
 * The open slots families actually see: a provider's explicit availability if
 * they've set one, otherwise the deterministic auto-generated fallback.
 */
export function effectiveOpenSlots(
  listingId: string,
  availabilityMap: Record<string, ProviderAvailability>,
  takenIds: Set<string>,
  days = 21,
): OpenSlot[] {
  const avail = availabilityMap[listingId];
  if (avail) return slotsFromAvailability(listingId, avail, takenIds, days);
  return openSlotsFor(listingId, takenIds, days);
}

/** Group open slots by date for a calendar-style picker. */
export function groupSlotsByDate(slots: OpenSlot[]): { date: string; label: string; times: OpenSlot[] }[] {
  const map = new Map<string, { date: string; label: string; times: OpenSlot[] }>();
  for (const s of slots) {
    if (!map.has(s.date)) map.set(s.date, { date: s.date, label: s.label, times: [] });
    map.get(s.date)!.times.push(s);
  }
  return [...map.values()];
}

export function slotId(listingId: string, date: string, time: string): string {
  return `${listingId}:${date}:${time}`;
}

const STATUS_TONE: Record<string, string> = {
  upcoming: "text-navy bg-navy/[0.08]",
  completed: "text-green-700 bg-green-600/10",
  canceled: "text-ink/50 bg-ink/[0.06]",
};

export function bookingStatusTone(status: string): string {
  return STATUS_TONE[status] ?? STATUS_TONE.upcoming;
}

export function formatMoney(n: number): string {
  return n === 0 ? "Free" : `$${n.toLocaleString()}`;
}
