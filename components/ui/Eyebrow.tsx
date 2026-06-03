import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
  tone = "red",
}: {
  children: ReactNode;
  className?: string;
  tone?: "red" | "gold" | "navy" | "muted" | "light";
}) {
  const tones = {
    red: "text-red",
    gold: "text-gold",
    navy: "text-navy",
    muted: "text-ink/50",
    light: "text-gold-300",
  };
  return <p className={`eyebrow ${tones[tone]} ${className}`}>{children}</p>;
}
