"use client";

import { useSyncExternalStore } from "react";

/*
  Lightweight operator access gate. The operator console governs trust & safety
  across the platform, so it sits behind a passcode rather than being reachable
  by anyone who flips the role toggle. Demo-only: the passcode is public and the
  unlocked flag is persisted to localStorage.
*/

export const OPERATOR_PASSCODE = "csd-operator";

const KEY = "csd-operator-unlocked";
let unlocked = false;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  if (localStorage.getItem(KEY) === "1") {
    unlocked = true;
    for (const l of listeners) l();
  }
}

/** Attempt to unlock with a passcode. Returns whether it succeeded. */
export function unlockOperator(code: string): boolean {
  if (code.trim().toLowerCase() !== OPERATOR_PASSCODE) return false;
  unlocked = true;
  if (typeof window !== "undefined") localStorage.setItem(KEY, "1");
  for (const l of listeners) l();
  return true;
}

export function lockOperator() {
  unlocked = false;
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useOperatorUnlocked(): boolean {
  return useSyncExternalStore(subscribe, () => unlocked, () => false);
}
