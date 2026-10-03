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
    lastUpdated: "2026-10-02",
  },
  "juki-tl-2000qi": {
    score: 8.3,
    scoredFor: "quilting",
    reason: "Same 1,500 spm straight stitch as the TL-2010Q on Juki's page; owners say the 2010Q adds a speed control, and the 2000Qi's throat is unpublished.",
    context: "Straight-stitch quilter · in Quilting hub",
    keySpec: "1,500 spm · button trimmer",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Speed control", note: "Owners say it adds a speed control and sub-tension dial; Juki lists $2,169 against $1,799." },
      { slug: "brother-pq1600s", label: "Cross-shop", note: "Brother's straight-stitch quilter." },
      { slug: "janome-hd3000", label: "Needs zigzag", note: "Full stitch set, slower." },
    ],
    imageAlt: "Juki TL-2000Qi straight-stitch sewing and quilting machine",
    lastUpdated: "2026-10-02",
    verdict: "A 1,500 spm straight-stitch quilting machine with no published throat figure, so check the reach before you pay.",
    specsVerified: "2026-10-01",
  },
  "juki-tl-18qvp": {
    series: "TL",
    score: 8.5,
    scoredFor: "quilting",
    reason: "The TL-2010Q platform with a float function and more feet; the throat is the same, so the extra is features, not arm.",
    context: "Straight-stitch quilter · in Quilting hub",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Same throat per dealers", note: "Dealers give the same 8.5 in; Juki lists no float function for it." },
      { slug: "handi-quilter-moxie", label: "Frame", note: "The next tier up." },
      { slug: "brother-pq1600s", label: "Cross-shop", note: "Brother's straight-stitch quilter." },
    ],
    imageAlt: "Juki TL-18QVP straight-stitch quilting machine",
    lastUpdated: "2026-10-02",
    verdict: "A fast straight-stitch quilter on the TL-2010Q's 8.5 in throat; the premium buys a float function and nine feet, not more reach.",
    specsVerified: "2026-10-01",
  },
  // --------------------------------------------------------------- Juki DDL
  "juki-ddl-8700": {
    score: 8.4,
    scoredFor: "heavy-duty",
    reason: "True industrial lockstitch for a home workshop, medium-weight on Juki's own variant list.",
    context: "Industrial lockstitch · in Heavy duty hub",
    verdict: "A real factory lockstitch for a home workshop, if you have a table, a motor and the floor space; Juki classes the base model as medium-weight.",
    keySpec: "5,500 spm · industrial lockstitch · table-mounted",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Portable", note: "Fast straight stitch that lives on a table." },
      { slug: "janome-hd3000", label: "Needs zigzag", note: "Domestic, full stitch set." },
    ],
    imageAlt: "Juki DDL-8700 industrial lockstitch sewing machine head",
    lastUpdated: "2026-10-02",
    specsVerified: "2026-10-01",
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
      { slug: "brother-1034d", label: "Brother option", note: "Brother's entry serger." },
      { slug: "juki-mo-1000", label: "Air threading", note: "Same brand, threads itself." },
      { slug: "babylock-vibrant", label: "Dealer route", note: "Baby Lock's entry serger." },
    ],
    imageAlt: "Juki MO-654DE serger",
    lastUpdated: "2026-10-02",
    verdict: "A 2/3/4 thread serger at 1,500 spm that owners rate well, with manual threading and no free arm.",
    specsVerified: "2026-10-01",
  },
  "juki-mo-1000": {
    score: 8.7,
    scoredFor: "serger",
    reason: "Air threading on a 2/3/4 thread serger; Juki's MSRP is $2,299, so check the dealer price.",
    context: "Air-threading overlocker · in Sergers hub",
    keySpec: "Air threading · 2/3/4 thread",
    alternatives: [
      { slug: "juki-mo-654de", label: "Cheaper", note: "Manual looper threading and a 6 mm maximum overlock width against 9 mm, at a lower Juki suggested price (Juki pages)." },
      { slug: "babylock-vibrant", label: "Dealer route", note: "Baby Lock's manual-thread entry." },
      { slug: "brother-2340cv", label: "For hems", note: "Coverstitch, not a serger." },
    ],
    imageAlt: "Juki MO-1000 air-threading serger",
    lastUpdated: "2026-10-02",
    verdict: "An air-threading 2/3/4 thread serger at 1,500 spm; Juki's MSRP is $2,299, owner evidence is thin, and Juki gives a throat height, not a needle-to-arm figure.",
    specsVerified: "2026-10-02",
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
      { slug: "juki-mo-654de", label: "1,500 spm, 5-year warranty", note: "Per Juki's spec: 1,500 spm and a 5-year mechanical warranty." },
      { slug: "brother-1034dx", label: "Sibling", note: "Lighter, with an LED, and listed cheaper at Brother." },
      { slug: "singer-14t968dc", label: "Combo", note: "Serger plus coverstitch in one." },
    ],
    imageAlt: "Brother 1034D serger with four thread cones",
    specsVerified: "2026-10-01",
    lastUpdated: "2026-10-02",
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
      { slug: "juki-mo-654de", label: "1,500 spm, 5-year warranty", note: "Per Juki's spec: 1,500 spm and a 5-year mechanical warranty." },
    ],
    imageAlt: "Brother 1034DX serger",
    specsVerified: "2026-10-01",
    lastUpdated: "2026-10-02",
  },
  "brother-2340cv": {
    series: "CV",
    score: 8.0,
    scoredFor: "serger",
    reason: "A low-priced Brother coverstitch; owners report a fussy machine, so budget for setup.",
    context: "Coverstitch · in Sergers hub (coverstitch section)",
    keySpec: "Coverstitch + chain stitch",
    alternatives: [
      { slug: "janome-coverpro-2000cpx", label: "Bigger bed", note: "More room right of the needle." },
      { slug: "singer-14t968dc", label: "Combo", note: "Serger and coverstitch in one machine." },
      { slug: "juki-mo-654de", label: "Serger instead", note: "If seams, not hems, are the gap." },
    ],
    imageAlt: "Brother 2340CV coverstitch machine",
    lastUpdated: "2026-10-02",
    verdict: "A low-priced Brother coverstitch and chain stitch machine with no knife, no free arm listed and a fussy reputation, so it suits a knit sewist who already owns a serger.",
    specsVerified: "2026-10-02",
  },
  "brother-st371hd": {
    series: "ST",
    score: 7.2,
    scoredFor: "heavy-duty",
    reason: "Brother's heavy-duty-labelled dial machine: 37 stitches and fixed presser pressure, with motor, throat and frame unpublished.",
    context: "Mechanical · in First machine hub",
    buy: { kind: "retailer", url: "https://www.sewingmachinesplus.com/brother-st371hd.php" },
    alternatives: [
      { slug: "singer-4452", label: "Cross-shop", note: "A Singer in the same class; our catalog notes a walking foot in its box, which the Brother does not list." },
      { slug: "janome-hd3000", label: "Step up", note: "Our catalog lists an aluminum body; Brother publishes no frame material for the ST371HD." },
    ],
    imageAlt: "Brother ST371HD Strong and Tough sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "A 37-stitch dial machine Brother labels heavy duty, with fixed presser pressure and no published motor, throat or frame figures; owners split on thick layers.",
    specsVerified: "2026-10-02",
  },
  "brother-pq1600s": {
    series: "PQ",
    score: 8.4,
    scoredFor: "quilting",
    reason: "Brother's straight-stitch quilter, cross-shopped against the Juki TL.",
    context: "Straight-stitch quilter · in Quilting hub",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Cross-shop", note: "The TL it is priced against." },
      { slug: "juki-tl-2000qi", label: "Same-class Juki", note: "A Juki quilting machine with a button trimmer." },
      { slug: "janome-mc6650", label: "Needs zigzag", note: "Computerized, 10 in workspace per Janome." },
    ],
    imageAlt: "Brother PQ1600S straight-stitch quilting machine",
    lastUpdated: "2026-10-02",
  },
  // ------------------------------------------------------------------ Singer
  "singer-4423": {
    series: "HD",
    score: 7.0,
    scoredFor: "heavy-duty",
    reason: "Heavy Duty is a Singer line name. 23 stitches, 84 W motor, no walking foot in the box; reliability reports are mixed.",
    context: "Singer Heavy Duty family · in Heavy duty and First machine hubs",
    keySpec: "1,100 spm · 23 stitches · metal frame",
    alternatives: [
      { slug: "singer-4452", label: "More feet", note: "Singer lists 32 stitches and a walking foot, non-stick foot and clearance plate in the bundle." },
      { slug: "janome-hd3000", label: "Step up", note: "Owners in head-to-head threads favor it on reliability; the Singer is the cheaper one." },
      { slug: "brother-st371hd", label: "Cross-shop", note: "Brother's machine in the same class." },
    ],
    imageAlt: "Singer Heavy Duty 4423 sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "Heavy Duty is Singer's line name, not a rating. Owners report denim hems and canvas bags going well, and reliability reports are mixed.",
    specsVerified: "2026-10-02",
  },
  "singer-4432": {
    series: "HD",
    score: 6.8,
    scoredFor: "heavy-duty",
    priceBand: 1,
    reason: "Same 32 stitches as the 4452 without its extra feet; owner reports on thick fabric are split.",
    context: "Singer Heavy Duty family · in Heavy duty hub",
    keySpec: "1,100 spm · 32 stitches · metal frame",
    alternatives: [
      { slug: "singer-4452", label: "More feet", note: "Singer lists the same 32 stitches; the 4452 adds a walking foot, non-stick foot, clearance plate and heavy duty needles." },
      { slug: "singer-4423", label: "Lower list price", note: "Singer lists 23 stitches against 32, at an MSRP of $289.99 against $299.99." },
    ],
    imageAlt: "Singer Heavy Duty 4432 sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "Singer's 32-stitch mechanical with a metal interior frame; owner reports on thick fabric and early defects are split, so buy it on price.",
    specsVerified: "2026-10-01",
  },
  "singer-4452": {
    series: "HD",
    score: 7.1,
    scoredFor: "heavy-duty",
    reason: "Heavy duty is Singer's line name. Fine for denim hems and canvas bags; out of its depth on thick strap stacks.",
    context: "Singer Heavy Duty family · value pick in Heavy duty hub",
    verdict: "Heavy Duty is a Singer series name, not a rating. Owners report denim and canvas hems going well and thick strap stacks going badly.",
    keySpec: "1,100 spm · 32 stitches · metal frame",
    alternatives: [
      { slug: "singer-4423", label: "Fewer feet", note: "Same motor, fewer feet." },
      { slug: "janome-hd3000", label: "Step up", note: "Steadier build for the same jobs." },
      { slug: "brother-st371hd", label: "Cross-shop", note: "Brother's machine in the same class." },
    ],
    imageAlt: "Singer Heavy Duty 4452 sewing machine",
    lastUpdated: "2026-10-02",
    specsVerified: "2026-10-01",
  },
  "singer-14t968dc": {
    series: "Pro",
    score: 7.6,
    scoredFor: "serger",
    reason: "Serger and coverstitch in one box, with a manual changeover each time you switch; Singer's manual now confirms most ranges but not free arm, trimmer or motor.",
    context: "Serger and coverstitch combo · in Sergers hub",
    alternatives: [
      { slug: "brother-1034d", label: "Serger only", note: "Cheaper if hems are not the gap." },
      { slug: "brother-2340cv", label: "Coverstitch only", note: "Dedicated hem machine." },
      { slug: "janome-coverpro-2000cpx", label: "Bigger coverstitch", note: "Wide bed for large pieces." },
    ],
    imageAlt: "Singer Professional 5 14T968DC serger and coverstitch machine",
    lastUpdated: "2026-10-02",
    verdict: "A 5-thread serger and coverstitch in one box at 1,300 spm, with a manual changeover each time you switch and many owner threads about threading trouble.",
    specsVerified: "2026-10-02",
  },
  // ------------------------------------------------------------------ Janome
  "janome-hd3000": {
    score: 8.2,
    scoredFor: "heavy-duty",
    priceBand: 2,
    reason: "Janome lists 18 stitches, a 5-piece feed dog and a top loading rotary hook, while owner reports on heavy fabric and reliability split.",
    context: "Mechanical all-rounder · in Heavy duty and First machine hubs",
    verdict: "A mechanical aluminum-frame zigzag machine with 18 stitches and a rotary hook; owners split on heavy fabric and reliability, so check the dealer and return terms.",
    keySpec: "18 stitches · 5-piece feed dog · 6.5 mm width",
    alternatives: [
      { slug: "singer-4452", label: "Singer", note: "Singer lists 32 stitches against Janome's 18." },
      { slug: "juki-tl-2010q", label: "Faster", note: "Straight stitch only, much faster." },
      { slug: "janome-mc6650", label: "Computerized", note: "Same brand, 10 in workspace per Janome." },
    ],
    imageAlt: "Janome HD3000 mechanical sewing machine",
    lastUpdated: "2026-10-02",
    specsVerified: "2026-10-02",
  },
  "janome-mc6650": {
    series: "MC",
    score: 8.1,
    scoredFor: "quilting",
    priceBand: 4,
    reason: "Computerized all-rounder with a 10 in flatbed workspace per Janome; no free arm and no built-in walking foot.",
    context: "Computerized quilter · in Heavy duty and Quilting hubs",
    verdict: "A computerized flatbed for quilters who also sew garments; Janome's 10 in is a workspace width, not a measured throat.",
    keySpec: "1,000 spm · 10 in throat · full stitch set",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Faster", note: "Straight stitch only." },
      { slug: "janome-hd3000", label: "Cheaper", note: "Mechanical; check its throat against needle-to-arm before comparing." },
      { slug: "bernina-570-qe", label: "Dealer route", note: "The Bernina it is cross-shopped with." },
    ],
    imageAlt: "Janome Memory Craft 6650 computerized sewing and quilting machine",
    lastUpdated: "2026-10-02",
    specsVerified: "2026-10-01",
  },
  "janome-coverpro-2000cpx": {
    series: "CoverPro",
    score: 8.2,
    scoredFor: "serger",
    reason: "More room right of the needle than the Brother.",
    context: "Coverstitch · in Sergers hub (coverstitch section)",
    alternatives: [
      { slug: "brother-2340cv", label: "Smaller bed", note: "A smaller bed than the CoverPro." },
      { slug: "singer-14t968dc", label: "Combo", note: "Serger and coverstitch in one." },
    ],
    imageAlt: "Janome CoverPro 2000CPX coverstitch machine",
    lastUpdated: "2026-10-02",
  },
  // ------------------------------------------------------------ Long-arm tier
  "handi-quilter-moxie": {
    series: "Moxie",
    score: 8.5,
    scoredFor: "quilting",
    reason: "Entry long-arm on a frame; 15 in throat space, about 10 in usable per the maker.",
    context: "Long-arm on a frame · in Quilting hub",
    alternatives: [
      { slug: "grace-qnique-15r", label: "Cross-shop", note: "The other 15 in entry long-arm." },
      { slug: "juki-tl-18qvp", label: "Sit-down", note: "8.5 in TL arm per dealers, no frame." },
      { slug: "juki-tl-2010q", label: "Domestic", note: "Fast quilter on a table." },
    ],
    imageAlt: "Handi Quilter Moxie long-arm quilting machine on a frame",
    lastUpdated: "2026-10-02",
    verdict: "A 15 in head on a frame: Handi Quilter lists regulated stitching and an 8 ft Loft frame, but gives about 10 in of usable quilting area and tension reports recur.",
    specsVerified: "2026-10-02",
  },
  "grace-qnique-15r": {
    series: "Qnique",
    score: 8.0,
    scoredFor: "quilting",
    reason: "The frame maker's own 15 in head, usually sold as a bundle.",
    context: "Long-arm on a frame · in Quilting hub",
    alternatives: [
      { slug: "handi-quilter-moxie", label: "Cross-shop", note: "The other 15 in entry long-arm." },
      { slug: "juki-tl-18qvp", label: "Sit-down", note: "8.5 in TL arm per dealers, no frame." },
    ],
    imageAlt: "Grace Q'nique 15R long-arm quilting machine",
    lastUpdated: "2026-09-29",
  },
  // ----------------------------------------------------------- Dealer-only
  "babylock-vibrant": {
    series: "Sergers",
    score: 7.9,
    scoredFor: "serger",
    reason: "Manual threading and tension; Jet-Air and automatic tension start at the Victory, per Baby Lock's chart.",
    context: "Overlocker · dealer-only · in Sergers hub",
    alternatives: [
      { slug: "brother-1034d", label: "Cheaper", note: "Same thread count online." },
      { slug: "juki-mo-654de", label: "2/3/4 thread", note: "Same 2/3/4 thread count, sold online." },
    ],
    imageAlt: "Baby Lock Vibrant serger",
    lastUpdated: "2026-10-02",
    verdict: "Baby Lock's manual-threading entry serger: 2/3/4 thread at 1,200 spm, no Jet-Air or automatic tension, sold through authorized retailers.",
    specsVerified: "2026-10-01",
  },
  "bernina-570-qe": {
    series: "5",
    score: 8.3,
    scoredFor: "quilting",
    reason: "The dealer-only quilter people cross-shop against the Memory Craft; confirm the generation and the BSR foot with the dealer.",
    context: "Computerized quilter · dealer-only · in Quilting hub",
    alternatives: [
      { slug: "janome-mc6650", label: "Sold online", note: "The Memory Craft it is priced against." },
      { slug: "juki-tl-2010q", label: "Straight stitch", note: "Faster, much cheaper, one stitch." },
    ],
    imageAlt: "Bernina 570 QE computerized quilting machine",
    lastUpdated: "2026-10-02",
    verdict: "A dealer-only computerized quilter with 8.5 in right of the needle, built-in Dual Feed and BSR functionality, and a stitch regulator foot that varies by bundle.",
    specsVerified: "2026-10-02",
  },
  // ------------------------------------------------------------ Backlog batch
  "juki-ddl-5550": {
    score: 8.5,
    scoredFor: "heavy-duty",
    reason: "Industrial straight stitch head; needs a table, motor and floor space, and Juki publishes no throat or head weight.",
    context: "Industrial lockstitch · in Heavy duty hub",
    alternatives: [
      { slug: "juki-ddl-8700", label: "Industrial option", note: "The industrial straight stitch we list first." },
      { slug: "juki-dnu-1541s", label: "Walking foot", note: "For upholstery and leather." },
      { slug: "juki-tl-2010q", label: "Portable", note: "1,500 spm on a domestic body." },
    ],
    imageAlt: "Juki DDL-5550 industrial sewing machine head on a table",
    lastUpdated: "2026-10-02",
    verdict: "A Juki industrial straight stitch head with a 13 mm knee lift and automatic oiling that needs a table, a motor and floor space, and whose throat, head weight and origin Juki does not publish.",
    specsVerified: "2026-10-02",
  },
  "juki-mo-644d": {
    score: 7.9,
    scoredFor: "serger",
    reason: "Juki's catalog lists the 2-thread converter as optional here and standard on the 654DE.",
    context: "Overlocker · in Sergers hub",
    alternatives: [
      { slug: "juki-mo-654de", label: "Step up", note: "Converter standard per Juki's catalog; Juki prints a higher list price." },
      { slug: "brother-1034d", label: "Entry serger", note: "Brother's entry serger." },
      { slug: "babylock-vibrant", label: "Dealer route", note: "Baby Lock's entry serger." },
    ],
    imageAlt: "Juki MO-644D serger",
    lastUpdated: "2026-10-02",
    verdict: "Juki's entry serger on paper: 2/3/4 thread, 1,500 spm, differential feed and a built-in rolled hem, with the 2-thread converter sold separately.",
    specsVerified: "2026-10-02",
  },
  "juki-hzl-f600": {
    score: 8.2,
    scoredFor: "quilting",
    reason: "Box feed, knee lift, trimmer, walking foot and wide table listed in the box; Juki publishes no throat figure.",
    context: "Computerized · in Heavy duty and Quilting hubs",
    alternatives: [
      { slug: "juki-hzl-f300", label: "Cheaper", note: "Same chassis and speed with 106 stitches; Juki lists $1,799 against $2,369 and the wide table is optional." },
      { slug: "janome-mc6650", label: "Wider workspace", note: "10 in per Janome and 1,000 spm." },
      { slug: "juki-tl-2010q", label: "Straight only", note: "Faster, no zigzag." },
    ],
    imageAlt: "Juki HZL-F600 computerized sewing and quilting machine",
    lastUpdated: "2026-10-02",
    verdict: "A box-feed computerized HZL with 225 stitches, 900 spm, walking foot, wide table and knee lift listed in the box; Juki publishes no throat figure.",
    specsVerified: "2026-10-02",
  },
  "juki-hzl-f300": {
    score: 8.0,
    scoredFor: "beginner",
    reason: "Juki lists 106 stitches, 900 spm and box feed, with the knee lifter, table and walking foot optional; Juki's MSRP is $1,799 and it publishes no throat figure.",
    context: "Computerized · in First serious machine and Quilting hubs",
    alternatives: [
      { slug: "juki-hzl-f600", label: "Step up", note: "225 stitches, walking foot and table." },
      { slug: "janome-hd3000", label: "Mechanical", note: "No electronics; 18 stitches per Janome." },
      { slug: "brother-cs7000x", label: "Brother", note: "A computerized Brother; check Brother's current price." },
    ],
    imageAlt: "Juki HZL-F300 computerized sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "A 900 spm box-feed computerized machine with 106 stitches and 16 sensor buttonholes; Juki gives no throat figure, and the knee lifter, wide table and walking foot are extras.",
    specsVerified: "2026-10-02",
  },
  "juki-dnu-1541s": {
    score: 8.8,
    scoredFor: "heavy-duty",
    reason: "Walking-foot industrial head; Juki gives 10.4 in needle to arm and 36.5 kg for the head, and lists the motor and table separately.",
    context: "Industrial walking foot · in Heavy duty hub",
    alternatives: [
      { slug: "juki-ddl-8700", label: "Drop feed", note: "Cheaper industrial for flat work." },
      { slug: "juki-ddl-5550", label: "Sibling", note: "Straight stitch, no walking foot." },
      { slug: "singer-4452", label: "Domestic", note: "The value pick for occasional denim." },
    ],
    imageAlt: "Juki DNU-1541S walking foot industrial sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "A 2,500 spm unison-feed industrial head with a safety mechanism, sold as a head: Juki's catalog lists the motor and table separately, and the 10.4 in needle-to-arm reach and heavy-material wording are Juki's.",
    specsVerified: "2026-10-01",
  },
  "janome-hd9": {
    score: 8.4,
    scoredFor: "heavy-duty",
    reason: "Janome's straight-stitch-only head for heavy layers, sold through authorized dealers and Amazon.",
    context: "Straight-stitch head · in Heavy duty and Quilting hubs",
    alternatives: [
      { slug: "juki-tl-2010q", label: "Same job", note: "Same job at 1,500 spm." },
      { slug: "brother-pq1600s", label: "Budget", note: "1,500 spm straight stitch for far less." },
      { slug: "juki-tl-2000qi", label: "Value", note: "The TL without the trimmer button." },
    ],
    imageAlt: "Janome HD9 Professional straight-stitch sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "A 1,600 spm straight-stitch head with knee lift and thread cutter, with a household-use warranty to check against your job.",
    specsVerified: "2026-10-01",
  },
  "janome-hd1000": {
    score: 7.0,
    scoredFor: "beginner",
    reason: "The entry HD: a first machine with an aluminum frame, not a heavy-fabric tool.",
    context: "Mechanical · in First serious machine hub",
    alternatives: [
      { slug: "janome-hd3000", label: "Step up", note: "18 stitches and a one-step buttonhole." },
      { slug: "singer-4423", label: "Same Singer family", note: "A related Singer heavy duty model." },
      { slug: "janome-hd5000", label: "Top HD", note: "7 mm zigzag and seven feet." },
    ],
    imageAlt: "Janome HD1000 mechanical sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "The HD1000 is a household-only, aluminum-framed 14-stitch mechanical that owners treat as a first machine, not a heavy-fabric tool.",
    specsVerified: "2026-10-01",
  },
  "janome-hd5000": {
    score: 8.0,
    scoredFor: "heavy-duty",
    priceBand: 2,
    reason: "Janome lists the same specs as the HD3000; check bundle contents and the dealer price.",
    context: "Mechanical · in Heavy duty hub",
    alternatives: [
      { slug: "janome-hd3000", label: "Same specs", note: "Janome's spec table matches the HD5000 line for line, including 6.5 mm width." },
      { slug: "singer-4452", label: "Singer rival", note: "A Singer heavy-duty rival; check its published specs against the HD5000 before choosing." },
      { slug: "brother-st371hd", label: "Brother rival", note: "Brother's heavy-duty-labelled rival; check its published specs against the HD5000 before choosing." },
    ],
    imageAlt: "Janome HD5000 mechanical sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "A mechanical Janome HD with 18 stitches and an aluminum frame; Janome's spec table matches the HD3000 line for line, so check bundle contents and the dealer price.",
    specsVerified: "2026-10-02",
  },
  "janome-8002d": {
    score: 7.6,
    scoredFor: "serger",
    reason: "Janome's entry 3/4-thread serger: $399 MSRP, manual threading, no 2-thread stitch.",
    context: "Overlocker · in Sergers hub",
    alternatives: [
      { slug: "brother-1034d", label: "Brother", note: "A 3/4-thread serger at the same 1,300 spm with a free arm per the cross-shop notes." },
      { slug: "juki-mo-654de", label: "More threads", note: "Adds 2-thread stitches (2/3/4 thread) and 1,500 spm." },
      { slug: "brother-1034dx", label: "Sibling", note: "Brother's refreshed 1034D with right-side dials, per the cross-shop notes." },
    ],
    imageAlt: "Janome 8002D serger",
    lastUpdated: "2026-10-02",
    verdict: "Janome's entry 3/4-thread serger: 1,300 spm, 0.5 to 2.25 differential and manual threading at a $399 MSRP, with no 2-thread stitch and no published throat or free arm.",
    specsVerified: "2026-10-02",
  },
  "singer-hd6600c": {
    score: 7.2,
    scoredFor: "beginner",
    reason: "Computerized Singer Heavy Duty; no thread cutter, few feet, mixed owner reports.",
    context: "Computerized · Singer Heavy Duty family",
    alternatives: [
      { slug: "singer-4452", label: "Mechanical", note: "Same speed, fewer stitches, the value pick." },
      { slug: "singer-hd6700c", label: "Step up", note: "Adds a speed slider and a walking foot." },
      { slug: "janome-hd3000", label: "Built heavier", note: "Our beginner pick, mechanical." },
    ],
    imageAlt: "Singer Heavy Duty 6600C computerized sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "A computerized Singer Heavy Duty with LCD stitch selection; owner reports on build and reliability are mixed.",
    specsVerified: "2026-10-01",
  },
  "singer-hd6700c": {
    score: 7.4,
    scoredFor: "beginner",
    reason: "Computerized Singer Heavy Duty with 10 feet incl. walking foot; Singer pages disagree on speed, stitches and needle up/down.",
    context: "Computerized · in First serious machine hub",
    alternatives: [
      { slug: "singer-hd6600c", label: "Sibling", note: "Singer's 6600C in the same Heavy Duty line; see its review." },
      { slug: "singer-4452", label: "Mechanical", note: "Singer's mechanical Heavy Duty; no electronics." },
      { slug: "janome-mc6650", label: "Real step up", note: "10 in workspace per Janome and a heavier frame." },
    ],
    imageAlt: "Singer Heavy Duty 6700C computerized sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "A metal-frame computerized machine with 10 feet and a walking foot, but Singer's own pages disagree on speed, stitch count and needle up/down.",
    specsVerified: "2026-10-02",
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
    lastUpdated: "2026-10-02",
    verdict: "The base Heavy Duty head: 11 stitches, a four-step buttonhole and no needle threader on the 4423 frame, so it only makes sense on a real price gap to the 4423.",
    specsVerified: "2026-10-02",
  },
  "singer-14cg754": {
    score: 7.2,
    scoredFor: "serger",
    reason: "Entry 2/3/4-thread serger; \"ProFinish\" is Singer's name, and owner evidence is limited.",
    context: "Overlocker · in Sergers hub",
    alternatives: [
      { slug: "brother-1034d", label: "Entry serger", note: "Brother's entry serger; owners compare threading and light." },
      { slug: "singer-14t968dc", label: "Combo", note: "Singer's serger plus coverstitch." },
      { slug: "juki-mo-654de", label: "1,500 spm, 5-year warranty", note: "Per Juki's spec: 1,500 spm and a 5-year mechanical warranty." },
    ],
    imageAlt: "Singer ProFinish 14CG754 serger",
    lastUpdated: "2026-10-02",
    verdict: "A budget 2/3/4-thread serger with differential feed, rolled hem and free arm; Singer's page shows it out of stock, and owner evidence is thin.",
    specsVerified: "2026-10-02",
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
      { slug: "juki-mo-654de", label: "1,500 spm, 5-year warranty", note: "Per Juki's spec: 1,500 spm and a 5-year mechanical warranty." },
    ],
    imageAlt: "Brother 1634D serger",
    lastUpdated: "2026-10-02",
  },
  "brother-cs7000x": {
    score: 7.1,
    scoredFor: "beginner",
    reason: "The budget computerized package; no published throat and a 750 spm ceiling.",
    context: "Computerized · in First serious machine hub",
    alternatives: [
      { slug: "janome-hd3000", label: "Mechanical", note: "Fewer stitches, far more machine." },
      { slug: "brother-st371hd", label: "Heavy duty", note: "Brother's mechanical for thick layers." },
      { slug: "janome-mc6650", label: "Real quilter", note: "10 in workspace per Janome, 1,000 spm, many times the price." },
    ],
    imageAlt: "Brother CS7000X computerized sewing machine with wide table",
    lastUpdated: "2026-10-02",
    verdict: "Budget computerized package with 70 stitches and a wide table, held back by no published throat figure and a 750 spm ceiling.",
    specsVerified: "2026-10-02",
  },
  "bernina-1008": {
    score: 7.9,
    scoredFor: "heavy-duty",
    priceBand: 3,
    reason: "Bernina's US page says it is no longer available; owners report a sturdy mechanical, so buy through a dealer or used.",
    context: "Mechanical, discontinued · used market via Bernina dealers",
    alternatives: [
      { slug: "janome-hd3000", label: "In production", note: "The all-mechanical alternative buyers name when the 1008 is unavailable." },
      { slug: "bernina-570-qe", label: "Same dealer", note: "Bernina's computerized quilter." },
      { slug: "brother-st371hd", label: "Budget", note: "A cheap new mechanical." },
    ],
    imageAlt: "Bernina 1008 mechanical sewing machine",
    lastUpdated: "2026-10-02",
    verdict: "Bernina's US page says the 1008 is no longer available; owners praise a sturdy mechanical, so it is a dealer or used-market buy to check unit by unit.",
    specsVerified: "2026-10-01",
  },
  "bernina-l-850": {
    score: 8.5,
    scoredFor: "serger",
    reason: "Air threading and a knee lift at a $3,999 MSRP, dealer only.",
    context: "Air-threading overlocker · in Sergers hub",
    alternatives: [
      { slug: "juki-mo-1000", label: "Cheaper air", note: "Juki's air threader for a third of the money." },
      { slug: "babylock-victory", label: "Dealer rival", note: "Baby Lock's air-threading entry." },
      { slug: "juki-mo-654de", label: "Manual", note: "Our pick if you thread by hand." },
    ],
    imageAlt: "Bernina L 850 air-threading serger",
    lastUpdated: "2026-10-02",
    verdict: "A dealer-only 2/3/4 thread air-threading serger at a $3,999 MSRP that buys mechanical refinement, not a touch screen or coverstitch.",
    specsVerified: "2026-10-02",
  },
  "handi-quilter-amara": {
    score: 8.6,
    scoredFor: "quilting",
    reason: "The first true long-arm throat in the Handi Quilter line.",
    context: "20 in stand-up long-arm · in Quilting hub",
    alternatives: [
      { slug: "grace-qnique-19x", label: "19 in head", note: "Grace's 19 in quilting arm width, per Grace." },
      { slug: "handi-quilter-moxie", label: "Entry tier", note: "15 in on an 8 ft frame." },
      { slug: "handi-quilter-sweet-sixteen", label: "Sit-down", note: "16 in at a table, no frame." },
    ],
    imageAlt: "Handi Quilter Amara 20 long-arm quilting machine on a frame",
    lastUpdated: "2026-10-02",
  },
  "handi-quilter-sweet-sixteen": {
    score: 7.8,
    scoredFor: "quilting",
    reason: "Sit-down quilter the maker no longer lists; dealer stock versus a used unit.",
    context: "Sit-down mid-arm, discontinued · remaining stock and used market",
    alternatives: [
      { slug: "handi-quilter-moxie", label: "Current", note: "Same brand, a frame machine with a 15 in head." },
      { slug: "juki-tl-18qvp", label: "Domestic", note: "8.5 in straight stitch at a table." },
      { slug: "handi-quilter-amara", label: "Go long-arm", note: "A 20 in head on a frame, for quilters who find a table drags on big quilts." },
    ],
    imageAlt: "Handi Quilter Sweet Sixteen sit-down quilting machine with table",
    lastUpdated: "2026-10-02",
    verdict: "A 16 in sit-down quilter with a table and optional regulation; the maker has no machine page, so judged on its manual and owner reports.",
    specsVerified: "2026-10-02",
  },
  "grace-qnique-19x": {
    score: 8.3,
    scoredFor: "quilting",
    reason: "The most throat per dollar in the entry frame class.",
    context: "19 in long-arm head · in Quilting hub",
    alternatives: [
      { slug: "handi-quilter-moxie", label: "Dealer depth", note: "15 in with Handi Quilter service." },
      { slug: "grace-qnique-15r", label: "15 in head", note: "Grace's 15 in head." },
      { slug: "handi-quilter-amara", label: "Step up", note: "20 in, twice the price." },
    ],
    imageAlt: "Grace Q'nique 19X long-arm quilting machine",
    lastUpdated: "2026-10-02",
  },
  "babylock-imagine": {
    score: 7.7,
    scoredFor: "serger",
    priceBand: 3,
    reason: "Air-threading serger that one dealer lists as discontinued; mostly a used-market buy.",
    context: "Air-threading overlocker, discontinued · used market",
    alternatives: [
      { slug: "juki-mo-1000", label: "Buy new", note: "Air threading you can order today." },
      { slug: "babylock-vibrant", label: "Same dealer", note: "Baby Lock's manual-thread entry." },
      { slug: "bernina-l-850", label: "Dealer rival", note: "Air threading with a knee lift." },
    ],
    imageAlt: "Baby Lock Imagine air-threading serger",
    lastUpdated: "2026-10-02",
    verdict: "A Baby Lock 4/3/2 thread serger that one dealer lists as discontinued; Jet-Air threading and Automatic Thread Delivery are maker claims that owners mostly, not always, bear out.",
    specsVerified: "2026-10-01",
  },
  "babylock-victory": {
    score: 8.4,
    scoredFor: "serger",
    reason: "Baby Lock's air-threading entry, dealer sold; the maker's own sheets confirm most specs but not motor, frame or throat.",
    context: "Air-threading overlocker · in Sergers hub",
    alternatives: [
      { slug: "juki-mo-1000", label: "Cheaper air", note: "Juki's air threader, sold online." },
      { slug: "babylock-vibrant", label: "Same dealer", note: "Manual threading, far less money." },
      { slug: "bernina-l-850", label: "Dealer rival", note: "Air threading with a knee lift." },
    ],
    imageAlt: "Baby Lock Victory air-threading serger",
    lastUpdated: "2026-10-02",
    verdict: "Baby Lock's Jet-Air serger with Automatic Thread Delivery and no tension dials, sold through dealers; Baby Lock publishes no motor, frame or throat figure.",
    specsVerified: "2026-10-02",
  },
  "singer-14hd854": {
    score: 7.3,
    scoredFor: "serger",
    reason: "The ProFinish with a Heavy Duty badge; buy on price against the 14CG754, and read the manual figures, which differ from Singer's page.",
    context: "Overlocker · Singer Heavy Duty serger",
    alternatives: [
      { slug: "singer-14cg754", label: "Sibling", note: "Same class, ProFinish name." },
      { slug: "brother-1034d", label: "Entry serger", note: "Brother's entry serger." },
      { slug: "juki-mo-654de", label: "1,500 spm, 5-year warranty", note: "Per Juki's spec: 1,500 spm and a 5-year mechanical warranty." },
    ],
    imageAlt: "Singer Heavy Duty 14HD854 serger",
    lastUpdated: "2026-10-02",
    verdict: "A 2/3/4 thread Singer serger with differential feed and a free arm; Heavy Duty is a series name, and the owner record is thin.",
    specsVerified: "2026-10-02",
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
