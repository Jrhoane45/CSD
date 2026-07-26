import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import type { CheckoutInput } from "@/lib/payments/types";

export const runtime = "nodejs";

/**
 * Creates a Stripe Checkout Session for a campaign (one-time) or provider
 * subscription (recurring) and returns its URL. Responds 503 in demo mode.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const input = (await req.json()) as CheckoutInput;
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const amount = Math.round((input.amountUsd ?? 0) * 100);

  try {
    const session =
      input.kind === "subscription"
        ? await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  recurring: { interval: "month" },
                  unit_amount: amount,
                  product_data: { name: `Club Sports Direct — ${input.plan}` },
                },
              },
            ],
            metadata: { kind: "subscription", plan: input.plan },
            success_url: `${origin}/app/provider?checkout=success`,
            cancel_url: `${origin}/app/provider?checkout=cancel`,
          })
        : await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: amount,
                  product_data: { name: input.label || "CSD promotion" },
                },
              },
            ],
            metadata: { kind: "campaign", listingId: input.listingId },
            success_url: `${origin}/app/promote?checkout=success`,
            cancel_url: `${origin}/app/promote?checkout=cancel`,
          });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
