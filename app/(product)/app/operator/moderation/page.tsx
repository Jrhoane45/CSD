import type { Metadata } from "next";
import { OperatorModeration } from "@/components/app/OperatorModeration";

export const metadata: Metadata = {
  title: "Operator · Moderation",
  description: "Review and resolve content reports.",
};

export default function OperatorModerationPage() {
  return <OperatorModeration />;
}
