"use client";

import { useCallback } from "react";
import type { PiqResult } from "./prospectiq";
import { createPersistentStore } from "./persistentStore";

/*
  localStorage-backed history of Prospect IQ evaluations (demo, no backend).
  Powers progress-over-time: a trend of composite/pillars across re-evaluations.
  The single latest result still lives in `csd-piq-result` (useProspectIQ);
  this keeps the full ordered series so improvement is visible.
*/

const store = createPersistentStore<PiqResult[]>("csd-piq-history", []);

export function usePiqHistory() {
  const { value: history, ready } = store.useValue();

  const add = useCallback((r: PiqResult) => {
    store.update((prev) =>
      // De-dupe an immediate re-save of the exact same evaluation (e.g. verify toggle).
      [...prev.filter((h) => h.createdAt !== r.createdAt), r].sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
      ),
    );
  }, []);

  const clear = useCallback(() => store.clear(), []);

  return { history, ready, add, clear };
}
