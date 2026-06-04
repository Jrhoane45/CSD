"use client";

import { useCallback, useEffect, useState } from "react";
import type { AthleteProfile } from "./types";

const KEY = "csd-athlete-profile";

/** localStorage-backed athlete profile (demo, no backend). */
export function useProfile() {
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const save = useCallback((p: AthleteProfile) => {
    const withMeta = { ...p, createdAt: p.createdAt ?? new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(withMeta));
    setProfile(withMeta);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setProfile(null);
  }, []);

  return { profile, ready, save, clear };
}
