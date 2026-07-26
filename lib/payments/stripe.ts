"use client";

import type { CheckoutInput, CheckoutOutcome, PaymentAdapter } from "./types";

/*
  Stripe checkout. Asks a server route to create a Stripe Checkout Session, then
  redirects the browser to it. On return, Stripe fires a webhook the server uses
  to fulfill (activate the campaign / subscription). Code-complete; exercised
  only against real Stripe keys.
*/
export const stripePayments: PaymentAdapter = {
  mode: "stripe",
  checkout: async (input: CheckoutInput): Promise<CheckoutOutcome> => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`Checkout failed (${res.status})`);
    const { url } = (await res.json()) as { url?: string };
    if (!url) throw new Error("Checkout session did not return a URL.");
    window.location.assign(url);
    return { status: "redirected" };
  },
};
