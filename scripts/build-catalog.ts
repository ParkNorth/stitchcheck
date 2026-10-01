#!/usr/bin/env tsx
/**
 * Compile the research cache (`data/specs/{slug}.json`, written by the research
 * loop from manufacturer and dealer sources) into a typed TypeScript module the
 * site imports: `src/lib/catalog-data.ts`.
 *
 * The JSON is the provenance record: every non-null spec carries a source URL.
 * `src/lib/products.ts` layers the site-specific editorial decisions (score,
 * jobs, picks, alternatives, buy route) on top of this data. Run after any
 * change under data/specs/:
 *
 *   npm run build:catalog
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const SPECS_DIR = path.join(ROOT, "data", "specs");
const OUT = path.join(ROOT, "src", "lib", "catalog-data.ts");

const SPEC_KEYS = [
  "stitchTypes",
  "stitchCount",
  "maxSpm",
  "threads",
  "differentialFeed",
  "throatIn",
  "needleSystem",
  "presserFootLift",
  "threadTrimmer",
  "feedSystem",
  "buttonhole",
  "motor",
  "frame",
  "weightLb",
  "dimensionsIn",
  "includedFeet",
  "warrantyUs",
] as const;

type Sourced = { value: string | number | null; source: string | null };

type Raw = {
  slug: string;
  brand: string;
  model: string;
  series?: string;
  type: string;
  industrial?: boolean;
  jobs: string[];
  manufacturerUrl?: string;
  retailerUrl?: string | null;
  priceUsdSeen?: number | null;
  priceSeenDate?: string | null;
  priceSeenAt?: string | null;
  specs: Record<string, Sourced>;
  claims?: string[];
  conflicts?: string[];
  ownerThemes?: { theme: string; tone: string; source: string | null }[];
  evidence?: string;
  buyerQuestions?: string[];
  crossShop?: { slug: string; why: string }[];
  discontinued?: boolean;
  replacedBy?: string | null;
  editorial?: {
    verdict: string;
    whoFor: string;
    skipIf: string;
    keySpec: string;
    strengths: string[];
    weaknesses: string[];
    checks: { title: string; body: string }[];
    realCost: string[];
    faqs?: { q: string; a: string }[];
  };
  sources?: string[];
};

const RETAILER = "Sewing Machines Plus";

function clean(s: string): string {
  // Published copy never carries em or en dashes.
  return s.replace(/\s*—\s*/g, ", ").replace(/\s*–\s*/g, " to ").replace(/\s+/g, " ").trim();
}

function cleanDeep<T>(v: T): T {
  if (typeof v === "string") return clean(v) as T;
  if (Array.isArray(v)) return v.map(cleanDeep) as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) out[k] = cleanDeep(val);
    return out as T;
  }
  return v;
}

function normalizeSpecs(specs: Record<string, Sourced>): Record<string, Sourced> {
  const out: Record<string, Sourced> = {};
  for (const k of SPEC_KEYS) {
    const raw = specs[k] ?? { value: null, source: null };
    let value = raw.value;
    if (value === "" || value === undefined) value = null;
    if ((k === "maxSpm" || k === "throatIn" || k === "weightLb" || k === "stitchCount") && typeof value === "string") {
      const n = Number(String(value).replace(/[^0-9.]/g, ""));
      value = Number.isFinite(n) && n > 0 ? n : value;
    }
    out[k] = { value: typeof value === "string" ? clean(value) : value, source: raw.source ?? null };
  }
  return out;
}

type RealCostIn = string | { item: string; note?: string };
type EditorialIn = Omit<NonNullable<Raw["editorial"]>, "realCost"> & { realCost: RealCostIn[] };

function normalizeEditorial(e: Raw["editorial"] | undefined): Raw["editorial"] | undefined {
  if (!e) return undefined;
  const ed = e as unknown as EditorialIn;
  return {
    ...ed,
    strengths: (ed.strengths ?? []).map(String),
    weaknesses: (ed.weaknesses ?? []).map(String),
    checks: (ed.checks ?? []).map((c) => ({ title: String(c.title), body: String(c.body) })),
    realCost: (ed.realCost ?? []).map((r: RealCostIn) => (typeof r === "string" ? r : r.note ? `${r.item}: ${r.note}` : r.item)),
    faqs: (ed.faqs ?? []).map((f) => ({ q: String(f.q), a: String(f.a) })),
  };
}

function normalizeSeenAt(at: string | null | undefined): { at: string; note: string | null } {
  if (!at) return { at: RETAILER, note: null };
  const a = at.trim();
  if (a.toLowerCase().startsWith("sewing machines plus")) {
    return { at: RETAILER, note: a.length > RETAILER.length ? a : null };
  }
  if (/^brother usa/i.test(a)) return { at: "Brother USA", note: null };
  return { at: "another dealer", note: a };
}

const files = fs
  .readdirSync(SPECS_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

const entries: string[] = [];
for (const f of files) {
  const raw = JSON.parse(fs.readFileSync(path.join(SPECS_DIR, f), "utf8")) as Raw;
  if (raw.slug !== f.replace(/\.json$/, "")) {
    throw new Error(`${f}: slug "${raw.slug}" does not match the filename`);
  }
  const seen = normalizeSeenAt(raw.priceSeenAt);
  const entry = {
    slug: raw.slug,
    brand: raw.brand,
    model: raw.model,
    series: raw.series ?? null,
    type: raw.type,
    industrial: Boolean(raw.industrial),
    jobs: raw.jobs ?? [],
    manufacturerUrl: raw.manufacturerUrl ?? null,
    retailerUrl: raw.retailerUrl ?? null,
    priceUsdSeen: typeof raw.priceUsdSeen === "number" ? Math.round(raw.priceUsdSeen) : null,
    priceSeenDate: raw.priceSeenDate ?? null,
    priceSeenAt: seen.at,
    priceNote: seen.note,
    specs: normalizeSpecs(raw.specs ?? {}),
    claims: cleanDeep(raw.claims ?? []),
    conflicts: cleanDeep(raw.conflicts ?? []),
    ownerThemes: cleanDeep(raw.ownerThemes ?? []),
    evidence: raw.evidence ?? "positioning",
    buyerQuestions: cleanDeep(raw.buyerQuestions ?? []),
    crossShop: cleanDeep(raw.crossShop ?? []),
    discontinued: Boolean(raw.discontinued),
    replacedBy: raw.replacedBy ?? null,
    editorial: cleanDeep(
      normalizeEditorial(raw.editorial) ?? {
        verdict: "",
        whoFor: "",
        skipIf: "",
        keySpec: "",
        strengths: [],
        weaknesses: [],
        checks: [],
        realCost: [],
        faqs: [],
      },
    ),
    sources: raw.sources ?? [],
  };
  entries.push(`  ${JSON.stringify(raw.slug)}: ${JSON.stringify(entry, null, 2).replace(/\n/g, "\n  ")},`);
}

const header = `
// GENERATED by scripts/build-catalog.ts from data/specs/*.json. Do not edit by hand.
// Re-run: npm run build:catalog

export type CatalogSourced = { value: string | number | null; source: string | null };

export interface CatalogEntry {
  slug: string;
  brand: string;
  model: string;
  series: string | null;
  type: string;
  industrial: boolean;
  jobs: string[];
  manufacturerUrl: string | null;
  retailerUrl: string | null;
  priceUsdSeen: number | null;
  priceSeenDate: string | null;
  priceSeenAt: string;
  priceNote: string | null;
  specs: Record<string, CatalogSourced>;
  claims: string[];
  conflicts: string[];
  ownerThemes: { theme: string; tone: string; source: string | null }[];
  evidence: string;
  buyerQuestions: string[];
  crossShop: { slug: string; why: string }[];
  discontinued: boolean;
  replacedBy: string | null;
  editorial: {
    verdict: string;
    whoFor: string;
    skipIf: string;
    keySpec: string;
    strengths: string[];
    weaknesses: string[];
    checks: { title: string; body: string }[];
    realCost: string[];
    faqs: { q: string; a: string }[];
  };
  sources: string[];
}

export const CATALOG_BUILT = ${JSON.stringify(new Date().toISOString().slice(0, 10))};

export const catalogData: Record<string, CatalogEntry> = {
`;

fs.writeFileSync(OUT, `${header}${entries.join("\n")}\n};\n`);
console.log(`Wrote ${path.relative(ROOT, OUT)} with ${files.length} entries.`);

// ---------------------------------------------------------------- review rollups
// data/reviews/{slug}/rollup.json (written by scripts/reviews-rollup.ts) feeds the review page's owner
// signals, document checks, sibling and rival blocks. Only rollups an editor has approved
// (status "approved") ship; drafts are ignored. claimIds are stripped to keep the bundle small;
// `npm run reviews:rollup -- check` validates them against claims.jsonl.
{
  const REVIEWS_DIR = path.join(ROOT, "data", "reviews");
  const ROLLUP_OUT = path.join(ROOT, "src", "lib", "rollup-data.ts");
  const slim = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(slim);
    if (v && typeof v === "object") {
      return Object.fromEntries(Object.entries(v as Record<string, unknown>).filter(([k]) => k !== "claimIds").map(([k, x]) => [k, slim(x)]));
    }
    return v;
  };
  const rollups: Record<string, unknown> = {};
  if (fs.existsSync(REVIEWS_DIR)) {
    for (const slug of fs.readdirSync(REVIEWS_DIR).sort()) {
      const f = path.join(REVIEWS_DIR, slug, "rollup.json");
      if (!fs.existsSync(f)) continue;
      const r = JSON.parse(fs.readFileSync(f, "utf8"));
      // Publication gate (data/reviews/_plan.json): an approved rollup ships only with a human sign-off, or when the
      // model was published before the gate existed (plan.tiers.done). Unsigned work can sit on a branch safely.
      const plan = fs.existsSync(path.join(REVIEWS_DIR, "_plan.json")) ? JSON.parse(fs.readFileSync(path.join(REVIEWS_DIR, "_plan.json"), "utf8")) : null;
      const cleared = !plan || plan.signoffs?.[slug] || plan.tiers?.done?.includes(slug);
      if (r.status === "approved" && cleared) rollups[slug] = cleanDeep(slim(r));
      else if (r.status === "approved") console.log(`rollup ${slug}: approved but no sign-off in data/reviews/_plan.json, not compiled`);
    }
  }
  fs.writeFileSync(
    ROLLUP_OUT,
    `// GENERATED by scripts/build-catalog.ts from data/reviews/*/rollup.json (approved only). Do not edit by hand.\n// Re-run: npm run build:catalog\n\nimport type { Rollup } from "./rollups";\n\nexport const rollupData: Record<string, Rollup> = ${JSON.stringify(rollups, null, 2)};\n`,
  );
  console.log(`Wrote ${path.relative(ROOT, ROLLUP_OUT)} with ${Object.keys(rollups).length} approved rollup(s).`);
}
