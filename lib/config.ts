/*
  Runtime configuration seam. The demo runs fully client-side with no external
  services; these flags let a real backend (Supabase) and payments (Stripe) be
  switched on purely by providing env vars — no code changes. Everything reads
  `process.env` at call time so it is easy to reason about and to test.

  Public env vars (safe to expose to the browser) use the NEXT_PUBLIC_ prefix
  and are inlined at build time by Next.js.
*/

export type AuthMode = "demo" | "supabase";
export type PaymentMode = "demo" | "stripe";

const present = (v: string | undefined | null): boolean => typeof v === "string" && v.length > 0;

export function isSupabaseConfigured(): boolean {
  return (
    present(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    present(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function isStripeConfigured(): boolean {
  return present(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

/** Which auth backend is active. Defaults to the local demo until Supabase env is set. */
export function authMode(): AuthMode {
  return isSupabaseConfigured() ? "supabase" : "demo";
}

/** Which payment backend is active. Defaults to the simulated demo until Stripe env is set. */
export function paymentMode(): PaymentMode {
  return isStripeConfigured() ? "stripe" : "demo";
}

export const supabaseEnv = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
});
