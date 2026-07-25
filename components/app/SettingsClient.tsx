"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Bell,
  CreditCard,
  Receipt,
  ShieldCheck,
  Check,
  Trash2,
  RefreshCw,
  Mail,
  Smartphone,
  LifeBuoy,
} from "lucide-react";
import { useProfile } from "@/lib/useProfile";
import { useRole } from "@/lib/useRole";
import { resetDemo } from "@/lib/store";
import { createPersistentStore } from "@/lib/persistentStore";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AthleteAvatar } from "@/components/app/AthleteAvatar";

const KEY = "csd-settings";

interface Settings {
  newMessages: boolean;
  bookingReminders: boolean;
  eventMatches: boolean;
  weeklyDigest: boolean;
  channelEmail: boolean;
  channelSms: boolean;
}

const DEFAULTS: Settings = {
  newMessages: true,
  bookingReminders: true,
  eventMatches: true,
  weeklyDigest: false,
  channelEmail: true,
  channelSms: false,
};

const settingsStore = createPersistentStore<Settings>(KEY, DEFAULTS, (stored) => ({
  ...DEFAULTS,
  ...stored,
}));

const PREFS: { key: keyof Settings; label: string; sub: string }[] = [
  { key: "newMessages", label: "New messages & leads", sub: "When a program or family messages you." },
  { key: "bookingReminders", label: "Booking reminders", sub: "Reminders before an upcoming session." },
  { key: "eventMatches", label: "Event & program matches", sub: "New tryouts, camps, and programs that fit." },
  { key: "weeklyDigest", label: "Weekly digest", sub: "A Monday summary of activity and matches." },
];

export function SettingsClient() {
  const { profile } = useProfile();
  const role = useRole();
  const { value: settings } = settingsStore.useValue();
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    settingsStore.update((prev) => ({ ...prev, ...patch }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const email = profile?.email || "you@example.com";
  const name =
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
    profile?.parentName ||
    "Your account";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Eyebrow>Account</Eyebrow>
      <div className="mt-2 flex items-center justify-between gap-3">
        <h1 className="display text-4xl text-navy">SETTINGS</h1>
        {saved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-700">
            <Check size={13} /> Saved
          </span>
        )}
      </div>

      {/* account */}
      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <div className="flex items-center gap-2">
          <UserRound size={18} className="text-navy" />
          <h2 className="font-semibold text-navy">Account</h2>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AthleteAvatar photo={profile?.photo} firstName={profile?.firstName} lastName={profile?.lastName} size={56} />
            <div>
              <p className="font-semibold text-navy">{name}</p>
              <p className="text-sm text-ink/55">{email}</p>
              <p className="mt-0.5 text-xs text-ink/45 capitalize">Signed in as {role}</p>
            </div>
          </div>
          <Link
            href="/app/profile/create"
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            Edit profile
          </Link>
        </div>
      </section>

      {/* notifications */}
      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-navy" />
          <h2 className="font-semibold text-navy">Notifications</h2>
        </div>
        <ul className="mt-4 divide-y divide-ink/[0.07]">
          {PREFS.map((p) => (
            <li key={p.key} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-semibold text-navy">{p.label}</p>
                <p className="text-xs text-ink/55">{p.sub}</p>
              </div>
              <Toggle on={settings[p.key]} onClick={() => update({ [p.key]: !settings[p.key] } as Partial<Settings>)} />
            </li>
          ))}
        </ul>

        <p className="eyebrow mt-5 text-ink/45">Delivery channels</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <ChannelChip
            icon={Mail}
            label="Email"
            on={settings.channelEmail}
            onClick={() => update({ channelEmail: !settings.channelEmail })}
          />
          <ChannelChip
            icon={Smartphone}
            label="SMS"
            on={settings.channelSms}
            onClick={() => update({ channelSms: !settings.channelSms })}
          />
        </div>
      </section>

      {/* billing shortcuts */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/app/orders"
          className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5 transition-colors hover:border-navy/30"
        >
          <span className="flex items-center gap-3">
            <Receipt size={18} className="text-navy" />
            <span>
              <span className="block text-sm font-semibold text-navy">Orders &amp; receipts</span>
              <span className="block text-xs text-ink/55">Sessions &amp; event registrations</span>
            </span>
          </span>
        </Link>
        <Link
          href="/app/provider/billing"
          className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5 transition-colors hover:border-navy/30"
        >
          <span className="flex items-center gap-3">
            <CreditCard size={18} className="text-navy" />
            <span>
              <span className="block text-sm font-semibold text-navy">Plan &amp; billing</span>
              <span className="block text-xs text-ink/55">For providers — subscription &amp; invoices</span>
            </span>
          </span>
        </Link>
        <Link
          href="/app/help"
          className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5 transition-colors hover:border-navy/30 sm:col-span-2"
        >
          <span className="flex items-center gap-3">
            <LifeBuoy size={18} className="text-navy" />
            <span>
              <span className="block text-sm font-semibold text-navy">Help &amp; support</span>
              <span className="block text-xs text-ink/55">FAQ and contact the team</span>
            </span>
          </span>
        </Link>
      </section>

      {/* privacy + demo controls */}
      <section className="mt-6 rounded-2xl border border-ink/10 bg-white p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-navy" />
          <h2 className="font-semibold text-navy">Privacy &amp; data</h2>
        </div>
        <p className="mt-2 text-sm text-ink/60">
          This is a demo — all data lives in your browser only. Nothing is sent to a server, and you can
          wipe it any time.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (confirm("Reset the demo? This clears your profile, saved items, and all activity.")) resetDemo();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red/40 px-4 py-2 text-sm font-semibold text-red hover:bg-red hover:text-white"
          >
            <RefreshCw size={14} /> Reset demo data
          </button>
          <button
            onClick={() => {
              if (confirm("Clear notification settings?")) {
                settingsStore.clear();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/60 hover:text-navy"
          >
            <Trash2 size={14} /> Reset preferences
          </button>
        </div>
      </section>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-navy" : "bg-ink/20"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          on ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function ChannelChip({
  icon: Icon,
  label,
  on,
  onClick,
}: {
  icon: typeof Mail;
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
        on ? "border-navy bg-navy text-white" : "border-ink/15 text-ink/55 hover:text-navy"
      }`}
    >
      <Icon size={14} /> {label}
      {on && <Check size={13} />}
    </button>
  );
}
