import type { Metadata } from "next";
import { NotificationsClient } from "@/components/app/NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your platform activity and alerts.",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
