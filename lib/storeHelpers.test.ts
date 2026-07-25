import { describe, it, expect } from "vitest";
import { vettingStatusFor, isPubliclyVisible, removedReviewIds } from "./store";
import { SEED_MODERATION } from "./data/activity";

describe("vettingStatusFor", () => {
  it("falls back to the listing's verified flag with no override", () => {
    expect(vettingStatusFor({ id: "x", verified: true }, {})).toBe("verified");
    expect(vettingStatusFor({ id: "x", verified: false }, {})).toBe("pending");
  });
  it("respects an operator override", () => {
    expect(vettingStatusFor({ id: "x", verified: true }, { x: "suspended" })).toBe("suspended");
    expect(vettingStatusFor({ id: "x", verified: false }, { x: "verified" })).toBe("verified");
  });
});

describe("isPubliclyVisible", () => {
  it("hides only suspended providers", () => {
    expect(isPubliclyVisible({ id: "x", verified: true }, {})).toBe(true);
    expect(isPubliclyVisible({ id: "x", verified: false }, {})).toBe(true);
    expect(isPubliclyVisible({ id: "x", verified: true }, { x: "suspended" })).toBe(false);
  });
});

describe("removedReviewIds", () => {
  const reviewItem = SEED_MODERATION.find((i) => i.reviewId);

  it("is empty with no removals", () => {
    expect(removedReviewIds({}).size).toBe(0);
  });

  it("collects reviewIds only for items marked removed", () => {
    expect(reviewItem).toBeDefined();
    if (!reviewItem?.reviewId) return;
    expect(removedReviewIds({ [reviewItem.id]: "removed" }).has(reviewItem.reviewId)).toBe(true);
    expect(removedReviewIds({ [reviewItem.id]: "dismissed" }).size).toBe(0);
  });
});
