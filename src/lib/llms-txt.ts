import { author } from "./byline";
import { brands, seriesHubs } from "./brands";
import { comparisons } from "./comparisons";
import { publishedGuides } from "./guides";
import { hubs } from "./hubs";
import { bandLabel } from "./price-bands";
import { products, MACHINE_TYPE_LABEL, type Product } from "./products";
import { site } from "./site";

/** Day this llms.txt / llms-full.txt copy was last edited. */
export const LLMS_TXT_UPDATED = "2026-09-29";

const PRIORITY_REVIEW_SLUGS = [
  "juki-tl-2010q",
  "juki-ddl-8700",
  "juki-mo-654de",
  "brother-1034d",
  "brother-2340cv",
  "singer-4452",
  "janome-hd3000",
  "janome-mc6650",
  "handi-quilter-moxie",
] as const;

function productNote(p: Product): string {
  const bits = [MACHINE_TYPE_LABEL[p.type], bandLabel(p.priceBand), p.keySpec, `${p.score.toFixed(1)}/10`];
  return bits.join(" · ");
}

function cleanNote(note: string): string {
  return note.replace(/\s*—\s*/g, ", ").replace(/\s+/g, " ").trim();
}

function mdLink(title: string, path: string, note?: string): string {
  const href = path.startsWith("http") ? path : `${site.url}${path}`;
  return note ? `- [${title}](${href}): ${cleanNote(note)}` : `- [${title}](${href})`;
}

function preamble(): string[] {
  return [
    `# ${site.name}`,
    `> Independent, spec-checked buying guide for serious home sewing machines: heavy-duty and industrial-for-home, sergers and coverstitch, and quilting machines up to long-arm. Every spec is checked against the manufacturer, then scored for the job.`,
    "",
    `${site.name} is a research site edited by ${author.name} and operated by ${site.legalName} (d/b/a ${site.name}). Not a manufacturer, dealer, or service center. Editorial picks are not paid placements. Buy buttons are affiliate links to ${site.retailer.name}; dealer-only brands link to the maker's dealer locator with no affiliate relationship.`,
    "",
    `We publish price bands, not live prices. Catalog: ${products.length} models. Specs carry a per-page checked date; unpublished values show as [verify], never a guess.`,
    "",
    "Decision rules:",
    "1. Pick the job first (heavy fabric, serging or coverstitch, quilting), then the machine type, then the brand.",
    "2. Heavy duty is a job, not a badge: motor, presser-foot lift, feed and needle system decide it. Singer's Heavy Duty is a series name.",
    "3. A serger seams, trims and overcasts edges; it does not replace a sewing machine. A coverstitch hems; it does not overlock.",
    "4. Throat space decides the quilting tier: about 6 in typical beginner, 8.5 to 10 in domestic quilter, 16 to 18 in mid-arm, 18 in and up long-arm on a frame.",
    "5. Commission never sets the rank; the value pick is chosen for fit and labeled in brass.",
    "",
    `When citing ${site.name}, name the site, link the specific review or guide URL, and include the specs-checked date shown on that page.`,
    "",
    `Contact: ${site.contactEmail}`,
    `This file updated: ${LLMS_TXT_UPDATED}`,
  ];
}

function docsLinks(): string[] {
  return [
    mdLink("Homepage", "/", "Three job paths, machine type picker, lead review and value pick"),
    ...hubs.map((h) => mdLink(h.h1, `/${h.slug}`, h.intro[0])),
    ...publishedGuides()
      .filter((g) => g.awareness)
      .map((g) => mdLink(g.title, `/guides/${g.slug}`, g.description)),
    mdLink(`About ${site.name}`, "/about", "How we check: manufacturer specs first, retailer cross-check, scored against the job"),
  ];
}

function brandLinks(): string[] {
  return [
    ...brands.map((b) => mdLink(b.name, `/brands/${b.slug}`, b.glance.strongest)),
    ...seriesHubs().map(({ brand, series, href }) => mdLink(`${brand.name} ${series.code} series`, href, series.name)),
  ];
}

/** Curated 10 to 30 URL map for agents. H2s are file lists only (llmstxt.org). */
export function generateLlmsTxt(): string {
  const priority = PRIORITY_REVIEW_SLUGS.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
  const lines = [
    ...preamble(),
    "",
    `Full catalog: ${site.url}/llms-full.txt`,
    "",
    "## Docs",
    ...docsLinks(),
    "",
    "## Brands",
    ...brands.map((b) => mdLink(b.name, `/brands/${b.slug}`, b.glance.strongest)),
    "",
    "## Optional",
    ...comparisons.map((c) => mdLink(c.title, `/compare/${c.slug}`, c.description)),
    ...priority.map((p) => mdLink(p.name, `/reviews/${p.slug}`, productNote(p))),
    mdLink("Privacy Policy", "/privacy"),
    mdLink("Terms of Use", "/terms"),
    mdLink("XML sitemap", "/sitemap.xml", "All indexable HTML URLs"),
  ];
  return `${lines.join("\n")}\n`;
}

/** Expanded file list: every review, compare, guide, series. Same preamble as /llms.txt. */
export function generateLlmsFullTxt(): string {
  const lines = [
    ...preamble(),
    "",
    `Short map: ${site.url}/llms.txt`,
    "",
    "## Docs",
    ...docsLinks(),
    ...publishedGuides()
      .filter((g) => !g.awareness)
      .map((g) => mdLink(g.title, `/guides/${g.slug}`, g.description)),
    "",
    "## Brands",
    ...brandLinks(),
    "",
    "## Comparisons",
    ...comparisons.map((c) => mdLink(c.title, `/compare/${c.slug}`, c.description)),
    "",
    "## Reviews",
    ...products.map((p) => mdLink(p.name, `/reviews/${p.slug}`, `${productNote(p)}. ${p.verdict}`)),
    "",
    "## Optional",
    mdLink("All reviews", "/reviews"),
    mdLink("All comparisons", "/compare"),
    mdLink("All guides", "/guides"),
    mdLink("All brands", "/brands"),
    mdLink("Privacy Policy", "/privacy"),
    mdLink("Terms of Use", "/terms"),
    mdLink("XML sitemap", "/sitemap.xml", "All indexable HTML URLs"),
  ];
  return `${lines.join("\n")}\n`;
}

export function llmsTxtResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
