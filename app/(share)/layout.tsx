import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream/40">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Logo />
          <Link
            href="/app"
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink/60 hover:text-navy"
          >
            Launch the app <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-5 text-center text-xs text-ink/50">
          © 2026 Club Sports Direct · Confidential demo
        </div>
      </footer>
    </div>
  );
}
