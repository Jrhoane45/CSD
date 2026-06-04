import type { AthleteProfile, County, DevLevel, Listing } from "./types";

export interface ScorePart {
  label: string;
  points: number;
  max: number;
}

export interface CsdScoreResult {
  score: number;
  parts: ScorePart[];
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const round = (n: number) => Math.round(n);

export function averageRating(listing: Listing): number {
  if (listing.reviews.length === 0) return 0;
  return (
    listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length
  );
}

/**
 * CSD Score™ — a transparent, deterministic credibility score (0-100).
 * Mirrors the documented inputs: certifications, experience, alumni outcomes,
 * notable athletes, and aggregated review quality. NOT a popularity contest.
 */
export function computeCsdScore(listing: Listing): CsdScoreResult {
  const credentials = Math.min(18, listing.certifications.length * 6);
  const experience = Math.min(16, round((listing.yearsInOperation / 15) * 16));

  const alumniWeighted =
    listing.alumni.pro * 10 +
    listing.alumni.d1 * 4 +
    listing.alumni.d2 * 2 +
    listing.alumni.d3 * 1;
  const alumni = Math.min(28, round(alumniWeighted * 0.9));

  const notable = Math.min(12, listing.notableAthletes.length * 4);

  const avg = averageRating(listing);
  const reviewQuality = round((avg / 5) * 18);
  const reviewVolume = Math.min(8, round(listing.reviews.length * 1.2));

  const parts: ScorePart[] = [
    { label: "Coaching credentials", points: credentials, max: 18 },
    { label: "Experience & tenure", points: experience, max: 16 },
    { label: "Alumni outcomes", points: alumni, max: 28 },
    { label: "Notable athletes developed", points: notable, max: 12 },
    { label: "Review quality", points: reviewQuality, max: 18 },
    { label: "Verified engagement", points: reviewVolume, max: 8 },
  ];

  const score = clamp(parts.reduce((s, p) => s + p.points, 0));
  return { score, parts };
}

/** Bucket for displaying a score as a tier label. */
export function scoreTier(score: number): { label: string; tone: string } {
  if (score >= 85) return { label: "Elite credibility", tone: "gold" };
  if (score >= 70) return { label: "Strong", tone: "navy" };
  if (score >= 55) return { label: "Established", tone: "navy" };
  return { label: "Emerging", tone: "muted" };
}

// --- Matching engine (demo logic) -------------------------------------------

const COUNTY_MILES: Record<County, number> = {
  "Los Angeles": 10,
  Orange: 35,
  Ventura: 45,
  Riverside: 60,
  "San Bernardino": 65,
  "San Diego": 110,
};

const LEVEL_ORDER: DevLevel[] = [
  "Recreational",
  "Intermediate",
  "Competitive",
  "Elite",
];

export interface MatchFactor {
  label: string;
  points: number;
  max: number;
  detail: string;
  strong: boolean;
}

export interface MatchResult {
  listing: Listing;
  fit: number;
  factors: MatchFactor[];
  headline: string;
}

function levelFactor(profile: AthleteProfile, listing: Listing): MatchFactor {
  const max = 38;
  if (!profile.level) {
    return { label: "Development level", points: 22, max, detail: "Open to all levels", strong: false };
  }
  if (listing.levels.includes(profile.level)) {
    return {
      label: "Development level",
      points: max,
      detail: `Specializes in ${profile.level} athletes`,
      max,
      strong: true,
    };
  }
  const target = LEVEL_ORDER.indexOf(profile.level);
  const nearest = Math.min(
    ...listing.levels.map((l) => Math.abs(LEVEL_ORDER.indexOf(l) - target)),
  );
  if (nearest === 1) {
    return {
      label: "Development level",
      points: 17,
      detail: `Serves an adjacent tier to ${profile.level}`,
      max,
      strong: false,
    };
  }
  return {
    label: "Development level",
    points: 4,
    detail: `Level mismatch — a churn risk CSD flags`,
    max,
    strong: false,
  };
}

function distanceFactor(profile: AthleteProfile, listing: Listing): MatchFactor {
  const max = 18;
  if (!profile.county) {
    return { label: "Distance", points: 10, max, detail: "Location flexible", strong: false };
  }
  if (profile.county === listing.county) {
    return {
      label: "Distance",
      points: 18,
      detail: `In ${listing.county} County`,
      max,
      strong: true,
    };
  }
  const athlete = COUNTY_MILES[profile.county];
  const distance = Math.abs(listing.milesFromAnchor - athlete);
  const maxMiles = profile.maxMiles || 50;
  if (distance <= maxMiles) {
    const points = round(18 * (1 - (0.6 * distance) / maxMiles));
    return {
      label: "Distance",
      points,
      detail: `~${round(distance)} mi — within your ${maxMiles} mi range`,
      max,
      strong: points >= 13,
    };
  }
  const points = Math.max(0, round(18 * (1 - distance / (maxMiles * 2))));
  return {
    label: "Distance",
    points,
    detail: `~${round(distance)} mi — outside your range`,
    max,
    strong: false,
  };
}

export const PRICE_LABEL: Record<number, string> = {
  0: "Any budget",
  1: "$ Value",
  2: "$$ Mid-range",
  3: "$$$ Premium",
};

function priceFactor(profile: AthleteProfile, listing: Listing): MatchFactor {
  const max = 10;
  const budget = profile.priceMax ?? 0;
  if (!budget) {
    return { label: "Price range", points: max, max, detail: "Any budget", strong: false };
  }
  if (listing.priceBand <= budget) {
    return { label: "Price range", points: max, max, detail: "Within your budget", strong: true };
  }
  if (listing.priceBand === budget + 1) {
    return { label: "Price range", points: 5, max, detail: "Slightly above your budget", strong: false };
  }
  return { label: "Price range", points: 1, max, detail: "Above your budget", strong: false };
}

function goalsFactor(profile: AthleteProfile, listing: Listing): MatchFactor {
  const max = 10;
  if (profile.goals.length === 0) {
    return { label: "Goal alignment", points: 6, max, detail: "No specific goals set", strong: false };
  }
  const overlap = profile.goals.filter((g) => listing.goals.includes(g));
  const points = round((overlap.length / profile.goals.length) * max);
  return {
    label: "Goal alignment",
    points,
    detail:
      overlap.length > 0
        ? `Strong on ${overlap.slice(0, 2).join(", ")}`
        : "Limited overlap with your goals",
    max,
    strong: points >= 7,
  };
}

/** Score a single listing against an athlete profile. */
export function matchListing(
  profile: AthleteProfile,
  listing: Listing,
): MatchResult {
  const level = levelFactor(profile, listing);
  const distance = distanceFactor(profile, listing);
  const goals = goalsFactor(profile, listing);
  const price = priceFactor(profile, listing);

  const csd = computeCsdScore(listing).score;
  const csdFactor: MatchFactor = {
    label: "CSD Score™",
    points: round((csd / 100) * 12),
    max: 12,
    detail: `CSD Score ${csd} — vetted credibility`,
    strong: csd >= 75,
  };

  const sportFactor: MatchFactor = {
    label: "Sport",
    points: profile.sport && listing.sports.includes(profile.sport) ? 12 : 5,
    max: 12,
    detail:
      profile.sport && listing.sports.includes(profile.sport)
        ? `${profile.sport} program`
        : "Multi-sport",
    strong: true,
  };

  const factors = [level, distance, csdFactor, sportFactor, goals, price];
  const fit = clamp(round(factors.reduce((s, f) => s + f.points, 0)));

  const top = [...factors].sort((a, b) => b.points / b.max - a.points / a.max)[0];
  const headline = top.detail;

  return { listing, fit, factors, headline };
}

/** Rank a set of listings for an athlete profile, applying hard filters. */
export function rankMatches(
  profile: AthleteProfile,
  listings: Listing[],
): MatchResult[] {
  return listings
    .filter((l) => !profile.sport || l.sports.includes(profile.sport))
    .filter((l) => profile.category === "any" || l.category === profile.category)
    .map((l) => matchListing(profile, l))
    .sort((a, b) => b.fit - a.fit);
}
