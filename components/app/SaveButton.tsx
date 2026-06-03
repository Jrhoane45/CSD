"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSaved } from "@/lib/useSaved";

export function SaveButton({ id, className = "" }: { id: string; className?: string }) {
  const { has, toggle, ready } = useSaved();
  const saved = ready && has(id);

  return (
    <button
      onClick={() => toggle(id)}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${
        saved
          ? "border-navy bg-navy text-white"
          : "border-navy/30 text-navy hover:bg-navy hover:text-white"
      } ${className}`}
    >
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
