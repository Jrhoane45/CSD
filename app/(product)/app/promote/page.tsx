import type { Metadata } from "next";
import { PromotionsStudio } from "@/components/app/PromotionsStudio";

export const metadata: Metadata = {
  title: "Promotions",
  description: "Promote tournaments, showcases, camps, and clinics across Club Sports Direct.",
};

export default function PromotePage() {
  return <PromotionsStudio />;
}
