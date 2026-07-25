import Link from "next/link";
import { Logo } from "../brand/Logo";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/features", label: "Features" },
      { href: "/how-it-works/parents", label: "For Parents" },
      { href: "/how-it-works/providers", label: "For Providers" },
      { href: "/csd-score", label: "CSD Score™" },
      { href: "/prospect-iq", label: "Prospect IQ™" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/app", label: "Launch the app" },
      { href: "/app/discover", label: "Discover" },
      { href: "/app/match", label: "Find your match" },
      { href: "/app/rankings", label: "Rankings" },
      { href: "/app/provider", label: "List your program" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About & Founder" },
      { href: "/resources", label: "Resources" },
      { href: "/contact", label: "Contact" },
      { href: "/app/help", label: "Help center" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-navy text-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2">
          <Logo tone="light" tagline />
          <p className="mt-4 max-w-xs text-sm text-cream/70">
            Connecting youth athletes to the right clubs, trainers, and advisers — vetted,
            data-driven matching that replaces word-of-mouth with substance.
          </p>
          <p className="mt-4 text-sm text-cream/60">info@clubsportsdirect.com</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-4 text-gold-300">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-cream/75 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-cream/55 sm:flex-row">
          <p>© 2026 Club Sports Direct. Confidential — investor & partner demo.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
            Demo build · sample data
          </p>
        </div>
      </div>
    </footer>
  );
}
