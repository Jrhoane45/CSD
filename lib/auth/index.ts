"use client";

import { authMode } from "@/lib/config";
import type { AuthAdapter } from "./types";
import { demoAdapter } from "./demoAdapter";
import { supabaseAdapter } from "./supabaseAdapter";

/*
  Selects the active auth adapter from config: Supabase when its env vars are
  present, the local demo adapter otherwise. Both implement the same surface, so
  nothing at the call sites changes.
*/
export const authAdapter: AuthAdapter = authMode() === "supabase" ? supabaseAdapter : demoAdapter;

export type { AuthAdapter, AuthState, AuthUser, Role } from "./types";
