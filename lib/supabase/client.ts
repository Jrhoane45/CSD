"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseEnv } from "@/lib/config";

/*
  Browser Supabase client. Created lazily and only when configured, so the demo
  build never instantiates a client or requires env vars.
*/

let cached: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (cached) return cached;
  const { url, anonKey } = supabaseEnv();
  cached = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return cached;
}
