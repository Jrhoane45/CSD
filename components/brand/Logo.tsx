import Link from "next/link";
import { CsdBadge } from "./CsdBadge";

type Tone = "light" | "dark";

export function Logo({
  tone = "dark",
  tagline = false,
  href = "/",
  className = "",
}: {
  tone?: Tone;
  tagline?: boolean;
  href?: string | null;
  className?: string;
}) {
  const word = tone === "light" ? "text-white" : "text-navy";
  const tag = tone === "light" ? "text-gold-300" : "text-red";

  const inner = (
    <span className={`flex items-center gap-3 ${className}`}>
      <CsdBadge className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`display text-[1.45rem] tracking-tight ${word}`}>
          CLUB SPORTS DIRECT
        </span>
        {tagline && (
          <span className={`eyebrow mt-1 text-[0.6rem] ${tag}`}>Team Sports, Simplified</span>
        )}
      </span>
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} aria-label="Club Sports Direct home" className="inline-flex">
      {inner}
    </Link>
  );
}
