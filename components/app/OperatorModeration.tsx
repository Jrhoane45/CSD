"use client";

import { useState } from "react";
import { Flag, Check, Trash2, MessageSquare, Building2, CalendarDays } from "lucide-react";
import type { ModerationItem } from "@/lib/types";
import { SEED_MODERATION } from "@/lib/data/activity";
import { useStore, resolveModeration } from "@/lib/store";
import { Eyebrow } from "@/components/ui/Eyebrow";

const TYPE_ICON: Record<ModerationItem["type"], typeof Flag> = {
  review: MessageSquare,
  listing: Building2,
  event: CalendarDays,
};

const RESOLUTION_LABEL = {
  dismissed: "Dismissed — content kept",
  removed: "Removed",
} as const;

export function OperatorModeration() {
  const { moderation } = useStore();
  const [showResolved, setShowResolved] = useState(false);

  const open = SEED_MODERATION.filter((i) => !moderation[i.id]);
  const resolved = SEED_MODERATION.filter((i) => moderation[i.id]);
  const list = showResolved ? resolved : open;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Eyebrow>CSD operator</Eyebrow>
      <h1 className="mt-3 display text-4xl text-navy">CONTENT MODERATION</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/60">
        Reports on reviews, listings, and events. Dismiss false flags to keep the content, or remove
        anything that violates CSD&apos;s trust &amp; safety standards.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setShowResolved(false)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            !showResolved ? "bg-navy text-white" : "bg-cream text-ink/60 hover:text-navy"
          }`}
        >
          Open ({open.length})
        </button>
        <button
          onClick={() => setShowResolved(true)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            showResolved ? "bg-navy text-white" : "bg-cream text-ink/60 hover:text-navy"
          }`}
        >
          Resolved ({resolved.length})
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {list.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink/15 p-6 text-center text-sm text-ink/45">
            {showResolved ? "Nothing resolved yet." : "No open reports. Queue clear. 🎉"}
          </p>
        ) : (
          list.map((item) => {
            const Icon = TYPE_ICON[item.type];
            const resolution = moderation[item.id];
            return (
              <div key={item.id} className="rounded-2xl border border-ink/10 bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red/10 text-red">
                    <Flag size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[0.6rem] font-bold uppercase text-ink/60">
                        <Icon size={11} /> {item.type}
                      </span>
                      <span className="text-sm font-semibold text-navy">{item.reason}</span>
                    </div>
                    <p className="mt-1.5 rounded-lg bg-cream/60 px-3 py-2 text-sm italic text-ink/70">
                      “{item.excerpt}”
                    </p>
                    <p className="mt-1.5 text-xs text-ink/45">
                      {item.listingName} · {item.reportedBy}
                    </p>
                  </div>
                </div>

                {resolution ? (
                  <p className="mt-3 border-t border-ink/10 pt-3 text-xs font-semibold text-ink/55">
                    {RESOLUTION_LABEL[resolution]}
                  </p>
                ) : (
                  <div className="mt-3 flex justify-end gap-2 border-t border-ink/10 pt-3">
                    <button
                      onClick={() => resolveModeration(item.id, "dismissed")}
                      className="inline-flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/60 hover:border-navy/40 hover:text-navy"
                    >
                      <Check size={13} /> Dismiss
                    </button>
                    <button
                      onClick={() => resolveModeration(item.id, "removed")}
                      className="inline-flex items-center gap-1 rounded-lg bg-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                    >
                      <Trash2 size={13} /> Remove content
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
