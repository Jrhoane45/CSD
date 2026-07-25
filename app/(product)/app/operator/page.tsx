import type { Metadata } from "next";
import { OperatorConsole } from "@/components/app/OperatorConsole";

export const metadata: Metadata = {
  title: "Operator console",
  description: "Platform trust & safety, vetting, moderation, and ad revenue.",
};

export default function OperatorPage() {
  return <OperatorConsole />;
}
