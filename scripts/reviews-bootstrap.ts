#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows are loose JSON */
/**
 * Create the starting files for a new model's review ledger from its spec. Offline and deterministic.
 *
 *   npm run reviews:bootstrap -- --slug singer-4452            # writes only files that do not exist yet
 *   npm run reviews:bootstrap -- --slug singer-4452 --force    # overwrite queries.json and editor.json
 *
 * Writes data/reviews/{slug}/queries.json (model aliases, confusable siblings, Reddit searches and subreddits,
 * SearchAPI queries), editor.json (siblings, features, rivals, extra-mention regex, empty summaries and scope
 * rules, notes and an ownerNote template to adjust) and a manufacturer.json skeleton listing the maker page
 * from the spec. Siblings are other catalog models of the same brand whose name contains this model or is
 * contained in it, plus the spec's crossShop machines. Review the siblings before collecting: a missed
 * sibling is how 1034DX reviews end up under the 1034D.
 */
import fs from "node:fs";
import path from "node:path";

const a = process.argv.slice(2);
const val = (n: string) => a[a.indexOf(n) + 1];
const slug = val("--slug");
const FORCE = a.includes("--force");
if (!slug) throw new Error("usage: reviews-bootstrap.ts --slug <slug> [--force]");
const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "data", "reviews", slug);
const specs: Record<string, any> = Object.fromEntries(
  fs.readdirSync(path.join(ROOT, "data", "specs")).filter((f) => f.endsWith(".json")).map((f) => {
    const d = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "specs", f), "utf8"));
    return [d.slug, d];
  }),
);
const spec = specs[slug];
if (!spec) throw new Error(`no data/specs/${slug}.json`);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Regex source for a model name: tokens joined by optional separators, with a suffix guard so 1034D never matches 1034DX. */
/** "ST371HD Strong & Tough" is typed as "ST371HD": keep the code, drop trailing marketing words. */
const shortName = (m: string) => m.replace(/\s*\([^)]*\)/g, "").trim().replace(/^([A-Za-z]*-?\d+[A-Za-z]*)\s+[A-Za-z&].*$/, "$1");
const modelPattern = (m0: string) => {
  const m = m0.match(/\([^)]+\)/) ? m0 : shortName(m0);
  // "Vibrant (BL460B)": match the part people type, and the parenthetical code as an alternative.
  const paren = m.match(/\(([^)]+)\)/)?.[1];
  const base = m.replace(/\s*\([^)]*\)/g, "").trim();
  const one = (t: string) => t.toLowerCase().split(/[\s-]+/).filter(Boolean).map(esc).join("[\\s-]*") + "(?![a-z0-9])";
  const alts = [one(base)];
  if (paren) alts.push(one(paren));
  // Reviewers type the bare number: "Heavy Duty 4423" is "4423"; "TL-2010Q" is "2010Q".
  const core = base.match(/(\d{3,}[A-Za-z]*)\s*$/)?.[1];
  if (core && norm(core) !== norm(base) && (/[A-Za-z]/.test(core) || /\s/.test(base))) alts.push(one(core));
  return alts.join("|");
};
const bareModel = (m: string) => shortName(m);

const me = norm(spec.model);
const siblings = Object.values(specs).filter((o: any) => {
  if (o.slug === slug || o.brand !== spec.brand) return false;
  // Same series (Pearl Line, TL, Heavy Duty) is the usual way buyers confuse near-identical models.
  if (spec.series && o.series && norm(o.series) === norm(spec.series) && o.type === spec.type) return true;
  // Same product line: equal leading letters (MO-654DE and MO-644D, DDL-8700 and DDL-5550, TL-2010Q and TL-2000Qi).
  const lead = (m: string) => norm(m).match(/^[a-z]+/)?.[0] ?? "";
  if (o.type === spec.type && lead(o.model).length >= 2 && lead(o.model) === lead(spec.model)) return true;
  const you = norm(o.model);
  return you.length >= 3 && me.length >= 3 && (you.startsWith(me) || me.startsWith(you) || you.includes(me) || me.includes(you));
});
const cross = (spec.crossShop ?? []).map((c: any) => specs[c.slug]).filter(Boolean);
const sibSet = new Map<string, any>();
for (const s of siblings) sibSet.set(s.slug, s);

// Aliases: as written, without separators, and a bare numeric-plus-letters core (TL-2010Q -> 2010Q).
const short = shortName(spec.model);
const aliases = new Set<string>([short, `${spec.brand} ${short}`]);
aliases.add(short.replace(/[\s-]+/g, ""));
const core = short.match(/(\d{3,}[A-Za-z]*)\s*$/)?.[1];
if (core && norm(core) !== norm(short) && (/[A-Za-z]/.test(core) || /\s/.test(short))) aliases.add(core);

const SUBS: Record<string, string[]> = {
  serger: ["sewing", "SewingForBeginners", "sewhelp", "serging", "quilting", "myog"],
  coverstitch: ["sewing", "SewingForBeginners", "sewhelp", "serging"],
  mechanical: ["sewing", "sewhelp", "SewingForBeginners", "quilting", "myog", "BagMaking"],
  computerized: ["sewing", "sewhelp", "quilting", "SewingForBeginners", "embroidery"],
  "long-arm": ["quilting", "longarm", "Quilt"],
};
const type = spec.type as string;
const queries = {
  slug,
  model_names: [...aliases],
  confusable_siblings: [...new Set([...sibSet.values()].map((s) => bareModel(s.model)))],
  reddit: {
    searches: [`${spec.brand} ${spec.model}`, `${spec.model}`, `${spec.model} review`, `${spec.model} problems`, `${spec.model} vs`],
    subreddits: SUBS[type] ?? SUBS.mechanical,
  },
  searchapi: [`${spec.brand} ${spec.model} review`, `${spec.brand} ${spec.model} owner review problems`, `${spec.brand} ${spec.model} forum`, `${spec.brand} ${spec.model} vs`, `${spec.brand} ${spec.model} patternreview`],
  retailers: ["amazon.com", "walmart.com", "sewingmachinesplus.com", "brother-usa.com", "jukijunkies.com", "joann.com"].filter(Boolean),
  forums: ["patternreview.com", "quiltingboard.com", "sewingmachineforum.com"],
  youtube: [`${spec.brand} ${spec.model} review`],
};

const rivalSpecs = [...cross].filter((c: any) => c.slug !== slug);
const editor = {
  notes: [
    "Counts are statements extracted from each review, comment or page and grouped by theme. They are not a poll, a rating or a failure rate.",
    "Retailer reviews are seller-collected and skew positive. Where a retailer listing was sampled, the page's own totals are shown above.",
    "Reddit and forum posts are self-selected, and many are people asking for help, so problems are over-represented.",
    "Themes were tagged by a model and the quotes behind them were machine-checked against the source text. Examples link to the original post.",
  ],
  ownerNote: "Read the problem counts below with care. Reddit threads about this machine are mostly people asking for help, so problems are over-represented. The retailers' own ratings under 'How we collected this' are the better gauge of overall satisfaction.",
  siblings: [...sibSet.values()].map((s: any) => ({ model: bareModel(s.model), label: `${s.brand} ${bareModel(s.model)}`, pattern: modelPattern(s.model) })),
  features: [
    ["price|\\$|cost|cheap|expens", "Price"],
    ["weight|lbs|pounds|heav|light(er)? ?weight", "Weight"],
    ["led|light|bulb|lamp", "Work light"],
    ["motor|watt|amp|power", "Motor power"],
    ["feet|foot|accessor|bundle|box|included", "Accessories and box contents"],
    ["plastic|metal|build|sturdy|flimsy|durab", "Build"],
    ["part|plate|blade|clamp|interchang", "Parts compatibility"],
    ["warrant", "Warranty"],
  ],
  rivals: rivalSpecs.map((r: any) => [modelPattern(r.model), `${r.brand} ${bareModel(r.model)}`]),
  themeRemap: [],
  others: [...sibSet.values(), ...rivalSpecs].map((s: any) => modelPattern(s.model)).join("|") || "vs\\.?|versus",
  scopeRules: [],
  siblingSummaries: {},
  siblingExtras: {},
};
const manufacturer = {
  slug,
  collected: null,
  purpose: "First-party facts from the maker's own documents, compared against data/specs/" + slug + ".json. Research input for the editor; not a spec file.",
  documents: [{ id: "maker-page", url: spec.manufacturerUrl ?? null, type: "product page", fetched: null, note: "TODO: fetch, then add the manual, warranty and brochure PDFs with their pages" }],
  facts: [],
};

fs.mkdirSync(DIR, { recursive: true });
const write = (f: string, v: unknown, always = false) => {
  const p = path.join(DIR, f);
  if (fs.existsSync(p) && !(always && FORCE)) return console.log(`kept   ${f}`);
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
  console.log(`wrote  ${f}`);
};
write("queries.json", queries, true);
write("editor.json", editor, true);
write("manufacturer.json", manufacturer);
console.log(`siblings: ${queries.confusable_siblings.join(", ") || "none"}; rivals from crossShop: ${rivalSpecs.map((r: any) => r.model).join(", ") || "none"}`);
console.log("Review the siblings and editor.json before collecting.");
