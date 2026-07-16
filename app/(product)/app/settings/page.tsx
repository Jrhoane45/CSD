import type { Metadata } from "next";
import { SettingsClient } from "@/components/app/SettingsClient";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account, notifications, and privacy.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
