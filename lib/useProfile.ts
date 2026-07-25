"use client";

import { useCallback } from "react";
import type { AthleteProfile } from "./types";
import { createPersistentStore } from "./persistentStore";

const store = createPersistentStore<AthleteProfile | null>("csd-athlete-profile", null);

/** localStorage-backed athlete profile, synced across components (demo, no backend). */
export function useProfile() {
  const { value: profile, ready } = store.useValue();

  const save = useCallback((p: AthleteProfile) => {
    store.set({ ...p, createdAt: p.createdAt ?? new Date().toISOString() });
  }, []);

  const clear = useCallback(() => store.clear(), []);

  return { profile, ready, save, clear };
}
