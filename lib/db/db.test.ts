import { describe, it, expect, afterEach } from "vitest";
import { getRepositories } from "./index";
import { demoRepositories } from "./demo";
import { LISTINGS } from "@/lib/data/listings";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
});

describe("repository factory", () => {
  it("returns the demo repositories when Supabase is not configured", () => {
    expect(getRepositories()).toBe(demoRepositories);
  });
});

describe("demo listings repo", () => {
  it("lists all seed listings and gets by id", async () => {
    const all = await demoRepositories.listings.list();
    expect(all.length).toBe(LISTINGS.length);

    const one = await demoRepositories.listings.get("hoop-prodigy");
    expect(one?.name).toBe("Hoop Prodigy");

    const missing = await demoRepositories.listings.get("does-not-exist");
    expect(missing).toBeNull();
  });
});

describe("demo reviews repo", () => {
  it("returns the seed reviews for a listing", async () => {
    const reviews = await demoRepositories.reviews.listForListing("hoop-prodigy");
    expect(Array.isArray(reviews)).toBe(true);
    for (const r of reviews) {
      expect(r.rating).toBeGreaterThanOrEqual(1);
      expect(r.rating).toBeLessThanOrEqual(5);
    }
  });
});
