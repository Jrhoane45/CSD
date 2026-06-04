"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  UserPlus,
  Upload,
  X,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { AthleteProfile, Category, DevLevel, ProfileVideo, Sport } from "@/lib/types";
import { MediaUploader } from "@/components/app/MediaUploader";
import { zipToCounty, HEIGHT_OPTIONS } from "@/lib/location";
import { PRICE_LABEL } from "@/lib/scoring";
import { useProfile } from "@/lib/useProfile";
import { SPORTS_LIST, GOALS_LIST, CATEGORY_LABEL } from "@/lib/data/listings";
import { AthleteAvatar } from "@/components/app/AthleteAvatar";

const STEPS = ["Account", "Athlete", "Stats", "Criteria", "Media", "Review"];
const LEVELS: DevLevel[] = ["Recreational", "Intermediate", "Competitive", "Elite"];
const input =
  "w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy";

interface Draft {
  parentName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: "" | "Male" | "Female" | "Other";
  school: string;
  gradYear: string;
  photo: string;
  heightIn: string;
  weightLb: string;
  sport: string;
  level: string;
  zip: string;
  maxMiles: number;
  priceMax: 0 | 1 | 2 | 3;
  category: Category | "any";
  goals: string[];
  photos: string[];
  videos: ProfileVideo[];
}

const EMPTY: Draft = {
  parentName: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  school: "",
  gradYear: "",
  photo: "",
  heightIn: "",
  weightLb: "",
  sport: "",
  level: "",
  zip: "",
  maxMiles: 25,
  priceMax: 0,
  category: "any",
  goals: [],
  photos: [],
  videos: [],
};

export function OnboardingFlow({ initial }: { initial?: AthleteProfile | null }) {
  const router = useRouter();
  const { save } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>(() =>
    initial
      ? {
          ...EMPTY,
          parentName: initial.parentName ?? "",
          email: initial.email ?? "",
          password: "demo",
          firstName: initial.firstName ?? "",
          lastName: initial.lastName ?? "",
          age: initial.age?.toString() ?? "",
          gender: initial.gender ?? "",
          school: initial.school ?? "",
          gradYear: initial.gradYear ?? "",
          photo: initial.photo ?? "",
          heightIn: initial.heightIn?.toString() ?? "",
          weightLb: initial.weightLb?.toString() ?? "",
          sport: initial.sport ?? "",
          level: initial.level ?? "",
          zip: initial.zip ?? "",
          maxMiles: initial.maxMiles ?? 25,
          priceMax: initial.priceMax ?? 0,
          category: initial.category ?? "any",
          goals: initial.goals ?? [],
          photos: initial.photos ?? [],
          videos: initial.videos ?? [],
        }
      : EMPTY,
  );

  const set = (patch: Partial<Draft>) => setD((p) => ({ ...p, ...patch }));
  const county = useMemo(() => zipToCounty(d.zip), [d.zip]);

  const toggleGoal = (g: string) =>
    set({ goals: d.goals.includes(g) ? d.goals.filter((x) => x !== g) : [...d.goals, g] });

  const onPhoto = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const S = 256;
        const canvas = document.createElement("canvas");
        canvas.width = S;
        canvas.height = S;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const scale = Math.max(S / img.width, S / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
        set({ photo: canvas.toDataURL("image/jpeg", 0.85) });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const canNext =
    (step === 0 && d.parentName && d.email && d.password) ||
    (step === 1 && d.firstName && d.age) ||
    (step === 2 && d.sport && d.level) ||
    (step === 3 && !!county) ||
    step === 4;

  const submit = () => {
    const profile: AthleteProfile = {
      parentName: d.parentName,
      email: d.email,
      firstName: d.firstName,
      lastName: d.lastName,
      photo: d.photo || undefined,
      gender: d.gender,
      school: d.school,
      gradYear: d.gradYear,
      heightIn: d.heightIn ? Number(d.heightIn) : null,
      weightLb: d.weightLb ? Number(d.weightLb) : null,
      sport: d.sport as Sport,
      age: d.age ? Number(d.age) : null,
      level: d.level as DevLevel,
      zip: d.zip,
      county: county ?? "Los Angeles",
      maxMiles: d.maxMiles,
      priceMax: d.priceMax,
      category: d.category,
      goals: d.goals,
      photos: d.photos,
      videos: d.videos,
    };
    save(profile);
    router.push("/app/profile");
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center gap-2 text-navy">
        <UserPlus size={20} />
        <h1 className="display text-3xl">{initial ? "EDIT PROFILE" : "CREATE YOUR PROFILE"}</h1>
      </div>
      <p className="mt-1 text-sm text-ink/55">
        Free for parents &amp; athletes. We use this to match your athlete on substance and fit.
      </p>

      {/* progress */}
      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col gap-1.5">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-navy" : "bg-ink/15"}`} />
            <span className={`text-xs font-medium ${i === step ? "text-navy" : "text-ink/40"}`}>{s}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-7 sm:p-9">
        {/* STEP 0 — Account */}
        {step === 0 && (
          <Section title="Create your account" subtitle="The parent or guardian sets up the account.">
            <Field label="Parent / guardian name">
              <input className={input} value={d.parentName} onChange={(e) => set({ parentName: e.target.value })} placeholder="Jordan Smith" />
            </Field>
            <Field label="Email">
              <input className={input} type="email" value={d.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@email.com" />
            </Field>
            <Field label="Password">
              <input className={input} type="password" value={d.password} onChange={(e) => set({ password: e.target.value })} placeholder="••••••••" />
            </Field>
            <p className="flex items-center gap-1.5 text-xs text-ink/45">
              <ShieldCheck size={14} className="text-navy" /> Demo only — no real account is created.
            </p>
          </Section>
        )}

        {/* STEP 1 — Athlete identity */}
        {step === 1 && (
          <Section title="Who's the athlete?" subtitle="Add a photo and the basics.">
            <div className="flex items-center gap-4">
              <AthleteAvatar photo={d.photo} firstName={d.firstName} lastName={d.lastName} size={72} />
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
                <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white">
                  <Upload size={15} /> {d.photo ? "Change photo" : "Upload photo"}
                </button>
                {d.photo && (
                  <button onClick={() => set({ photo: "" })} className="ml-2 inline-flex items-center gap-1 text-sm text-red">
                    <X size={14} /> Remove
                  </button>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input className={input} value={d.firstName} onChange={(e) => set({ firstName: e.target.value })} placeholder="Alex" />
              </Field>
              <Field label="Last name">
                <input className={input} value={d.lastName} onChange={(e) => set({ lastName: e.target.value })} placeholder="Smith" />
              </Field>
              <Field label="Age">
                <input className={input} type="number" min={5} max={18} value={d.age} onChange={(e) => set({ age: e.target.value })} placeholder="14" />
              </Field>
              <Field label="Gender">
                <select className={input} value={d.gender} onChange={(e) => set({ gender: e.target.value as Draft["gender"] })}>
                  <option value="">Select…</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="School">
                <input className={input} value={d.school} onChange={(e) => set({ school: e.target.value })} placeholder="Santa Monica HS" />
              </Field>
              <Field label="Graduation year">
                <select className={input} value={d.gradYear} onChange={(e) => set({ gradYear: e.target.value })}>
                  <option value="">Select…</option>
                  {Array.from({ length: 12 }, (_, i) => 2026 + i).map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>
        )}

        {/* STEP 2 — Stats & sport */}
        {step === 2 && (
          <Section title="Stats & sport" subtitle="Physical stats and the sport your athlete plays.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Height">
                <select className={input} value={d.heightIn} onChange={(e) => set({ heightIn: e.target.value })}>
                  <option value="">Select…</option>
                  {HEIGHT_OPTIONS.map((h) => (
                    <option key={h.value} value={h.value}>{h.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Weight (lbs)">
                <input className={input} type="number" min={40} max={350} value={d.weightLb} onChange={(e) => set({ weightLb: e.target.value })} placeholder="150" />
              </Field>
            </div>
            <Field label="Primary sport">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {SPORTS_LIST.map((s) => (
                  <Chip key={s} selected={d.sport === s} onClick={() => set({ sport: s })}>{s}</Chip>
                ))}
              </div>
            </Field>
            <Field label="Current development level">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {LEVELS.map((l) => (
                  <Chip key={l} selected={d.level === l} onClick={() => set({ level: l })}>{l}</Chip>
                ))}
              </div>
            </Field>
          </Section>
        )}

        {/* STEP 3 — Criteria */}
        {step === 3 && (
          <Section title="Matching criteria" subtitle="These base criteria drive the matching engine.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ZIP code">
                <input className={input} value={d.zip} onChange={(e) => set({ zip: e.target.value.replace(/\D/g, "").slice(0, 5) })} placeholder="90405" inputMode="numeric" />
                {d.zip.length === 5 && (
                  <p className={`mt-1.5 flex items-center gap-1 text-xs ${county ? "text-navy" : "text-red"}`}>
                    <MapPin size={12} /> {county ? `${county} County` : "Not a recognized SoCal ZIP"}
                  </p>
                )}
              </Field>
              <Field label={`Willing to travel · ${d.maxMiles} mi`}>
                <input type="range" min={5} max={60} step={5} value={d.maxMiles} onChange={(e) => set({ maxMiles: Number(e.target.value) })} className="mt-3 w-full accent-navy" />
              </Field>
            </div>
            <Field label="Budget / price range">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {([0, 1, 2, 3] as const).map((p) => (
                  <Chip key={p} selected={d.priceMax === p} onClick={() => set({ priceMax: p })}>{PRICE_LABEL[p]}</Chip>
                ))}
              </div>
            </Field>
            <Field label="Looking for">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {(["any", "club", "trainer", "consultant"] as const).map((c) => (
                  <Chip key={c} selected={d.category === c} onClick={() => set({ category: c })}>
                    {c === "any" ? "Any" : CATEGORY_LABEL[c].split(" ")[0]}
                  </Chip>
                ))}
              </div>
            </Field>
            <Field label="Goals">
              <div className="flex flex-wrap gap-2">
                {GOALS_LIST.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleGoal(g)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      d.goals.includes(g) ? "border-navy bg-navy text-white" : "border-ink/15 text-ink/70 hover:border-navy/40"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Field>
          </Section>
        )}

        {/* STEP 4 — Media */}
        {step === 4 && (
          <Section title="Photos & video" subtitle="Add up to 6 photos and 2 highlight videos (optional).">
            <MediaUploader
              photos={d.photos}
              videos={d.videos}
              onPhotos={(photos) => set({ photos })}
              onVideos={(videos) => set({ videos })}
            />
          </Section>
        )}

        {/* STEP 5 — Review */}
        {step === 5 && (
          <Section title="Review your profile" subtitle="Confirm and create. You can edit anything later.">
            <div className="flex items-center gap-4 rounded-2xl bg-cream/60 p-4">
              <AthleteAvatar photo={d.photo} firstName={d.firstName} lastName={d.lastName} size={64} />
              <div>
                <p className="text-lg font-bold text-navy">{d.firstName} {d.lastName}</p>
                <p className="text-sm text-ink/60">{d.sport || "—"} · {d.level || "—"} · Age {d.age || "—"}</p>
              </div>
            </div>
            <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              <Review label="School" value={d.school} />
              <Review label="Grad year" value={d.gradYear} />
              <Review label="Height" value={d.heightIn ? HEIGHT_OPTIONS.find((h) => h.value === Number(d.heightIn))?.label : ""} />
              <Review label="Weight" value={d.weightLb ? `${d.weightLb} lbs` : ""} />
              <Review label="Location" value={county ? `${d.zip} · ${county} Co.` : d.zip} />
              <Review label="Travel" value={`${d.maxMiles} mi`} />
              <Review label="Budget" value={PRICE_LABEL[d.priceMax]} />
              <Review label="Looking for" value={d.category === "any" ? "Any" : CATEGORY_LABEL[d.category]} />
              <Review label="Goals" value={d.goals.join(", ")} />
              <Review label="Media" value={`${d.photos.length} photos · ${d.videos.length} videos`} />
            </dl>
          </Section>
        )}

        {/* nav */}
        <div className="mt-8 flex items-center justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 disabled:opacity-0">
            <ArrowLeft size={16} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext} className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-deep disabled:opacity-40">
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={submit} className="inline-flex items-center gap-1.5 rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600">
              <Check size={16} /> {initial ? "Save profile" : "Create profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy">{title}</h2>
      <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow text-ink/50">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
        selected ? "border-navy bg-navy text-white" : "border-ink/15 text-navy hover:border-navy/40"
      }`}
    >
      {children}
    </button>
  );
}

function Review({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between border-b border-ink/5 py-1.5 text-sm">
      <dt className="text-ink/55">{label}</dt>
      <dd className="font-medium text-navy">{value || "—"}</dd>
    </div>
  );
}
