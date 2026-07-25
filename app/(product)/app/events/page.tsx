import type { Metadata } from "next";
import { EventsBrowse } from "@/components/app/EventsBrowse";

export const metadata: Metadata = {
  title: "Events",
  description: "Tryouts, camps, showcases, and clinics across Southern California.",
};

export default function EventsPage() {
  return <EventsBrowse />;
}
