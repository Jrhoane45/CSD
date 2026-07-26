import { isSupabaseConfigured } from "@/lib/config";
import type { Repositories } from "./types";
import { demoRepositories } from "./demo";
import { supabaseRepositories } from "./supabase";

/*
  Single entry point for data access. Returns Supabase-backed repositories when
  configured, the demo (seed) repositories otherwise — call sites are identical.
*/
export function getRepositories(): Repositories {
  return isSupabaseConfigured() ? supabaseRepositories : demoRepositories;
}

export type { ListingsRepo, ReviewsRepo, Repositories, NewReview } from "./types";
