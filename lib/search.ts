import type { PlatformEvent } from "./types";
import { LISTINGS, CATEGORY_LABEL } from "./data/listings";
import { isPubliclyVisible } from "./store";
import { formatEventDate } from "./store";

/*
  Global in-app search — a lightweight, dependency-free index over the things a
  user actually navigates to: programs (listings), events, and app destinations.
  Ranks by match quality (title prefix > title word > any field) so the best
  results float up. 100% client-side.
*/

export type SearchKind = "program" | "event" | "page";

export type SearchIcon =
  | "club"
  | "trainer"
  | "consultant"
  | "event"
  | "discover"
  | "match"
  | "piq"
  | "rankings"
  | "sessions"
  | "inbox"
  | "saved"
  | "recruiting"
  | "orders"
  | "settings"
  | "help"
  | "provider"
  | "billing"
  | "roster"
  | "promote"
  | "analytics"
  | "operator";

export interface SearchResult {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: SearchIcon;
}

export interface PageEntry {
  title: string;
  subtitle: string;
  href: string;
  icon: SearchIcon;
  keywords: string;
}

/** App destinations users can jump to. */
export const PAGES: PageEntry[] = [
  { title: "Discover", subtitle: "Browse the vetted directory", href: "/app/discover", icon: "discover", keywords: "programs directory search filter compare map" },
  { title: "Find a match", subtitle: "Ranked, fit-scored programs", href: "/app/match", icon: "match", keywords: "matching wizard fit athlete profile" },
  { title: "Prospect IQ", subtitle: "AI scout evaluation", href: "/app/prospect-iq", icon: "piq", keywords: "combine evaluation talent score pillars scouting report" },
  { title: "Rankings", subtitle: "Regional leaderboard", href: "/app/rankings", icon: "rankings", keywords: "leaderboard percentile tier standings" },
  { title: "Events", subtitle: "Tryouts, camps & showcases", href: "/app/events", icon: "event", keywords: "tryout camp clinic showcase rsvp register" },
  { title: "My sessions", subtitle: "Booked training sessions", href: "/app/sessions", icon: "sessions", keywords: "booking schedule reschedule cancel appointments" },
  { title: "Inbox", subtitle: "Messages & leads", href: "/app/inbox", icon: "inbox", keywords: "messages chat conversations leads" },
  { title: "Saved", subtitle: "Your shortlisted programs", href: "/app/saved", icon: "saved", keywords: "bookmarks shortlist favorites" },
  { title: "Recruiting Hub", subtitle: "College pathway roadmap", href: "/app/recruiting", icon: "recruiting", keywords: "college target schools advisers scholarship offer" },
  { title: "Orders & receipts", subtitle: "Sessions & registrations", href: "/app/orders", icon: "orders", keywords: "purchases receipts payments billing history" },
  { title: "Settings", subtitle: "Account & notifications", href: "/app/settings", icon: "settings", keywords: "account preferences privacy notifications reset" },
  { title: "Help & support", subtitle: "FAQ and contact", href: "/app/help", icon: "help", keywords: "support faq questions contact" },
  { title: "Provider dashboard", subtitle: "Manage your listing", href: "/app/provider", icon: "provider", keywords: "claim listing leads events provider business" },
  { title: "Billing & subscription", subtitle: "Plan, usage & invoices", href: "/app/provider/billing", icon: "billing", keywords: "plan subscription pro elite invoices payment upgrade" },
  { title: "Roster & teams", subtitle: "Manage teams & players", href: "/app/provider/roster", icon: "roster", keywords: "teams players prospects roster elite" },
  { title: "Promote", subtitle: "Paid event campaigns", href: "/app/promote", icon: "promote", keywords: "advertising ads campaign boost promotion" },
  { title: "Analytics", subtitle: "Views, funnel & fit", href: "/app/provider/analytics", icon: "analytics", keywords: "metrics views leads conversion charts" },
  { title: "Operator console", subtitle: "Trust & safety", href: "/app/operator", icon: "operator", keywords: "operator admin vetting moderation revenue platform" },
  { title: "Vetting", subtitle: "Verify / suspend providers", href: "/app/operator/providers", icon: "operator", keywords: "operator vetting verify suspend reinstate" },
  { title: "Moderation", subtitle: "Resolve content reports", href: "/app/operator/moderation", icon: "operator", keywords: "operator moderation reports flag reviews" },
  { title: "Ad revenue", subtitle: "Advertising dashboard", href: "/app/operator/promotions", icon: "operator", keywords: "operator revenue advertising campaigns spend" },
];

const CATEGORY_ICON: Record<string, SearchIcon> = {
  club: "club",
  trainer: "trainer",
  consultant: "consultant",
};

/** Score a haystack against a query. 0 = no match. Higher = better. */
function score(title: string, haystack: string, tokens: string[]): number {
  const t = title.toLowerCase();
  const h = haystack.toLowerCase();
  // Every token must appear somewhere.
  for (const tok of tokens) {
    if (!h.includes(tok)) return 0;
  }
  const first = tokens[0];
  if (t.startsWith(first)) return 100;
  if (new RegExp(`\\b${escapeRe(first)}`).test(t)) return 70;
  if (t.includes(first)) return 50;
  return 20; // matched only via secondary fields
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface SearchOptions {
  vetting: Parameters<typeof isPubliclyVisible>[1];
}

export function searchAll(
  query: string,
  events: PlatformEvent[],
  opts: SearchOptions,
): { programs: SearchResult[]; events: SearchResult[]; pages: SearchResult[] } {
  const q = query.trim().toLowerCase();
  if (!q) return { programs: [], events: [], pages: [] };
  const tokens = q.split(/\s+/).filter(Boolean);

  // Programs
  const programs = LISTINGS.filter((l) => isPubliclyVisible(l, opts.vetting))
    .map((l) => {
      const hay = [
        l.name,
        CATEGORY_LABEL[l.category],
        l.sports.join(" "),
        l.city,
        `${l.county} county`,
        l.specialties.join(" "),
        l.goals.join(" "),
      ].join(" ");
      return { l, s: score(l.name, hay, tokens) };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 6)
    .map<SearchResult>(({ l }) => ({
      kind: "program",
      id: l.id,
      title: l.name,
      subtitle: `${CATEGORY_LABEL[l.category]} · ${l.sports.join(", ")} · ${l.city}`,
      href: `/app/listing/${l.id}`,
      icon: CATEGORY_ICON[l.category],
    }));

  // Events
  const eventResults = events
    .map((e) => {
      const hay = [e.title, e.sport, e.type, e.city, `${e.county} county`, e.listingName].join(" ");
      return { e, s: score(e.title, hay, tokens) };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 5)
    .map<SearchResult>(({ e }) => ({
      kind: "event",
      id: e.id,
      title: e.title,
      subtitle: `${e.type} · ${e.sport} · ${formatEventDate(e.date)} · ${e.city}`,
      href: "/app/events",
      icon: "event",
    }));

  // Pages
  const pages = PAGES.map((p) => {
    const hay = `${p.title} ${p.subtitle} ${p.keywords}`;
    return { p, s: score(p.title, hay, tokens) };
  })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 5)
    .map<SearchResult>(({ p }) => ({
      kind: "page",
      id: p.href,
      title: p.title,
      subtitle: p.subtitle,
      href: p.href,
      icon: p.icon,
    }));

  return { programs, events: eventResults, pages };
}
