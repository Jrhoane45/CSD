"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "../brand/Logo";

const LINKS = [
  { href: "/how-it-works/parents", label: "For Parents" },
  { href: "/how-it-works/providers", label: "For Providers" },
  { href: "/csd-score", label: "CSD Score" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo tagline />

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-lg bg-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            Launch the app <ArrowRight size={15} />
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-navy lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-cream"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/app"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red px-5 py-3 text-sm font-semibold text-white"
            >
              Launch the app <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
