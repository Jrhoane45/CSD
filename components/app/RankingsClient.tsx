"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Trophy, ScanLine, ArrowRight, MapPin, ShieldCheck, Medal, Info } from "lucide-react";
import type { County, Sport } from "@/lib/types";
import { SPORTS_LIST } from "@/lib/data/listings";
import { useProfile } from "@/lib/useProfile";
import { useProspectIQ } from "@/lib/useProspectIQ";
import {
  rankedList,
  tierTone,
  AGE_BANDS,
  RANKING_COUNTIES,
  type AgeBand,
  type RankFilter,
  type RankedAthlete,
} from "@/lib/rankings";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function RankingsClient() {
  const { profile } = useProfile();
  const { result: piq } = useProspectIQ();

  const you: RankedAthlete | null = useMemo(() => {
    if (!piq) return null;
    const name =
      `${profile?.firstName ?? ""} ${profile?.lastName?.[0] ? profile.lastName[0] + "." : ""}`.trim() || "You";
    return {
      id: "you",
      name,
      sport: piq.sport,
      position: piq.position,
      age: piq.age,
      county: (profile?.county as County) || "Los Angeles",
      composite: piq.composite,
      percentile: piq.percentile,
      tier: piq.tier,
      verified: piq.verified,
      isYou: true,
    };
  }, [piq, profile]);

  const [sport, setSport] = useState<Sport>(piq?.sport || "Basketball");
  const [band, setBand] = useState<AgeBand>("all");
  const [county, setCounty] = useState<County | "all">("all");

  const filter: RankFilter = { sport, band, county };
  const list = useMemo(() => rankedList(filter, you), [sport, band, county, you]);
  const yourRow = list.find((r) => r.a.isYou);
  const podium = list.slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center gap-2">
        <Trophy size={20} className="text-gold" />
        <Eyebrow>Prospect IQ™ Rankings</Eyebrow>
      </div>
      <h1 className="display mt-2 text-4xl text-navy">SOCAL LEADERBOARD</h1>
      <p className="mt-1 max-w-2xl text-ink/60">
        How evaluated athletes stack up across Southern California, powered by the Prospect IQ engine.
        Filter by sport, age, and region.
      </p>

      {/* your standing */}
      {you ? (
        yourRow ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/50 bg-gold/[0.09] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-navy text-white">
                <span className="display text-2xl leading-none text-gold">#{yourRow.rank}</span>
              </div>
              <div>
                <p className="font-bold text-navy">Your ranking · {you.name}</p>
                <p className="text-sm text-ink/60">
                  {you.tier} · PIQ {you.composite} · {you.percentile}th percentile · {sport}
                </p>
              </div>
            </div>
            <Link href="/app/prospect-iq" className="text-sm font-semibold text-red hover:underline">
              Improve your score →
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-ink/10 bg-white p-4 text-sm text-ink/60">
            <Info size={15} className="text-navy" /> Your Prospect IQ is for {you.sport}. Switch the sport
            filter to {you.sport} to see your rank.
          </div>
        )
      ) : (
        <Link
          href="/app/prospect-iq"
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gold/[0.08] p-5 transition-colors hover:bg-gold/[0.14]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
              <ScanLine size={20} />
            </div>
            <div>
              <p className="font-bold text-navy">Get ranked</p>
              <p className="text-sm text-ink/60">Run a Prospect IQ evaluation to see where you land.</p>
            </div>
          </div>
          <ArrowRight size={18} className="shrink-0 text-navy" />
        </Link>
      )}

      {/* filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Select label="Sport" value={sport} onChange={(v) => setSport(v as Sport)}>
          {SPORTS_LIST.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select label="Age" value={band} onChange={(v) => setBand(v as AgeBand)}>
          {AGE_BANDS.map((b) => (
            <option key={b.key} value={b.key}>
              {b.label}
            </option>
          ))}
        </Select>
        <Select label="Region" value={county} onChange={(v) => setCounty(v as County | "all")}>
          <option value="all">All of SoCal</option>
          {RANKING_COUNTIES.map((c) => (
            <option key={c} value={c}>
              {c} County
            </option>
          ))}
        </Select>
      </div>

      {/* podium */}
      {podium.length === 3 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[podium[1], podium[0], podium[2]].map((r, i) => {
            const place = r.rank;
            const heights = ["pt-6", "pt-2", "pt-8"];
            const medals = ["text-ink/40", "text-gold", "text-[#c77b3a]"];
            return (
              <div key={r.a.id} className={`flex flex-col items-center ${heights[i]}`}>
                <Medal size={20} className={medals[place - 1] ?? "text-ink/40"} />
                <div
                  className={`mt-2 w-full rounded-2xl border p-4 text-center ${
                    r.a.isYou ? "border-gold bg-gold/[0.12]" : place === 1 ? "border-navy bg-navy text-white" : "border-ink/10 bg-white"
                  }`}
                >
                  <p className={`display text-2xl ${place === 1 && !r.a.isYou ? "text-gold" : "text-navy"}`}>
                    #{place}
                  </p>
                  <p className={`mt-1 truncate text-sm font-semibold ${place === 1 && !r.a.isYou ? "text-white" : "text-navy"}`}>
                    {r.a.name}
                  </p>
                  <p className={`text-xs ${place === 1 && !r.a.isYou ? "text-cream/70" : "text-ink/55"}`}>
                    PIQ {r.a.composite}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-ink/50">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Athlete</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Region</th>
              <th className="px-4 py-3 text-center font-medium">Tier</th>
              <th className="px-4 py-3 text-right font-medium">PIQ</th>
              <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">Pctl</th>
            </tr>
          </thead>
          <tbody>
            {list.slice(0, 50).map(({ rank, a }) => (
              <tr
                key={a.id}
                className={`border-b border-ink/[0.06] last:border-0 ${
                  a.isYou ? "bg-gold/[0.1]" : "hover:bg-cream/50"
                }`}
              >
                <td className="px-4 py-3">
                  <span className={`font-bold ${rank <= 3 ? "text-gold" : "text-ink/40"}`}>{rank}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="flex items-center gap-1.5 font-semibold text-navy">
                    {a.isYou ? "You" : a.name}
                    {a.verified && <ShieldCheck size={13} className="text-navy/50" />}
                  </p>
                  <p className="text-xs text-ink/50">
                    {a.position} · Age {a.age}
                  </p>
                </td>
                <td className="hidden px-4 py-3 text-ink/60 sm:table-cell">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} /> {a.county}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tierTone(a.tier)}`}>
                    {a.tier}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-navy">{a.composite}</td>
                <td className="hidden px-4 py-3 text-right text-ink/60 sm:table-cell">{a.percentile}th</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-ink/45">
        <Info size={13} /> Cohort is illustrative demo data generated by the Prospect IQ engine; your own
        result is slotted in live. Rankings are regional and update as athletes re-evaluate.
      </p>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="eyebrow text-ink/45">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-ink/15 px-3 py-2 text-sm font-medium text-navy outline-none focus:border-navy"
      >
        {children}
      </select>
    </label>
  );
}
