/** Price bands are the only price shown on the site. Never a live price in chrome. */
export type PriceBand = 1 | 2 | 3 | 4 | 5;

export const PRICE_BANDS: Record<PriceBand, { short: string; label: string; range: string; min: number; max: number | null }> = {
  1: { short: "$", label: "$ under 500", range: "Under $500", min: 0, max: 500 },
  2: { short: "$$", label: "$$ 500–1k", range: "$500–1,000", min: 500, max: 1000 },
  3: { short: "$$$", label: "$$$ 1–2k", range: "$1,000–2,000", min: 1000, max: 2000 },
  4: { short: "$$$$", label: "$$$$ 2–3k", range: "$2,000–3,000", min: 2000, max: 3000 },
  5: { short: "$$$$$", label: "$$$$$ 3k+", range: "$3,000 and up", min: 3000, max: null },
};

export function bandLabel(b: PriceBand): string {
  return PRICE_BANDS[b].label;
}

export function bandRange(b: PriceBand): string {
  return PRICE_BANDS[b].range;
}

/** Derive a band from a seen price. Used only by the validator to catch drift. */
export function bandForPrice(usd: number): PriceBand {
  if (usd < 500) return 1;
  if (usd < 1000) return 2;
  if (usd < 2000) return 3;
  if (usd < 3000) return 4;
  return 5;
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
