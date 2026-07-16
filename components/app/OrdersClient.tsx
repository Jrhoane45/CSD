"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Receipt, CalendarCheck, Ticket, DollarSign, Download, ArrowRight, Compass } from "lucide-react";
import { useStore, formatEventDate } from "@/lib/store";
import { formatMoney } from "@/lib/scheduling";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface OrderRow {
  id: string;
  kind: "session" | "event";
  title: string;
  provider: string;
  date: string; // ISO for sorting
  when: string; // display
  amount: number;
  status: string;
}

function parsePrice(label: string): number {
  if (!label || /free/i.test(label)) return 0;
  const m = label.replace(/,/g, "").match(/\d+/);
  return m ? Number(m[0]) : 0;
}

export function OrdersClient() {
  const { bookings, events } = useStore();

  const orders = useMemo<OrderRow[]>(() => {
    const rows: OrderRow[] = [];
    for (const b of bookings) {
      if (b.parentName !== "You") continue;
      rows.push({
        id: b.id,
        kind: "session",
        title: b.sessionTypeName,
        provider: b.listingName,
        date: b.createdAt,
        when: `${formatEventDate(b.date)} · ${b.time}`,
        amount: b.price,
        status: b.status === "canceled" ? "Refunded" : "Paid",
      });
    }
    for (const e of events) {
      if (!e.registered) continue;
      rows.push({
        id: `evt-${e.id}`,
        kind: "event",
        title: e.title,
        provider: e.listingName,
        date: e.createdAt,
        when: formatEventDate(e.date),
        amount: parsePrice(e.priceLabel),
        status: "Registered",
      });
    }
    return rows.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [bookings, events]);

  const total = orders
    .filter((o) => o.status !== "Refunded")
    .reduce((s, o) => s + o.amount, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Eyebrow>Orders &amp; receipts</Eyebrow>
      <h1 className="display mt-2 text-4xl text-navy">YOUR PURCHASES</h1>
      <p className="mt-1 text-ink/60">Booked sessions and event registrations, all in one place.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat icon={CalendarCheck} n={String(orders.filter((o) => o.kind === "session").length)} label="Sessions" />
        <Stat icon={Ticket} n={String(orders.filter((o) => o.kind === "event").length)} label="Event registrations" />
        <Stat icon={DollarSign} n={formatMoney(total)} label="Total spent" />
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/20 p-10 text-center">
          <Receipt size={28} className="mx-auto text-ink/30" />
          <p className="mt-3 font-semibold text-navy">No purchases yet</p>
          <p className="mt-1 text-sm text-ink/55">Book a session or register for an event to see receipts here.</p>
          <Link
            href="/app/discover"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
          >
            <Compass size={15} /> Explore programs <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-ink/50">
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">When</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/[0.06] last:border-0">
                  <td className="px-5 py-3">
                    <p className="flex items-center gap-1.5 font-semibold text-navy">
                      {o.kind === "session" ? (
                        <CalendarCheck size={13} className="text-gold" />
                      ) : (
                        <Ticket size={13} className="text-gold" />
                      )}
                      {o.title}
                    </p>
                    <p className="text-xs text-ink/55">{o.provider}</p>
                  </td>
                  <td className="hidden whitespace-nowrap px-5 py-3 text-ink/60 sm:table-cell">{o.when}</td>
                  <td className="px-5 py-3 text-right font-semibold text-navy">{formatMoney(o.amount)}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        o.status === "Refunded"
                          ? "bg-ink/[0.06] text-ink/50"
                          : "bg-green-600/10 text-green-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-ink/50 hover:text-navy">
                      <Download size={13} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-ink/45">
        Demo — no real payments are processed. Receipts and totals reflect your simulated activity this
        session.
      </p>
    </div>
  );
}

function Stat({ icon: Icon, n, label }: { icon: typeof Receipt; n: string; label: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <Icon size={20} className="text-navy" />
      <p className="display mt-3 text-3xl text-navy">{n}</p>
      <p className="eyebrow mt-1 text-ink/50">{label}</p>
    </div>
  );
}
