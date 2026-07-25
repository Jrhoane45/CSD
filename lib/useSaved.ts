"use client";

import { useCallback } from "react";
import { createPersistentStore } from "./persistentStore";

const store = createPersistentStore<string[]>("csd-saved-listings", []);

/** localStorage-backed "saved" listings, synced across components (demo, no backend). */
export function useSaved() {
  const { value: ids, ready } = store.useValue();

  const toggle = useCallback((id: string) => {
    store.update((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const has = (id: string) => ids.includes(id);

  return { ids, has, toggle, ready };
}
