"use client";

import { useCallback, useEffect, useState } from "react";
import type { PiqResult } from "./prospectiq";

const KEY = "csd-piq-result";

/** localStorage-backed latest Prospect IQ result (demo, no backend). */
export function useProspectIQ() {
  const [result, setResult] = useState<PiqResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setResult(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const save = useCallback((r: PiqResult) => {
    localStorage.setItem(KEY, JSON.stringify(r));
    setResult(r);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setResult(null);
  }, []);

  return { result, ready, save, clear };
}
