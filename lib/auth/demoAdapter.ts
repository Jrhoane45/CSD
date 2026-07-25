"use client";

import type { Role } from "@/lib/types";
import { roleStore, setRole as applyRole } from "@/lib/useRole";
import { createPersistentStore } from "@/lib/persistentStore";
import type { AuthAdapter, AuthState, AuthUser } from "./types";

/*
  Demo auth: identity lives in localStorage and the active role is the existing
  role toggle. Composes the role store + a local identity store into one stable
  AuthState snapshot so it can back useSyncExternalStore without churn.
*/

interface DemoIdentity {
  id: string;
  email: string | null;
  name: string | null;
}

const identityStore = createPersistentStore<DemoIdentity | null>("csd-demo-identity", null);

let snapshot: AuthState = { user: null, role: "parent", ready: false };
const listeners = new Set<() => void>();
let wired = false;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `u_${Math.random().toString(36).slice(2)}`;
}

function rebuild() {
  const role: Role = roleStore.get();
  const identity = identityStore.get();
  const ready = roleStore.ready() && identityStore.ready();
  const user: AuthUser | null = identity
    ? { id: identity.id, email: identity.email, name: identity.name, role }
    : null;
  snapshot = { user, role, ready };
  for (const l of listeners) l();
}

function ensureWired() {
  if (wired) return;
  wired = true;
  roleStore.subscribe(rebuild);
  identityStore.subscribe(rebuild);
  rebuild();
}

export const demoAdapter: AuthAdapter = {
  mode: "demo",

  getState: () => snapshot,

  subscribe: (cb: () => void) => {
    ensureWired();
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },

  setRole: (role: Role) => applyRole(role),

  signIn: async ({ email, name }: { email: string; name?: string }) => {
    const identity: DemoIdentity = {
      id: newId(),
      email: email.trim() || null,
      name: name?.trim() || email.split("@")[0] || "Member",
    };
    identityStore.set(identity);
    return { ...identity, role: roleStore.get() };
  },

  signOut: async () => {
    identityStore.clear();
  },
};
