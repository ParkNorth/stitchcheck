const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://stitchcheck.com";

export const site = {
  name: "Stitch Check",
  /** Legal owner / operator of the site (brand is a d/b/a). */
  legalName: "North Park",
  domain: "stitchcheck.com",
  url: siteUrl,
  tagline: "Spec-checked buying guides for serious home sewing machines",
  description:
    "Independent buying guide for heavy-duty, serger, coverstitch and quilting machines from $300 to $3,000. Every spec is checked against the manufacturer, then scored for the job.",
  retailer: {
    name: "Sewing Machines Plus",
    shortName: "SMP",
    url: "https://www.sewingmachinesplus.com/",
  },
  disclosure:
    "Stitch Check is reader-supported. Buy buttons link to Sewing Machines Plus through an affiliate network. If you buy, we earn a commission at no cost to you. Every buy button says affiliate. Editorial decisions are our own: commission never sets the rank, and we recommend the fit for the job even when it earns nothing.",
  topBar: {
    left: "Independent buying guide · every spec checked against the manufacturer",
    right: "We earn a commission when you buy through our links",
  },
  footerBlurb:
    "Independent buying guide for heavy-duty, serger and quilting machines. Buy links go to Sewing Machines Plus, which pays us a commission.",
  footerNote: "Specs change. Check the manufacturer before you buy.",
  contactEmail: "hello@stitchcheck.com",
  correctionsEmail: "corrections@stitchcheck.com",
  governingState: "Delaware",
  /** Bump only when the whole catalog was re-verified. */
  lastUpdated: "2026-09-29",
} as const;

export const nav = {
  primary: [
    { label: "Heavy duty", href: "/best-heavy-duty-sewing-machines" },
    { label: "Sergers", href: "/best-sergers" },
    { label: "Quilting", href: "/best-quilting-machines" },
    { label: "Brands", href: "/brands" },
    { label: "Compare", href: "/compare" },
    { label: "Guides", href: "/guides" },
  ],
  footer: {
    jobs: [
      { label: "Heavy duty", href: "/best-heavy-duty-sewing-machines" },
      { label: "Sergers", href: "/best-sergers" },
      { label: "Quilting", href: "/best-quilting-machines" },
      { label: "First serious machine", href: "/best-sewing-machines-for-beginners" },
    ],
    brands: [
      { label: "Juki", href: "/brands/juki" },
      { label: "Janome", href: "/brands/janome" },
      { label: "Brother", href: "/brands/brother" },
      { label: "All brands", href: "/brands" },
    ],
    guides: [
      { label: "Serger vs sewing machine", href: "/guides/serger-vs-sewing-machine" },
      { label: "Thick fabric", href: "/guides/sewing-machine-for-thick-fabric" },
      { label: "Long-arm cost", href: "/guides/how-much-does-a-long-arm-cost" },
      { label: "All guides", href: "/guides" },
    ],
    site: [
      { label: "About · how we check", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
} as const;

/** Month Year for "Specs checked" stamps. */
export function monthYear(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function longDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
