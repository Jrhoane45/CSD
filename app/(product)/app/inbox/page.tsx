import type { Metadata } from "next";
import { Inbox } from "@/components/app/Inbox";

export const metadata: Metadata = {
  title: "Inbox",
  description: "Messages and leads between athletes' families and programs.",
};

export default function InboxPage() {
  return <Inbox />;
}
