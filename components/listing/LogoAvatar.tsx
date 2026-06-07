"use client";

import type { Listing } from "@/lib/types";
import { useStore } from "@/lib/store";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "h-12 w-12 rounded-xl text-base",
  md: "h-16 w-16 rounded-2xl text-xl",
  lg: "h-20 w-20 rounded-2xl text-2xl",
};

// Deterministic brand-tinted fallback so every monogram looks intentional.
const PALETTE = [
  "bg-navy text-white",
  "bg-red text-white",
  "bg-navy-deep text-gold-300",
  "bg-gold text-ink",
];

function initials(name: string): string {
  const skip = new Set(["the", "of", "and", "a", "for", "&"]);
  const words = name.split(/\s+/).filter((w) => w && !skip.has(w.toLowerCase()));
  const letters = words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return letters || name.slice(0, 2).toUpperCase();
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function LogoAvatar({
  listing,
  size = "sm",
  className = "",
}: {
  listing: Pick<Listing, "name" | "logo" | "id">;
  size?: Size;
  className?: string;
}) {
  const s = SIZES[size];
  const { media } = useStore();
  // A provider-uploaded logo (persisted in the store) overrides the seed logo.
  const logo = media[listing.id]?.logo ?? listing.logo;

  if (logo) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden border border-ink/10 bg-white ${s} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={`${listing.name} logo`}
          className="h-full w-full object-contain p-1.5"
        />
      </div>
    );
  }

  const pal = PALETTE[hash(listing.id) % PALETTE.length];
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-bold leading-none ${pal} ${s} ${className}`}
      aria-label={`${listing.name} logo placeholder`}
    >
      {initials(listing.name)}
    </div>
  );
}
