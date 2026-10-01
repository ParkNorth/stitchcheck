import { catalogData, type CatalogEntry } from "./catalog-data";
import { bandForPrice, type PriceBand } from "./price-bands";
import imagesManifest from "./images-manifest.json";

type ImageEntry = { src: string; width: number; height: number; credit: string; sourceUrl: string; pageUrl: string | null };
const IMAGES: Record<string, ImageEntry> = imagesManifest;

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
  /** "Photo: Juki" when the image is a manufacturer shot from scripts/fetch-images.ts. */
  imageCredit: string | null;
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

/** Dealer-only brands sell through dealers; any other brand with no buy route simply has no seller linked yet. */
export function isDealerOnlyBrand(brand: string): boolean {
  return DEALER_ONLY_BRANDS.has(brand);
}

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
    specsVerified: "2026-09-30",
    lastUpdated: "2026-09-30",
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
      "The cheapest serger we would tell a friend to buy. Threading is its weak point: the lay-in guides help, but the lower looper is what owners complain about most.",
    keySpec: "3/4 thread · differential feed",
    alternatives: [
      { slug: "juki-mo-654de", label: "Steadier", note: "Our pick for weekly serging." },
      { slug: "brother-1034dx", label: "Sibling", note: "Lighter, with an LED, and listed cheaper at Brother." },
      { slug: "singer-14t968dc", label: "Combo", note: "Serger plus coverstitch in one." },
    ],
    imageAlt: "Brother 1034D serger with four thread cones",
    specsVerified: "2026-10-01",
    lastUpdated: "2026-10-01",
  },
  "brother-1034dx": {
    score: 7.8,
    scoredFor: "serger",
    reason: "Same stitch set as the 1034D with an LED and less weight; pick on price.",
    context: "Overlocker · in Sergers hub",
    keySpec: "3/4 thread · differential feed",
    buy: { kind: "none" },
    alternatives: [
      { slug: "brother-1034d", label: "Sibling", note: "Bulb light, 0.9 lb heavier, listed $30 higher at Brother." },
      { slug: "juki-mo-654de", label: "Steadier", note: "Our pick for weekly serging." },
    ],
    imageAlt: "Brother 1034DX serger",
    specsVerified: "2026-10-01",
    lastUpdated: "2026-10-01",
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
  // ------------------------------------------------------------ Backlog batch
  "juki-ddl-5550": {
    score: 8.5,
    scoredFor: "heavy-duty",
    reason: "Made-in-Japan industrial straight stitch; needs a table, motor and floor space.",
    context: "Industrial lockstitch · in Heavy duty hub",
    alternatives: [
      { slug: "juki-ddl-8700", label: "Cheaper", note: "The industrial we rank first." },
      { slug: "juki-dnu-1541s", label: "Walking foot", note: "For upholstery and leather." },
      { slug: "juki-tl-2010q", label: "Portable", note: "1,500 spm on a domestic body." },
    ],
    imageAlt: "Juki DDL-5550 industrial sewing machine head on a table",
    lastUpdated: "2026-09-29",
  },
  "juki-mo-644d": {
    score: 7.9,
    scoredFor: "serger",
    reason: "Juki's entry serger at Brother 1034D money; the 654DE adds the 2-thread converter.",
    context: "Overlocker · in Sergers hub",
    alternatives: [
      { slug: "juki-mo-654de", label: "Step up", note: "Outside dials and 2-thread stitches." },
      { slug: "brother-1034d", label: "Value pick", note: "The cheapest serger we'd recommend." },
      { slug: "babylock-vibrant", label: "Dealer route", note: "Baby Lock's entry serger." },
    ],
    imageAlt: "Juki MO-644D serger",
    lastUpdated: "2026-09-29",
  },
  "juki-hzl-f600": {
    score: 8.2,
    scoredFor: "quilting",
    reason: "Box feed, knee lift, trimmer, walking foot and table in the box.",
    context: "Computerized · in Heavy duty and Quilting hubs",
    alternatives: [
      { slug: "juki-hzl-f300", label: "Cheaper", note: "Same chassis, 106 stitches." },
      { slug: "janome-mc6650", label: "Wider throat", note: "10 in and 1,000 spm." },
      { slug: "juki-tl-2010q", label: "Straight only", note: "Faster, no zigzag." },
    ],
    imageAlt: "Juki HZL-F600 computerized sewing and quilting machine",
    lastUpdated: "2026-09-29",
  },
  "juki-hzl-f300": {
    score: 8.0,
    scoredFor: "beginner",
    reason: "The F600 chassis with fewer stitches; the best-built computerized under $1,000 here.",
    context: "Computerized · in First serious machine and Quilting hubs",
    alternatives: [
      { slug: "juki-hzl-f600", label: "Step up", note: "225 stitches, walking foot and table." },
      { slug: "janome-hd3000", label: "Mechanical", note: "Our beginner pick, no electronics." },
      { slug: "brother-cs7000x", label: "Budget", note: "Computerized for under $300." },
    ],
    imageAlt: "Juki HZL-F300 computerized sewing machine",
    lastUpdated: "2026-09-29",
  },
  "juki-dnu-1541s": {
    score: 8.8,
    scoredFor: "heavy-duty",
    reason: "The walking-foot industrial upholstery and leather forums recommend first.",
    context: "Industrial walking foot · in Heavy duty hub",
    alternatives: [
      { slug: "juki-ddl-8700", label: "Drop feed", note: "Cheaper industrial for flat work." },
      { slug: "juki-ddl-5550", label: "Sibling", note: "Straight stitch, no walking foot." },
      { slug: "singer-4452", label: "Domestic", note: "The value pick for occasional denim." },
    ],
    imageAlt: "Juki DNU-1541S walking foot industrial sewing machine",
    lastUpdated: "2026-09-29",
  },
  "janome-hd9": {
    score: 8.4,
    scoredFor: "heavy-duty",
    reason: "Janome's answer to the Juki TL, at a higher price.",
    context: "Straight-stitch head · in Heavy duty and Quilting hubs",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Cheaper", note: "Same job, 1,500 spm, our pick." },
      { slug: "brother-pq1600s", label: "Budget", note: "1,500 spm straight stitch for far less." },
      { slug: "juki-tl-2000qi", label: "Value", note: "The TL without the trimmer button." },
    ],
    imageAlt: "Janome HD9 Professional straight-stitch sewing machine",
    lastUpdated: "2026-09-29",
  },
  "janome-hd1000": {
    score: 7.0,
    scoredFor: "beginner",
    reason: "The entry HD: a solid first machine, not a heavy-fabric tool.",
    context: "Mechanical · in First serious machine hub",
    alternatives: [
      { slug: "janome-hd3000", label: "Step up", note: "18 stitches and a one-step buttonhole." },
      { slug: "singer-4423", label: "Cheaper", note: "Faster on paper, lighter in the hand." },
      { slug: "janome-hd5000", label: "Top HD", note: "7 mm zigzag and seven feet." },
    ],
    imageAlt: "Janome HD1000 mechanical sewing machine",
    lastUpdated: "2026-09-29",
  },
  "janome-hd5000": {
    score: 8.0,
    scoredFor: "heavy-duty",
    priceBand: 2,
    reason: "The HD3000 body with a wider zigzag and a quilting kit.",
    context: "Mechanical · in Heavy duty hub",
    alternatives: [
      { slug: "janome-hd3000", label: "Cheaper", note: "Same body, 5 mm zigzag, our beginner pick." },
      { slug: "singer-4452", label: "Budget", note: "The value pick if the extras don't matter." },
      { slug: "brother-st371hd", label: "Cheaper still", note: "Brother's 37-stitch heavy duty." },
    ],
    imageAlt: "Janome HD5000 mechanical sewing machine",
    lastUpdated: "2026-09-29",
  },
  "janome-8002d": {
    score: 7.6,
    scoredFor: "serger",
    reason: "Janome's budget 3/4-thread serger at Brother 1034D money.",
    context: "Overlocker · in Sergers hub",
    alternatives: [
      { slug: "brother-1034d", label: "Value pick", note: "The cheapest serger we'd recommend." },
      { slug: "juki-mo-654de", label: "Steadier", note: "2-thread stitches and a heavier build." },
      { slug: "brother-1034dx", label: "Sibling", note: "Brother's bundle variant." },
    ],
    imageAlt: "Janome 8002D serger",
    lastUpdated: "2026-09-29",
  },
  "singer-hd6600c": {
    score: 7.2,
    scoredFor: "beginner",
    reason: "The cheapest computerized Heavy Duty; no thread cutter, few feet.",
    context: "Computerized · Singer Heavy Duty family",
    alternatives: [
      { slug: "singer-4452", label: "Mechanical", note: "Same speed, fewer stitches, the value pick." },
      { slug: "singer-hd6700c", label: "Step up", note: "Adds a speed slider and a walking foot." },
      { slug: "janome-hd3000", label: "Built heavier", note: "Our beginner pick, mechanical." },
    ],
    imageAlt: "Singer Heavy Duty 6600C computerized sewing machine",
    lastUpdated: "2026-09-29",
  },
  "singer-hd6700c": {
    score: 7.4,
    scoredFor: "beginner",
    reason: "The 6600C plus a speed slider and a 10-foot kit with a walking foot.",
    context: "Computerized · in First serious machine hub",
    alternatives: [
      { slug: "singer-hd6600c", label: "Cheaper", note: "Same head, fewer feet." },
      { slug: "singer-4452", label: "Mechanical", note: "The value pick for denim hems." },
      { slug: "janome-mc6650", label: "Real step up", note: "10 in throat and a heavier frame." },
    ],
    imageAlt: "Singer Heavy Duty 6700C computerized sewing machine",
    lastUpdated: "2026-09-29",
  },
  "singer-4411": {
    score: 6.6,
    scoredFor: "beginner",
    reason: "The base Heavy Duty head; only wins on a real price gap to the 4423.",
    context: "Mechanical · base of the Singer Heavy Duty family",
    alternatives: [
      { slug: "singer-4423", label: "Step up", note: "23 stitches, needle threader, one-step buttonhole." },
      { slug: "singer-4432", label: "More stitches", note: "32 stitches on the same frame." },
      { slug: "brother-st371hd", label: "Rival", note: "Brother's 37-stitch heavy duty." },
    ],
    imageAlt: "Singer Heavy Duty 4411 mechanical sewing machine",
    lastUpdated: "2026-09-29",
  },
  "singer-14cg754": {
    score: 7.2,
    scoredFor: "serger",
    reason: "Budget 2/3/4-thread serger; \"Commercial Grade\" is a label, not a spec.",
    context: "Overlocker · in Sergers hub",
    alternatives: [
      { slug: "brother-1034d", label: "Value pick", note: "The cheapest serger we'd recommend." },
      { slug: "singer-14t968dc", label: "Combo", note: "Singer's serger plus coverstitch." },
      { slug: "juki-mo-654de", label: "Steadier", note: "Our pick for weekly serging." },
    ],
    imageAlt: "Singer ProFinish 14CG754 serger",
    lastUpdated: "2026-09-29",
  },
  "brother-1634d": {
    score: 7.5,
    scoredFor: "serger",
    priceBand: 1,
    reason: "The 1034D in mass-retail clothing; buy whichever is cheaper today.",
    context: "Overlocker · the 1034D's mass-retail sibling",
    alternatives: [
      { slug: "brother-1034d", label: "Sibling", note: "Same platform, our value pick." },
      { slug: "brother-1034dx", label: "Sibling", note: "The bundle variant." },
      { slug: "juki-mo-654de", label: "Steadier", note: "Our pick for weekly serging." },
    ],
    imageAlt: "Brother 1634D serger",
    lastUpdated: "2026-09-29",
  },
  "brother-cs7000x": {
    score: 7.1,
    scoredFor: "beginner",
    reason: "The budget computerized package; the 750 spm ceiling shows on thick seams.",
    context: "Computerized · in First serious machine hub",
    alternatives: [
      { slug: "janome-hd3000", label: "Mechanical", note: "Fewer stitches, far more machine." },
      { slug: "brother-st371hd", label: "Heavy duty", note: "Brother's mechanical for thick layers." },
      { slug: "janome-mc6650", label: "Real quilter", note: "10 in throat, 1,000 spm, four times the price." },
    ],
    imageAlt: "Brother CS7000X computerized sewing machine with wide table",
    lastUpdated: "2026-09-29",
  },
  "bernina-1008": {
    score: 7.9,
    scoredFor: "heavy-duty",
    priceBand: 3,
    reason: "Bernina's last all-mechanical machine; a used-market buy since 2020.",
    context: "Mechanical, discontinued · used market via Bernina dealers",
    alternatives: [
      { slug: "janome-hd3000", label: "In production", note: "The mechanical we'd buy new instead." },
      { slug: "bernina-570-qe", label: "Same dealer", note: "Bernina's computerized quilter." },
      { slug: "brother-st371hd", label: "Budget", note: "A cheap new mechanical." },
    ],
    imageAlt: "Bernina 1008 mechanical sewing machine",
    lastUpdated: "2026-09-29",
  },
  "bernina-l-850": {
    score: 8.5,
    scoredFor: "serger",
    reason: "Air threading and a knee lift, at dealer prices.",
    context: "Air-threading overlocker · in Sergers hub",
    alternatives: [
      { slug: "juki-mo-1000", label: "Cheaper air", note: "Juki's air threader for a third of the money." },
      { slug: "babylock-victory", label: "Dealer rival", note: "Baby Lock's air-threading entry." },
      { slug: "juki-mo-654de", label: "Manual", note: "Our pick if you thread by hand." },
    ],
    imageAlt: "Bernina L 850 air-threading serger",
    lastUpdated: "2026-09-29",
  },
  "handi-quilter-amara": {
    score: 8.6,
    scoredFor: "quilting",
    reason: "The first true long-arm throat in the Handi Quilter line.",
    context: "20 in stand-up long-arm · in Quilting hub",
    alternatives: [
      { slug: "grace-qnique-19x", label: "Cheaper", note: "19 in for less than half the money." },
      { slug: "handi-quilter-moxie", label: "Entry tier", note: "15 in on an 8 ft frame." },
      { slug: "handi-quilter-sweet-sixteen", label: "Sit-down", note: "16 in at a table, no frame." },
    ],
    imageAlt: "Handi Quilter Amara 20 long-arm quilting machine on a frame",
    lastUpdated: "2026-09-29",
  },
  "handi-quilter-sweet-sixteen": {
    score: 7.8,
    scoredFor: "quilting",
    reason: "Discontinued sit-down mid-arm; remaining stock versus a used unit.",
    context: "Sit-down mid-arm, discontinued · remaining stock and used market",
    alternatives: [
      { slug: "handi-quilter-moxie", label: "Current", note: "Handi Quilter's entry head, on a frame." },
      { slug: "juki-tl-18qvp", label: "Domestic", note: "8.5 in straight stitch at a table." },
      { slug: "handi-quilter-amara", label: "Go long-arm", note: "20 in on a frame." },
    ],
    imageAlt: "Handi Quilter Sweet Sixteen sit-down quilting machine with table",
    lastUpdated: "2026-09-29",
  },
  "grace-qnique-19x": {
    score: 8.3,
    scoredFor: "quilting",
    reason: "The most throat per dollar in the entry frame class.",
    context: "19 in long-arm head · in Quilting hub",
    alternatives: [
      { slug: "handi-quilter-moxie", label: "Dealer depth", note: "15 in with Handi Quilter service." },
      { slug: "grace-qnique-15r", label: "Cheaper", note: "Grace's 15 in head." },
      { slug: "handi-quilter-amara", label: "Step up", note: "20 in, twice the price." },
    ],
    imageAlt: "Grace Q'nique 19X long-arm quilting machine",
    lastUpdated: "2026-09-29",
  },
  "babylock-imagine": {
    score: 7.7,
    scoredFor: "serger",
    priceBand: 3,
    reason: "Discontinued air-threading serger; a used-market buy, replaced by the Victory.",
    context: "Air-threading overlocker, discontinued · used market",
    alternatives: [
      { slug: "juki-mo-1000", label: "Buy new", note: "Air threading you can order today." },
      { slug: "babylock-vibrant", label: "Same dealer", note: "Baby Lock's manual-thread entry." },
      { slug: "bernina-l-850", label: "Dealer rival", note: "Air threading with a knee lift." },
    ],
    imageAlt: "Baby Lock Imagine air-threading serger",
    lastUpdated: "2026-09-29",
  },
  "babylock-victory": {
    score: 8.4,
    scoredFor: "serger",
    reason: "Baby Lock's air-threading entry; the Imagine's replacement, dealer priced.",
    context: "Air-threading overlocker · in Sergers hub",
    alternatives: [
      { slug: "juki-mo-1000", label: "Cheaper air", note: "Juki's air threader, sold online." },
      { slug: "babylock-vibrant", label: "Same dealer", note: "Manual threading, far less money." },
      { slug: "bernina-l-850", label: "Dealer rival", note: "Air threading with a knee lift." },
    ],
    imageAlt: "Baby Lock Victory air-threading serger",
    lastUpdated: "2026-09-29",
  },
  "singer-14hd854": {
    score: 7.3,
    scoredFor: "serger",
    reason: "The ProFinish with a Heavy Duty badge; buy on price against the 14CG754.",
    context: "Overlocker · Singer Heavy Duty serger",
    alternatives: [
      { slug: "singer-14cg754", label: "Sibling", note: "Same class, ProFinish name." },
      { slug: "brother-1034d", label: "Value pick", note: "The cheapest serger we'd recommend." },
      { slug: "juki-mo-654de", label: "Steadier", note: "Our pick for weekly serging." },
    ],
    imageAlt: "Singer Heavy Duty 14HD854 serger",
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
    faqs: f.faqs ?? c.editorial.faqs ?? [],
    buy: f.buy ?? defaultBuy(c),
    manufacturerUrl: c.manufacturerUrl,
    sources: c.sources,
    discontinued: c.discontinued,
    replacedBy: c.replacedBy,
    imageAlt: f.imageAlt,
    image: f.image ?? IMAGES[c.slug]?.src ?? null,
    imageCredit: f.image ? null : (IMAGES[c.slug]?.credit ?? null),
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

/** True when the product has a real "Check lowest price" button. */
export function hasBuyButton(p: Product): boolean {
  return p.buy.kind === "retailer";
}

/** The date shown as "Specs checked": verified date if any, else the research date. */
export function checkedDate(p: Product): string {
  return p.specsVerified ?? p.lastUpdated;
}
