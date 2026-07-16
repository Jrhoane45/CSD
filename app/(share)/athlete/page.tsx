import type { Metadata } from "next";
import { ShareableProfile } from "@/components/app/ShareableProfile";

export const metadata: Metadata = {
  title: "Athlete Profile",
  description: "A shareable recruiting profile — stats, Prospect IQ evaluation, and highlights.",
};

export default function AthleteSharePage() {
  return <ShareableProfile />;
}
