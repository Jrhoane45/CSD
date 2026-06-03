// SVG recreation of the CSD round emblem — scalable, self-contained.
// Drop the official PNG/SVG into /public and swap <CsdBadge> for an <img> to use the exact logo.

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
        <path id="csd-arc-top" d="M 32 100 A 68 68 0 0 1 168 100" />
        <path id="csd-arc-bottom" d="M 38 100 A 62 62 0 0 0 162 100" />
        <radialGradient id="csd-core" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#1d3a73" />
          <stop offset="100%" stopColor="#0e1b3a" />
        </radialGradient>
        <linearGradient id="csd-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e63b4d" />
          <stop offset="45%" stopColor="#c8102e" />
          <stop offset="100%" stopColor="#8f0c22" />
        </linearGradient>
        <linearGradient id="csd-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd76a" />
          <stop offset="100%" stopColor="#d68a00" />
        </linearGradient>
        <pattern id="csd-mesh" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill="#0c1730" opacity="0.55" />
        </pattern>
      </defs>

      {/* outer navy disc + thin rings */}
      <circle cx="100" cy="100" r="98" fill="#14264f" />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#0c1730" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#ffffff" strokeWidth="2.5" />

      {/* arc text */}
      <text fill="#ffffff" fontFamily="var(--font-display, sans-serif)" fontSize="21" letterSpacing="2.5" textAnchor="middle">
        <textPath href="#csd-arc-top" startOffset="50%">CLUB SPORTS</textPath>
      </text>
      <text fill="#ffffff" fontFamily="var(--font-display, sans-serif)" fontSize="21" letterSpacing="4" textAnchor="middle">
        <textPath href="#csd-arc-bottom" startOffset="50%">DIRECT</textPath>
      </text>

      {/* gold stars */}
      <g fill="url(#csd-gold)" stroke="#9a6700" strokeWidth="0.5">
        <path d="M 29 100 l 3.4 6.9 7.6 1.1 -5.5 5.4 1.3 7.6 -6.8 -3.6 -6.8 3.6 1.3 -7.6 -5.5 -5.4 7.6 -1.1 z" />
        <path d="M 171 100 l 3.4 6.9 7.6 1.1 -5.5 5.4 1.3 7.6 -6.8 -3.6 -6.8 3.6 1.3 -7.6 -5.5 -5.4 7.6 -1.1 z" />
      </g>

      {/* glossy red ring + mesh core */}
      <circle cx="100" cy="100" r="54" fill="url(#csd-core)" />
      <circle cx="100" cy="100" r="54" fill="url(#csd-mesh)" />
      <circle cx="100" cy="100" r="54" fill="none" stroke="url(#csd-red)" strokeWidth="6" />
      <circle cx="100" cy="100" r="57.5" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
      <circle cx="100" cy="100" r="50.5" fill="none" stroke="#0c1730" strokeWidth="1.5" />

      {/* CSD monogram */}
      <text
        x="100"
        y="119"
        textAnchor="middle"
        fill="#f4f6fb"
        stroke="#c8102e"
        strokeWidth="1.1"
        fontFamily="var(--font-display, sans-serif)"
        fontSize="54"
        letterSpacing="1"
        fontStyle="italic"
      >
        CSD
      </text>
    </svg>
  );
}
