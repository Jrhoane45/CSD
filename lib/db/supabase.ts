import type { Category, County, DevLevel, Listing, Review, Sport } from "@/lib/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ListingsRepo, NewReview, ReviewsRepo, Repositories } from "./types";

/*
  Supabase-backed repositories. Row → domain mapping lives here so the rest of
  the app keeps consuming the same domain types. Uses the browser client; server
  contexts that need the caller's auth will pass a server client in a follow-up.
  Code-complete and switched on by env, but exercised only against a real project.
*/

interface ListingRow {
  id: string;
  name: string;
  category: string;
  sports: string[] | null;
  levels: string[] | null;
  city: string | null;
  county: string | null;
  miles_from_anchor: number | null;
  claim_state: string | null;
  vetting: string | null;
  years_in_operation: number | null;
  certifications: string[] | null;
  philosophy: string | null;
  price_band: number | null;
  price_label: string | null;
  goals: string[] | null;
  specialties: string[] | null;
  alumni: { pro: number; d1: number; d2: number; d3: number } | null;
  notable_athletes: string[] | null;
  featured: boolean | null;
}

interface ReviewRow {
  author_name: string;
  rating: number;
  created_at: string;
  title: string | null;
  body: string | null;
  dimensions: { label: string; value: number }[] | null;
}

function requireClient() {
  const c = getSupabaseBrowserClient();
  if (!c) throw new Error("Supabase is not configured.");
  return c;
}

function rowToListing(r: ListingRow): Listing {
  return {
    id: r.id,
    name: r.name,
    category: (r.category as Category) ?? "club",
    sports: (r.sports as Sport[]) ?? [],
    levels: (r.levels as DevLevel[]) ?? [],
    city: r.city ?? "",
    county: (r.county as County) ?? "Los Angeles",
    milesFromAnchor: r.miles_from_anchor ?? 0,
    claimState: (r.claim_state as Listing["claimState"]) ?? "unclaimed",
    verified: r.vetting === "verified",
    yearsInOperation: r.years_in_operation ?? 0,
    certifications: r.certifications ?? [],
    philosophy: r.philosophy ?? "",
    priceBand: (r.price_band as Listing["priceBand"]) ?? 2,
    priceLabel: r.price_label ?? "",
    alumni: r.alumni ?? { pro: 0, d1: 0, d2: 0, d3: 0 },
    notableAthletes: r.notable_athletes ?? [],
    goals: r.goals ?? [],
    specialties: r.specialties ?? [],
    reviews: [], // loaded via ReviewsRepo when needed
    featured: r.featured ?? false,
  };
}

function rowToReview(r: ReviewRow): Review {
  return {
    author: r.author_name,
    rating: r.rating,
    date: r.created_at.slice(0, 10),
    title: r.title ?? "",
    body: r.body ?? "",
    dimensions: r.dimensions ?? [],
  };
}

const listings: ListingsRepo = {
  list: async () => {
    const { data, error } = await requireClient().from("listings").select("*");
    if (error) throw error;
    return ((data as ListingRow[]) ?? []).map(rowToListing);
  },
  get: async (id: string) => {
    const { data, error } = await requireClient().from("listings").select("*").eq("id", id).single();
    if (error) return null;
    return data ? rowToListing(data as ListingRow) : null;
  },
};

const reviews: ReviewsRepo = {
  listForListing: async (listingId: string) => {
    const { data, error } = await requireClient()
      .from("reviews")
      .select("*")
      .eq("listing_id", listingId)
      .eq("removed", false)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data as ReviewRow[]) ?? []).map(rowToReview);
  },
  create: async (input: NewReview) => {
    const { error } = await requireClient().from("reviews").insert({
      listing_id: input.listingId,
      author_name: input.authorName,
      rating: input.rating,
      title: input.title,
      body: input.body,
      dimensions: input.dimensions,
    });
    if (error) throw error;
  },
};

export const supabaseRepositories: Repositories = { listings, reviews };
