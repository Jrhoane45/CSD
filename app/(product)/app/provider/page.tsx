import type { Metadata } from "next";
import { ProviderDashboard } from "@/components/app/ProviderDashboard";

export const metadata: Metadata = {
  title: "Provider dashboard",
  description: "Claim your profile, manage leads and events, and upgrade to paid.",
};

export default function ProviderPage() {
  return <ProviderDashboard />;
}
