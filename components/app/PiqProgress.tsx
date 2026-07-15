"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Minus, ScanLine } from "lucide-react";
import type { PiqResult } from "@/lib/prospectiq";
import { PILLAR_NAME } from "@/lib/prospectiq";

const NAVY = "#14264f";
const GOLD = "#f5a800";

function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Prospect IQ progress over time — a composite trend across re-evaluations plus
 * per-pillar movement from first to latest. Makes improvement visible.
 */
export function PiqProgress({ history, compact = false }: { history: PiqResult[]; compact?: boolean }) {
  const first = history[0];
  const latest = history[history.length - 1];
  const compositeDelta = latest.composite - first.composite;
  const pctDelta = latest.percentile - first.percentile;

  const data = history.map((h, i) => ({
    i: history.length > 1 ? shortDate(h.createdAt) : "Eval",
    composite: h.composite,
    percentile: h.percentile,
    label: `Eval ${i + 1}`,
  }));

  const pillarKeys = ["T", "A", "G", "C", "E"] as const;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScanLine size={18} className="text-navy" />
          <h3 className="font-semibold text-navy">Prospect IQ™ progress</h3>
        </div>
        <span className="text-xs text-ink/50">
          {history.length} evaluation{history.length === 1 ? "" : "s"} · {latest.sport}
        </span>
      </div>

      {/* headline deltas */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <DeltaStat label="PIQ composite" value={latest.composite} delta={compositeDelta} />
        <DeltaStat label="Percentile" value={latest.percentile} suffix="th" delta={pctDelta} />
        <div className="rounded-xl bg-cream/60 p-3 text-center">
          <p className="display text-2xl text-navy">{latest.tier}</p>
          <p className="eyebrow mt-1 text-[0.5rem] text-ink/50">Current tier</p>
        </div>
      </div>

      {history.length > 1 ? (
        <div className="mt-5 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e1d3" vertical={false} />
              <XAxis dataKey="i" stroke="#cfc8b8" tick={{ fill: "#6b6b6b", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#6b6b6b", fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="composite" stroke={NAVY} strokeWidth={2.5} dot={{ r: 3 }} name="PIQ" />
              <Line type="monotone" dataKey="percentile" stroke={GOLD} strokeWidth={2} dot={{ r: 3 }} name="Percentile" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-dashed border-ink/15 p-4 text-center text-sm text-ink/55">
          Re-evaluate after training to chart your progress over time.
        </p>
      )}

      {!compact && (
        <div className="mt-5">
          <p className="eyebrow text-ink/45">Pillar movement</p>
          <ul className="mt-2 space-y-1.5">
            {pillarKeys.map((k) => {
              const d = latest.pillars[k] - first.pillars[k];
              return (
                <li key={k} className="flex items-center gap-3 text-sm">
                  <span className="w-40 shrink-0 text-ink/65">{PILLAR_NAME[k]}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full bg-navy" style={{ width: `${latest.pillars[k]}%` }} />
                  </div>
                  <span className="w-14 shrink-0 text-right font-semibold text-navy">{latest.pillars[k]}</span>
                  <DeltaBadge delta={d} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function DeltaStat({
  label,
  value,
  delta,
  suffix = "",
}: {
  label: string;
  value: number;
  delta: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-cream/60 p-3 text-center">
      <p className="display text-2xl text-navy">
        {value}
        {suffix}
      </p>
      <p className="eyebrow mt-1 text-[0.5rem] text-ink/50">{label}</p>
      <div className="mt-1 flex justify-center">
        <DeltaBadge delta={delta} />
      </div>
    </div>
  );
}

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0)
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-ink/[0.06] px-1.5 py-0.5 text-[0.65rem] font-bold text-ink/50">
        <Minus size={10} /> 0
      </span>
    );
  const up = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold ${
        up ? "bg-green-600/10 text-green-700" : "bg-red/10 text-red"
      }`}
    >
      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {up ? "+" : ""}
      {delta}
    </span>
  );
}
