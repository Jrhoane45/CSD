"use client";

import type { AuthAdapter, AuthState } from "./types";

/*
  Placeholder for the real Supabase-backed auth adapter. It implements the same
  AuthAdapter surface as the demo adapter, so switching backends is a one-line
  change in ./index once this is filled in (Supabase client + auth.onAuthStateChange
  + a `profiles` row carrying the role). Lands in a follow-up alongside the data
  layer; the demo adapter is used until then even if Supabase env is present.
*/

const NOT_IMPLEMENTED = "Supabase auth adapter is not implemented yet.";
const EMPTY: AuthState = { user: null, role: "parent", ready: false };

export const supabaseAdapter: AuthAdapter = {
  mode: "supabase",
  getState: () => EMPTY,
  subscribe: () => () => {},
  setRole: () => {
    throw new Error(NOT_IMPLEMENTED);
  },
  signIn: async () => {
    throw new Error(NOT_IMPLEMENTED);
  },
  signOut: async () => {
    throw new Error(NOT_IMPLEMENTED);
  },
};
