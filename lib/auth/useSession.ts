"use client";

import { useSyncExternalStore } from "react";
import { authAdapter } from "./index";
import type { AuthState } from "./types";

const SERVER_STATE: AuthState = { user: null, role: "parent", ready: false };

/**
 * Unified identity/session for the app. Today it composes the demo role toggle
 * and a local identity; when Supabase is wired the same hook returns real
 * accounts with no change at call sites.
 */
export function useSession() {
  const state = useSyncExternalStore(
    authAdapter.subscribe,
    authAdapter.getState,
    () => SERVER_STATE,
  );

  return {
    user: state.user,
    role: state.role,
    ready: state.ready,
    signedIn: state.user !== null,
    mode: authAdapter.mode,
    setRole: authAdapter.setRole,
    signIn: authAdapter.signIn,
    signOut: authAdapter.signOut,
  };
}
