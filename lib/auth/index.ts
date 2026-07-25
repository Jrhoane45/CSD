"use client";

import { authMode } from "@/lib/config";
import type { AuthAdapter } from "./types";
import { demoAdapter } from "./demoAdapter";

/*
  Selects the active auth adapter from config. Supabase is wired in a follow-up;
  until then we fall back to the demo adapter (with a warning) so the app keeps
  running even if Supabase env vars are present.
*/
function pickAdapter(): AuthAdapter {
  if (authMode() === "supabase") {
    // eslint-disable-next-line no-console
    console.warn("[auth] Supabase is configured but its adapter is not implemented yet — using demo auth.");
  }
  return demoAdapter;
}

export const authAdapter: AuthAdapter = pickAdapter();

export { supabaseAdapter } from "./supabaseAdapter";
export type { AuthAdapter, AuthState, AuthUser, Role } from "./types";
