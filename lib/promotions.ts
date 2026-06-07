import type {
  AdPlacement,
  AudienceReach,
  CampaignObjective,
  PaymentMethod,
} from "./types";

/*
  Promotions pricing & estimates for the demo. Deterministic, illustrative —
  no real ad exchange, but the numbers behave consistently so reporting and
  estimates feel real. Every promoted unit is a *vetted, verified* provider.
*/

export interface PlacementDef {
  id: AdPlacement;
  label: string;
  desc: string;
  /** Base cost per day before the audience multiplier. */
  perDay: number;
  /** Relative daily impression volume at Local reach. */
  dailyImpressions: number;
}

export const PLACEMENTS: PlacementDef[] = [
  {
    id: "events-featured",
    label: "Featured on Events board",
    desc: "Top, highlighted slot wherever families browse events.",
    perDay: 8,
    dailyImpressions: 220,
  },
  {
    id: "discover-spotlight",
    label: "Discover spotlight",
    desc: "A native sponsored card at the top of search results.",
    perDay: 15,
    dailyImpressions: 480,
  },
  {
    id: "in-app-banner",
    label: "In-app banner",
    desc: "A brand banner across key in-app screens.",
    perDay: 10,
    dailyImpressions: 350,
  },
  {
    id: "in-app-popup",
    label: "In-app pop-up",
    desc: "A full, on-brand interstitial shown on app entry.",
    perDay: 20,
    dailyImpressions: 640,
  },
];

export const PLACEMENT_LABEL: Record<AdPlacement, string> = Object.fromEntries(
  PLACEMENTS.map((p) => [p.id, p.label]),
) as Record<AdPlacement, string>;

export const AUDIENCE_MULT: Record<AudienceReach, number> = {
  Local: 1,
  Regional: 2.2,
  Statewide: 4,
};

export const PAYMENT_METHODS: PaymentMethod[] = ["Card", "PayPal", "Apple Pay", "Bank (ACH)"];

const CTR = 0.035; // est. click-through rate
const RSVP_RATE = 0.12; // est. clicks → RSVPs

export interface CampaignEstimate {
  budget: number;
  impressions: number;
  clicks: number;
  rsvps: number;
}

export function estimateCampaign(
  placements: AdPlacement[],
  audience: AudienceReach,
  durationDays: number,
): CampaignEstimate {
  const mult = AUDIENCE_MULT[audience];
  const defs = PLACEMENTS.filter((p) => placements.includes(p.id));
  const perDay = defs.reduce((s, p) => s + p.perDay, 0);
  const dailyImp = defs.reduce((s, p) => s + p.dailyImpressions, 0);
  const budget = Math.round(perDay * mult * durationDays);
  const impressions = Math.round(dailyImp * mult * durationDays);
  const clicks = Math.round(impressions * CTR);
  const rsvps = Math.round(clicks * RSVP_RATE);
  return { budget, impressions, clicks, rsvps };
}

export interface CampaignPlan {
  key: string;
  name: string;
  tagline: string;
  rationale: string;
  objective: CampaignObjective;
  placements: AdPlacement[];
  audience: AudienceReach;
  durationDays: number;
}

export const CAMPAIGN_PLANS: CampaignPlan[] = [
  {
    key: "fill-fast",
    name: "Fill it fast",
    tagline: "Sell out a tryout or camp on a deadline",
    rationale:
      "High-visibility placements with urgency. Best when you have a date to fill and need RSVPs now.",
    objective: "Fill an event",
    placements: ["events-featured", "in-app-popup"],
    audience: "Local",
    durationDays: 7,
  },
  {
    key: "max-exposure",
    name: "Maximum exposure",
    tagline: "Put a showcase or tournament in front of the whole region",
    rationale:
      "Broad, multi-surface reach for recruiting-driven events where you want maximum eyes statewide.",
    objective: "Grow awareness",
    placements: ["discover-spotlight", "in-app-banner", "events-featured"],
    audience: "Statewide",
    durationDays: 14,
  },
  {
    key: "budget-local",
    name: "Budget-friendly local",
    tagline: "Steady local awareness without overspending",
    rationale:
      "A single efficient placement at local reach — a low-cost way to keep your clinic top-of-mind.",
    objective: "Drive profile visits",
    placements: ["events-featured"],
    audience: "Local",
    durationDays: 5,
  },
];
