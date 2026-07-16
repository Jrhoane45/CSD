import type { Metadata } from "next";
import { HelpCenter } from "@/components/app/HelpCenter";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Answers to common questions, plus a way to reach the team.",
};

export default function HelpPage() {
  return <HelpCenter />;
}
