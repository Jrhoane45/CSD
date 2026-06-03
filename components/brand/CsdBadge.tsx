import Image from "next/image";
import logo from "@/public/csd-logo.jpg";

// The official CSD emblem. The source art sits on a light-gray square, so we crop
// to a circle (rounded-full + object-cover) for a clean mark on any background.
export function CsdBadge({ className = "", title = "Club Sports Direct" }: { className?: string; title?: string }) {
  return (
    <Image
      src={logo}
      alt={title}
      sizes="96px"
      placeholder="blur"
      className={`rounded-full object-cover ${className}`}
    />
  );
}
