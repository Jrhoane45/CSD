import type { Metadata } from "next";
import type { Category } from "@/lib/types";
import { DiscoverClient } from "@/components/app/DiscoverClient";

export const metadata: Metadata = {
  title: "Discover",
  description: "Browse vetted clubs, trainers, and advisers across Southern California.",
};

const VALID: Category[] = ["club", "trainer", "consultant"];

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initial = category && VALID.includes(category as Category) ? (category as Category) : undefined;
  return <DiscoverClient initialCategory={initial} />;
}
