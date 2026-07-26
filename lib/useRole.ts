"use client";

import type { Role } from "./types";
import { createPersistentStore } from "./persistentStore";

/*
  Shared Parent ⇄ Provider ⇄ Operator role, persisted to localStorage and synced
  across every component. Built on the same external-store primitive as the rest
  of the app; the underlying `roleStore` is exported so the auth/session layer
  can compose it.
*/

const VALID: Role[] = ["parent", "provider", "operator"];

export const roleStore = createPersistentStore<Role>("csd-role", "parent", (stored) =>
  VALID.includes(stored) ? stored : "parent",
);

export function setRole(r: Role) {
  roleStore.set(r);
}

export function useRole(): Role {
  return roleStore.useValue().value;
}
