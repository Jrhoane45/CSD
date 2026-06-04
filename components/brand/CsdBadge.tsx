// Flat-vector CSD emblem — crisp at any size, transparent background, brand fonts.
// Rendered inline so it uses the app's display font (Anton) via CSS variables.
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
        {/* text arcs */}
        <path id="csd-top" d="M 28 100 a 72 72 0 0 1 144 0" />
        <path id="csd-bottom" d="M 33 100 a 67 67 0 0 0 134 0" />
      </defs>

      {/* outer navy disc + rings */}
      <circle cx="100" cy="100" r="98" fill="#14264f" />
      <circle cx="100" cy="100" r="90.5" fill="none" stroke="#ffffff" strokeWidth="3" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="#0e1b3a" strokeWidth="2" />

      {/* arc wordmark */}
      <text
        fill="#ffffff"
        fontFamily="var(--font-display, 'Arial Narrow', sans-serif)"
        fontSize="20"
        letterSpacing="2.5"
        textAnchor="middle"
      >
        <textPath href="#csd-top" startOffset="50%">CLUB SPORTS</textPath>
      </text>
      <text
        fill="#ffffff"
        fontFamily="var(--font-display, 'Arial Narrow', sans-serif)"
        fontSize="20"
        letterSpacing="4"
        textAnchor="middle"
      >
        <textPath href="#csd-bottom" startOffset="50%">DIRECT</textPath>
      </text>

      {/* flat gold stars */}
      <g fill="#f5a800">
        <path d="M 30 100 l 3.3 6.7 7.4 1.1 -5.35 5.2 1.26 7.4 -6.62 -3.48 -6.62 3.48 1.26 -7.4 -5.35 -5.2 7.4 -1.1 z" />
        <path d="M 170 100 l 3.3 6.7 7.4 1.1 -5.35 5.2 1.26 7.4 -6.62 -3.48 -6.62 3.48 1.26 -7.4 -5.35 -5.2 7.4 -1.1 z" />
      </g>

      {/* inner red ring + core */}
      <circle cx="100" cy="100" r="53" fill="#0e1b3a" />
      <circle cx="100" cy="100" r="53" fill="none" stroke="#c8102e" strokeWidth="5" />
      <circle cx="100" cy="100" r="48.5" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.18" />

      {/* CSD monogram */}
      <text
        x="100"
        y="119"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="var(--font-display, 'Arial Narrow', sans-serif)"
        fontSize="56"
        fontStyle="italic"
        letterSpacing="1"
      >
        CSD
      </text>
    </svg>
  );
}
