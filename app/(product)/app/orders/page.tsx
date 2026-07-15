import type { Metadata } from "next";
import { OrdersClient } from "@/components/app/OrdersClient";

export const metadata: Metadata = {
  title: "Orders & Receipts",
  description: "Your booked sessions and event registrations.",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
