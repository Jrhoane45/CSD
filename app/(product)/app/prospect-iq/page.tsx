import type { Metadata } from "next";
import { CombineFlow } from "@/components/app/CombineFlow";

export const metadata: Metadata = {
  title: "Prospect IQ",
  description: "The AI scout — evaluate talent across five pillars and get a Scouting Report.",
};

export default function ProspectIQPage() {
  return <CombineFlow />;
}
