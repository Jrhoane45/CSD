import type { Metadata } from "next";
import { AvailabilityEditor } from "@/components/app/AvailabilityEditor";

export const metadata: Metadata = {
  title: "Availability",
  description: "Set the times families can book sessions with you.",
};

export default function AvailabilityPage() {
  return <AvailabilityEditor />;
}
