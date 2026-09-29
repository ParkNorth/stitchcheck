import type { Brand, MachineType } from "./products";

export interface Series {
  /** URL segment and decoder code: "tl", "hzl", "ddl", "mo". */
  slug: string;
  code: string;
  name: string;
  type: MachineType;
  builtFor: string;
  band: string;
  watchFor: string;
  /** Series hubs exist only where a brand has real series with several models. */
  hasHub: boolean;
  description: string;
  dateModified: string;
}

export interface BrandInfo {
  slug: string;
  name: Brand;
  intro: string;
  glance: {
    strongest: string;
    weaker: string;
    priceSpan: string;
  };
  series: Series[];
  /** Dealer-only brands get no buy button. */
  dealerOnly: boolean;
  dealerLocatorUrl?: string;
  manufacturerUrl: string;
  metaDescription: string;
  dateModified: string;
}

export const brands: BrandInfo[] = [
  {
    slug: "juki",
    name: "Juki",
    intro:
      "A Japanese maker best known for factory machines. Its home line borrows from that side: fast straight-stitch machines and sergers are the strength, while the computerized range is smaller than Brother's or Janome's.",
    glance: {
      strongest: "High-speed straight stitch, sergers",
      weaker: "Embroidery, budget computerized",
      priceSpan: "$ under 500 → $$$ 1–2k",
    },
    series: [
      {
        slug: "tl",
        code: "TL",
        name: "High-speed straight stitch",
        type: "mechanical",
        builtFor: "Quilting, garment seams, canvas",
        band: "$$ → $$$",
        watchFor: "No zigzag at all",
        hasHub: true,
        description:
          "Juki's TL series is a single-needle, straight-stitch-only line built for speed and stitch quality. 1,500 spm across the range; the model number tells you the convenience tier, not the arm size.",
        dateModified: "2026-09-29",
      },
      {
        slug: "hzl",
        code: "HZL",
        name: "Home zigzag, all-rounder",
        type: "computerized",
        builtFor: "General sewing, garments",
        band: "$$ → $$$",
        watchFor: "Not a heavy-duty line",
        hasHub: false,
        description: "Juki's computerized home zigzag machines. Box feed on the F series.",
        dateModified: "2026-09-29",
      },
      {
        slug: "ddl",
        code: "DDL",
        name: "Industrial lockstitch",
        type: "mechanical",
        builtFor: "Production speed, home workshops",
        band: "$$ + table",
        watchFor: "Table, motor, floor space",
        hasHub: true,
        description:
          "Factory single-needle lockstitch heads sold to home buyers with a table and motor. Straight stitch only, 5,000 spm and up, standard industrial needles and feet.",
        dateModified: "2026-09-29",
      },
      {
        slug: "mo",
        code: "MO",
        name: "Overlock (sergers)",
        type: "serger",
        builtFor: "Knits, seam finishing",
        band: "$ → $$$",
        watchFor: "Threading system varies",
        hasHub: true,
        description:
          "Juki's home sergers, from the manually threaded MO-654DE to the air-threading MO-1000. All 2/3/4 thread with differential feed.",
        dateModified: "2026-09-29",
      },
      {
        slug: "dnu",
        code: "DNU",
        name: "Industrial walking foot",
        type: "mechanical",
        builtFor: "Upholstery, leather, webbing on a table",
        band: "$$$$ → $$$$$",
        watchFor: "Needs a table, motor and a dedicated spot",
        hasHub: false,
        description: "Juki's compound-feed industrial lockstitch line: the DNU-1541 and 1541S for thick, sticky and layered materials.",
        dateModified: "2026-09-29",
      },
    ],
    dealerOnly: false,
    manufacturerUrl: "https://www.jukihome.com/",
    metaDescription:
      "Juki sewing machines decoded: what TL, HZL, DDL and MO mean, which series fits heavy fabric, quilting or serging, and every Juki model we have spec-checked.",
    dateModified: "2026-09-29",
  },
  {
    slug: "janome",
    name: "Janome",
    intro:
      "A Japanese maker with the widest home range of the brands we cover. The HD line is the mechanical heavy-duty entry; Memory Craft is the computerized tier with wider throats; CoverPro is the coverstitch line.",
    glance: {
      strongest: "Mechanical build quality, wide-throat computerized",
      weaker: "Straight-stitch speed (until the HD9), budget sergers",
      priceSpan: "$$ 500–1k → $$$$ 2–3k",
    },
    series: [
      {
        slug: "hd",
        code: "HD",
        name: "Heavy duty mechanical",
        type: "mechanical",
        builtFor: "Denim, canvas, everyday garments",
        band: "$$",
        watchFor: "Slower than the Juki TL",
        hasHub: false,
        description: "Janome's mechanical heavy-duty line: HD1000, HD3000, HD5000 and the straight-stitch HD9.",
        dateModified: "2026-09-29",
      },
      {
        slug: "mc",
        code: "MC",
        name: "Memory Craft computerized",
        type: "computerized",
        builtFor: "Quilting and garments on one machine",
        band: "$$$ → $$$$",
        watchFor: "Computerized means more to service",
        hasHub: false,
        description: "Janome's computerized sewing and quilting machines with wider throats.",
        dateModified: "2026-09-29",
      },
      {
        slug: "coverpro",
        code: "CoverPro",
        name: "Coverstitch",
        type: "coverstitch",
        builtFor: "Knit hems, activewear",
        band: "$$",
        watchFor: "Coverstitch only, no overlock",
        hasHub: false,
        description: "Janome's dedicated coverstitch machines on a sewing-machine style bed.",
        dateModified: "2026-09-29",
      },
      {
        slug: "sergers",
        code: "Sergers",
        name: "Sergers",
        type: "serger",
        builtFor: "Knits, seam finishing",
        band: "$",
        watchFor: "Manual threading across the range",
        hasHub: false,
        description: "Janome's 3/4-thread home sergers, led by the 8002D.",
        dateModified: "2026-09-29",
      },
    ],
    dealerOnly: false,
    manufacturerUrl: "https://www.janome.com/",
    metaDescription:
      "Janome sewing machines decoded: HD mechanical heavy duty, Memory Craft computerized quilters, CoverPro coverstitch, and every Janome model we have spec-checked.",
    dateModified: "2026-09-29",
  },
  {
    slug: "brother",
    name: "Brother",
    intro:
      "The volume brand. Brother's sergers and coverstitch machines are the most-bought in the US at their price, and the ST line is its mechanical heavy-duty entry. Embroidery is Brother's biggest home line and outside our scope.",
    glance: {
      strongest: "Budget sergers and coverstitch, wide dealer network",
      weaker: "Straight-stitch speed, industrial-style build",
      priceSpan: "$ under 500 → $$ 500–1k",
    },
    series: [
      {
        slug: "1034",
        code: "1034",
        name: "Budget sergers",
        type: "serger",
        builtFor: "First serger, knits, finishing",
        band: "$",
        watchFor: "1034D and 1034DX are near-identical",
        hasHub: false,
        description: "Brother's 3/4-thread home sergers.",
        dateModified: "2026-09-29",
      },
      {
        slug: "pq",
        code: "PQ",
        name: "Straight-stitch quilters",
        type: "mechanical",
        builtFor: "Quilting, garment seams, canvas",
        band: "$$",
        watchFor: "Straight stitch only, like the Juki TL",
        hasHub: false,
        description: "Brother's high-speed straight-stitch quilting machines, cross-shopped against the Juki TL.",
        dateModified: "2026-09-29",
      },
      {
        slug: "cv",
        code: "CV",
        name: "Coverstitch",
        type: "coverstitch",
        builtFor: "Knit hems",
        band: "$",
        watchFor: "Coverstitch only",
        hasHub: false,
        description: "Brother's dedicated coverstitch machine, the 2340CV.",
        dateModified: "2026-09-29",
      },
      {
        slug: "st",
        code: "ST",
        name: "Strong & Tough mechanical",
        type: "mechanical",
        builtFor: "Denim, repairs, first serious machine",
        band: "$",
        watchFor: "Marketing name, not a rating",
        hasHub: false,
        description: "Brother's mechanical heavy-duty entry, the ST371HD.",
        dateModified: "2026-09-29",
      },
      {
        slug: "cs",
        code: "CS",
        name: "CS computerized",
        type: "computerized",
        builtFor: "First computerized machine, light quilting",
        band: "$",
        watchFor: "Plastic-bodied; count the included feet, not the stitches",
        hasHub: false,
        description: "Brother's budget computerized line, led by the CS7000X with its wide table.",
        dateModified: "2026-09-29",
      },
    ],
    dealerOnly: false,
    manufacturerUrl: "https://www.brother-usa.com/home/sewing-embroidery",
    metaDescription:
      "Brother sewing machines for serious home sewists: the 1034D and 1034DX sergers, the 2340CV coverstitch and the ST heavy-duty line, spec-checked.",
    dateModified: "2026-09-29",
  },
  {
    slug: "singer",
    name: "Singer",
    intro:
      "The name everyone knows, now owned by SVP Worldwide. The Heavy Duty 44xx family is the best-selling budget mechanical line in the US. Heavy Duty is a series name, not a rating, and we score it against the job.",
    glance: {
      strongest: "Budget mechanical, availability, price",
      weaker: "Build weight, presser-foot pressure on thick layers",
      priceSpan: "$ under 500 → $$ 500–1k",
    },
    series: [
      {
        slug: "heavy-duty",
        code: "HD",
        name: "Heavy Duty 44xx",
        type: "mechanical",
        builtFor: "Denim hems, canvas bags, repairs",
        band: "$",
        watchFor: "Same motor across 4423, 4432, 4452",
        hasHub: false,
        description: "Singer's Heavy Duty family: 4411, 4423, 4432, 4452 and the computerized 6600C and 6700C.",
        dateModified: "2026-09-29",
      },
      {
        slug: "professional",
        code: "Pro",
        name: "Professional 5 serger and coverstitch",
        type: "serger",
        builtFor: "Knits, finishing and hems on one machine",
        band: "$$",
        watchFor: "Conversion time between overlock and coverstitch",
        hasHub: false,
        description: "Singer's 2/3/4/5-thread serger with coverstitch conversion.",
        dateModified: "2026-09-29",
      },
      {
        slug: "sergers",
        code: "Sergers",
        name: "ProFinish and Heavy Duty sergers",
        type: "serger",
        builtFor: "First serger, seam finishing",
        band: "$",
        watchFor: "ProFinish is the budget line, not the Professional 5",
        hasHub: false,
        description: "Singer's 2/3/4-thread home sergers: the ProFinish 14CG754 and the Heavy Duty 14HD854.",
        dateModified: "2026-09-29",
      },
    ],
    dealerOnly: false,
    manufacturerUrl: "https://www.singer.com/",
    metaDescription:
      "Singer Heavy Duty decoded: what the 4423, 4432 and 4452 share, where the series name overpromises, and every Singer model we have spec-checked.",
    dateModified: "2026-09-29",
  },
  {
    slug: "babylock",
    name: "Baby Lock",
    intro:
      "A dealer-only US brand made by Juki's parent company, best known for air-threading sergers. You cannot buy a new Baby Lock online, so we have no buy button; we send you to the dealer locator.",
    glance: {
      strongest: "Air-threading sergers, dealer support and lessons",
      weaker: "Price transparency, online buying",
      priceSpan: "$$ 500–1k → $$$$$ 3k+",
    },
    series: [
      {
        slug: "sergers",
        code: "Sergers",
        name: "Vibrant, Victory, Celebrate, Triumph and up",
        type: "serger",
        builtFor: "Knits and finishing with air threading",
        band: "$$ → $$$$$",
        watchFor: "Dealer pricing, not published",
        hasHub: true,
        description: "Baby Lock's serger ladder, from the manually threaded Vibrant to the air-threading Triumph.",
        dateModified: "2026-09-29",
      },
    ],
    dealerOnly: true,
    dealerLocatorUrl: "https://babylock.com/find-a-retailer",
    manufacturerUrl: "https://babylock.com/",
    metaDescription:
      "Baby Lock sergers decoded: the Vibrant, Victory, Celebrate and Triumph ladder, what air threading costs, and why there is no buy button on this page.",
    dateModified: "2026-09-29",
  },
  {
    slug: "bernina",
    name: "Bernina",
    intro:
      "A Swiss maker sold only through dealers. The 5 and 7 series are the quilting machines people cross-shop against Janome Memory Craft; bernette is the lower-priced sub-brand. No buy button here: dealer pricing only.",
    glance: {
      strongest: "Stitch quality, quilting features, dealer service",
      weaker: "Price, online buying",
      priceSpan: "$$$ 1–2k → $$$$$ 3k+",
    },
    series: [
      {
        slug: "5-series",
        code: "5",
        name: "5 series quilting",
        type: "computerized",
        builtFor: "Quilting and garments",
        band: "$$$$$",
        watchFor: "Dealer pricing, not published",
        hasHub: false,
        description: "Bernina's mid-range computerized quilting machines.",
        dateModified: "2026-09-29",
      },
      {
        slug: "classic",
        code: "1008",
        name: "1008 mechanical",
        type: "mechanical",
        builtFor: "Schools, garment sewing, a machine to keep",
        band: "$$$",
        watchFor: "Discontinued; check dealer stock and the replacement",
        hasHub: false,
        description: "Bernina's last all-mechanical machine, sold to schools and sewists who want no electronics.",
        dateModified: "2026-09-29",
      },
      {
        slug: "l",
        code: "L",
        name: "L series sergers",
        type: "serger",
        builtFor: "Knits, air threading, dealer service",
        band: "$$$$",
        watchFor: "Dealer pricing, not published",
        hasHub: false,
        description: "Bernina's L 8 series air-threading sergers and the L 890 combo.",
        dateModified: "2026-09-29",
      },
    ],
    dealerOnly: true,
    dealerLocatorUrl: "https://www.bernina.com/en-US/Dealer-Locator",
    manufacturerUrl: "https://www.bernina.com/",
    metaDescription:
      "Bernina for serious home sewists: which series matter for quilting and heavy fabric, what bernette is, and why there is no buy button on this page.",
    dateModified: "2026-09-29",
  },
  {
    slug: "handi-quilter",
    name: "Handi Quilter",
    intro:
      "A US long-arm specialist sold through dealers and a few online retailers. The Moxie is the entry stand-up long-arm; Amara, Forte and Infinity climb the throat and price ladder. Sit-down heads (Sweet Sixteen, Capri) are the mid-arm route.",
    glance: {
      strongest: "Stand-up long-arms with a dealer network, stitch regulation, Pro-Stitcher robotics",
      weaker: "Anything under 15 in of throat; price transparency",
      priceSpan: "$$$$$ 3k+",
    },
    series: [
      {
        slug: "moxie",
        code: "Moxie",
        name: "Entry long-arm on a frame",
        type: "long-arm",
        builtFor: "Whole quilts, often, in a room with a wall for the frame",
        band: "$$$$$",
        watchFor: "Frame, regulation and delivery are separate lines",
        hasHub: false,
        description: "Handi Quilter's 15 in entry long-arm, usually bundled with a Loft frame.",
        dateModified: "2026-09-29",
      },
      {
        slug: "amara",
        code: "Amara",
        name: "Amara stand-up long-arm",
        type: "long-arm",
        builtFor: "Whole quilts on a 10 or 12 ft frame, Pro-Stitcher ready",
        band: "$$$$$",
        watchFor: "Machine price rarely includes the frame",
        hasHub: false,
        description: "Handi Quilter's 20 and 24 in stand-up long-arms.",
        dateModified: "2026-09-29",
      },
      {
        slug: "sweet-sixteen",
        code: "Sweet Sixteen",
        name: "Sit-down mid-arm",
        type: "long-arm",
        builtFor: "Free-motion quilting at a table, no frame",
        band: "$$$$$",
        watchFor: "Sit-down: you move the quilt, not the machine",
        hasHub: false,
        description: "Handi Quilter's 16 in sit-down mid-arm with table.",
        dateModified: "2026-09-29",
      },
    ],
    dealerOnly: false,
    dealerLocatorUrl: "https://handiquilter.com/find-a-retailer/",
    manufacturerUrl: "https://handiquilter.com/",
    metaDescription:
      "Handi Quilter decoded: Moxie, Amara, Forte and the sit-down Sweet Sixteen by throat space and price, what the frame adds, and where to buy.",
    dateModified: "2026-09-29",
  },
  {
    slug: "grace-company",
    name: "Grace Company",
    intro:
      "The frame maker. Grace sells the Q'nique long-arm heads alongside its Q-Zone and Continuum frames, usually as a bundle, which makes it the price-led alternative to Handi Quilter at the 15 to 19 in tier.",
    glance: {
      strongest: "Frame-and-head bundles, price at the entry long-arm tier",
      weaker: "Dealer service depth, resale value versus Handi Quilter",
      priceSpan: "$$$$$ 3k+",
    },
    series: [
      {
        slug: "qnique",
        code: "Qnique",
        name: "Q'nique long-arm heads",
        type: "long-arm",
        builtFor: "Whole quilts on a Grace frame",
        band: "$$$$$",
        watchFor: "Bundle pricing hides the head price",
        hasHub: false,
        description: "Grace Company's Q'nique heads, 15 to 21 in, sold with Q-Zone and Continuum frames.",
        dateModified: "2026-09-29",
      },
    ],
    dealerOnly: false,
    dealerLocatorUrl: "https://graceframe.com/en/dealers",
    manufacturerUrl: "https://graceframe.com/",
    metaDescription:
      "Grace Company decoded: Q'nique long-arm heads by throat space, Q-Zone and Continuum frames, and what the bundle actually includes.",
    dateModified: "2026-09-29",
  },
];

export const brandsBySlug: Record<string, BrandInfo> = Object.fromEntries(brands.map((b) => [b.slug, b]));

export function getBrand(slug: string): BrandInfo | undefined {
  return brandsBySlug[slug];
}

export function brandSlugFor(name: Brand): string | undefined {
  return brands.find((b) => b.name === name)?.slug;
}

export function getSeries(brandSlug: string, seriesSlug: string): Series | undefined {
  return getBrand(brandSlug)?.series.find((s) => s.slug === seriesSlug);
}

/** Series hubs that exist as URLs. */
export function seriesHubs(): { brand: BrandInfo; series: Series; href: string }[] {
  return brands.flatMap((brand) =>
    brand.series.filter((s) => s.hasHub).map((series) => ({ brand, series, href: `/brands/${brand.slug}/${series.slug}` })),
  );
}

/** Match a product's `series` code to a brand's series entry. */
export function seriesForProduct(brandSlug: string, code: string | undefined): Series | undefined {
  if (!code) return undefined;
  const b = getBrand(brandSlug);
  return b?.series.find((s) => s.code.toLowerCase() === code.toLowerCase() || s.slug === code.toLowerCase());
}
