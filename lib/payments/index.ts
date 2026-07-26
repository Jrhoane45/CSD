import { paymentMode } from "@/lib/config";
import type { PaymentAdapter } from "./types";
import { demoPayments } from "./demo";
import { stripePayments } from "./stripe";

/*
  Active payment adapter: Stripe when its publishable key is present, the
  simulated demo otherwise. Call sites are identical.
*/
export const payments: PaymentAdapter = paymentMode() === "stripe" ? stripePayments : demoPayments;

export type { CheckoutInput, CheckoutOutcome, PaymentAdapter } from "./types";
