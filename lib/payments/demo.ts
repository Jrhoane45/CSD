import type { CheckoutOutcome, PaymentAdapter } from "./types";

/*
  Simulated checkout — the demo's existing behavior, now behind the seam. A short
  delay stands in for network/processing, then the caller finalizes locally.
*/
export const demoPayments: PaymentAdapter = {
  mode: "demo",
  checkout: (): Promise<CheckoutOutcome> =>
    new Promise((resolve) => setTimeout(() => resolve({ status: "succeeded" }), 1400)),
};
