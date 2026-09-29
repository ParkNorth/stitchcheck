import type { Job } from "./products";

export type Pick = "our-pick" | "value-pick";

export interface RankedEntry {
  slug: string;
  pick?: Pick;
  /** Overrides the product's default one-line reason on this hub. */
  reason?: string;
  /** Hub-specific "Also budget for" cell in the side-by-side table. */
  alsoBudget?: string;
}

export interface ShortAnswer {
  label: string;
  tone: "enamel" | "brass" | "ink";
  slug: string;
  sentence: string;
}

export interface HubSection {
  title: string;
  intro: string;
  entries: RankedEntry[];
}

export interface Hub {
  slug: string;
  job: Job;
  /** Nav label and breadcrumb. */
  label: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** Mono line under the H1: scope. */
  scope: string;
  /** Three-line intro verdict. */
  intro: string[];
  shortAnswer: ShortAnswer[];
  ranked: RankedEntry[];
  /** Optional second section (coverstitch inside sergers). */
  sections?: HubSection[];
  relatedGuides: string[];
  headToHeads: string[];
  otherJobs: Job[];
  faqs: { q: string; a: string }[];
  /** True for the feeder hub: kept out of primary nav. */
  feeder?: boolean;
  lastUpdated: string;
}

export const hubs: Hub[] = [
  {
    slug: "best-heavy-duty-sewing-machines",
    job: "heavy-duty",
    label: "Heavy duty",
    h1: "Best heavy-duty sewing machines",
    metaTitle: "Best Heavy-Duty Sewing Machines (2026): Denim, Canvas, Leather, Upholstery",
    metaDescription:
      "Ten heavy-duty and industrial-for-home sewing machines, ranked for thick fabric, not stitch count. Specs checked against Juki, Janome and Singer data. Who each one is for and who should skip it.",
    scope: "Includes industrial-for-home · leather · denim · canvas · upholstery",
    intro: [
      "Heavy duty is a job, not a badge. We rank on motor, presser-foot lift, feed and needle system.",
      "The fastest machine here is straight-stitch only; the cheapest is a series name that overpromises.",
      "If you sew upholstery weekly, skip the domestic tier and read the industrial entry.",
    ],
    shortAnswer: [
      {
        label: "Best overall",
        tone: "enamel",
        slug: "juki-tl-2010q",
        sentence: "the fastest domestic straight stitch, if you don't need zigzag.",
      },
      {
        label: "Honest value",
        tone: "brass",
        slug: "singer-4452",
        sentence: "fine for denim hems, out of its depth on upholstery.",
      },
      {
        label: "Go industrial",
        tone: "ink",
        slug: "juki-dnu-1541s",
        sentence: "the walking-foot industrial for upholstery and leather, if you have a table and floor space.",
      },
    ],
    ranked: [
      { slug: "juki-tl-2010q", pick: "our-pick", alsoBudget: "TL feet, solid table" },
      { slug: "janome-hd9", alsoBudget: "Jumbo bobbins" },
      { slug: "janome-hd3000", alsoBudget: "Nothing extra" },
      { slug: "juki-hzl-f600", alsoBudget: "Nothing extra" },
      { slug: "janome-hd5000", alsoBudget: "Nothing extra" },
      { slug: "janome-mc6650", alsoBudget: "Nothing extra" },
      { slug: "singer-4452", pick: "value-pick", alsoBudget: "Nothing extra" },
    ],
    sections: [
      {
        title: "Industrial for home",
        intro:
          "Factory heads sold to home sewists. Each needs a table, a servo motor and a permanent spot, and each does one stitch faster and harder than anything above. Buy the walking foot if your work is upholstery or leather; buy drop feed for flat seams.",
        entries: [
          { slug: "juki-dnu-1541s", alsoBudget: "Table + servo motor" },
          { slug: "juki-ddl-8700", alsoBudget: "Table + servo motor" },
          { slug: "juki-ddl-5550", alsoBudget: "Table + servo motor" },
        ],
      },
    ],
    relatedGuides: ["sewing-machine-for-thick-fabric", "mechanical-vs-computerized", "sewing-machine-brands-ranked"],
    headToHeads: ["singer-4423-vs-4432-vs-4452", "juki-tl-2010q-vs-tl-2000qi"],
    otherJobs: ["serger", "quilting"],
    faqs: [
      {
        q: "What makes a sewing machine heavy duty?",
        a: "A motor that holds speed through layers, a high presser-foot lift, a feed system that grips thick seams, and a needle system that takes 100/16 to 110/18 needles. Stitch count has nothing to do with it. Singer's Heavy Duty is a series name; the Juki TL and DDL earn the description on the spec sheet.",
      },
      {
        q: "Can a home heavy-duty machine sew leather?",
        a: "Garment-weight leather and two layers of denim, yes, with a leather needle and a walking or Teflon foot. Upholstery leather and marine vinyl want an industrial walking-foot machine, which is a different class from anything on this list.",
      },
      {
        q: "Is an industrial machine practical at home?",
        a: "If you have a permanent spot for a table, yes. The Juki DDL-8700 and DDL-5550 are straight stitch only and run quietly on a servo motor; the DNU-1541S adds a walking foot for upholstery. Each is a piece of furniture, not an appliance you put away.",
      },
      {
        q: "Do I need a walking foot?",
        a: "For layered denim, canvas bags and quilts, a walking foot stops the top layer creeping. Most machines on this list take a generic low-shank walking foot; the Juki TL takes its own.",
      },
    ],
    lastUpdated: "2026-09-29",
  },
  {
    slug: "best-sergers",
    job: "serger",
    label: "Sergers",
    h1: "Best sergers",
    metaTitle: "Best Sergers (2026): Overlockers and Coverstitch Machines, Spec-Checked",
    metaDescription:
      "Eight sergers from $200 up, ranked on differential feed, threading and stitch options, plus coverstitch machines in their own section. Specs checked against Brother, Juki, Janome, Singer and Bernina data.",
    scope: "Overlockers first · coverstitch as its own section · knits, seam finishing, stretch hems",
    intro: [
      "A serger seams, trims and wraps the edge in one pass. It does not replace your sewing machine.",
      "We rank on differential feed, threading and stitch options. Accessory bundles weigh least.",
      "If hems are the gap, not seams, skip to the coverstitch section.",
    ],
    shortAnswer: [
      { label: "Best overall", tone: "enamel", slug: "juki-mo-654de", sentence: "our pick if you will serge every week." },
      { label: "Honest value", tone: "brass", slug: "brother-1034d", sentence: "the cheapest serger we'd tell a friend to buy." },
      { label: "Air threading", tone: "ink", slug: "juki-mo-1000", sentence: "threads its own loopers, at three times the price." },
    ],
    ranked: [
      { slug: "juki-mo-654de", pick: "our-pick", alsoBudget: "Four thread cones" },
      { slug: "juki-mo-1000", alsoBudget: "Four thread cones" },
      { slug: "bernina-l-850", alsoBudget: "Four thread cones, dealer setup" },
      { slug: "juki-mo-644d", alsoBudget: "Four thread cones, 2-thread converter" },
      { slug: "janome-8002d", alsoBudget: "Four thread cones" },
      { slug: "brother-1034dx", alsoBudget: "Four thread cones" },
      { slug: "brother-1034d", pick: "value-pick", alsoBudget: "Four thread cones" },
      { slug: "singer-14cg754", alsoBudget: "Four thread cones" },
    ],
    sections: [
      {
        title: "Coverstitch machines",
        intro:
          "A coverstitch machine hems knits with the twin rows of stitching you see on a bought T-shirt. It does not overlock. Most people buy one after a serger, not instead of one.",
        entries: [
          { slug: "janome-coverpro-2000cpx", alsoBudget: "Three cones, hem guide" },
          { slug: "brother-2340cv", alsoBudget: "Three cones" },
        ],
      },
    ],
    relatedGuides: ["serger-vs-sewing-machine", "what-is-a-serger", "coverstitch-vs-serger"],
    headToHeads: ["brother-1034d-vs-1034dx", "brother-1034d-vs-juki-mo-654de"],
    otherJobs: ["heavy-duty", "quilting"],
    faqs: [
      {
        q: "Do I need a serger if I have a sewing machine?",
        a: "Only if you sew knits regularly or want a shop-finished inside. A sewing machine with a zigzag or overcast stitch finishes seams; a serger does it faster and trims as it goes. If you do not own a capable sewing machine yet, buy that first.",
      },
      {
        q: "What is differential feed?",
        a: "Two sets of feed dogs moving at different speeds, so knits do not stretch into waves and slippery fabric does not pucker. Every serger on this list has it.",
      },
      {
        q: "Is air threading worth it?",
        a: "If you change thread colours often, yes. Air threading pushes the looper thread through with a button; manual threading takes a few minutes and a diagram. The MO-1000 costs about three times the MO-654DE for the same stitches.",
      },
      {
        q: "Serger or coverstitch first?",
        a: "Serger. It does seams and edges. A coverstitch does hems only, and most people who buy one already own a serger.",
      },
    ],
    lastUpdated: "2026-09-29",
  },
  {
    slug: "best-quilting-machines",
    job: "quilting",
    label: "Quilting",
    h1: "Best quilting machines",
    metaTitle: "Best Quilting Machines (2026): Domestic, Mid-Arm and Long-Arm by Throat Space",
    metaDescription:
      "Eight quilting machines from the Juki TL tier to a 20 in long-arm on a frame, ranked on throat space and stitch quality at speed. Specs checked against Juki, Janome, Handi Quilter and Grace data.",
    scope: "Domestic straight-stitch quilters · mid-arm · long-arm on a frame",
    intro: [
      "Throat space decides which tier you need. Decorative stitches do not.",
      "A domestic straight-stitch quilter handles most throws and lap quilts on a table.",
      "A long-arm on a frame is a room-sized commitment. Read the cost guide before you fall for one.",
    ],
    shortAnswer: [
      { label: "Best overall", tone: "enamel", slug: "juki-tl-2010q", sentence: "the fastest domestic quilter, if you already own a zigzag machine." },
      { label: "All-rounder", tone: "ink", slug: "janome-mc6650", sentence: "10 in of throat with a full computerized stitch set." },
      { label: "Long-arm entry", tone: "brass", slug: "handi-quilter-moxie", sentence: "15 in on a frame; budget the frame and the room." },
    ],
    ranked: [
      { slug: "juki-tl-2010q", pick: "our-pick", alsoBudget: "TL feet, solid table" },
      { slug: "janome-mc6650", alsoBudget: "Quilting feet if not bundled" },
      { slug: "juki-hzl-f600", alsoBudget: "Nothing extra" },
      { slug: "juki-tl-2000qi", pick: "value-pick", alsoBudget: "TL feet, solid table" },
      { slug: "juki-hzl-f300", alsoBudget: "Walking foot" },
    ],
    sections: [
      {
        title: "Mid-arm and long-arm on a frame",
        intro:
          "From here the machine moves and the quilt stays still. Budget the frame, delivery and a room with a clear wall before the head. Throat is needle-to-body; 15 in heads are entry long-arms, 18 in and up is the real thing.",
        entries: [
          { slug: "handi-quilter-moxie", alsoBudget: "Frame, delivery" },
          { slug: "grace-qnique-19x", alsoBudget: "Grace frame, delivery" },
          { slug: "handi-quilter-amara", alsoBudget: "Studio3 frame, delivery, Pro-Stitcher" },
        ],
      },
    ],
    relatedGuides: ["how-to-choose-a-quilting-machine", "how-much-does-a-long-arm-cost", "mechanical-vs-computerized"],
    headToHeads: ["juki-tl-2010q-vs-tl-2000qi"],
    otherJobs: ["heavy-duty", "serger"],
    faqs: [
      {
        q: "How much throat space do I need for quilting?",
        a: "About 6 in is a typical beginner machine and it is where quilters run out of room. 8.5 to 10 in handles most lap and throw quilts on a table. 16 to 18 in is mid-arm territory. 18 in and up is a long-arm on a frame.",
      },
      {
        q: "Do I need a long-arm to quilt?",
        a: "No. Most quilters finish on a domestic machine. A long-arm makes sense when you quilt whole tops often, have the room for a frame, and have already run out of throat on a table.",
      },
      {
        q: "Straight stitch only: is that a problem?",
        a: "For quilting, no. Piecing and free-motion quilting are straight stitch. You need a second machine for garments and binding by machine with a zigzag.",
      },
    ],
    lastUpdated: "2026-09-29",
  },
  {
    slug: "best-sewing-machines-for-beginners",
    job: "beginner",
    label: "First serious machine",
    h1: "Best sewing machines for beginners who plan to keep sewing",
    metaTitle: "Best Sewing Machines for Beginners (2026): First Serious Machines You Won't Outgrow",
    metaDescription:
      "Beginner sewing machines chosen so you do not replace them in a year: metal frames, real presser-foot lift, honest speed. Specs checked against Singer, Janome and Brother data.",
    scope: "First serious machine · feeds the heavy-duty, serger and quilting hubs",
    intro: [
      "Most beginner lists sell the cheapest machine. We pick the cheapest one you will not outgrow.",
      "Outgrown means: too slow, too little throat, a motor that stalls on denim, a frame that walks.",
      "Decide the job first. The three hubs above are where this page sends you next.",
    ],
    shortAnswer: [
      { label: "Best first machine", tone: "enamel", slug: "janome-hd3000", sentence: "mechanical, steady, a full stitch set." },
      { label: "Honest value", tone: "brass", slug: "singer-4452", sentence: "cheap and capable on denim; know its limits." },
      { label: "First serger", tone: "ink", slug: "brother-1034d", sentence: "when finishing seams becomes the gap." },
    ],
    ranked: [
      { slug: "janome-hd3000", pick: "our-pick", alsoBudget: "Denim needles" },
      { slug: "juki-hzl-f300", alsoBudget: "Nothing extra" },
      { slug: "singer-4452", pick: "value-pick", alsoBudget: "Denim needles" },
      { slug: "singer-hd6700c", alsoBudget: "Nothing extra" },
      { slug: "singer-4423", alsoBudget: "Denim needles" },
      { slug: "janome-hd1000", alsoBudget: "Denim needles" },
      { slug: "brother-cs7000x", alsoBudget: "Denim needles" },
      { slug: "brother-1034d", alsoBudget: "Four thread cones" },
    ],
    relatedGuides: ["mechanical-vs-computerized", "serger-vs-sewing-machine", "sewing-machine-brands-ranked"],
    headToHeads: ["singer-4423-vs-4432-vs-4452"],
    otherJobs: ["heavy-duty", "serger", "quilting"],
    faqs: [
      {
        q: "Mechanical or computerized for a first machine?",
        a: "Mechanical if you want fewer things to go wrong and a machine that is cheap to service. Computerized if you want a needle up/down button, speed control and one-touch buttonholes. Neither is more capable on thick fabric; the motor and frame decide that.",
      },
      {
        q: "How much should a first serious machine cost?",
        a: "Between about $300 and $700 buys a metal-frame mechanical machine that will not need replacing. Below that you are buying a machine you will outgrow; above it you are paying for throat space or computerized features.",
      },
    ],
    feeder: true,
    lastUpdated: "2026-09-29",
  },
];

export const hubsBySlug: Record<string, Hub> = Object.fromEntries(hubs.map((h) => [h.slug, h]));

export function getHub(slug: string): Hub | undefined {
  return hubsBySlug[slug];
}

export function hubForJob(job: Job): Hub | undefined {
  return hubs.find((h) => h.job === job);
}

export function allHubEntries(h: Hub): RankedEntry[] {
  return [...h.ranked, ...(h.sections?.flatMap((s) => s.entries) ?? [])];
}
