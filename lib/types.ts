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
