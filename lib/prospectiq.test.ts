import { describe, it, expect } from "vitest";
import type { PiqInput } from "./prospectiq";
import { tierFor, weightsFor, computePiq } from "./prospectiq";

describe("tierFor", () => {
  it("buckets percentiles at the documented boundaries", () => {
    expect(tierFor(90)).toBe("Elite");
    expect(tierFor(89)).toBe("Competitive");
    expect(tierFor(70)).toBe("Competitive");
    expect(tierFor(69)).toBe("Intermediate");
    expect(tierFor(40)).toBe("Intermediate");
    expect(tierFor(39)).toBe("Beginner");
  });
});

describe("weightsFor", () => {
  it("returns pillar weights that sum to 1", () => {
    for (const [sport, position] of [
      ["Basketball", "Guard"],
      ["Soccer", "Anything"], // falls back to the sport default
      ["Football", "Lineman"],
    ] as const) {
      const w = weightsFor(sport, position);
      const sum = w.T + w.A + w.G + w.C + w.E;
      expect(sum).toBeCloseTo(1, 5);
    }
  });
});

describe("computePiq", () => {
  const input: PiqInput = {
    sport: "Basketball",
    position: "Guard",
    age: 14,
    level: "Competitive",
    seed: "Test Athlete",
    drillsCaptured: 5,
    verified: true,
  };

  it("produces in-range, self-consistent results", () => {
    const r = computePiq(input);
    for (const v of Object.values(r.pillars)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
    expect(r.composite).toBeGreaterThanOrEqual(0);
    expect(r.composite).toBeLessThanOrEqual(100);
    expect(r.percentile).toBeGreaterThanOrEqual(1);
    expect(r.percentile).toBeLessThanOrEqual(99);
    expect(r.tier).toBe(tierFor(r.percentile));
  });

  it("is deterministic for a given seed", () => {
    const a = computePiq(input);
    const b = computePiq(input);
    expect(b.pillars).toEqual(a.pillars);
    expect(b.composite).toBe(a.composite);
    expect(b.percentile).toBe(a.percentile);
  });
});
