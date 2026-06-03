import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function PageHero({
  eyebrow,
  title,
  highlight,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-red/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <Eyebrow tone="light">{eyebrow}</Eyebrow>
        <h1 className="display mt-4 max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl">
          {title} {highlight && <span className="text-gold display-italic">{highlight}</span>}
        </h1>
        {children && <div className="mt-5 max-w-2xl text-lg text-cream/85">{children}</div>}
      </div>
    </section>
  );
}
