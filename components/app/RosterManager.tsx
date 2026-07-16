"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Plus,
  Trash2,
  DownloadCloud,
  Crown,
  UserRound,
  Check,
} from "lucide-react";
import type { DevLevel } from "@/lib/types";
import {
  useStore,
  createTeam,
  removeTeam,
  addRosterMember,
  assignMember,
  removeRosterMember,
  importProspects,
} from "@/lib/store";
import { Eyebrow } from "@/components/ui/Eyebrow";

const LISTING_ID = "hoop-prodigy";
const LEVELS: DevLevel[] = ["Recreational", "Intermediate", "Competitive", "Elite"];

export function RosterManager() {
  const { teams, roster } = useStore();
  const [imported, setImported] = useState<number | null>(null);

  const prospects = useMemo(() => roster.filter((m) => m.teamId === null), [roster]);
  const membersByTeam = useMemo(() => {
    const map: Record<string, typeof roster> = {};
    for (const t of teams) map[t.id] = roster.filter((m) => m.teamId === t.id);
    return map;
  }, [teams, roster]);

  const doImport = () => {
    const n = importProspects(LISTING_ID);
    setImported(n);
    setTimeout(() => setImported(null), 2600);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/app/provider"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-navy"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-navy" />
            <Eyebrow>Teams &amp; roster</Eyebrow>
          </div>
          <h1 className="display mt-2 text-4xl text-navy">MANAGE YOUR ROSTER</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1.5 text-sm font-semibold text-ink">
          <Crown size={15} /> Elite feature
        </span>
      </div>

      {/* summary + import */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-5">
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="inline-flex items-center gap-1.5 text-ink/65">
            <Users size={15} className="text-navy" /> {teams.length} teams
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink/65">
            <UserRound size={15} className="text-navy" /> {roster.filter((m) => m.status === "active").length} rostered
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink/65">
            <UserPlus size={15} className="text-navy" /> {prospects.length} prospects
          </span>
        </div>
        <button
          onClick={doImport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
        >
          {imported !== null ? (
            <>
              <Check size={15} /> {imported > 0 ? `Imported ${imported}` : "All up to date"}
            </>
          ) : (
            <>
              <DownloadCloud size={15} /> Import from bookings &amp; events
            </>
          )}
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* teams */}
        <div className="space-y-5">
          {teams.map((t) => (
            <div key={t.id} className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-navy">{t.name}</h3>
                  <span className="rounded-full bg-navy/[0.07] px-2.5 py-0.5 text-xs font-semibold text-navy">
                    {t.level}
                  </span>
                  <span className="text-xs text-ink/45">{membersByTeam[t.id]?.length ?? 0} players</span>
                </div>
                <button
                  onClick={() => removeTeam(t.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ink/45 hover:text-red"
                >
                  <Trash2 size={13} /> Delete team
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {(membersByTeam[t.id]?.length ?? 0) === 0 ? (
                  <p className="rounded-xl border border-dashed border-ink/15 p-4 text-center text-sm text-ink/45">
                    No players yet — assign prospects from the pool.
                  </p>
                ) : (
                  membersByTeam[t.id].map((m) => (
                    <MemberRow key={m.id} member={m} teamId={t.id} />
                  ))
                )}
              </div>
            </div>
          ))}

          <AddTeamCard />
        </div>

        {/* prospect pool */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-gold/40 bg-gold/[0.06] p-6">
            <div className="flex items-center gap-2">
              <UserPlus size={18} className="text-navy" />
              <h3 className="font-semibold text-navy">Prospect pool</h3>
            </div>
            <p className="mt-1 text-xs text-ink/55">Unassigned athletes — assign them to a team.</p>
            <div className="mt-4 space-y-2">
              {prospects.length === 0 ? (
                <p className="rounded-xl border border-dashed border-ink/20 p-4 text-center text-sm text-ink/45">
                  No prospects. Import from bookings &amp; events, or add one below.
                </p>
              ) : (
                prospects.map((m) => <MemberRow key={m.id} member={m} teamId={null} />)
              )}
            </div>
            <AddProspect />
          </div>
        </aside>
      </div>
    </div>
  );
}

function MemberRow({
  member,
  teamId,
}: {
  member: { id: string; name: string; parent: string; teamId: string | null };
  teamId: string | null;
}) {
  const { teams } = useStore();
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-ink/10 bg-white p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-navy">{member.name}</p>
        <p className="truncate text-xs text-ink/50">{member.parent}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <select
          value={teamId ?? ""}
          onChange={(e) => assignMember(member.id, e.target.value || null)}
          className="rounded-lg border border-ink/15 px-2 py-1 text-xs font-medium text-navy outline-none focus:border-navy"
        >
          <option value="">Prospect</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => removeRosterMember(member.id)}
          aria-label="Remove"
          className="rounded-lg p-1.5 text-ink/40 hover:text-red"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function AddTeamCard() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<DevLevel>("Competitive");

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-navy/30 p-4 text-sm font-semibold text-navy hover:bg-navy/[0.03]"
      >
        <Plus size={16} /> Add a team
      </button>
    );

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="font-semibold text-navy">New team</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team name (e.g. HP Select 12U)"
          className="min-w-0 flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as DevLevel)}
          className="rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
        >
          {LEVELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => {
            if (!name.trim()) return;
            createTeam(name.trim(), level);
            setName("");
            setOpen(false);
          }}
          disabled={!name.trim()}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
        >
          Create team
        </button>
        <button onClick={() => setOpen(false)} className="text-sm font-semibold text-ink/50 hover:text-navy">
          Cancel
        </button>
      </div>
    </div>
  );
}

function AddProspect() {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  return (
    <div className="mt-4 border-t border-gold/30 pt-4">
      <p className="eyebrow text-ink/45">Add a prospect</p>
      <div className="mt-2 space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Athlete (e.g. Kai, 14 · Competitive)"
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
        />
        <input
          value={parent}
          onChange={(e) => setParent(e.target.value)}
          placeholder="Parent / contact"
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
        />
        <button
          onClick={() => {
            if (!name.trim()) return;
            addRosterMember(name.trim(), parent.trim() || "—", null);
            setName("");
            setParent("");
          }}
          disabled={!name.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
        >
          <UserPlus size={14} /> Add prospect
        </button>
      </div>
    </div>
  );
}
