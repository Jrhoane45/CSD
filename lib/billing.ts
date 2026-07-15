import type { Invoice, PlanTier, ProviderSubscription } from "./types";

/*
  Provider billing — subscription tiers, usage, and invoice history.
  Illustrative pricing for the demo; no real charges are ever made.
*/

export interface PlanDef {
  tier: PlanTier;
  name: string;
  price: number; // monthly, dollars
  tagline: string;
  boostsIncluded: number;
  features: string[];
  popular?: boolean;
}

export const PLANS: PlanDef[] = [
  {
    tier: "free",
    name: "Free",
    price: 0,
    tagline: "Claim your profile & respond to reviews",
    boostsIncluded: 0,
    features: [
      "Claimed, verified public profile",
      "Edit your narrative & pricing",
      "Respond to reviews",
      "Appear in search & matches",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    price: 149,
    tagline: "Leads, events & analytics — the growth plan",
    boostsIncluded: 4,
    popular: true,
    features: [
      "Everything in Free",
      "Lead inbox & messaging",
      "Session booking & scheduling",
      "Full analytics dashboard",
      "Event posting + 4 boosts / mo",
      "Featured search placement",
    ],
  },
  {
    tier: "elite",
    name: "Elite",
    price: 349,
    tagline: "Multi-location programs & priority support",
    boostsIncluded: 12,
    features: [
      "Everything in Pro",
      "Up to 5 locations / teams",
      "Roster & staff management",
      "12 event boosts / mo",
      "Priority placement & support",
      "Dedicated success manager",
    ],
  },
];

export function planDef(tier: PlanTier): PlanDef {
  return PLANS.find((p) => p.tier === tier) ?? PLANS[0];
}

export const PLAN_LABEL: Record<PlanTier, string> = {
  free: "Free",
  pro: "Pro",
  elite: "Elite",
};

/** Add `n` months to an ISO date (YYYY-MM-DD), returning a local ISO date. */
export function addMonthsISO(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setMonth(d.getMonth() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function defaultSubscription(todayISO: string): ProviderSubscription {
  return {
    plan: "pro",
    status: "active",
    renewsOn: addMonthsISO(todayISO, 1),
    card: { brand: "Visa", last4: "4242", exp: "12 / 28" },
    boostsIncluded: 4,
    boostsUsed: 1,
    since: addMonthsISO(todayISO, -5),
  };
}

/** A realistic invoice back-history for the current provider. */
export function seedInvoices(todayISO: string): Invoice[] {
  const out: Invoice[] = [];
  for (let i = 1; i <= 4; i++) {
    out.push({
      id: `inv-seed-${i}`,
      date: addMonthsISO(todayISO, -i),
      description: "Pro plan — monthly subscription",
      amount: 149,
      status: "paid",
    });
  }
  // A one-off boost charge in the mix.
  out.splice(1, 0, {
    id: "inv-seed-boost",
    date: addMonthsISO(todayISO, -1),
    description: "Event boost — Premium (Fall Tryouts)",
    amount: 149,
    status: "paid",
  });
  return out;
}
