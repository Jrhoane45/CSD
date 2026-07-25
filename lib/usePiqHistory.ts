"use client";

import { useCallback, useEffect, useState } from "react";
import type { PiqResult } from "./prospectiq";

/*
  localStorage-backed history of Prospect IQ evaluations (demo, no backend).
  Powers progress-over-time: a trend of composite/pillars across re-evaluations.
  The single latest result still lives in `csd-piq-result` (useProspectIQ);
  this keeps the full ordered series so improvement is visible.
*/

const KEY = "csd-piq-history";

export function usePiqHistory() {
  const [history, setHistory] = useState<PiqResult[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const add = useCallback((r: PiqResult) => {
    setHistory((prev) => {
      // De-dupe an immediate re-save of the exact same evaluation (e.g. verify toggle).
      const next = [...prev.filter((h) => h.createdAt !== r.createdAt), r].sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
      );
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setHistory([]);
  }, []);

  return { history, ready, add, clear };
}
