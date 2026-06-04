import type { DevLevel, Sport } from "./types";

// ---------------------------------------------------------------------------
// Prospect IQ™ — demo scoring engine.
// Deterministic, rubric-driven evaluation that mirrors the documented model:
// five pillars → weighted composite → national cohort percentile → tier.
// (Demo logic: simulates the AI video analysis with consistent, plausible output.)
// ---------------------------------------------------------------------------

export type PillarKey = "T" | "A" | "G" | "C" | "E";

export interface Pillars {
  T: number;
  A: number;
  G: number;
  C: number;
  E: number;
}

export type Tier = "Beginner" | "Intermediate" | "Competitive" | "Elite";

export interface PiqResult {
  sport: Sport;
  position: string;
  age: number;
  pillars: Pillars;
  composite: number;
  percentile: number;
  tier: Tier;
  confidence: number;
  highPotential: boolean;
  verified: boolean;
  drillsCaptured: number;
  createdAt: string;
}

export interface PiqInput {
  sport: Sport;
  position: string;
  age: number;
  level: DevLevel | "";
  seed: string; // e.g. athlete name — makes the spread deterministic per athlete
  drillsCaptured: number;
  verified?: boolean;
}

export const PILLARS: { key: PillarKey; name: string; sub: string }[] = [
  { key: "T", name: "Technical Skill", sub: "Shooting, ball handling, footwork & mechanics" },
  { key: "A", name: "Athleticism", sub: "Speed, agility, explosiveness & conditioning" },
  { key: "G", name: "Game IQ", sub: "Decision-making, spacing, anticipation" },
  { key: "C", name: "Competitive Application", sub: "Execution under live, contested pressure" },
  { key: "E", name: "Trajectory & Experience", sub: "History & rate of development" },
];

export const PILLAR_NAME: Record<PillarKey, string> = {
  T: "Technical Skill",
  A: "Athleticism",
  G: "Game IQ",
  C: "Competitive Application",
  E: "Trajectory & Experience",
};

// Illustrative pillar weights per Sport×Position (advisory panel sets the real ones).
const WEIGHTS: Record<string, Pillars> = {
  "Basketball:Guard": { T: 0.3, A: 0.2, G: 0.25, C: 0.2, E: 0.05 },
  "Basketball:Wing": { T: 0.28, A: 0.24, G: 0.22, C: 0.21, E: 0.05 },
  "Basketball:Big": { T: 0.26, A: 0.27, G: 0.2, C: 0.22, E: 0.05 },
  Basketball: { T: 0.3, A: 0.22, G: 0.23, C: 0.2, E: 0.05 },
  Soccer: { T: 0.25, A: 0.2, G: 0.3, C: 0.2, E: 0.05 },
  Baseball: { T: 0.35, A: 0.15, G: 0.15, C: 0.3, E: 0.05 },
  Softball: { T: 0.35, A: 0.15, G: 0.15, C: 0.3, E: 0.05 },
  Football: { T: 0.25, A: 0.3, G: 0.2, C: 0.2, E: 0.05 },
  Volleyball: { T: 0.3, A: 0.25, G: 0.2, C: 0.2, E: 0.05 },
};

export function weightsFor(sport: Sport, position: string): Pillars {
  return (
    WEIGHTS[`${sport}:${position}`] ??
    WEIGHTS[sport] ?? { T: 0.3, A: 0.2, G: 0.25, C: 0.2, E: 0.05 }
  );
}

const LEVEL_BASE: Record<string, number> = {
  Recreational: 40,
  Intermediate: 57,
  Competitive: 73,
  Elite: 86,
  "": 55,
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const round = (n: number) => Math.round(n);

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295; // 0..1
}

/** Deterministic per-pillar offset in roughly [-10, +10]. */
function offset(seed: string, key: string): number {
  return (hash(seed + ":" + key) - 0.5) * 20;
}

export function tierFor(percentile: number): Tier {
  if (percentile >= 90) return "Elite";
  if (percentile >= 70) return "Competitive";
  if (percentile >= 40) return "Intermediate";
  return "Beginner";
}

export const TIER_META: Record<Tier, { pct: string; blurb: string; tone: string }> = {
  Beginner: { pct: "< 40th", blurb: "Developing fundamentals — foundation & fun.", tone: "muted" },
  Intermediate: { pct: "40–69th", blurb: "Solid fundamentals — ready for structured development.", tone: "navy" },
  Competitive: { pct: "70–89th", blurb: "Above cohort — suited to travel/club & selective programs.", tone: "gold" },
  Elite: { pct: "90th+", blurb: "Top of cohort — elite programs, showcases & recruiting.", tone: "red" },
};

export function computePiq(input: PiqInput): PiqResult {
  const base = LEVEL_BASE[input.level] ?? 55;
  const raw: Pillars = {
    T: clamp(base + offset(input.seed, "T")),
    A: clamp(base + offset(input.seed, "A")),
    G: clamp(base + offset(input.seed, "G")),
    C: clamp(base + offset(input.seed, "C")),
    // Experience scales a little with age (older = more history) but stays cohort-fair.
    E: clamp(base - 6 + (input.age ? (input.age - 8) * 1.4 : 0) + offset(input.seed, "E")),
  };
  const pillars: Pillars = {
    T: round(raw.T),
    A: round(raw.A),
    G: round(raw.G),
    C: round(raw.C),
    E: round(raw.E),
  };

  const w = weightsFor(input.sport, input.position);
  const composite = round(
    pillars.T * w.T + pillars.A * w.A + pillars.G * w.G + pillars.C * w.C + pillars.E * w.E,
  );

  // Map composite → national cohort percentile (beta-seeded curve).
  const percentile = clamp(round(composite + (composite - 55) * 0.3), 1, 99);
  const tier = tierFor(percentile);

  const confidence = clamp(48 + input.drillsCaptured * 9 + (input.verified ? 8 : 0), 0, 99);
  const highPotential = (percentile >= 80 && input.age <= 15) || percentile >= 92;

  return {
    sport: input.sport,
    position: input.position,
    age: input.age,
    pillars,
    composite,
    percentile,
    tier,
    confidence,
    highPotential,
    verified: !!input.verified,
    drillsCaptured: input.drillsCaptured,
    createdAt: new Date().toISOString(),
  };
}

export function pillarBand(score: number): string {
  if (score >= 85) return "Elite-level";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Solid";
  if (score >= 40) return "Developing";
  return "Foundational";
}

// Basketball development recommendations keyed by the weakest pillars.
const DEV_LIBRARY: Record<PillarKey, { focus: string; drills: string[] }> = {
  T: {
    focus: "Tighten shooting mechanics and ball-handling consistency.",
    drills: ["Form-shooting progression (close → mid)", "Two-ball stationary handling", "Footwork into the catch"],
  },
  A: {
    focus: "Build first-step quickness, change-of-direction, and vertical explosiveness.",
    drills: ["Lateral agility ladder", "Reactive sprint starts", "Depth-jump / approach-jump work"],
  },
  G: {
    focus: "Sharpen decision-making, spacing, and reading the defense.",
    drills: ["Read-and-react film study", "2-on-1 / 3-on-2 decisions", "Off-ball spacing reps"],
  },
  C: {
    focus: "Translate skills to live, contested play and raise compete level.",
    drills: ["1-on-1 from a closeout", "Live small-sided games", "Defensive multiple-effort drills"],
  },
  E: {
    focus: "Add structured reps and competition to accelerate development velocity.",
    drills: ["Join a level-appropriate club", "Consistent weekly skills training", "Track progress with re-evaluations"],
  },
};

export interface PathwayItem {
  pillar: PillarKey;
  pillarName: string;
  focus: string;
  drills: string[];
}

export function developmentPathway(result: PiqResult): PathwayItem[] {
  const entries = (Object.keys(result.pillars) as PillarKey[])
    .map((k) => ({ k, v: result.pillars[k] }))
    .sort((a, b) => a.v - b.v)
    .slice(0, 2);
  return entries.map(({ k }) => ({
    pillar: k,
    pillarName: PILLAR_NAME[k],
    focus: DEV_LIBRARY[k].focus,
    drills: DEV_LIBRARY[k].drills,
  }));
}

export function strengths(result: PiqResult): PillarKey[] {
  return (Object.keys(result.pillars) as PillarKey[])
    .sort((a, b) => result.pillars[b] - result.pillars[a])
    .slice(0, 2);
}

// Basketball Combine drill set (capture protocol).
export const BASKETBALL_DRILLS = [
  { id: "handling", name: "Ball-handling circuit", pillar: "Technical", tip: "Full body in frame, side angle, ~30s" },
  { id: "shooting", name: "Shooting (form → range)", pillar: "Technical", tip: "Baseline angle, show the arc, 10 reps" },
  { id: "agility", name: "Agility & movement", pillar: "Athleticism", tip: "Mark a 15ft lane, film straight on" },
  { id: "defense", name: "Defensive slides", pillar: "Competitive", tip: "Wide angle, show stance & feet" },
  { id: "game", name: "Game footage (optional)", pillar: "Game IQ", tip: "Any recent full-speed clip" },
] as const;

export const POSITIONS_BY_SPORT: Record<string, string[]> = {
  Basketball: ["Guard", "Wing", "Big"],
  Soccer: ["Forward", "Midfielder", "Defender", "Goalkeeper"],
  Baseball: ["Pitcher", "Infield", "Outfield", "Catcher"],
  Softball: ["Pitcher", "Infield", "Outfield", "Catcher"],
  Football: ["QB", "Skill", "Line", "Defense"],
  Volleyball: ["Setter", "Outside", "Middle", "Libero"],
};
