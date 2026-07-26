import Stripe from "stripe";

/*
  Server-only Stripe client, created lazily from STRIPE_SECRET_KEY. Returns null
  when unset so routes can respond cleanly in demo mode. Never import from a
  client component.
*/

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (cached) return cached;
  cached = new Stripe(key);
  return cached;
}
