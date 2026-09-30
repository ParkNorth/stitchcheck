import { formatSpec, getProduct, type Product, type SpecKey } from "./products";
import { bandLabel } from "./price-bands";

export type WinnerRule = "higher" | "lower" | "none";

export interface CompareRow {
  label: string;
  /** Use a catalog spec key so values and winners come from the data... */
  key?: SpecKey | "priceBand" | "score";
  /** ...or hand-written cells per product slug. */
  cells?: Record<string, string>;
  /** Higher wins, lower wins, or no winner (ties stay plain). */
  rule: WinnerRule;
  /** Hand-declared winners for text rows (slugs). */
  winners?: string[];
}

export interface Comparison {
  slug: string;
  title: string;
  description: string;
  /** Exactly two, or exactly three for the one family exception. */
  productSlugs: string[];
  /** Which of the products gets "Our pick" / "Value pick" on the head card. */
  picks?: Record<string, "our-pick" | "value-pick">;
  summary: string;
  rows: CompareRow[];
  buyIf: { slug: string; text: string }[];
  relatedGuide: string;
  /** Breadcrumb label when the compare is a family, e.g. "Singer Heavy Duty family". */
  crumb?: string;
  /** First publish date. Never moves; `lastUpdated` does. */
  published: string;
  lastUpdated: string;
}

export const comparisons: Comparison[] = [
  {
    slug: "juki-tl-2010q-vs-tl-2000qi",
    title: "Juki TL-2010Q vs TL-2000Qi",
    description:
      "Same 1,500 spm motor and straight stitch. The 2010Q adds a pedal thread trimmer and speed conveniences; the 2000Qi keeps the price difference.",
    productSlugs: ["juki-tl-2010q", "juki-tl-2000qi"],
    picks: { "juki-tl-2010q": "our-pick" },
    summary:
      "Same motor, same stitch. Buy the 2010Q if you quilt every week and want the pedal trimmer; the 2000Qi if price matters more.",
    rows: [
      { label: "Price band", key: "priceBand", rule: "lower" },
      { label: "Max speed", key: "maxSpm", rule: "higher" },
      { label: "Stitch types", key: "stitchTypes", rule: "none" },
      {
        label: "Thread trimmer",
        cells: { "juki-tl-2010q": "Pedal + button", "juki-tl-2000qi": "Button" },
        rule: "none",
        winners: ["juki-tl-2010q"],
      },
      { label: "Presser foot lift", key: "presserFootLift", rule: "none" },
      { label: "Frame", key: "frame", rule: "none" },
      { label: "Our score", key: "score", rule: "higher" },
    ],
    buyIf: [
      {
        slug: "juki-tl-2010q",
        text: "You're at the machine most weeks and cutting thread hundreds of times per quilt. The pedal trimmer earns its price there.",
      },
      {
        slug: "juki-tl-2000qi",
        text: "You want the same speed and stitch for less, and pressing a button to trim doesn't bother you.",
      },
    ],
    relatedGuide: "how-to-choose-a-quilting-machine",
    published: "2026-09-29",
    lastUpdated: "2026-09-29",
  },
  {
    slug: "brother-1034d-vs-1034dx",
    title: "Brother 1034D vs 1034DX",
    description:
      "Two part numbers for the same 3/4-thread serger. The difference is the bundle and the day's price, not the machine.",
    productSlugs: ["brother-1034d", "brother-1034dx"],
    picks: { "brother-1034d": "value-pick" },
    summary:
      "Same stitches, same differential feed, same build. Buy whichever is cheaper the day you look, and compare the included feet before you decide the X is worth anything.",
    rows: [
      { label: "Price band", key: "priceBand", rule: "lower" },
      { label: "Threads", key: "threads", rule: "none" },
      { label: "Differential feed", key: "differentialFeed", rule: "none" },
      { label: "Stitch types", key: "stitchTypes", rule: "none" },
      { label: "Included feet", key: "includedFeet", rule: "none" },
      { label: "Weight", key: "weightLb", rule: "none" },
      { label: "Our score", key: "score", rule: "higher" },
    ],
    buyIf: [
      { slug: "brother-1034d", text: "It is in stock and cheaper today. You get the same serger." },
      { slug: "brother-1034dx", text: "The bundle lists a foot you would have bought anyway, or it is the one on sale." },
    ],
    relatedGuide: "what-is-a-serger",
    published: "2026-09-29",
    lastUpdated: "2026-09-29",
  },
  {
    slug: "singer-4423-vs-4432-vs-4452",
    title: "Singer 4423 vs 4432 vs 4452",
    description:
      "The Singer Heavy Duty family compared as people search it: one motor, one speed, three stitch counts and three bundles.",
    productSlugs: ["singer-4423", "singer-4432", "singer-4452"],
    picks: { "singer-4452": "value-pick" },
    summary:
      "Same motor, same speed. Buy the 4452 if you'd use the extra presser feet, the 4423 if you won't. The 4432 is hard to justify between them.",
    crumb: "Singer Heavy Duty family",
    rows: [
      { label: "Price band", key: "priceBand", rule: "lower" },
      { label: "Built-in stitches", key: "stitchCount", rule: "higher" },
      { label: "Max speed", key: "maxSpm", rule: "higher" },
      { label: "Buttonhole", key: "buttonhole", rule: "none" },
      { label: "Presser feet included", key: "includedFeet", rule: "none" },
      { label: "Our score", key: "score", rule: "higher" },
    ],
    buyIf: [
      { slug: "singer-4423", text: "You want the family motor and speed at the lowest price and will not use the extra feet." },
      { slug: "singer-4432", text: "It is on sale below the 4423. Otherwise skip it." },
      { slug: "singer-4452", text: "You would buy the extra presser feet anyway. The bundle is the whole difference." },
    ],
    relatedGuide: "sewing-machine-for-thick-fabric",
    published: "2026-09-29",
    lastUpdated: "2026-09-29",
  },
  {
    slug: "brother-1034d-vs-juki-mo-654de",
    title: "Brother 1034D vs Juki MO-654DE",
    description:
      "The value serger against our pick. Same thread counts on paper; the Juki is the steadier build for people who serge every week.",
    productSlugs: ["brother-1034d", "juki-mo-654de"],
    picks: { "juki-mo-654de": "our-pick", "brother-1034d": "value-pick" },
    summary:
      "Buy the Brother if a serger is a few-times-a-year tool. Buy the Juki if you will serge every week; it stays in adjustment and adds a 2-thread option.",
    rows: [
      { label: "Price band", key: "priceBand", rule: "lower" },
      { label: "Threads", key: "threads", rule: "none", winners: ["juki-mo-654de"] },
      { label: "Differential feed", key: "differentialFeed", rule: "none" },
      { label: "Max speed", key: "maxSpm", rule: "higher" },
      { label: "Weight", key: "weightLb", rule: "none" },
      { label: "Our score", key: "score", rule: "higher" },
    ],
    buyIf: [
      { slug: "brother-1034d", text: "You want to finish seams without spending more than the sewing machine cost, and you serge occasionally." },
      { slug: "juki-mo-654de", text: "You serge every week and want a machine that holds tension and adds a 2-thread option." },
    ],
    relatedGuide: "serger-vs-sewing-machine",
    published: "2026-09-29",
    lastUpdated: "2026-09-29",
  },
];

export const comparisonsBySlug: Record<string, Comparison> = Object.fromEntries(
  comparisons.map((c) => [c.slug, c]),
);

export function getComparison(slug: string): Comparison | undefined {
  return comparisonsBySlug[slug];
}

export function comparisonsForProduct(slug: string): Comparison[] {
  return comparisons.filter((c) => c.productSlugs.includes(slug));
}

export interface ResolvedCell {
  slug: string;
  text: string;
  winner: boolean;
  missing: boolean;
}

export interface ResolvedRow {
  label: string;
  cells: ResolvedCell[];
}

function rawValue(p: Product, row: CompareRow): { text: string | null; num: number | null } {
  if (row.cells) {
    const t = row.cells[p.slug] ?? null;
    return { text: t, num: null };
  }
  if (row.key === "priceBand") return { text: bandLabel(p.priceBand), num: p.priceBand };
  if (row.key === "score") return { text: p.score.toFixed(1), num: p.score };
  if (row.key) {
    const sv = p.specs[row.key];
    const v = sv.value;
    const num = typeof v === "number" ? v : null;
    return { text: formatSpec(row.key, v), num };
  }
  return { text: null, num: null };
}

/** Compute cells and winners. Ties stay plain; shared wins highlight every winning cell. */
export function resolveRows(c: Comparison): { rows: ResolvedRow[]; tally: Record<string, number>; ties: number } {
  const prods = c.productSlugs.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));
  const tally: Record<string, number> = Object.fromEntries(prods.map((p) => [p.slug, 0]));
  let ties = 0;
  const rows: ResolvedRow[] = c.rows.map((row) => {
    const vals = prods.map((p) => ({ p, ...rawValue(p, row) }));
    let winners = new Set<string>();
    if (row.winners) {
      winners = new Set(row.winners);
    } else if (row.rule !== "none") {
      const nums = vals.filter((v) => v.num !== null).map((v) => v.num as number);
      if (nums.length === vals.length && nums.length > 1) {
        const best = row.rule === "higher" ? Math.max(...nums) : Math.min(...nums);
        const winning = vals.filter((v) => v.num === best);
        if (winning.length < vals.length) winning.forEach((v) => winners.add(v.p.slug));
      }
    }
    if (winners.size === 0) ties += 1;
    else winners.forEach((slug) => (tally[slug] = (tally[slug] ?? 0) + 1));
    return {
      label: row.label,
      cells: vals.map((v) => ({
        slug: v.p.slug,
        text: v.text ?? "[verify]",
        winner: winners.has(v.p.slug),
        missing: v.text === null,
      })),
    };
  });
  return { rows, tally, ties };
}
