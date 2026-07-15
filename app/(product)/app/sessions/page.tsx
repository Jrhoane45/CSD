import type { Metadata } from "next";
import { SessionsClient } from "@/components/app/SessionsClient";

export const metadata: Metadata = {
  title: "My Sessions",
  description: "Training sessions and visits you've booked with programs and trainers.",
};

export default function SessionsPage() {
  return <SessionsClient />;
}
