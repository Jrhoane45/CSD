import type { Metadata } from "next";
import { RosterManager } from "@/components/app/RosterManager";

export const metadata: Metadata = {
  title: "Roster & Teams",
  description: "Manage your teams, roster, and prospect pool.",
};

export default function RosterPage() {
  return <RosterManager />;
}
