import type { Metadata } from "next";
import { BillingCenter } from "@/components/app/BillingCenter";

export const metadata: Metadata = {
  title: "Billing & Subscription",
  description: "Manage your CSD plan, usage, payment method, and billing history.",
};

export default function BillingPage() {
  return <BillingCenter />;
}
