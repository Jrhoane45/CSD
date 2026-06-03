import Link from "next/link";
import { CsdBadge } from "@/components/brand/CsdBadge";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-white">
      <CsdBadge className="h-20 w-20" />
      <p className="display mt-8 text-7xl text-gold">404</p>
      <h1 className="display mt-2 text-3xl text-white">OFF THE FIELD.</h1>
      <p className="mt-3 max-w-sm text-cream/70">
        We couldn&apos;t find that page. Let&apos;s get you back to the right place to grow.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-gold-300"
        >
          Back home
        </Link>
        <Link
          href="/app"
          className="rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          Open the app
        </Link>
      </div>
    </div>
  );
}
