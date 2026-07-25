"use client";

import { useCallback } from "react";
import type { PiqResult } from "./prospectiq";
import { createPersistentStore } from "./persistentStore";

const store = createPersistentStore<PiqResult | null>("csd-piq-result", null);

/** localStorage-backed latest Prospect IQ result (demo, no backend). */
export function useProspectIQ() {
  const { value: result, ready } = store.useValue();

  const save = useCallback((r: PiqResult) => store.set(r), []);
  const clear = useCallback(() => store.clear(), []);

  return { result, ready, save, clear };
}
