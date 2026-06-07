"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CheckoutModal, type Plan } from "@/components/app/CheckoutModal";

/**
 * Pricing-page CTA. Free tier links straight to the provider dashboard; paid
 * tiers open the simulated checkout, then route to the dashboard on success.
 */
export function PlanButton({
  plan,
  cta,
  featured,
  free,
}: {
  plan: Plan;
  cta: string;
  featured: boolean;
  free?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const base =
    "mt-7 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors duration-150";
  const variant = featured
    ? "bg-gold text-ink hover:bg-gold-300"
    : "bg-navy text-white hover:bg-navy-deep";

  return (
    <>
      <button
        onClick={() => (free ? router.push("/app/provider") : setOpen(true))}
        className={`${base} ${variant}`}
      >
        {cta} <ArrowRight size={16} />
      </button>
      <CheckoutModal
        open={open}
        plan={plan}
        onClose={() => setOpen(false)}
        onSuccess={() => router.push("/app/provider")}
      />
    </>
  );
}
