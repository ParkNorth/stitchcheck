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
  lastUpdated: string;
}

export const comparisons: Comparison[] = [
  {
    slug: "juki-tl-2010q-vs-tl-2000qi",
    title: "Juki TL-2010Q vs TL-2000Qi",
    description:
      "Same 1,500 spm straight stitch. Owners say the 2010Q adds a speed control and sub-tension dial; Juki's page gives the 2000Qi a trimmer on heel rock and a push button.",
    productSlugs: ["juki-tl-2010q", "juki-tl-2000qi"],
    picks: { "juki-tl-2010q": "our-pick" },
    summary:
      "Same stitch and speed ceiling. Buy the 2010Q if owner-reported speed control matters to you; the 2000Qi if you accept foot-control speed and a lower price.",
    rows: [
      { label: "Price band", key: "priceBand", rule: "lower" },
      { label: "Max speed", key: "maxSpm", rule: "higher" },
      { label: "Stitch types", key: "stitchTypes", rule: "none" },
      {
        label: "Thread trimmer",
        cells: { "juki-tl-2010q": "Pedal + button", "juki-tl-2000qi": "Pedal + button" },
        rule: "none",
        winners: [],
      },
      { label: "Presser foot lift", key: "presserFootLift", rule: "none" },
      { label: "Frame", key: "frame", rule: "none" },
      { label: "Our score", key: "score", rule: "higher" },
    ],
    buyIf: [
      {
        slug: "juki-tl-2010q",
        text: "You want the speed control owners say the 2010Q adds, and you will pay the gap Juki lists: $2,169 against $1,799.",
      },
      {
        slug: "juki-tl-2000qi",
        text: "You want the same 1,500 spm straight stitch with a trimmer on heel rock and a push button, and foot-control speed does not bother you.",
      },
    ],
    relatedGuide: "how-to-choose-a-quilting-machine",
    lastUpdated: "2026-10-01",
  },
  {
    slug: "brother-1034d-vs-1034dx",
    title: "Brother 1034D vs 1034DX",
    description:
      "The same 3/4-thread serger with the same three feet. Brother's own pages give the DX an LED and less weight, the D an accessory tray, and list the DX $30 cheaper.",
    productSlugs: ["brother-1034d", "brother-1034dx"],
    picks: { "brother-1034d": "value-pick" },
    summary:
      "Same stitches, same 1,300 spm, same differential feed and the same three feet. Brother's pages give the DX an LED light and 0.9 lb less weight; the D keeps an accessory storage tray. Brother lists the DX at $289.99 and the D at $319.99, so buy whichever is cheaper the day you look, and prefer the DX if you want the LED.",
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
      { slug: "brother-1034d", text: "It is cheaper where you shop, or you want the accessory storage tray." },
      { slug: "brother-1034dx", text: "You want an LED work light and a lighter body, and it is at or below the 1034D price." },
    ],
    relatedGuide: "what-is-a-serger",
    lastUpdated: "2026-10-01",
  },
  {
    slug: "singer-4423-vs-4432-vs-4452",
    title: "Singer 4423 vs 4432 vs 4452",
    description:
      "The Singer Heavy Duty family compared as people search it: Singer's own pages list 23, 32 and 32 stitches and three bundles.",
    productSlugs: ["singer-4423", "singer-4432", "singer-4452"],
    picks: { "singer-4452": "value-pick" },
    summary:
      "Singer's pages list 23 stitches for the 4423 and the same 32 for the 4432 and 4452, with the 4452 adding a walking foot, non-stick foot, clearance plate and heavy duty needles. Buy the 4452 if you would use the extra feet, the 4423 if you will not. The 4432 is hard to justify between them.",
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
      { slug: "singer-4423", text: "You want the lowest price and will not use the extra feet or the extra stitches." },
      { slug: "singer-4432", text: "It is on sale below the 4452 and you want 32 stitches without the extra feet. Otherwise skip it." },
      { slug: "singer-4452", text: "You would buy the extra presser feet anyway. Singer lists the same 32 stitches as the 4432; the bundle is the difference." },
    ],
    relatedGuide: "sewing-machine-for-thick-fabric",
    lastUpdated: "2026-10-01",
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
    lastUpdated: "2026-09-29",
  },
  {
    slug: "singer-4411-vs-4452",
    title: "Singer 4411 vs 4452",
    description:
      "Same 1,100 spm, 84 W head on Singer's pages. The 4452 adds 21 stitches, a one-step buttonhole and a walking foot; the 4411 is the stripped base model.",
    productSlugs: ["singer-4411", "singer-4452"],
    picks: { "singer-4452": "value-pick" },
    summary:
      "Singer lists the same 1,100 spm, 84 W motor, metal interior frame and 6.25 in needle to tower for both, and owners say they share a frame and motor. The 4452 adds 32 stitches against 11, a one-step buttonhole and a walking foot, non-stick foot and clearance plate in the box; buy the 4411 only when the dealer price gap is real and you will not use any of that.",
    crumb: "Singer Heavy Duty family",
    rows: [
      { label: "Price band", key: "priceBand", rule: "lower" },
      { label: "Built-in stitches", key: "stitchCount", rule: "higher" },
      { label: "Max speed", key: "maxSpm", rule: "higher" },
      { label: "Buttonhole", key: "buttonhole", rule: "none" },
      { label: "Included feet", key: "includedFeet", rule: "none" },
      {
        label: "Motor and frame",
        cells: {
          "singer-4411": "84 W, 0.7 A; metal interior frame, stainless steel bedplate",
          "singer-4452": "84 W, 0.7 A; metal interior frame, stainless steel bedplate",
        },
        rule: "none",
        winners: [],
      },
      {
        label: "Needle threader",
        cells: {
          "singer-4411": "None listed (manual)",
          "singer-4452": "[verify]",
        },
        rule: "none",
        winners: [],
      },
      { label: "Throat space", key: "throatIn", rule: "none" },
      { label: "Our score", key: "score", rule: "higher" },
    ],
    buyIf: [
      {
        slug: "singer-4411",
        text: "The dealer price is clearly below the 4452, you will not use a walking foot, and 11 stitches with a four-step buttonhole are enough for hems, repairs and canvas. Owners are split on thick fabric and report defects as the largest theme, so keep the return window open.",
      },
      {
        slug: "singer-4452",
        text: "You would buy the walking foot and non-stick foot anyway, or you want the one-step buttonhole and 32 stitches. Owners report denim and canvas hems going well and thick strap stacks going badly, with threading and tension complaints from a minority.",
      },
    ],
    relatedGuide: "sewing-machine-for-thick-fabric",
    lastUpdated: "2026-10-02",
  },
  {
    slug: "singer-4411-vs-4423",
    title: "Singer 4411 vs 4423",
    description:
      "Singer lists the same 1,100 spm, 84 W motor and frame on both. The 4423 adds 12 stitches, a one-step buttonhole and a needle threader; the 4411 is the stripped version.",
    productSlugs: ["singer-4411", "singer-4423"],
    picks: { "singer-4423": "our-pick" },
    summary:
      "Singer lists the same 1,100 spm, 84 W motor, metal interior frame and 6.25 in needle-to-tower figure on both, so this is a feature gap, not a power gap. The 4423 adds 12 stitches, a one-step buttonhole and a built-in needle threader, and the 4411 only wins on a real price gap.",
    rows: [
      { label: "Price band", key: "priceBand", rule: "lower" },
      { label: "Built-in stitches", key: "stitchCount", rule: "higher" },
      { label: "Buttonhole", key: "buttonhole", rule: "none", winners: ["singer-4423"] },
      {
        label: "Needle threader",
        cells: {
          "singer-4411": "Manual; none listed",
          "singer-4423": "Built-in",
        },
        rule: "none",
        winners: ["singer-4423"],
      },
      { label: "Max speed", key: "maxSpm", rule: "higher" },
      {
        label: "Motor and frame",
        cells: {
          "singer-4411": "84 W, 0.7 A; metal interior frame, stainless steel bedplate",
          "singer-4423": "84 W, 0.7 A; metal interior frame, stainless steel bedplate",
        },
        rule: "none",
        winners: [],
      },
      { label: "Weight", key: "weightLb", rule: "none" },
      {
        label: "Owner defect reports",
        cells: {
          "singer-4411": "43 voices, 32 owners (largest theme)",
          "singer-4423": "40 voices, 27 owners (largest theme)",
        },
        rule: "none",
        winners: [],
      },
      { label: "Our score", key: "score", rule: "higher" },
    ],
    buyIf: [
      {
        slug: "singer-4411",
        text: "The 4423 is not close in price where you shop, and you will live with a four-step buttonhole, a manual threader and 11 stitches for hems, repairs and canvas.",
      },
      {
        slug: "singer-4423",
        text: "The price gap is small, which Singer's list prices suggest it is. You get the one-step buttonhole, built-in threader and 23 stitches on the same motor and frame; owners report mixed reliability on both.",
      },
    ],
    relatedGuide: "sewing-machine-for-thick-fabric",
    lastUpdated: "2026-10-02",
  },
{
    slug: "janome-hd3000-vs-hd5000",
    title: "Janome HD3000 vs HD5000",
    description:
      "Janome's spec tables match line for line: 18 stitches, 6.5 mm width, 18.7 lb. The real decision is bundle, needle threader and dealer price.",
    productSlugs: ["janome-hd3000", "janome-hd5000"],
    picks: { "janome-hd3000": "our-pick" },
    summary:
      "On Janome's own pages the two machines share 18 stitches, 6.5 mm zigzag width, 4 mm length, 18.7 lb and a 6.5 x 4.6 in workspace, and neither page names a speed, a motor rating or a needle-to-arm throat. What decides it is the box and the price: Janome lists a built-in needle threader and 7 feet for the HD5000, while the HD3000 has the larger owner read and a maker price on record. We lean to the HD3000 on that evidence, not on a spec gap.",
    rows: [
      { label: "Price band", key: "priceBand", rule: "lower" },
      { label: "Built-in stitches", key: "stitchCount", rule: "higher" },
      {
        label: "Zigzag width",
        cells: { "janome-hd3000": "6.5 mm (Janome)", "janome-hd5000": "6.5 mm (Janome)" },
        rule: "none",
        winners: [],
      },
      { label: "Weight", key: "weightLb", rule: "none" },
      { label: "Frame", key: "frame", rule: "none" },
      { label: "Included feet", key: "includedFeet", rule: "none" },
      {
        label: "Needle threader",
        cells: { "janome-hd3000": "[verify]", "janome-hd5000": "Built-in, one hand (Janome)" },
        rule: "none",
        winners: [],
      },
      { label: "Max speed", key: "maxSpm", rule: "higher" },
      { label: "Our score", key: "score", rule: "higher" },
    ],
    buyIf: [
      {
        slug: "janome-hd3000",
        text: "You want Janome's mechanical aluminum-frame HD with the larger owner read behind it, and you accept that owners split on heavy fabric and reliability. Buy from an authorized US dealer so the 25 year warranty stands.",
      },
      {
        slug: "janome-hd5000",
        text: "The dealer quote is at or below the HD3000 and you want the needle threader and 7 feet Janome lists. If you want the quilting kit in the box, buy the Black Edition, where Janome lists it as standard.",
      },
    ],
    relatedGuide: "sewing-machine-for-thick-fabric",
    lastUpdated: "2026-10-02",
  },
  {
    slug: "janome-hd1000-vs-hd3000",
    title: "Janome HD1000 vs HD3000",
    description:
      "Janome lists the HD3000 with 18 stitches, a rotary hook and foot pressure adjustment; the HD1000 has 14 stitches and none listed.",
    productSlugs: ["janome-hd1000", "janome-hd3000"],
    picks: { "janome-hd3000": "our-pick", "janome-hd1000": "value-pick" },
    summary:
      "Both are mechanical Janome zigzag machines with an aluminum frame per Janome and a household-use-only manual. Janome's pages give the HD3000 the hardware the HD1000 lacks: 18 stitches, a top loading rotary hook, a 5-piece feed dog, 6.5 mm width and listed foot pressure adjustment.",
    rows: [
      { label: "Price band", key: "priceBand", rule: "lower" },
      { label: "Built-in stitches", key: "stitchCount", rule: "higher" },
      {
        label: "Buttonhole",
        cells: {
          "janome-hd1000": "4-step",
          "janome-hd3000": "One automatic (Janome's table says four-step, its prose says one-step)",
        },
        rule: "none",
        winners: [],
      },
      {
        label: "Max zigzag width",
        cells: { "janome-hd1000": "5 mm", "janome-hd3000": "6.5 mm" },
        rule: "none",
        winners: ["janome-hd3000"],
      },
      {
        label: "Hook and feed dog",
        cells: {
          "janome-hd1000": "Front-loading vertical oscillating hook; 3-piece feed dog",
          "janome-hd3000": "Top loading full rotary hook; 5-piece feed dog",
        },
        rule: "none",
        winners: ["janome-hd3000"],
      },
      {
        label: "Presser foot pressure",
        cells: {
          "janome-hd1000": "Not listed by Janome; owners say none",
          "janome-hd3000": "Adjustable dial per Janome's manual",
        },
        rule: "none",
        winners: ["janome-hd3000"],
      },
      { label: "Max speed", key: "maxSpm", rule: "none" },
      { label: "Weight", key: "weightLb", rule: "none" },
      { label: "Our score", key: "score", rule: "higher" },
    ],
    buyIf: [
      {
        slug: "janome-hd1000",
        text: "You want a first Janome mechanical for garments, mending and the odd denim hem, and the lower price band matters more than 4 extra stitches. Owners report jams and heavy-fabric stops, so skip it for bags, webbing or leather.",
      },
      {
        slug: "janome-hd3000",
        text: "You want foot pressure adjustment, a top-loading bobbin and a 6.5 mm zigzag for denim, canvas and mending. Owners are split on heavy fabric and reliability, so buy from an authorized Janome dealer with return terms.",
      },
    ],
    relatedGuide: "sewing-machine-for-thick-fabric",
    lastUpdated: "2026-10-02",
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
