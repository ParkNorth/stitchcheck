import { rollupData } from "./rollup-data";

/**
 * Counts rolled up from collected owner, buyer and editorial reviews (scripts/reviews-rollup.ts).
 * Counts only; every number traces to claims in data/reviews/{slug}/claims.jsonl. Rendered by
 * src/components/ui/RollupBlocks.tsx. Never feeds AggregateRating schema (AGENTS.md rule 21).
 */
export interface RollupExample {
  claim_id: string;
  polarity?: string;
  claim: string;
  quote: string;
  url: string;
  source_class?: string;
  dimension?: string;
  favors?: string;
}

export interface RollupTheme {
  theme: string;
  label: string;
  statements: number;
  voices: number;
  ownerVoices: number;
  sources: number;
  sourceClasses: string[];
  classVoices?: Record<string, number>;
  polarity: { positive: number; negative: number; mixed: number; neutral: number };
  years: [number, number] | null;
  recurrence: "recurring" | "reported" | "one-off";
  examples: RollupExample[];
}

export interface RollupRating {
  retailer: string;
  url: string;
  pageRating: number | null;
  pageCount: number;
  fetched: string;
  distribution: Record<string, number>;
  lowRated: number;
  sampled?: string | null;
}

export interface RollupDocumentCheck {
  field?: string;
  source?: string;
  label: string;
  juki: string;
  others: string;
  status: "confirmed" | "differs" | "unverified" | "dealer only";
  links: { label: string; url: string }[];
}

export interface RollupSiblingRow {
  feature: string;
  urls: number;
  classes: string[];
  summary: string;
  check: string;
  examples: RollupExample[];
}

export interface RollupRival {
  model: string;
  claims: number;
  sources: number;
  favors: { this: number; other: number; mixed: number };
  dimensions: { this: { dimension: string; n: number }[]; other: { dimension: string; n: number }[] };
  examples: RollupExample[];
}

export interface Rollup {
  slug: string;
  status: "draft" | "approved";
  reviewedBy: string | null;
  reviewedOn: string | null;
  generated: string;
  notes?: string[];
  ownerNote?: string | null;
  method: {
    sources: number;
    itemsCollected: number;
    statements: number;
    voices: number;
    ownerVoices: number;
    dateRange: [number, number] | null;
    byClass: Record<string, { sources: number; items: number }>;
    blocked: number;
    evidence: "strong" | "moderate" | "thin";
    thresholds: string;
  };
  themes: RollupTheme[];
  ratings: RollupRating[];
  documentChecks: RollupDocumentCheck[];
  siblings: { model: string; label: string; rows: RollupSiblingRow[] }[];
  rivals: RollupRival[];
}

export function getRollup(slug: string): Rollup | undefined {
  return rollupData[slug];
}

/** Themes worth a row: enough voices to be a pattern, never the catch-all. */
export function visibleThemes(r: Rollup, min = 8): RollupTheme[] {
  return r.themes.filter((t) => t.theme !== "other" && t.voices >= min);
}
