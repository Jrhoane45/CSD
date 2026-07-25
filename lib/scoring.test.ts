import { describe, it, expect } from "vitest";
import type { AthleteProfile, Listing, Review } from "./types";
import {
  averageRating,
  computeCsdScore,
  derivedGoals,
  matchListing,
  rankMatches,
} from "./scoring";
import { LISTINGS } from "./data/listings";

const review = (rating: number): Review => ({
  author: "A",
  rating,
  date: "2024-01-01",
  title: "t",
  body: "b",
  dimensions: [],
});

const listing = (partial: Partial<Listing>): Listing =>
  ({
    id: "t",
    name: "T",
    category: "club",
    sports: ["Basketball"],
    levels: ["Competitive"],
    city: "Los Angeles",
    county: "Los Angeles",
    milesFromAnchor: 5,
    claimState: "claimed-paid",
    verified: true,
    yearsInOperation: 10,
    certifications: [],
    philosophy: "",
    priceBand: 2,
    priceLabel: "$$",
    alumni: { pro: 0, d1: 0, d2: 0, d3: 0 },
    notableAthletes: [],
    goals: [],
    specialties: [],
    reviews: [],
    ...partial,
  }) as Listing;

describe("averageRating", () => {
  it("averages review ratings", () => {
    expect(averageRating(listing({ reviews: [review(5), review(3)] }))).toBe(4);
  });
  it("is 0 with no reviews", () => {
    expect(averageRating(listing({ reviews: [] }))).toBe(0);
  });
});

describe("computeCsdScore", () => {
  it("sums the documented factors deterministically", () => {
    const { score, parts } = computeCsdScore(
      listing({
        certifications: ["a", "b", "c"], // 18
        yearsInOperation: 15, // 16
        alumni: { pro: 1, d1: 1, d2: 1, d3: 1 }, // 15
        notableAthletes: ["x", "y"], // 8
        reviews: [review(5), review(5)], // quality 18 + volume 2
      }),
    );
    expect(score).toBe(77);
    expect(parts).toHaveLength(6);
    expect(parts.reduce((s, p) => s + p.points, 0)).toBe(77);
  });

  it("never exceeds 100", () => {
    const { score } = computeCsdScore(
      listing({
        certifications: ["a", "b", "c", "d", "e"],
        yearsInOperation: 40,
        alumni: { pro: 50, d1: 50, d2: 50, d3: 50 },
        notableAthletes: ["a", "b", "c", "d"],
        reviews: [review(5), review(5), review(5), review(5), review(5)],
      }),
    );
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("derivedGoals", () => {
  it("derives Athletic Development from a physical-development tag", () => {
    expect(derivedGoals(listing({ goals: ["Strength & conditioning"] }))).toEqual([
      "Athletic Development",
    ]);
    expect(derivedGoals(listing({ goals: ["Speed & athleticism", "College recruiting"] }))).toEqual([
      "Athletic Development",
    ]);
  });
  it("returns nothing when the goal is already explicit or unrelated", () => {
    expect(derivedGoals(listing({ goals: ["Athletic Development"] }))).toEqual([]);
    expect(derivedGoals(listing({ goals: ["Skill development"] }))).toEqual([]);
  });
});

describe("matchListing goal synonyms", () => {
  it("credits Athletic Development against a strength-tagged provider", () => {
    const profile = {
      sport: "Basketball",
      age: 14,
      level: "Competitive",
      county: "Los Angeles",
      maxMiles: 30,
      category: "any",
      goals: ["Athletic Development"],
    } as AthleteProfile;
    const m = matchListing(profile, listing({ goals: ["Strength & conditioning"] }));
    const goalFactor = m.factors.find((f) => f.label === "Goal alignment");
    expect(goalFactor?.points).toBeGreaterThan(0);
  });
});

describe("rankMatches", () => {
  const profile = {
    sport: "Basketball",
    age: 14,
    level: "Competitive",
    county: "Los Angeles",
    maxMiles: 30,
    category: "any",
    goals: ["Athletic Development"],
  } as AthleteProfile;

  it("returns only sport-matching listings, sorted by fit descending", () => {
    const results = rankMatches(profile, LISTINGS);
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) expect(r.listing.sports).toContain("Basketball");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].fit).toBeGreaterThanOrEqual(results[i].fit);
    }
  });
});
