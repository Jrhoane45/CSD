"use client";

import { useSyncExternalStore } from "react";

/*
  A tiny localStorage-backed external store (demo, no backend). Built on
  useSyncExternalStore so it hydrates without a mount-effect setState, stays
  SSR-safe, and — unlike a per-component useState — keeps every consumer of the
  same key in sync. Mirrors the pattern in useRole.
*/

export interface PersistentStore<T> {
  get(): T;
  set(next: T): void;
  update(fn: (prev: T) => T): void;
  clear(): void;
  useValue(): { value: T; ready: boolean };
}

export function createPersistentStore<T>(
  key: string,
  initial: T,
  /** Reconcile a stored value on hydration (e.g. merge in new default keys). */
  reconcile?: (stored: T) => T,
): PersistentStore<T> {
  let value: T = initial;
  let ready = false;
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const l of listeners) l();
  };

  function hydrate() {
    if (ready || typeof window === "undefined") return;
    ready = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) {
        const parsed = JSON.parse(raw) as T;
        value = reconcile ? reconcile(parsed) : parsed;
      }
    } catch {
      /* ignore corrupt/unavailable storage */
    }
  }

  const get = () => value;

  function set(next: T) {
    value = next;
    ready = true;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore quota/privacy errors */
      }
    }
    emit();
  }

  const update = (fn: (prev: T) => T) => set(fn(value));

  function clear() {
    value = initial;
    ready = true;
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    }
    emit();
  }

  function subscribe(cb: () => void) {
    // The first subscription on the client pulls the persisted value in; the
    // snapshot change is picked up by useSyncExternalStore right after.
    hydrate();
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }

  function useValue() {
    const v = useSyncExternalStore(subscribe, get, () => initial);
    const r = useSyncExternalStore(subscribe, () => ready, () => false);
    return { value: v, ready: r };
  }

  return { get, set, update, clear, useValue };
}
