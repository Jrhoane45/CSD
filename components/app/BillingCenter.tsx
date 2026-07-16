"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Check,
  Crown,
  Download,
  Inbox,
  Megaphone,
  CalendarClock,
  ShieldCheck,
  Lock,
  Zap,
} from "lucide-react";
import type { PlanTier } from "@/lib/types";
import {
  useStore,
  setPlan,
  cancelSubscription,
  reactivateSubscription,
  updatePaymentCard,
} from "@/lib/store";
import { PLANS, planDef, PLAN_LABEL, formatDate } from "@/lib/billing";
import { formatMoney } from "@/lib/scheduling";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Modal } from "@/components/ui/Modal";

const LISTING_ID = "hoop-prodigy";

export function BillingCenter() {
  const { subscription: sub, invoices, threads, bookings } = useStore();
  const [confirmPlan, setConfirmPlan] = useState<PlanTier | null>(null);
  const [cardModal, setCardModal] = useState(false);

  const current = planDef(sub.plan);
  const leads = useMemo(() => threads.filter((t) => t.listingId === LISTING_ID).length, [threads]);
  const sessions = useMemo(
    () => bookings.filter((b) => b.listingId === LISTING_ID && b.status !== "canceled").length,
    [bookings],
  );

  const usage = [
    {
      icon: Megaphone,
      label: "Event boosts",
      used: sub.boostsUsed,
      total: sub.boostsIncluded,
      note: `${Math.max(0, sub.boostsIncluded - sub.boostsUsed)} remaining this cycle`,
    },
    { icon: Inbox, label: "Active leads", used: leads, total: null, note: "Unlimited on your plan" },
    { icon: CalendarClock, label: "Booked sessions", used: sessions, total: null, note: "Unlimited on your plan" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/app/provider"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-navy"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Eyebrow>Billing &amp; subscription</Eyebrow>
          <h1 className="display mt-2 text-4xl text-navy">YOUR PLAN</h1>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
            sub.status === "active" ? "bg-gold/20 text-ink" : "bg-red/10 text-red"
          }`}
        >
          <Crown size={15} /> {PLAN_LABEL[sub.plan]} · {sub.status === "active" ? "Active" : "Canceling"}
        </span>
      </div>

      {/* current plan summary */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-ink/10 bg-navy p-6 text-white">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="eyebrow text-gold-300">Current plan</p>
              <p className="display mt-1 text-3xl text-white">{current.name}</p>
            </div>
            <p className="text-right">
              <span className="display text-4xl text-gold">{formatMoney(current.price)}</span>
              {current.price > 0 && <span className="text-sm text-cream/70"> / mo</span>}
            </p>
          </div>
          <p className="mt-2 text-sm text-cream/70">{current.tagline}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-sm">
            <div>
              <p className="text-cream/55">Member since</p>
              <p className="font-semibold text-white">{formatDate(sub.since)}</p>
            </div>
            <div>
              <p className="text-cream/55">{sub.status === "active" ? "Renews on" : "Access until"}</p>
              <p className="font-semibold text-white">{formatDate(sub.renewsOn)}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {sub.status === "active" ? (
              <button
                onClick={cancelSubscription}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-cream/80 hover:bg-white/10"
              >
                Cancel subscription
              </button>
            ) : (
              <button
                onClick={reactivateSubscription}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold-300"
              >
                <Zap size={14} /> Reactivate
              </button>
            )}
          </div>
        </div>

        {/* payment method */}
        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-navy" />
            <h3 className="font-semibold text-navy">Payment method</h3>
          </div>
          {sub.card ? (
            <div className="mt-4 rounded-xl border border-ink/10 bg-cream/50 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-navy">
                  {sub.card.brand} •••• {sub.card.last4}
                </p>
                <span className="rounded bg-navy/[0.07] px-2 py-0.5 text-xs font-semibold text-navy">
                  Default
                </span>
              </div>
              <p className="mt-1 text-xs text-ink/55">Expires {sub.card.exp}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink/55">No card on file.</p>
          )}
          <button
            onClick={() => setCardModal(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            Update card
          </button>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink/45">
            <ShieldCheck size={13} /> Simulated — no real card is stored or charged.
          </p>
        </div>
      </div>

      {/* usage */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {usage.map((u) => {
          const pct = u.total ? Math.min(100, Math.round((u.used / u.total) * 100)) : null;
          return (
            <div key={u.label} className="rounded-2xl border border-ink/10 bg-white p-5">
              <div className="flex items-center justify-between">
                <u.icon size={18} className="text-navy" />
                <span className="text-sm font-bold text-navy">
                  {u.used}
                  {u.total !== null && <span className="text-ink/40"> / {u.total}</span>}
                </span>
              </div>
              <p className="eyebrow mt-3 text-ink/50">{u.label}</p>
              {pct !== null ? (
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                </div>
              ) : (
                <div className="mt-2 h-2 rounded-full bg-cream" />
              )}
              <p className="mt-2 text-xs text-ink/50">{u.note}</p>
            </div>
          );
        })}
      </div>

      {/* plan comparison */}
      <h2 className="display mt-10 text-2xl text-navy">CHANGE PLAN</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = p.tier === sub.plan;
          const rank = { free: 0, pro: 1, elite: 2 } as const;
          const isUpgrade = rank[p.tier] > rank[sub.plan];
          return (
            <div
              key={p.tier}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                isCurrent ? "border-navy bg-navy/[0.03]" : "border-ink/10 bg-white"
              }`}
            >
              {p.popular && !isCurrent && (
                <span className="absolute -top-2.5 left-6 rounded-full bg-gold px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-ink">
                  Most popular
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="font-bold text-navy">{p.name}</h3>
                <p className="text-navy">
                  <span className="display text-2xl">{formatMoney(p.price)}</span>
                  {p.price > 0 && <span className="text-xs text-ink/50"> / mo</span>}
                </p>
              </div>
              <p className="mt-1 text-xs text-ink/55">{p.tagline}</p>
              <ul className="mt-4 flex-1 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink/70">
                    <Check size={14} className="mt-0.5 shrink-0 text-navy" /> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent}
                onClick={() => setConfirmPlan(p.tier)}
                className={`mt-5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isCurrent
                    ? "cursor-default bg-cream text-ink/50"
                    : isUpgrade
                      ? "bg-navy text-white hover:bg-navy-deep"
                      : "border border-navy/30 text-navy hover:bg-navy hover:text-white"
                }`}
              >
                {isCurrent ? "Current plan" : isUpgrade ? "Upgrade" : "Switch"}
              </button>
            </div>
          );
        })}
      </div>

      {/* invoices */}
      <h2 className="display mt-10 text-2xl text-navy">BILLING HISTORY</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink/50">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Description</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-right font-medium">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-ink/[0.06] last:border-0">
                <td className="whitespace-nowrap px-5 py-3 text-ink/70">{formatDate(inv.date)}</td>
                <td className="px-5 py-3 text-navy">{inv.description}</td>
                <td className="px-5 py-3 text-right font-semibold text-navy">
                  {formatMoney(inv.amount)}
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      inv.status === "paid"
                        ? "bg-green-600/10 text-green-700"
                        : "bg-gold/20 text-ink"
                    }`}
                  >
                    {inv.status === "paid" ? <Check size={11} /> : null}
                    {inv.status === "paid" ? "Paid" : "Due"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-ink/50 hover:text-navy">
                    <Download size={13} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* confirm plan change */}
      <PlanConfirmModal
        tier={confirmPlan}
        onClose={() => setConfirmPlan(null)}
        onConfirm={(t) => {
          setPlan(t);
          setConfirmPlan(null);
        }}
      />

      {/* update card */}
      <CardModal open={cardModal} onClose={() => setCardModal(false)} />
    </div>
  );
}

function PlanConfirmModal({
  tier,
  onClose,
  onConfirm,
}: {
  tier: PlanTier | null;
  onClose: () => void;
  onConfirm: (t: PlanTier) => void;
}) {
  const [stage, setStage] = useState<"confirm" | "done">("confirm");
  if (!tier) return null;
  const def = planDef(tier);
  const close = () => {
    setStage("confirm");
    onClose();
  };
  return (
    <Modal open={!!tier} onClose={close} title={stage === "done" ? "Plan updated" : `Switch to ${def.name}`}>
      {stage === "done" ? (
        <div className="py-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
            <Check size={28} />
          </div>
          <p className="mt-4 font-semibold text-navy">You&apos;re on the {def.name} plan</p>
          <button
            onClick={close}
            className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between rounded-xl bg-cream/60 p-4">
            <p className="font-semibold text-navy">{def.name} plan</p>
            <p className="text-navy">
              <span className="display text-2xl">{formatMoney(def.price)}</span>
              {def.price > 0 && <span className="text-sm text-ink/55"> / mo</span>}
            </p>
          </div>
          <p className="text-sm text-ink/60">
            {def.price > 0
              ? "Your card on file will be billed on the next cycle. Change or cancel anytime."
              : "You'll keep access to paid features until your current period ends."}
          </p>
          <button
            onClick={() => {
              onConfirm(tier);
              setStage("done");
            }}
            className="w-full rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            Confirm {def.name}
          </button>
        </div>
      )}
    </Modal>
  );
}

function CardModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [num, setNum] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12 / 28");
  const save = () => {
    const digits = num.replace(/\D/g, "");
    updatePaymentCard({ brand: "Visa", last4: digits.slice(-4) || "4242", exp });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Update payment method" subtitle="Demo — no real card is stored.">
      <div className="space-y-4">
        <label className="block">
          <span className="eyebrow text-ink/50">Card number</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ink/15 px-3 py-2 focus-within:border-navy">
            <Lock size={14} className="text-ink/40" />
            <input
              value={num}
              onChange={(e) => setNum(e.target.value)}
              inputMode="numeric"
              className="w-full text-sm outline-none"
            />
          </div>
        </label>
        <label className="block w-1/2">
          <span className="eyebrow text-ink/50">Expiry</span>
          <input
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </label>
        <button
          onClick={save}
          className="w-full rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Save card
        </button>
      </div>
    </Modal>
  );
}
