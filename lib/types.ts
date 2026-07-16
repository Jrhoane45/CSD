// Core domain types for the Club Sports Direct demo.

export type Category = "club" | "trainer" | "consultant";

export type Sport =
  | "Soccer"
  | "Baseball"
  | "Softball"
  | "Basketball"
  | "Football"
  | "Volleyball";

/** The four athletic development tiers — the heart of CSD's matching. */
export type DevLevel =
  | "Recreational"
  | "Intermediate"
  | "Competitive"
  | "Elite";

export type ClaimState = "unclaimed" | "claimed-free" | "claimed-paid";

export type County =
  | "Los Angeles"
  | "Orange"
  | "Riverside"
  | "Ventura"
  | "San Diego"
  | "San Bernardino";

export interface ReviewDimension {
  label: string;
  value: number; // 0-5
}

export interface Review {
  author: string;
  rating: number; // overall, 0-5
  date: string;
  title: string;
  body: string;
  /** Category-specific dimensions, e.g. "Depth of Playing Schedule". */
  dimensions: ReviewDimension[];
  /** Reviewer is a confirmed customer (booked / attended). */
  verified?: boolean;
  /** Optional reviewer-attached photos (data URLs). */
  photos?: string[];
}

export interface AlumniOutcomes {
  pro: number;
  d1: number;
  d2: number;
  d3: number;
}

export interface Listing {
  id: string;
  name: string;
  /** Optional business thumbnail logo (path in /public). Falls back to a monogram. */
  logo?: string;
  category: Category;
  sports: Sport[];
  levels: DevLevel[];
  city: string;
  county: County;
  /** Rough miles from the LA anchor (Santa Monica, 90405) for demo distance math. */
  milesFromAnchor: number;
  claimState: ClaimState;
  verified: boolean;
  yearsInOperation: number;
  certifications: string[];
  philosophy: string;
  /** 1-3 illustrative price band, lower is cheaper. */
  priceBand: 1 | 2 | 3;
  priceLabel: string;
  alumni: AlumniOutcomes;
  notableAthletes: string[];
  goals: string[]; // goal tags this provider is strong at, e.g. "College recruiting"
  specialties: string[]; // e.g. "Adaptive", "Goalkeeper specific"
  reviews: Review[];
  featured?: boolean;
}

export interface ProfileVideo {
  src: string;
  name: string;
  kind: "file" | "link";
}

// --- Live platform activity (demo store) ------------------------------------

export type Role = "parent" | "provider" | "operator";

/** Operator vetting state for a provider listing. */
export type VettingStatus = "verified" | "pending" | "suspended";

/** A content report in the operator moderation queue. */
export interface ModerationItem {
  id: string;
  type: "review" | "listing" | "event";
  listingId: string;
  listingName: string;
  reason: string;
  excerpt: string;
  reportedBy: string;
  reportedAt: string;
  /** Links the report to real content so "remove" is consequential. */
  reviewId?: string;
  eventId?: string;
}

export type ThreadKind = "inquiry" | "booking";

export interface ThreadMessage {
  id: string;
  from: Role;
  body: string;
  at: string; // ISO timestamp
}

export interface Thread {
  id: string;
  listingId: string;
  listingName: string;
  listingLogo?: string;
  kind: ThreadKind;
  parentName: string;
  athlete: string; // e.g. "Diego, 14 · Competitive"
  fit?: number;
  /** booking specifics */
  bookingDate?: string;
  bookingTime?: string;
  status: "new" | "active" | "scheduled" | "archived";
  messages: ThreadMessage[];
  /** which role has an unread message waiting */
  unreadFor: Role | null;
  createdAt: string;
  updatedAt: string;
  seeded?: boolean;
}

export type EventType = "Tournament" | "Showcase" | "Camp" | "Clinic" | "Tryout" | "Open House";
export type EventBoost = "none" | "basic" | "standard" | "premium";

// --- Promotions / advertising ----------------------------------------------

/** Where a paid campaign's ad is served across the platform. */
export type AdPlacement =
  | "events-featured"
  | "discover-spotlight"
  | "in-app-banner"
  | "in-app-popup";

export type CampaignObjective = "Fill an event" | "Grow awareness" | "Drive profile visits";
export type AudienceReach = "Local" | "Regional" | "Statewide";
export type PaymentMethod = "Card" | "PayPal" | "Apple Pay" | "Bank (ACH)";

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  rsvps: number;
  spend: number;
}

export interface Campaign {
  id: string;
  listingId: string;
  listingName: string;
  listingLogo?: string;
  eventId?: string;
  eventTitle?: string;
  objective: CampaignObjective;
  placements: AdPlacement[];
  audience: AudienceReach;
  durationDays: number;
  budget: number;
  payment: PaymentMethod;
  status: "scheduled" | "active" | "ended";
  startDate: string; // ISO date (YYYY-MM-DD)
  endDate: string; // ISO date (YYYY-MM-DD)
  headline: string;
  cta: string;
  createdAt: string;
  metrics: CampaignMetrics;
}

/** A named registrant on an event's roster. */
export interface EventRegistrant {
  id: string;
  name: string;
  athlete?: string;
  at: string;
  self?: boolean;
}

export interface PlatformEvent {
  id: string;
  listingId?: string;
  listingName: string;
  title: string;
  type: EventType;
  sport: Sport;
  date: string; // ISO date (YYYY-MM-DD)
  time: string;
  city: string;
  county: County;
  description: string;
  priceLabel: string;
  boost: EventBoost;
  reach: number;
  rsvps: number;
  registered: boolean;
  registrants: EventRegistrant[];
  createdBy: "seed" | "provider";
  createdAt: string;
}

export interface UserReview extends Review {
  id: string;
  listingId: string;
}

export interface AppNotification {
  id: string;
  role: Role;
  icon: "message" | "calendar" | "star" | "trophy" | "user";
  text: string;
  href?: string;
  at: string;
  read: boolean;
}

/** A provider's public response to a review. */
export interface ReviewReply {
  body: string;
  at: string;
}

/** Provider-editable overrides applied on top of seed listing data. */
export interface ListingOverride {
  name?: string;
  philosophy?: string;
  priceLabel?: string;
}

/** Provider-uploaded media that persists across reloads, keyed by listingId. */
export interface ProviderMedia {
  logo?: string;
  photos: string[];
  videos: ProfileVideo[];
}

/** A parent's saved Discover search, with the filter set to re-apply. */
export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  category: string;
  sport: string;
  level: string;
  county: string;
  minScore: number;
  sort: string;
  createdAt: string;
}

export type SchoolDivision = "D1" | "D2" | "D3" | "NAIA" | "JUCO";
export type SchoolStatus = "Researching" | "Contacted" | "Visited" | "Offer";

/** A school on the athlete's recruiting target list. */
export interface TargetSchool {
  id: string;
  name: string;
  division: SchoolDivision;
  status: SchoolStatus;
  createdAt: string;
}

/** Recruiting Hub state — checklist progress + target schools. */
export interface RecruitingState {
  tasks: Record<string, boolean>;
  schools: TargetSchool[];
}

// --- Session booking & scheduling ------------------------------------------

export type BookingStatus = "upcoming" | "completed" | "canceled";

/** A booked training session / visit against a provider's published availability. */
export interface SessionBooking {
  id: string;
  listingId: string;
  listingName: string;
  listingLogo?: string;
  /** Deterministic slot id `${listingId}:${date}:${time}` — lets a booked slot disappear. */
  slotId: string;
  sessionTypeId: string;
  sessionTypeName: string;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // e.g. "4:30 PM"
  durationMin: number;
  price: number; // dollars, 0 = free
  athlete: string;
  parentName: string;
  fit?: number;
  status: BookingStatus;
  /** Links to the inbox thread opened alongside the booking. */
  threadId?: string;
  createdAt: string;
}

// --- Provider roster & team management --------------------------------------

export interface Team {
  id: string;
  name: string;
  level: DevLevel;
  sport: Sport;
}

export type RosterStatus = "prospect" | "active";

/** An athlete on a provider's roster (assigned to a team, or an unassigned prospect). */
export interface RosterMember {
  id: string;
  name: string; // athlete label, e.g. "Diego, 14 · Competitive"
  parent: string;
  teamId: string | null; // null = prospect pool
  status: RosterStatus;
  addedAt: string;
}

// --- Provider billing & subscription ---------------------------------------

export type PlanTier = "free" | "pro" | "elite";

export interface PaymentCard {
  brand: string; // e.g. "Visa"
  last4: string;
  exp: string; // "12 / 28"
}

export interface Invoice {
  id: string;
  date: string; // ISO date
  description: string;
  amount: number; // dollars
  status: "paid" | "due";
}

export interface ProviderSubscription {
  plan: PlanTier;
  status: "active" | "canceled";
  /** ISO date the plan next renews. */
  renewsOn: string;
  card?: PaymentCard;
  /** Included monthly event boosts and how many have been used. */
  boostsIncluded: number;
  boostsUsed: number;
  since: string; // ISO date the provider first subscribed
}

export interface AthleteProfile {
  // --- Account / identity (optional; set during onboarding) ---
  parentName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string; // data URL
  gender?: "" | "Male" | "Female" | "Other";
  school?: string;
  gradYear?: string;
  // --- Physical stats ---
  heightIn?: number | null; // total inches
  weightLb?: number | null;
  // --- Media gallery ---
  photos?: string[]; // up to 6 (data URLs)
  videos?: ProfileVideo[]; // up to 2
  // --- Matching criteria ---
  sport: Sport | "";
  age: number | null;
  level: DevLevel | "";
  zip?: string;
  county: County | "";
  maxMiles: number;
  priceMax?: 0 | 1 | 2 | 3; // 0 = any budget
  category: Category | "any";
  goals: string[];
  createdAt?: string;
}
