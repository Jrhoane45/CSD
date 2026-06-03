import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/app/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Premium-tier analytics — views, lead funnel, and lead fit quality.",
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
