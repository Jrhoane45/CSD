import type { Metadata } from "next";
import { OperatorPromotions } from "@/components/app/OperatorPromotions";

export const metadata: Metadata = {
  title: "Operator · Ad revenue",
  description: "Platform-wide promotions marketplace performance.",
};

export default function OperatorPromotionsPage() {
  return <OperatorPromotions />;
}
