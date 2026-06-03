import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "red" | "gold" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-deep",
  red: "bg-red text-white hover:bg-red-600",
  gold: "bg-gold text-ink hover:bg-gold-300",
  outline: "border border-navy/30 text-navy hover:bg-navy hover:text-white",
  ghost: "text-navy hover:bg-navy/5",
  light: "bg-white text-navy hover:bg-cream",
};

const SIZES: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
