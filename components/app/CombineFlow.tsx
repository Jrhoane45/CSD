"use client";

import { useEffect, useState } from "react";
import {
  Video,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera,
  Cpu,
  ScanLine,
} from "lucide-react";
import type { Sport } from "@/lib/types";
import {
  computePiq,
  BASKETBALL_DRILLS,
  POSITIONS_BY_SPORT,
  type PiqResult,
} from "@/lib/prospectiq";
import { SPORTS_LIST } from "@/lib/data/listings";
import { useProfile } from "@/lib/useProfile";
import { useProspectIQ } from "@/lib/useProspectIQ";
import { usePiqHistory } from "@/lib/usePiqHistory";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScoutingReport } from "@/components/app/ScoutingReport";
import { PiqProgress } from "@/components/app/PiqProgress";

type Stage = "intro" | "capture" | "analyzing" | "report";

const GENERIC_DRILLS = [
  { id: "skill", name: "Skills drill", pillar: "Technical", tip: "Side angle, full body, ~30s" },
  { id: "speed", name: "Speed & agility", pillar: "Athleticism", tip: "Mark a lane, film straight on" },
  { id: "comp", name: "Competitive rep", pillar: "Compete", tip: "A live or contested rep" },
  { id: "game", name: "Game footage (optional)", pillar: "Game IQ", tip: "A recent full-speed clip" },
] as const;

const ANALYZE_STEPS = [
  { icon: ScanLine, label: "Detecting pose & body landmarks" },
  { icon: Camera, label: "Tracking ball & movement" },
  { icon: Cpu, label: "Scoring mechanics against the expert rubric" },
  { icon: Sparkles, label: "Normalizing to national cohort" },
  { icon: Check, label: "Generating your Scouting Report" },
];

export function CombineFlow() {
  const { profile } = useProfile();
  const { save } = useProspectIQ();
  const { history, add: addHistory } = usePiqHistory();

  const [stage, setStage] = useState<Stage>("intro");
  const [sport, setSport] = useState<Sport>("Basketball");
  const [position, setPosition] = useState("Guard");
  const [age, setAge] = useState<string>("");
  const [captured, setCaptured] = useState<Set<string>>(new Set());
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [result, setResult] = useState<PiqResult | null>(null);
  const [locked, setLocked] = useState(true);

  // Prefill from the athlete profile if present.
  useEffect(() => {
    if (!profile) return;
    if (profile.sport) {
      setSport(profile.sport);
      setPosition(POSITIONS_BY_SPORT[profile.sport]?.[0] ?? "Guard");
    }
    if (profile.age) setAge(String(profile.age));
  }, [profile]);

  const drills = sport === "Basketball" ? BASKETBALL_DRILLS : GENERIC_DRILLS;
  const positions = POSITIONS_BY_SPORT[sport] ?? ["General"];

  const toggle = (id: string) =>
    setCaptured((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const runAnalysis = () => {
    setStage("analyzing");
    setAnalyzeStep(0);
    const seed =
      profile?.firstName || profile?.lastName
        ? `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()
        : `guest-${sport}-${position}`;
    const r = computePiq({
      sport,
      position,
      age: age ? Number(age) : 13,
      level: profile?.level ?? "",
      seed,
      drillsCaptured: captured.size,
    });
    setResult(r);
    save(r);
    addHistory(r);
  };

  // advance the analyzing animation, then reveal the report
  useEffect(() => {
    if (stage !== "analyzing") return;
    if (analyzeStep < ANALYZE_STEPS.length) {
      const t = setTimeout(() => setAnalyzeStep((s) => s + 1), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLocked(true);
      setStage("report");
    }, 500);
    return () => clearTimeout(t);
  }, [stage, analyzeStep]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/[0.1] px-4 py-1.5 text-xs font-medium text-ink/70">
        <Sparkles size={14} className="text-gold" />
        <span>
          <span className="font-semibold text-navy">Prospect IQ™</span> — premium AI scout. Basketball is
          the launch sport; other sports are in beta.
        </span>
      </div>

      {/* INTRO */}
      {stage === "intro" && (
        <div className="mt-6 rounded-3xl border border-ink/10 bg-white p-8">
          <Eyebrow>The CSD Combine™</Eyebrow>
          <h1 className="display mt-3 text-4xl text-navy">EVALUATE YOUR GAME</h1>
          <p className="mt-2 max-w-xl text-ink/65">
            Record a short, guided set of drills and our engine returns a structured talent
            evaluation — five pillars, a national-cohort tier, and a development pathway.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <Field label="Sport">
              <select
                value={sport}
                onChange={(e) => {
                  const s = e.target.value as Sport;
                  setSport(s);
                  setPosition(POSITIONS_BY_SPORT[s]?.[0] ?? "General");
                }}
                className={selectCls}
              >
                {SPORTS_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Position">
              <select value={position} onChange={(e) => setPosition(e.target.value)} className={selectCls}>
                {positions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Age">
              <input
                type="number"
                min={8}
                max={17}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="13"
                className={selectCls}
              />
            </Field>
          </div>
          <button
            onClick={() => setStage("capture")}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            {history.length > 0 ? "Re-evaluate" : "Start the Combine"} <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* progress over time — appears once there's history */}
      {stage === "intro" && history.length > 0 && (
        <div className="mt-6">
          <PiqProgress history={history} />
        </div>
      )}

      {/* CAPTURE */}
      {stage === "capture" && (
        <div className="mt-6 rounded-3xl border border-ink/10 bg-white p-8">
          <Eyebrow>Capture · {sport} · {position}</Eyebrow>
          <h2 className="display mt-3 text-3xl text-navy">RECORD YOUR DRILLS</h2>
          <p className="mt-2 text-sm text-ink/60">
            Follow each prompt for the cleanest footage — the better the capture, the higher your
            confidence rating. Tap to add each clip.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {drills.map((d) => {
              const done = captured.has(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => toggle(d.id)}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                    done ? "border-navy bg-navy/[0.05]" : "border-ink/15 hover:border-navy/40"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      done ? "bg-navy text-white" : "bg-cream text-navy"
                    }`}
                  >
                    {done ? <Check size={18} /> : <Video size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{d.name}</p>
                    <p className="text-xs text-ink/55">{d.tip}</p>
                    <span className="mt-1 inline-block rounded-full bg-gold/15 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-ink/60">
                      {d.pillar}
                    </span>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-ink/45">
                    {done ? "Captured" : "Add clip"}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-7 flex items-center justify-between">
            <button onClick={() => setStage("intro")} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55">
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-ink/55">{captured.size} of {drills.length} captured</span>
              <button
                onClick={runAnalysis}
                disabled={captured.size === 0}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-40"
              >
                Analyze <Sparkles size={16} />
              </button>
            </div>
          </div>
          <p className="mt-2 text-right text-xs text-ink/40">Demo: clips are simulated for the evaluation.</p>
        </div>
      )}

      {/* ANALYZING */}
      {stage === "analyzing" && (
        <div className="mt-6 rounded-3xl border border-ink/10 bg-navy p-10 text-white">
          <Eyebrow tone="light">Analyzing</Eyebrow>
          <h2 className="display mt-3 text-3xl text-white">RUNNING THE EVALUATION…</h2>
          <div className="mt-7 space-y-3">
            {ANALYZE_STEPS.map((s, i) => {
              const done = i < analyzeStep;
              const active = i === analyzeStep;
              return (
                <div
                  key={s.label}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all ${
                    done
                      ? "border-white/10 bg-white/[0.04] text-cream/70"
                      : active
                        ? "border-gold/40 bg-gold/[0.08] text-white"
                        : "border-white/5 text-cream/35"
                  }`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${done ? "bg-gold text-ink" : "bg-white/10"}`}>
                    {done ? <Check size={17} /> : <s.icon size={17} />}
                  </div>
                  <span className="text-sm font-medium">{s.label}</span>
                  {active && <span className="ml-auto text-xs text-gold-300">working…</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REPORT */}
      {stage === "report" && result && (
        <div className="mt-6">
          <ScoutingReport
            result={result}
            profile={profile}
            locked={locked}
            onUnlock={() => setLocked(false)}
            onVerify={() => {
              const v = { ...result, verified: true, confidence: Math.min(99, result.confidence + 8) };
              setResult(v);
              save(v);
            }}
            onReevaluate={() => {
              setCaptured(new Set());
              setResult(null);
              setLocked(true);
              setStage("capture");
            }}
          />
        </div>
      )}
    </div>
  );
}

const selectCls =
  "w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow text-ink/50">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
