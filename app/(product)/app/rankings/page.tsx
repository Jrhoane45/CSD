import type { Metadata } from "next";
import { RankingsClient } from "@/components/app/RankingsClient";

export const metadata: Metadata = {
  title: "Rankings",
  description: "The Prospect IQ regional leaderboard — see how athletes stack up across SoCal.",
};

export default function RankingsPage() {
  return <RankingsClient />;
}
