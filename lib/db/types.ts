import type { Listing, Review } from "@/lib/types";

/*
  The data-access seam. Every screen that needs persistent data goes through a
  repository rather than touching localStorage or the seed arrays directly, so
  the same call sites work against either the demo (seeds) or Supabase backend.
  Read paths are modelled first; write paths grow as domains migrate.
*/

export interface ListingsRepo {
  list(): Promise<Listing[]>;
  get(id: string): Promise<Listing | null>;
}

export interface NewReview {
  listingId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  dimensions: { label: string; value: number }[];
}

export interface ReviewsRepo {
  listForListing(listingId: string): Promise<Review[]>;
  create(input: NewReview): Promise<void>;
}

export interface Repositories {
  listings: ListingsRepo;
  reviews: ReviewsRepo;
}
