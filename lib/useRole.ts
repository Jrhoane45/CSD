"use client";

import { useSyncExternalStore } from "react";
import type { Role } from "./types";

/*
  Shared Parent ⇄ Provider role, persisted to localStorage and synced across
  every component (app shell, inbox, notifications) via a tiny store.
*/

const KEY = "csd-role";
let role: Role = "parent";
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const saved = localStorage.getItem(KEY) as Role | null;
  if (saved === "parent" || saved === "provider") {
    role = saved;
    for (const l of listeners) l();
  }
}

export function setRole(r: Role) {
  role = r;
  if (typeof window !== "undefined") localStorage.setItem(KEY, r);
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useRole(): Role {
  return useSyncExternalStore(subscribe, () => role, () => "parent");
}
