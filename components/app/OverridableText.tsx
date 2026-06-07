"use client";

import type { ElementType } from "react";
import type { ListingOverride } from "@/lib/types";
import { useStore } from "@/lib/store";

/**
 * Renders a listing field, applying any provider-saved override on top of the
 * seed default. Lets a server-rendered listing reflect client-side edits.
 */
export function OverridableText({
  listingId,
  field,
  fallback,
  as: Tag = "span",
  className = "",
}: {
  listingId: string;
  field: keyof ListingOverride;
  fallback: string;
  as?: ElementType;
  className?: string;
}) {
  const { overrides } = useStore();
  const value = overrides[listingId]?.[field] ?? fallback;
  return <Tag className={className}>{value}</Tag>;
}
