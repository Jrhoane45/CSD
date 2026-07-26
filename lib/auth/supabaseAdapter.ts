"use client";

import type { Role } from "@/lib/types";
import type { AuthAdapter, AuthState, AuthUser } from "./types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/*
  Supabase-backed auth. Implements the same AuthAdapter surface as the demo
  adapter: identity comes from Supabase Auth, and the active role from the
  matching row in the `profiles` table (see supabase/schema.sql). Sign-in uses a
  passwordless magic link; the session is established via onAuthStateChange when
  the user returns (Supabase JS detects the callback URL automatically).

  This is code-complete and switches on via env (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)
  but is only exercised against a real project — the demo adapter is used until then.
*/

let snapshot: AuthState = { user: null, role: "parent", ready: false };
const listeners = new Set<() => void>();
let wired = false;

function emit() {
  for (const l of listeners) l();
}

function requireClient() {
  const c = getSupabaseBrowserClient();
  if (!c) throw new Error("Supabase is not configured.");
  return c;
}

async function loadUser() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    snapshot = { user: null, role: "parent", ready: true };
    emit();
    return;
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const authUser = session?.user ?? null;
  if (!authUser) {
    snapshot = { user: null, role: "parent", ready: true };
    emit();
    return;
  }

  let role: Role = "parent";
  let name: string | null = (authUser.user_metadata?.full_name as string | undefined) ?? null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", authUser.id)
    .single();
  if (profile?.role) role = profile.role as Role;
  if (profile?.full_name) name = profile.full_name as string;

  const user: AuthUser = { id: authUser.id, email: authUser.email ?? null, name, role };
  snapshot = { user, role, ready: true };
  emit();
}

function ensureWired() {
  if (wired) return;
  wired = true;
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    snapshot = { user: null, role: "parent", ready: true };
    return;
  }
  void loadUser();
  supabase.auth.onAuthStateChange(() => void loadUser());
}

export const supabaseAdapter: AuthAdapter = {
  mode: "supabase",

  getState: () => snapshot,

  subscribe: (cb: () => void) => {
    ensureWired();
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },

  setRole: (role: Role) => {
    const supabase = getSupabaseBrowserClient();
    const uid = snapshot.user?.id;
    if (!supabase || !uid) return;
    // Optimistic local update, then persist to the profile row.
    snapshot = {
      ...snapshot,
      role,
      user: snapshot.user ? { ...snapshot.user, role } : null,
    };
    emit();
    void supabase.from("profiles").update({ role }).eq("id", uid);
  },

  signIn: async ({ email }: { email: string; name?: string }) => {
    const supabase = requireClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    // Magic link sent; the real session arrives via onAuthStateChange.
    return snapshot.user ?? { id: "pending", email, name: null, role: "parent" };
  },

  signOut: async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    snapshot = { user: null, role: "parent", ready: true };
    emit();
  },
};
