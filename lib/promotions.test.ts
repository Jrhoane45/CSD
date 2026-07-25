import { describe, it, expect } from "vitest";
import {
  estimateCampaign,
  addDaysISO,
  flightStatus,
  todayISO,
  CAMPAIGN_PLANS,
  PLACEMENTS,
} from "./promotions";

describe("estimateCampaign", () => {
  it("computes a deterministic estimate for a single placement", () => {
    expect(estimateCampaign(["events-featured"], "Local", 7)).toEqual({
      budget: 56, // 8/day * 1 * 7
      impressions: 1540, // 220/day * 1 * 7
      clicks: 54, // round(1540 * 0.035)
      rsvps: 6, // round(54 * 0.12)
    });
  });

  it("is zero with no placements", () => {
    expect(estimateCampaign([], "Local", 7)).toEqual({
      budget: 0,
      impressions: 0,
      clicks: 0,
      rsvps: 0,
    });
  });

  it("scales budget and impressions by the audience multiplier", () => {
    const local = estimateCampaign(["events-featured"], "Local", 7);
    const statewide = estimateCampaign(["events-featured"], "Statewide", 7);
    expect(statewide.budget).toBe(local.budget * 4); // Statewide mult = 4
    expect(statewide.impressions).toBe(local.impressions * 4);
  });
});

describe("addDaysISO", () => {
  it("adds days and rolls over months", () => {
    expect(addDaysISO("2024-01-01", 5)).toBe("2024-01-06");
    expect(addDaysISO("2024-01-31", 1)).toBe("2024-02-01");
    expect(addDaysISO("2024-02-28", 1)).toBe("2024-02-29"); // leap year
  });
});

describe("flightStatus", () => {
  it("classifies scheduled / active / ended relative to today", () => {
    const today = todayISO();
    expect(flightStatus(addDaysISO(today, -1), addDaysISO(today, 1))).toBe("active");
    expect(flightStatus(addDaysISO(today, 2), addDaysISO(today, 5))).toBe("scheduled");
    expect(flightStatus(addDaysISO(today, -5), addDaysISO(today, -2))).toBe("ended");
  });
});

describe("CAMPAIGN_PLANS", () => {
  it("reference only valid placement ids", () => {
    const ids = new Set(PLACEMENTS.map((p) => p.id));
    expect(CAMPAIGN_PLANS.length).toBeGreaterThan(0);
    for (const plan of CAMPAIGN_PLANS) {
      expect(plan.placements.length).toBeGreaterThan(0);
      for (const p of plan.placements) expect(ids.has(p)).toBe(true);
    }
  });
});
