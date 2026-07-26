import { describe, it, expect, afterEach } from "vitest";
import { isSupabaseConfigured, isStripeConfigured, authMode, paymentMode } from "./config";

const KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
];

function clearEnv() {
  for (const k of KEYS) delete process.env[k];
}

describe("config", () => {
  afterEach(clearEnv);

  it("defaults to demo mode with no env vars", () => {
    clearEnv();
    expect(isSupabaseConfigured()).toBe(false);
    expect(authMode()).toBe("demo");
    expect(isStripeConfigured()).toBe(false);
    expect(paymentMode()).toBe("demo");
  });

  it("requires BOTH supabase vars to switch backends", () => {
    clearEnv();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
    expect(isSupabaseConfigured()).toBe(false); // anon key still missing
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    expect(isSupabaseConfigured()).toBe(true);
    expect(authMode()).toBe("supabase");
  });

  it("switches payments to stripe when the publishable key is present", () => {
    clearEnv();
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_123";
    expect(isStripeConfigured()).toBe(true);
    expect(paymentMode()).toBe("stripe");
  });
});
