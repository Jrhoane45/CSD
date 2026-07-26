"use client";

import { useState } from "react";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { addNotification } from "@/lib/store";
import { payments } from "@/lib/payments";

export interface Plan {
  name: string;
  price: string;
  period: string;
  perks: string[];
}

export function CheckoutModal({
  open,
  plan,
  onClose,
  onSuccess,
}: {
  open: boolean;
  plan: Plan | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [stage, setStage] = useState<"form" | "processing" | "done">("form");
  const [card, setCard] = useState("4242 4242 4242 4242");

  const reset = () => {
    setStage("form");
    onClose();
  };

  const pay = async () => {
    if (!plan) return;
    setStage("processing");
    const amountUsd = Number(plan.price.replace(/[^0-9.]/g, "")) || 0;
    const outcome = await payments.checkout({
      kind: "subscription",
      plan: plan.name,
      priceLabel: `${plan.price}${plan.period}`,
      amountUsd,
    });
    // Stripe navigates away to Checkout; fulfillment happens via webhook.
    if (outcome.status === "redirected") return;
    setStage("done");
    addNotification({
      role: "provider",
      icon: "trophy",
      text: `${plan.name} subscription is active — premium tools unlocked`,
      href: "/app/provider",
    });
    onSuccess?.();
  };

  if (!plan) return null;

  return (
    <Modal
      open={open}
      onClose={reset}
      title={stage === "done" ? "You're subscribed" : `Subscribe · ${plan.name}`}
      subtitle={stage === "done" ? undefined : "Demo checkout — no card is charged."}
    >
      {stage === "done" ? (
        <div className="py-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
            <Check size={28} />
          </div>
          <p className="mt-4 font-semibold text-navy">{plan.name} plan active</p>
          <p className="mt-1 text-sm text-ink/60">
            Premium tools are unlocked. (No payment was processed — this is a demo.)
          </p>
          <button
            onClick={reset}
            className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between rounded-xl bg-cream/60 p-4">
            <div>
              <p className="font-semibold text-navy">{plan.name}</p>
              <p className="text-xs text-ink/55">Cancel anytime</p>
            </div>
            <p className="text-navy">
              <span className="display text-3xl">{plan.price}</span>
              <span className="text-sm text-ink/55">{plan.period}</span>
            </p>
          </div>

          <ul className="space-y-1.5">
            {plan.perks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-ink/70">
                <Check size={15} className="text-navy" /> {p}
              </li>
            ))}
          </ul>

          <label className="block">
            <span className="eyebrow text-ink/50">Card number</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ink/15 px-3 py-2 focus-within:border-navy">
              <Lock size={14} className="text-ink/40" />
              <input
                value={card}
                onChange={(e) => setCard(e.target.value)}
                className="w-full text-sm outline-none"
                inputMode="numeric"
              />
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="eyebrow text-ink/50">Expiry</span>
              <input
                defaultValue="12 / 28"
                className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
              />
            </label>
            <label className="block">
              <span className="eyebrow text-ink/50">CVC</span>
              <input
                defaultValue="123"
                className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
              />
            </label>
          </div>

          <button
            onClick={pay}
            disabled={stage === "processing"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
          >
            {stage === "processing" ? "Processing…" : `Subscribe — ${plan.price}${plan.period}`}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-ink/45">
            <ShieldCheck size={13} /> Simulated secure checkout · no real charge
          </p>
        </div>
      )}
    </Modal>
  );
}
