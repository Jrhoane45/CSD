import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

/**
 * Stripe webhook. Verifies the signature and fulfills completed checkouts.
 * Fulfillment writes to the database (activate campaign / subscription) once the
 * data layer is on Supabase — see the TODO below.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature") ?? "";
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (e) {
    return NextResponse.json({ error: `Invalid signature: ${(e as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata ?? {};
    // TODO(fulfillment): using `meta.kind` + `meta.listingId`/`meta.plan`, mark
    // the campaign active or the provider subscription live in the database.
    // Wired once campaigns/subscriptions are persisted in Supabase.
    void meta;
  }

  return NextResponse.json({ received: true });
}
