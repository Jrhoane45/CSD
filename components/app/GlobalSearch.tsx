"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  CornerDownLeft,
  Building2,
  Dumbbell,
  GraduationCap,
  CalendarDays,
  Compass,
  Target,
  ScanLine,
  Trophy,
  CalendarCheck,
  Inbox,
  Bookmark,
  Receipt,
  Settings,
  LifeBuoy,
  LayoutDashboard,
  CreditCard,
  Users,
  Megaphone,
  BarChart3,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { searchAll, PAGES, type SearchIcon, type SearchResult } from "@/lib/search";

const ICONS: Record<SearchIcon, typeof Search> = {
  club: Building2,
  trainer: Dumbbell,
  consultant: GraduationCap,
  event: CalendarDays,
  discover: Compass,
  match: Target,
  piq: ScanLine,
  rankings: Trophy,
  sessions: CalendarCheck,
  inbox: Inbox,
  saved: Bookmark,
  recruiting: GraduationCap,
  orders: Receipt,
  settings: Settings,
  help: LifeBuoy,
  provider: LayoutDashboard,
  billing: CreditCard,
  roster: Users,
  promote: Megaphone,
  analytics: BarChart3,
  operator: ShieldCheck,
};

const KIND_LABEL = { program: "Program", event: "Event", page: "Page" } as const;

export function GlobalSearch() {
  const { events, vetting } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { sections, flat } = useMemo(() => {
    if (!query.trim()) {
      const jump: SearchResult[] = PAGES.slice(0, 6).map((p) => ({
        kind: "page",
        id: p.href,
        title: p.title,
        subtitle: p.subtitle,
        href: p.href,
        icon: p.icon,
      }));
      return { sections: [{ label: "Jump to", items: jump }], flat: jump };
    }
    const r = searchAll(query, events, { vetting });
    const secs = [
      { label: "Programs", items: r.programs },
      { label: "Events", items: r.events },
      { label: "Pages", items: r.pages },
    ].filter((s) => s.items.length > 0);
    return { sections: secs, flat: secs.flatMap((s) => s.items) };
  }, [query, events, vetting]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (r: SearchResult | undefined) => {
      if (!r) return;
      close();
      router.push(r.href);
    },
    [close, router],
  );

  // Global shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
  }, [open]);

  const onModalKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(flat[active]);
    }
  };

  let runningIndex = -1;

  return (
    <>
      {/* trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="inline-flex items-center gap-2 rounded-lg border border-ink/15 bg-cream/60 px-2.5 py-2 text-sm text-ink/50 transition-colors hover:border-navy/30 hover:text-navy sm:px-3"
      >
        <Search size={16} />
        <span className="hidden lg:inline">Search…</span>
        <span className="hidden items-center gap-0.5 rounded border border-ink/15 bg-white px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink/45 lg:inline-flex">
          ⌘K
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/40 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={close}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[var(--shadow-lift)]"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onModalKey}
          >
            {/* input */}
            <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
              <Search size={18} className="text-ink/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programs, events, and pages…"
                className="w-full text-sm text-ink outline-none placeholder:text-ink/40"
              />
              <button onClick={close} aria-label="Close" className="rounded-md p-1 text-ink/40 hover:text-navy">
                <X size={16} />
              </button>
            </div>

            {/* results */}
            <div className="max-h-[52vh] overflow-y-auto py-2">
              {flat.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-ink/50">
                  No results for “{query}”. Try a program, sport, city, or page.
                </p>
              ) : (
                sections.map((sec) => (
                  <div key={sec.label} className="mb-1">
                    <p className="eyebrow px-4 py-1.5 text-ink/40">{sec.label}</p>
                    {sec.items.map((r) => {
                      runningIndex += 1;
                      const idx = runningIndex;
                      const Icon = ICONS[r.icon] ?? Search;
                      const isActive = idx === active;
                      return (
                        <button
                          key={`${r.kind}-${r.id}`}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => go(r)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            isActive ? "bg-navy/[0.06]" : "hover:bg-cream/50"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              isActive ? "bg-navy text-white" : "bg-cream text-navy"
                            }`}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-navy">{r.title}</span>
                            <span className="block truncate text-xs text-ink/55">{r.subtitle}</span>
                          </span>
                          <span className="shrink-0 rounded-full bg-ink/[0.06] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-ink/45">
                            {KIND_LABEL[r.kind]}
                          </span>
                          {isActive && <CornerDownLeft size={14} className="shrink-0 text-ink/35" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* footer hint */}
            <div className="flex items-center justify-between border-t border-ink/10 px-4 py-2 text-[0.7rem] text-ink/45">
              <span className="flex items-center gap-2">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> to navigate
                <Kbd>↵</Kbd> to open
                <Kbd>esc</Kbd> to close
              </span>
              <span className="hidden items-center gap-1 sm:inline-flex">
                Powered by CSD <ArrowRight size={11} />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-ink/15 bg-cream px-1.5 py-0.5 font-mono text-[0.6rem] text-ink/55">
      {children}
    </kbd>
  );
}
