import type { Metadata } from "next";
import { DemoBanner } from "@/components/site/DemoBanner";
import { AppShell } from "@/components/app/AppShell";
import { PromoPopup } from "@/components/app/PromoPopup";

export const metadata: Metadata = {
  title: "App",
  description: "The Club Sports Direct product experience — discovery, matching, and provider tools.",
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      <AppShell>{children}</AppShell>
      <PromoPopup />
    </>
  );
}
