import { Star } from "lucide-react";

export function StarRating({
  value,
  count,
  size = 14,
  className = "",
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  const full = Math.round(value * 2) / 2;
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.floor(full);
          const half = !filled && i - 0.5 === full;
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="text-ink/20" fill="currentColor" />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden text-gold"
                  style={{ width: half ? size / 2 : size }}
                >
                  <Star size={size} className="text-gold" fill="currentColor" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-navy">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-xs text-ink/45">({count})</span>}
    </div>
  );
}
