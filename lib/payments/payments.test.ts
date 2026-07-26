import { describe, it, expect, afterEach } from "vitest";
import { payments } from "./index";
import { demoPayments } from "./demo";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
});

describe("payments factory", () => {
  it("uses the demo adapter when Stripe is not configured", () => {
    expect(payments).toBe(demoPayments);
    expect(payments.mode).toBe("demo");
  });
});

describe("demo payments", () => {
  it("resolves a campaign checkout as succeeded (caller finalizes locally)", async () => {
    const outcome = await demoPayments.checkout({
      kind: "campaign",
      listingId: "hoop-prodigy",
      amountUsd: 56,
      label: "Fall Tryouts",
    });
    expect(outcome).toEqual({ status: "succeeded" });
  });

  it("resolves a subscription checkout as succeeded", async () => {
    const outcome = await demoPayments.checkout({
      kind: "subscription",
      plan: "Premium",
      priceLabel: "$149/ mo",
      amountUsd: 149,
    });
    expect(outcome).toEqual({ status: "succeeded" });
  });
});
