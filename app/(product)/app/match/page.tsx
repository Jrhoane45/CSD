import type { Metadata } from "next";
import { MatchFlow } from "@/components/app/MatchFlow";

export const metadata: Metadata = {
  title: "Find your match",
  description: "Build an athlete profile and get ranked, fit-scored program matches.",
};

export default function MatchPage() {
  return <MatchFlow />;
}
