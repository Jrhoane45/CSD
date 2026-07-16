import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Building2, LifeBuoy, Handshake, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Club Sports Direct — families, providers, partners, and press.",
};

const CHANNELS = [
  { icon: Mail, title: "General", body: "info@clubsportsdirect.com", href: "mailto:info@clubsportsdirect.com" },
  { icon: LifeBuoy, title: "Support", body: "Help center & FAQ", href: "/app/help" },
  { icon: Handshake, title: "Partnerships & investment", body: "partners@clubsportsdirect.com", href: "mailto:partners@clubsportsdirect.com" },
  { icon: Building2, title: "For providers", body: "List or claim your program", href: "/app/provider" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk youth" highlight="sports.">
        Whether you&apos;re a family, a program, a partner, or press — we&apos;d love to hear from you.
      </PageHero>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* channels */}
          <div>
            <Eyebrow>Ways to reach us</Eyebrow>
            <h2 className="display mt-4 text-3xl text-navy">PICK THE RIGHT DOOR.</h2>
            <div className="mt-8 space-y-3">
              {CHANNELS.map((c) => (
                <Link
                  key={c.title}
                  href={c.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-5 transition-colors hover:border-navy/30"
                >
                  <span className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/[0.06] text-navy">
                      <c.icon size={20} />
                    </span>
                    <span>
                      <span className="block font-semibold text-navy">{c.title}</span>
                      <span className="block text-sm text-ink/60">{c.body}</span>
                    </span>
                  </span>
                  <ArrowRight size={16} className="text-ink/30 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-cream-200 p-6">
              <p className="eyebrow text-ink/50">Headquarters</p>
              <p className="mt-2 text-navy">Southern California</p>
              <p className="text-sm text-ink/60">Serving athletes & programs across the region — expanding soon.</p>
            </div>
          </div>

          {/* form */}
          <div>
            <Eyebrow>Send a message</Eyebrow>
            <h2 className="display mt-4 text-3xl text-navy">DROP US A LINE.</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
