import type { County } from "./types";

/**
 * Best-effort ZIP → Southern California county mapping for the demo.
 * Uses the 3-digit ZIP prefix; defaults to Los Angeles when unknown.
 */
export function zipToCounty(zip: string): County | null {
  const z = (zip || "").trim();
  if (!/^\d{5}$/.test(z)) return null;
  const p = z.slice(0, 3);
  const n = Number(p);

  if (p === "926" || p === "927" || p === "928") return "Orange";
  if (p === "920" || p === "921" || p === "919") return "San Diego";
  if (p === "922" || p === "925") return "Riverside";
  if (p === "923" || p === "924") return "San Bernardino";
  if (p === "930" || p === "931") return "Ventura";
  if (n >= 900 && n <= 918) return "Los Angeles";
  return "Los Angeles";
}

/** Format total inches as e.g. 5'10". */
export function formatHeight(totalInches?: number | null): string {
  if (!totalInches || totalInches <= 0) return "—";
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  return `${ft}'${inch}"`;
}

/** Common youth-athlete height options (inches) for a friendly dropdown. */
export const HEIGHT_OPTIONS: { value: number; label: string }[] = (() => {
  const out: { value: number; label: string }[] = [];
  for (let total = 48; total <= 84; total++) {
    const ft = Math.floor(total / 12);
    const inch = total % 12;
    out.push({ value: total, label: `${ft}'${inch}"` });
  }
  return out;
})();
