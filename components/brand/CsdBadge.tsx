// SVG recreation of the CSD round emblem — scalable, self-contained.
// Swap for the official PNG/SVG in /public when available.

export function CsdBadge({ className = "", title = "Club Sports Direct" }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path id="csd-arc-top" d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id="csd-arc-bottom" d="M 36 100 A 64 64 0 0 0 164 100" />
      </defs>

      {/* outer navy disc + ring */}
      <circle cx="100" cy="100" r="98" fill="#14264f" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />

      {/* arc text */}
      <text
        fill="#ffffff"
        fontFamily="var(--font-display, sans-serif)"
        fontSize="22"
        letterSpacing="2"
        textAnchor="middle"
      >
        <textPath href="#csd-arc-top" startOffset="50%">
          CLUB SPORTS
        </textPath>
      </text>
      <text
        fill="#ffffff"
        fontFamily="var(--font-display, sans-serif)"
        fontSize="22"
        letterSpacing="3"
        textAnchor="middle"
      >
        <textPath href="#csd-arc-bottom" startOffset="50%">
          DIRECT
        </textPath>
      </text>

      {/* gold stars */}
      <g fill="#f5a800">
        <path d="M 30 100 l 3.2 6.5 7.2 1 -5.2 5.1 1.2 7.2 -6.4 -3.4 -6.4 3.4 1.2 -7.2 -5.2 -5.1 7.2 -1 z" />
        <path d="M 170 100 l 3.2 6.5 7.2 1 -5.2 5.1 1.2 7.2 -6.4 -3.4 -6.4 3.4 1.2 -7.2 -5.2 -5.1 7.2 -1 z" />
      </g>

      {/* inner red ring + navy core */}
      <circle cx="100" cy="100" r="52" fill="#14264f" stroke="#c8102e" strokeWidth="5" />
      <circle cx="100" cy="100" r="46" fill="none" stroke="#0e1b3a" strokeWidth="2" />

      {/* CSD monogram */}
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="var(--font-display, sans-serif)"
        fontSize="52"
        letterSpacing="1"
        fontStyle="italic"
      >
        CSD
      </text>
    </svg>
  );
}
