import type { Metadata } from "next";
import { OperatorVetting } from "@/components/app/OperatorVetting";

export const metadata: Metadata = {
  title: "Operator · Provider vetting",
  description: "Approve, verify, and suspend providers.",
};

export default function OperatorVettingPage() {
  return <OperatorVetting />;
}
