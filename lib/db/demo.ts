import type { Listing } from "@/lib/types";
import { LISTINGS, getListing } from "@/lib/data/listings";
import type { ListingsRepo, ReviewsRepo, Repositories } from "./types";

/*
  Demo repositories backed by the in-repo seed data. Server-safe (no store /
  localStorage), so the same repository calls work in server components. The
  live, interactive demo store continues to layer on top for session activity;
  these model the durable read path that Supabase will take over.
*/

const listings: ListingsRepo = {
  list: async (): Promise<Listing[]> => LISTINGS,
  get: async (id: string): Promise<Listing | null> => getListing(id) ?? null,
};

const reviews: ReviewsRepo = {
  listForListing: async (listingId: string) => getListing(listingId)?.reviews ?? [],
  // Demo writes are handled by the client store; the durable path is a no-op here.
  create: async () => {},
};

export const demoRepositories: Repositories = { listings, reviews };
