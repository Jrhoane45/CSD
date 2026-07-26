import type { PaymentMode } from "@/lib/config";

/*
  Payments seam. Checkout goes through an adapter so the simulated demo flow and
  real Stripe flow share the same call sites. Demo returns "succeeded" and the
  caller finalizes locally; Stripe returns "redirected" as the browser navigates
  to Stripe Checkout (fulfillment happens server-side via webhook).
*/

export interface CampaignCheckout {
  kind: "campaign";
  listingId: string;
  amountUsd: number;
  label: string;
}

export interface SubscriptionCheckout {
  kind: "subscription";
  plan: string;
  priceLabel: string;
  amountUsd: number;
}

export type CheckoutInput = CampaignCheckout | SubscriptionCheckout;

export type CheckoutOutcome = { status: "succeeded" } | { status: "redirected" };

export interface PaymentAdapter {
  readonly mode: PaymentMode;
  checkout(input: CheckoutInput): Promise<CheckoutOutcome>;
}
