"use client";

import { useMemo } from "react";
import type { Review } from "@/lib/types";
import { useStore, removedReviewIds } from "@/lib/store";
import { StarRating } from "@/components/ui/StarRating";

/**
 * The listing header's star rating, computed live from the merged review set —
 * seed reviews plus user-submitted reviews, minus any an operator has removed.
 * Keeps the headline number in sync with the reviews shown below.
 */
export function ListingHeadlineRating({
  listingId,
  seedReviews,
}: {
  listingId: string;
  seedReviews: Review[];
}) {
  const { reviews, moderation } = useStore();

  const { value, count } = useMemo(() => {
    const removed = removedReviewIds(moderation);
    const userReviews = reviews.filter((r) => r.listingId === listingId && !removed.has(r.id));
    const all = [...userReviews, ...seedReviews];
    const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
    return { value: avg, count: all.length };
  }, [reviews, moderation, listingId, seedReviews]);

  return <StarRating value={value} count={count} />;
}
