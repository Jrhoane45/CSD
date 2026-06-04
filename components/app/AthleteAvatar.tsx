export function AthleteAvatar({
  photo,
  firstName,
  lastName,
  size = 64,
  className = "",
}: {
  photo?: string;
  firstName?: string;
  lastName?: string;
  size?: number;
  className?: string;
}) {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "AT";

  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={`${firstName ?? "Athlete"} ${lastName ?? ""}`.trim()}
        className={`shrink-0 rounded-full border border-ink/10 object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-navy font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-label="Athlete avatar"
    >
      {initials}
    </div>
  );
}
