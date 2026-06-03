"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "csd-saved-listings";

/** Tiny localStorage-backed store for "saved" listings (demo, no backend). */
export function useSaved() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (id: string) => {
      persist(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
    },
    [ids, persist],
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, has, toggle, ready };
}
