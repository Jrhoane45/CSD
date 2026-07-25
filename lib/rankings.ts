import type { County, DevLevel, Sport } from "./types";
import { computePiq, tierFor, POSITIONS_BY_SPORT, type Tier } from "./prospectiq";
import { SPORTS_LIST } from "./data/listings";

/*
  Prospect IQ™ Rankings — a regional leaderboard powered by the same evaluation
  engine. A deterministic synthetic cohort (stable per name/sport, no RNG) stands
  in for the platform's evaluated athletes; the viewing family's own Prospect IQ
  result is slotted in live so they can see where they stand.
*/

export interface RankedAthlete {
  id: string;
  name: string;
  sport: Sport;
  position: string;
  age: number;
  county: County;
  composite: number;
  percentile: number;
  tier: Tier;
  verified: boolean;
  isYou?: boolean;
}

const FIRST = [
  "Diego", "Aaliyah", "Rohan", "Ella", "Marcus", "Sofia", "Jayden", "Mia", "Liam", "Zoe",
  "Noah", "Ava", "Ethan", "Isabella", "Mason", "Emma", "Lucas", "Olivia", "Caleb", "Maya",
  "Andre", "Priya", "Tyler", "Nina", "Jordan", "Layla", "Kai", "Harper", "Owen", "Sienna",
  "Malik", "Camila", "Devin", "Aria", "Xavier", "Nora",
];
const LAST = ["G.", "T.", "S.", "R.", "K.", "W.", "L.", "B.", "V.", "P.", "H.", "M.", "C.", "D.", "N."];
export const RANKING_COUNTIES: County[] = [
  "Los Angeles",
  "Orange",
  "Riverside",
  "Ventura",
  "San Diego",
  "San Bernardino",
];

// A spread of development levels so composites are realistically distributed.
const LEVEL_CYCLE: DevLevel[] = [
  "Elite",
  "Competitive",
  "Competitive",
  "Intermediate",
  "Competitive",
  "Elite",
  "Intermediate",
  "Competitive",
  "Elite",
  "Competitive",
  "Intermediate",
  "Competitive",
];

const PER_SPORT = 14;

function buildCohort(): RankedAthlete[] {
  const out: RankedAthlete[] = [];
  SPORTS_LIST.forEach((sport, si) => {
    const positions = POSITIONS_BY_SPORT[sport] ?? ["General"];
    for (let i = 0; i < PER_SPORT; i++) {
      const name = `${FIRST[(si * PER_SPORT + i) % FIRST.length]} ${LAST[(i * 3 + si) % LAST.length]}`;
      const position = positions[i % positions.length];
      const age = 12 + ((i * 2 + si) % 6); // 12–17
      const county = RANKING_COUNTIES[(i * 2 + si) % RANKING_COUNTIES.length];
      const level = LEVEL_CYCLE[i % LEVEL_CYCLE.length];
      const r = computePiq({
        sport,
        position,
        age,
        level,
        seed: `${name}:${sport}`,
        drillsCaptured: 3 + (i % 3),
        verified: i % 3 === 0,
      });
      out.push({
        id: `rk-${si}-${i}`,
        name,
        sport,
        position,
        age,
        county,
        composite: r.composite,
        percentile: r.percentile,
        tier: r.tier,
        verified: r.verified,
      });
    }
  });
  return out;
}

/** The full synthetic cohort (computed once). */
export const COHORT: RankedAthlete[] = buildCohort();

export type AgeBand = "all" | "u13" | "13-15" | "16+";

export const AGE_BANDS: { key: AgeBand; label: string }[] = [
  { key: "all", label: "All ages" },
  { key: "u13", label: "12 & under" },
  { key: "13-15", label: "13–15" },
  { key: "16+", label: "16+" },
];

function inBand(age: number, band: AgeBand): boolean {
  if (band === "all") return true;
  if (band === "u13") return age <= 12;
  if (band === "13-15") return age >= 13 && age <= 15;
  return age >= 16;
}

export interface RankFilter {
  sport: Sport;
  band: AgeBand;
  county: County | "all";
}

/**
 * Rank the cohort (plus the viewing athlete, if provided) for a given filter.
 * Returns entries sorted by composite desc with 1-based ranks applied.
 */
export function rankedList(
  filter: RankFilter,
  you?: RankedAthlete | null,
): { rank: number; a: RankedAthlete }[] {
  const pool = [...COHORT];
  if (you && you.sport === filter.sport) pool.push(you);
  const filtered = pool.filter(
    (a) => a.sport === filter.sport && inBand(a.age, filter.band) && (filter.county === "all" || a.county === filter.county),
  );
  filtered.sort((x, y) => y.composite - x.composite || y.percentile - x.percentile);
  return filtered.map((a, i) => ({ rank: i + 1, a }));
}

export function tierTone(tier: Tier): string {
  switch (tier) {
    case "Elite":
      return "bg-red/10 text-red";
    case "Competitive":
      return "bg-gold/20 text-ink";
    case "Intermediate":
      return "bg-navy/[0.08] text-navy";
    default:
      return "bg-ink/[0.06] text-ink/55";
  }
}

export { tierFor };
