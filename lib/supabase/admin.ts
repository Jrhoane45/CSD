import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseEnv } from "@/lib/config";

/*
  Server-only Supabase client using the service-role key. NEVER import this from
  a client component — the service role bypasses Row-Level Security. Use it in
  server components, route handlers, and webhooks for privileged reads/writes.
*/

let cached: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!isSupabaseConfigured() || !serviceKey) return null;
  if (cached) return cached;
  const { url } = supabaseEnv();
  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
