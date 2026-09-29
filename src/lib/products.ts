import { catalogData, type CatalogEntry } from "./catalog-data";
import { bandForPrice, type PriceBand } from "./price-bands";

/**
 * The catalog. One entry per model page.
 *
 * Two layers, merged here:
 * 1. `catalogData` (generated from `data/specs/{slug}.json` by the research
 *    loop): every published spec with a source URL, prices seen, claims,
 *    conflicts, owner themes and the editorial draft.
 * 2. `siteFields` below: the decisions only an editor makes. Score, which hubs
 *    the model sits in, price band when no price was seen, alternatives, the
 *    buy route, image, dates.
 *
 * `null` in a spec means the manufacturer does not publish it. It renders as
 * [verify] on the page. Never guess.
 */

export type Brand =
  | "Juki"
  | "Janome"
  | "Brother"
  | "Singer"
  | "Baby Lock"
  | "Bernina"
  | "Handi Quilter"
  | "Grace Company";

export type MachineType = "mechanical" | "computerized" | "serger" | "coverstitch" | "long-arm";

export const MACHINE_TYPE_LABEL: Record<MachineType, string> = {
  mechanical: "Mechanical",
  computerized: "Computerized",
  serger: "Serger",
  coverstitch: "Coverstitch",
  "long-arm": "Long-arm",
};

export const MACHINE_TYPES: MachineType[] = ["mechanical", "computerized", "serger", "coverstitch", "long-arm"];

export type Job = "heavy-duty" | "serger" | "quilting" | "beginner";

export const JOB_LABEL: Record<Job, string> = {
  "heavy-duty": "Heavy duty",
  serger: "Sergers",
  quilting: "Quilting",
  beginner: "First serious machine",
};

export const JOB_HUB_HREF: Record<Job, string> = {
  "heavy-duty": "/best-heavy-duty-sewing-machines",
  serger: "/best-sergers",
  quilting: "/best-quilting-machines",
  beginner: "/best-sewing-machines-for-beginners",
};

export type Sourced<T> = { value: T | null; source?: string | null };

export interface Specs {
  stitchTypes: Sourced<string>;
  stitchCount: Sourced<number>;
  maxSpm: Sourced<number>;
  threads: Sourced<string>;
  differentialFeed: Sourced<string>;
  throatIn: Sourced<number>;
  needleSystem: Sourced<string>;
  presserFootLift: Sourced<string>;
  threadTrimmer: Sourced<string>;
  feedSystem: Sourced<string>;
  buttonhole: Sourced<string>;
  motor: Sourced<string>;
  frame: Sourced<string>;
  weightLb: Sourced<number>;
  dimensionsIn: Sourced<string>;
  includedFeet: Sourced<string>;
  warrantyUs: Sourced<string>;
}

export type SpecKey = keyof Specs;

export const SPEC_KEYS: SpecKey[] = [
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
];

export const SPEC_LABEL: Record<SpecKey, string> = {
  stitchTypes: "Stitch types",
  stitchCount: "Built-in stitches",
  maxSpm: "Max speed",
  threads: "Threads",
  differentialFeed: "Differential feed",
  throatIn: "Throat space",
  needleSystem: "Needle system",
  presserFootLift: "Presser foot lift",
  threadTrimmer: "Thread trimmer",
  feedSystem: "Feed system",
  buttonhole: "Buttonhole",
  motor: "Motor / speed control",
  frame: "Frame",
  weightLb: "Weight",
  dimensionsIn: "Dimensions",
  includedFeet: "Included feet",
  warrantyUs: "Warranty (US)",
};

/** Rows shown on the single-model spec table, in order, per machine type. */
export const SPEC_ROWS_BY_TYPE: Record<MachineType, SpecKey[]> = {
  mechanical: [
    "stitchTypes",
    "stitchCount",
    "maxSpm",
    "throatIn",
    "presserFootLift",
    "threadTrimmer",
    "feedSystem",
    "buttonhole",
    "needleSystem",
    "motor",
    "frame",
    "weightLb",
    "dimensionsIn",
    "includedFeet",
    "warrantyUs",
  ],
  computerized: [
    "stitchTypes",
    "stitchCount",
    "maxSpm",
    "throatIn",
    "presserFootLift",
    "threadTrimmer",
    "feedSystem",
    "buttonhole",
    "needleSystem",
    "frame",
    "weightLb",
    "dimensionsIn",
    "includedFeet",
    "warrantyUs",
  ],
  serger: [
    "threads",
    "stitchTypes",
    "maxSpm",
    "differentialFeed",
    "feedSystem",
    "needleSystem",
    "presserFootLift",
    "frame",
    "weightLb",
    "dimensionsIn",
    "includedFeet",
    "warrantyUs",
  ],
  coverstitch: [
    "threads",
    "stitchTypes",
    "maxSpm",
    "differentialFeed",
    "needleSystem",
    "presserFootLift",
    "weightLb",
    "dimensionsIn",
    "includedFeet",
    "warrantyUs",
  ],
  "long-arm": [
    "throatIn",
    "maxSpm",
    "stitchTypes",
    "feedSystem",
    "needleSystem",
    "motor",
    "frame",
    "weightLb",
    "dimensionsIn",
    "includedFeet",
    "warrantyUs",
  ],
};

export function formatSpec(key: SpecKey, value: string | number | null | undefined): string | null {
  if (value === null || value === undefined || value === "") return null;
  switch (key) {
    case "maxSpm":
      return `${Number(value).toLocaleString("en-US")} spm`;
    case "throatIn":
      return `${value} in`;
    case "weightLb":
      return `${value} lb`;
    case "dimensionsIn":
      return `${value} in`;
    default:
      return String(value);
  }
}

export interface Check {
  title: string;
  body: string;
}

export interface Alternative {
  slug: string;
  /** Eyebrow on the alternatives card: "Cheaper", "Needs zigzag", "Go industrial". */
  label: string;
  note: string;
}

export interface Faq {
  q: string;
  a: string;
}

export type BuyRoute =
  | { kind: "retailer"; url: string }
  | { kind: "dealer"; url: string; label: string }
  | { kind: "none" };

export type Evidence = "owner" | "mixed" | "positioning";

export interface OwnerTheme {
  theme: string;
  tone: string;
  source: string | null;
}

export interface Product {
  slug: string;
  brand: Brand;
  model: string;
  name: string;
  series?: string;
  type: MachineType;
  industrial: boolean;
  jobs: Job[];
  scoredFor: Job;
  priceBand: PriceBand;
  priceUsdSeen: number | null;
  priceSeenDate: string | null;
  /** "Sewing Machines Plus" or "another dealer". */
  priceSeenAt: string;
  score: number;
  verdict: string;
  whoFor: string;
  skipIf: string;
  keySpec: string;
  reason: string;
  context: string;
  specs: Specs;
  strengths: string[];
  weaknesses: string[];
  checks: Check[];
  realCost: string[];
  alternatives: Alternative[];
  claims: string[];
  conflicts: string[];
  ownerThemes: OwnerTheme[];
  evidence: Evidence;
  faqs: Faq[];
  buy: BuyRoute;
  manufacturerUrl: string | null;
  sources: string[];
  discontinued: boolean;
  replacedBy: string | null;
  imageAlt: string;
  image: string | null;
  /** ISO date the specs were checked against a live manufacturer page. null = pending. */
  specsVerified: string | null;
  lastUpdated: string;
}

interface SiteFields {
  score: number;
  scoredFor: Job;
  /** Required when no price was seen; otherwise derived and cross-checked by the validator. */
  priceBand?: PriceBand;
  jobs?: Job[];
  /** Decoder code override when the research cache uses the marketing name ("Heavy Duty" -> "HD"). */
  series?: string;
  reason: string;
  context: string;
  alternatives: Alternative[];
  faqs?: Faq[];
  buy?: BuyRoute;
  imageAlt: string;
  image?: string | null;
  specsVerified?: string | null;
  lastUpdated: string;
  /** Editorial overrides when the research draft needs a tighter line. */
  verdict?: string;
  whoFor?: string;
  skipIf?: string;
  keySpec?: string;
  strengths?: string[];
  weaknesses?: string[];
  checks?: Check[];
  realCost?: string[];
}

const DEALER_ONLY_BRANDS = new Set<string>(["Baby Lock", "Bernina"]);

const DEALER_LOCATOR: Record<string, string> = {
  "Baby Lock": "https://babylock.com/find-a-retailer",
  Bernina: "https://www.bernina.com/en-US/Dealer-Locator",
  "Handi Quilter": "https://handiquilter.com/find-a-retailer/",
  "Grace Company": "https://graceframe.com/en/dealers",
  Juki: "https://www.jukihome.com/dealers",
  Janome: "https://www.janome.com/dealer-locator/",
  Brother: "https://www.brother-usa.com/store-locator",
  Singer: "https://www.singer.com/pages/store-locator",
};

function defaultBuy(c: CatalogEntry): BuyRoute {
  if (DEALER_ONLY_BRANDS.has(c.brand)) {
    return { kind: "dealer", url: DEALER_LOCATOR[c.brand], label: `Find a ${c.brand} dealer` };
  }
  if (c.retailerUrl && /sewingmachinesplus\.com/i.test(c.retailerUrl)) {
    return { kind: "retailer", url: c.retailerUrl };
  }
  return { kind: "none" };
}

const siteFields: Record<string, SiteFields> = {
  // ---------------------------------------------------------------- Juki TL
  "juki-tl-2010q": {
    score: 8.6,
    scoredFor: "quilting",
    reason: "Fastest domestic straight stitch here; the pick if heavy fabric is weekly work.",
    context: "Straight-stitch quilter · in Heavy duty and Quilting hubs",
    verdict: "The fastest domestic straight stitch you can put on a table, and nothing else.",
    whoFor: "You quilt or sew canvas and denim weekly, and already own a zigzag machine or serger.",
    skipIf: "It would be your only machine. No zigzag, no buttonholes, no stretch stitch.",
    keySpec: "1,500 spm · straight stitch · auto trimmer",
    realCost: ["Machine $$$ 1–2k", "TL-series feet, if not bundled", "A solid table", "A zigzag machine, if this is your first"],
    alternatives: [
      { slug: "juki-tl-2000qi", label: "Cheaper", note: "Same speed, fewer conveniences." },
      { slug: "janome-hd3000", label: "Needs zigzag", note: "Slower, but a full stitch set." },
      { slug: "juki-ddl-8700", label: "Go industrial", note: "Needs a table and floor space." },
    ],
    imageAlt: "Juki TL-2010Q straight-stitch sewing and quilting machine, three-quarter view",
    lastUpdated: "2026-09-29",
  },
  "juki-tl-2000qi": {
    score: 8.3,
    scoredFor: "quilting",
    reason: "Same speed and stitch as the 2010Q, fewer conveniences, lower band.",
    context: "Straight-stitch quilter · in Quilting hub",
    keySpec: "1,500 spm · button trimmer",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Pedal trimmer", note: "Same stitch, more conveniences." },
      { slug: "brother-pq1600s", label: "Cross-shop", note: "Brother's straight-stitch quilter." },
      { slug: "janome-hd3000", label: "Needs zigzag", note: "Full stitch set, slower." },
    ],
    imageAlt: "Juki TL-2000Qi straight-stitch sewing and quilting machine",
    lastUpdated: "2026-09-29",
  },
  "juki-tl-18qvp": {
    series: "TL",
    score: 8.5,
    scoredFor: "quilting",
    reason: "The TL with more arm and a dealer price; the step before a frame.",
    context: "Straight-stitch quilter · in Quilting hub",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Cheaper", note: "The standard TL arm." },
      { slug: "handi-quilter-moxie", label: "Frame", note: "The next tier up." },
      { slug: "brother-pq1600s", label: "Cross-shop", note: "Brother's straight-stitch quilter." },
    ],
    imageAlt: "Juki TL-18QVP straight-stitch quilting machine",
    lastUpdated: "2026-09-29",
  },
  // --------------------------------------------------------------- Juki DDL
  "juki-ddl-8700": {
    score: 8.4,
    scoredFor: "heavy-duty",
    reason: "True industrial lockstitch for a home workshop, if you have the floor space.",
    context: "Industrial lockstitch · in Heavy duty hub",
    verdict: "A real factory lockstitch for a home workshop, if you have a table, a motor and the floor space.",
    keySpec: "5,500 spm · industrial lockstitch · table-mounted",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Portable", note: "Fast straight stitch that lives on a table." },
      { slug: "janome-hd3000", label: "Needs zigzag", note: "Domestic, full stitch set." },
    ],
    imageAlt: "Juki DDL-8700 industrial lockstitch sewing machine head",
    lastUpdated: "2026-09-29",
  },
  // ---------------------------------------------------------------- Juki MO
  "juki-mo-654de": {
    series: "MO",
    score: 8.3,
    scoredFor: "serger",
    reason: "Our pick if you'll serge every week.",
    context: "Overlocker · in Sergers hub",
    keySpec: "2/3/4 thread · differential feed",
    alternatives: [
      { slug: "brother-1034d", label: "Cheaper", note: "The value pick, less refined." },
      { slug: "juki-mo-1000", label: "Air threading", note: "Same brand, threads itself." },
      { slug: "babylock-vibrant", label: "Dealer route", note: "Baby Lock's entry serger." },
    ],
    imageAlt: "Juki MO-654DE serger",
    lastUpdated: "2026-09-29",
  },
  "juki-mo-1000": {
    score: 8.7,
    scoredFor: "serger",
    reason: "Air threading at the lowest Juki band that has it.",
    context: "Air-threading overlocker · in Sergers hub",
    keySpec: "Air threading · 2/3/4 thread",
    alternatives: [
      { slug: "juki-mo-654de", label: "Cheaper", note: "Same stitches, manual threading." },
      { slug: "babylock-vibrant", label: "Dealer route", note: "Baby Lock's manual-thread entry." },
      { slug: "brother-2340cv", label: "For hems", note: "Coverstitch, not a serger." },
    ],
    imageAlt: "Juki MO-1000 air-threading serger",
    lastUpdated: "2026-09-29",
  },
  // ----------------------------------------------------------------- Brother
  "brother-1034d": {
    score: 7.8,
    scoredFor: "serger",
    priceBand: 1,
    reason: "The cheapest serger we'd tell a friend to buy.",
    context: "Overlocker · value pick in Sergers hub",
    verdict:
      "Not the smoothest serger we checked. It is the cheapest one we'd tell a friend to buy, and the lay-in threading guides are clear.",
    keySpec: "3/4 thread · differential feed",
    alternatives: [
      { slug: "juki-mo-654de", label: "Steadier", note: "Our pick for weekly serging." },
      { slug: "brother-1034dx", label: "Sibling", note: "Same machine, different bundle." },
      { slug: "singer-14t968dc", label: "Combo", note: "Serger plus coverstitch in one." },
    ],
    imageAlt: "Brother 1034D serger with four thread cones",
    lastUpdated: "2026-09-29",
  },
  "brother-1034dx": {
    score: 7.8,
    scoredFor: "serger",
    reason: "Same stitch set as the 1034D; pick on bundle and price.",
    context: "Overlocker · in Sergers hub",
    keySpec: "3/4 thread · differential feed",
    buy: { kind: "retailer", url: "https://www.sewingmachinesplus.com/brother-1034dx.php" },
    alternatives: [
      { slug: "brother-1034d", label: "Sibling", note: "Same machine, different bundle." },
      { slug: "juki-mo-654de", label: "Steadier", note: "Our pick for weekly serging." },
    ],
    imageAlt: "Brother 1034DX serger",
    lastUpdated: "2026-09-29",
  },
  "brother-2340cv": {
    series: "CV",
    score: 8.0,
    scoredFor: "serger",
    reason: "For hems, if that's what you were missing.",
    context: "Coverstitch · in Sergers hub (coverstitch section)",
    keySpec: "Coverstitch + chain stitch",
    alternatives: [
      { slug: "janome-coverpro-2000cpx", label: "Bigger bed", note: "More room right of the needle." },
      { slug: "singer-14t968dc", label: "Combo", note: "Serger and coverstitch in one machine." },
      { slug: "juki-mo-654de", label: "Serger instead", note: "If seams, not hems, are the gap." },
    ],
    imageAlt: "Brother 2340CV coverstitch machine",
    lastUpdated: "2026-09-29",
  },
  "brother-st371hd": {
    series: "ST",
    score: 7.2,
    scoredFor: "heavy-duty",
    reason: "Brother's answer to the Singer Heavy Duty; same class, same limits.",
    context: "Mechanical · in First machine hub",
    buy: { kind: "retailer", url: "https://www.sewingmachinesplus.com/brother-st371hd.php" },
    alternatives: [
      { slug: "singer-4452", label: "Cross-shop", note: "The Singer in the same class." },
      { slug: "janome-hd3000", label: "Step up", note: "Steadier build for the same jobs." },
    ],
    imageAlt: "Brother ST371HD Strong and Tough sewing machine",
    lastUpdated: "2026-09-29",
  },
  "brother-pq1600s": {
    series: "PQ",
    score: 8.4,
    scoredFor: "quilting",
    reason: "Brother's straight-stitch quilter, cross-shopped against the Juki TL.",
    context: "Straight-stitch quilter · in Quilting hub",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Cross-shop", note: "The TL it is priced against." },
      { slug: "juki-tl-2000qi", label: "Cheaper Juki", note: "Same class, button trimmer." },
      { slug: "janome-mc6650", label: "Needs zigzag", note: "Computerized, 10 in throat." },
    ],
    imageAlt: "Brother PQ1600S straight-stitch quilting machine",
    lastUpdated: "2026-09-29",
  },
  // ------------------------------------------------------------------ Singer
  "singer-4423": {
    series: "HD",
    score: 7.0,
    scoredFor: "heavy-duty",
    reason: "Fewest stitches in the family; same motor.",
    context: "Singer Heavy Duty family · in Heavy duty and First machine hubs",
    keySpec: "1,100 spm · 23 stitches · metal frame",
    alternatives: [
      { slug: "singer-4452", label: "More feet", note: "Same motor, more in the box." },
      { slug: "janome-hd3000", label: "Step up", note: "Steadier build, fewer stitches." },
      { slug: "brother-st371hd", label: "Cross-shop", note: "Brother's machine in the same class." },
    ],
    imageAlt: "Singer Heavy Duty 4423 sewing machine",
    lastUpdated: "2026-09-29",
  },
  "singer-4432": {
    series: "HD",
    score: 6.8,
    scoredFor: "heavy-duty",
    priceBand: 1,
    reason: "Middle child; buy on price only.",
    context: "Singer Heavy Duty family · in Heavy duty hub",
    keySpec: "1,100 spm · 32 stitches · metal frame",
    alternatives: [
      { slug: "singer-4452", label: "More feet", note: "Same stitches, better bundle." },
      { slug: "singer-4423", label: "Cheaper", note: "Fewer stitches, same motor." },
    ],
    imageAlt: "Singer Heavy Duty 4432 sewing machine",
    lastUpdated: "2026-09-29",
  },
  "singer-4452": {
    series: "HD",
    score: 7.1,
    scoredFor: "heavy-duty",
    reason: "Heavy duty in name. Fine for denim hems and canvas bags; out of its depth on upholstery.",
    context: "Singer Heavy Duty family · value pick in Heavy duty hub",
    verdict: "Heavy duty in name. Fine for denim hems and canvas bags; out of its depth on upholstery.",
    keySpec: "1,100 spm · 32 stitches · metal frame",
    alternatives: [
      { slug: "singer-4423", label: "Cheaper", note: "Same motor, fewer feet." },
      { slug: "janome-hd3000", label: "Step up", note: "Steadier build for the same jobs." },
      { slug: "brother-st371hd", label: "Cross-shop", note: "Brother's machine in the same class." },
    ],
    imageAlt: "Singer Heavy Duty 4452 sewing machine",
    lastUpdated: "2026-09-29",
  },
  "singer-14t968dc": {
    series: "Pro",
    score: 7.6,
    scoredFor: "serger",
    reason: "Serger and coverstitch in one box, with a conversion each time you switch.",
    context: "Serger and coverstitch combo · in Sergers hub",
    alternatives: [
      { slug: "brother-1034d", label: "Serger only", note: "Cheaper if hems are not the gap." },
      { slug: "brother-2340cv", label: "Coverstitch only", note: "Dedicated hem machine." },
      { slug: "janome-coverpro-2000cpx", label: "Bigger coverstitch", note: "Wide bed for large pieces." },
    ],
    imageAlt: "Singer Professional 5 14T968DC serger and coverstitch machine",
    lastUpdated: "2026-09-29",
  },
  // ------------------------------------------------------------------ Janome
  "janome-hd3000": {
    score: 8.2,
    scoredFor: "heavy-duty",
    priceBand: 2,
    reason: "Slower but steady, and it still zigzags and makes buttonholes.",
    context: "Mechanical all-rounder · in Heavy duty and First machine hubs",
    verdict: "Slower but steady, and it still zigzags and makes buttonholes.",
    keySpec: "860 spm · 18 stitches · 1-step buttonhole",
    alternatives: [
      { slug: "singer-4452", label: "Cheaper", note: "More stitches, lighter build." },
      { slug: "juki-tl-2010q", label: "Faster", note: "Straight stitch only, much faster." },
      { slug: "janome-mc6650", label: "Computerized", note: "Same brand, 10 in throat." },
    ],
    imageAlt: "Janome HD3000 mechanical sewing machine",
    lastUpdated: "2026-09-29",
  },
  "janome-mc6650": {
    series: "MC",
    score: 8.1,
    scoredFor: "quilting",
    priceBand: 3,
    reason: "The heavy-duty pick for people who also want a computerized all-rounder.",
    context: "Computerized quilter · in Heavy duty and Quilting hubs",
    verdict: "The heavy-duty pick for people who also want a computerized all-rounder.",
    keySpec: "1,000 spm · 10 in throat · full stitch set",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Faster", note: "Straight stitch only." },
      { slug: "janome-hd3000", label: "Cheaper", note: "Mechanical, smaller throat." },
      { slug: "bernina-570-qe", label: "Dealer route", note: "The Bernina it is cross-shopped with." },
    ],
    imageAlt: "Janome Memory Craft 6650 computerized sewing and quilting machine",
    lastUpdated: "2026-09-29",
  },
  "janome-coverpro-2000cpx": {
    series: "CoverPro",
    score: 8.2,
    scoredFor: "serger",
    reason: "More room right of the needle than the Brother.",
    context: "Coverstitch · in Sergers hub (coverstitch section)",
    alternatives: [
      { slug: "brother-2340cv", label: "Cheaper", note: "Same stitches, smaller bed." },
      { slug: "singer-14t968dc", label: "Combo", note: "Serger and coverstitch in one." },
    ],
    imageAlt: "Janome CoverPro 2000CPX coverstitch machine",
    lastUpdated: "2026-09-29",
  },
  // ------------------------------------------------------------ Long-arm tier
  "handi-quilter-moxie": {
    series: "Moxie",
    score: 8.5,
    scoredFor: "quilting",
    reason: "The entry long-arm on a frame; throat space decides it.",
    context: "Long-arm on a frame · in Quilting hub",
    alternatives: [
      { slug: "grace-qnique-15r", label: "Cross-shop", note: "The other 15 in entry long-arm." },
      { slug: "juki-tl-18qvp", label: "Sit-down", note: "Big TL arm, no frame." },
      { slug: "juki-tl-2010q", label: "Domestic", note: "Fast quilter on a table." },
    ],
    imageAlt: "Handi Quilter Moxie long-arm quilting machine on a frame",
    lastUpdated: "2026-09-29",
  },
  "grace-qnique-15r": {
    series: "Qnique",
    score: 8.0,
    scoredFor: "quilting",
    reason: "The frame maker's own 15 in head, usually sold as a bundle.",
    context: "Long-arm on a frame · in Quilting hub",
    alternatives: [
      { slug: "handi-quilter-moxie", label: "Cross-shop", note: "The other 15 in entry long-arm." },
      { slug: "juki-tl-18qvp", label: "Sit-down", note: "Big TL arm, no frame." },
    ],
    imageAlt: "Grace Q'nique 15R long-arm quilting machine",
    lastUpdated: "2026-09-29",
  },
  // ----------------------------------------------------------- Dealer-only
  "babylock-vibrant": {
    series: "Sergers",
    score: 7.9,
    scoredFor: "serger",
    reason: "Baby Lock's manual-thread entry; the dealer relationship is part of the price.",
    context: "Overlocker · dealer-only · in Sergers hub",
    alternatives: [
      { slug: "brother-1034d", label: "Cheaper", note: "Same thread count online." },
      { slug: "juki-mo-654de", label: "Our pick", note: "Steadier build, sold online." },
    ],
    imageAlt: "Baby Lock Vibrant serger",
    lastUpdated: "2026-09-29",
  },
  "bernina-570-qe": {
    series: "5",
    score: 8.3,
    scoredFor: "quilting",
    reason: "The dealer-only quilter people cross-shop against the Memory Craft.",
    context: "Computerized quilter · dealer-only · in Quilting hub",
    alternatives: [
      { slug: "janome-mc6650", label: "Sold online", note: "The Memory Craft it is priced against." },
      { slug: "juki-tl-2010q", label: "Straight stitch", note: "Faster, much cheaper, one stitch." },
    ],
    imageAlt: "Bernina 570 QE computerized quilting machine",
    lastUpdated: "2026-09-29",
  },
};

function asBrand(b: string): Brand {
  return b as Brand;
}

function asType(t: string): MachineType {
  return t as MachineType;
}

function asJobs(j: string[]): Job[] {
  return j as Job[];
}

function specs(c: CatalogEntry): Specs {
  const out = {} as Specs;
  for (const k of SPEC_KEYS) {
    const raw = c.specs[k] ?? { value: null, source: null };
    (out as unknown as Record<string, Sourced<string | number>>)[k] = { value: raw.value, source: raw.source };
  }
  return out;
}

function buildProduct(c: CatalogEntry, f: SiteFields): Product {
  const band: PriceBand = f.priceBand ?? (c.priceUsdSeen ? bandForPrice(c.priceUsdSeen) : 3);
  const jobs = f.jobs ?? asJobs(c.jobs);
  return {
    slug: c.slug,
    brand: asBrand(c.brand),
    model: c.model,
    name: `${c.brand} ${c.model}`,
    series: f.series ?? c.series ?? undefined,
    type: asType(c.type),
    industrial: c.industrial,
    jobs,
    scoredFor: f.scoredFor,
    priceBand: band,
    priceUsdSeen: c.priceUsdSeen,
    priceSeenDate: c.priceSeenDate,
    priceSeenAt: c.priceSeenAt,
    score: f.score,
    verdict: f.verdict ?? c.editorial.verdict,
    whoFor: f.whoFor ?? c.editorial.whoFor,
    skipIf: f.skipIf ?? c.editorial.skipIf,
    keySpec: f.keySpec ?? c.editorial.keySpec,
    reason: f.reason,
    context: f.context,
    specs: specs(c),
    strengths: f.strengths ?? c.editorial.strengths,
    weaknesses: f.weaknesses ?? c.editorial.weaknesses,
    checks: f.checks ?? c.editorial.checks,
    realCost: f.realCost ?? c.editorial.realCost,
    alternatives: f.alternatives,
    claims: c.claims,
    conflicts: c.conflicts,
    ownerThemes: c.ownerThemes,
    evidence: (c.evidence as Evidence) ?? "positioning",
    faqs: f.faqs ?? [],
    buy: f.buy ?? defaultBuy(c),
    manufacturerUrl: c.manufacturerUrl,
    sources: c.sources,
    discontinued: c.discontinued,
    replacedBy: c.replacedBy,
    imageAlt: f.imageAlt,
    image: f.image ?? null,
    specsVerified: f.specsVerified ?? null,
    lastUpdated: f.lastUpdated,
  };
}

export const products: Product[] = Object.entries(siteFields).map(([slug, f]) => {
  const c = catalogData[slug];
  if (!c) throw new Error(`products.ts: no catalog data for "${slug}" (run npm run build:catalog)`);
  return buildProduct(c, f);
});

// -------------------------------------------------------------------- helpers

export const productsBySlug: Record<string, Product> = Object.fromEntries(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return productsBySlug[slug];
}

export function productsForJob(job: Job): Product[] {
  return products.filter((p) => p.jobs.includes(job));
}

export function productsForBrand(brand: Brand): Product[] {
  return products.filter((p) => p.brand === brand);
}

export function productsForSeries(brand: Brand, seriesCode: string): Product[] {
  return products.filter((p) => p.brand === brand && p.series?.toLowerCase() === seriesCode.toLowerCase());
}

export function typeLabel(p: Product): string {
  return MACHINE_TYPE_LABEL[p.type];
}

export function primaryHubHref(p: Product): string {
  return JOB_HUB_HREF[p.scoredFor];
}

/** Table cell: "Straight" for a TL, "32" for a Singer, "Full set" for a computerized, threads for a serger. */
export function stitchSummary(p: Product): string {
  if (p.type === "serger" || p.type === "coverstitch") return p.specs.threads.value ?? "[verify]";
  if (p.specs.stitchCount.value === 1) return "Straight";
  if (p.type === "computerized") return p.specs.stitchCount.value ? `${p.specs.stitchCount.value}` : "Full set";
  if (p.type === "long-arm") return "Straight";
  return p.specs.stitchCount.value === null ? "[verify]" : String(p.specs.stitchCount.value);
}

/** True when the product has a real "Check price" button. */
export function hasBuyButton(p: Product): boolean {
  return p.buy.kind === "retailer";
}

/** The date shown as "Specs checked": verified date if any, else the research date. */
export function checkedDate(p: Product): string {
  return p.specsVerified ?? p.lastUpdated;
}
