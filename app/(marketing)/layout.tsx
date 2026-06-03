import { DemoBanner } from "@/components/site/DemoBanner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
