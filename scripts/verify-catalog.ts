#!/usr/bin/env tsx
/**
 * Deterministic catalog validator for Stitch Check.
 *
 * Network-free and fast. Exits non-zero with a specific message whenever the
 * catalog, research cache, registries, or routes drift out of sync. See
 * AGENTS.md for the rules these checks enforce.
 *
 *   npm run check:catalog            # full report
 *   npm run check:catalog -- --quiet # print only when something is wrong
 */
import fs from "node:fs";
import path from "node:path";

import { brands, brandSlugFor, seriesHubs } from "../src/lib/brands";
import ogManifest from "../src/lib/og-manifest.json";
import { comparisons } from "../src/lib/comparisons";
import { guides } from "../src/lib/guides";
import { hubs, allHubEntries } from "../src/lib/hubs";
import { bandForPrice } from "../src/lib/price-bands";
import { MACHINE_TYPES, SPEC_KEYS, products, getProduct } from "../src/lib/products";
import { nav } from "../src/lib/site";

const ROOT = path.resolve(__dirname, "..");
const QUIET = process.argv.includes("--quiet");

type Finding = { rule: string; subject: string; message: string };
const errors: Finding[] = [];
const warnings: Finding[] = [];
const fail = (rule: string, subject: string, message: string) => errors.push({ rule, subject, message });
const warn = (rule: string, subject: string, message: string) => warnings.push({ rule, subject, message });

const exists = (p: string) => fs.existsSync(p);
const read = (p: string) => fs.readFileSync(p, "utf8");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
function isRealPastIsoDate(s: string): boolean {
  if (!ISO_DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  if (d.toISOString().slice(0, 10) !== s) return false;
  return d.getTime() <= Date.now() + 24 * 3600 * 1000;
}

// Em dashes are banned outright. En dashes are allowed only as numeric-range glue ("500–1k", "16–18 in").
const EM_DASH = /\u2014|\s\u2013\s|\u2013(?![0-9$])/;
const HANDS_ON = /\b(we tested|in our hands|we found it|we ran it|we sewed|in our testing|our test)\b/i;

function checkCopy(rule: string, subject: string, text: string | undefined | null) {
  if (!text) return;
  if (EM_DASH.test(text)) fail(rule, subject, `em or en dash in published copy: "${text.slice(0, 60)}"`);
  if (HANDS_ON.test(text)) fail(rule, subject, `hands-on claim in copy: "${text.slice(0, 60)}"`);
}

// ---------------------------------------------------------------- products
const slugs = new Set<string>();
for (const p of products) {
  const subject = `products:${p.slug}`;
  if (slugs.has(p.slug)) fail("unique-slug", subject, "duplicate slug");
  slugs.add(p.slug);

  // Provenance: research cache and briefing must exist.
  const json = path.join(ROOT, "data", "specs", `${p.slug}.json`);
  const md = path.join(ROOT, "docs", "research", `${p.slug}.md`);
  if (!exists(json)) fail("research-cache", subject, `missing data/specs/${p.slug}.json`);
  if (!exists(md)) fail("briefing", subject, `missing docs/research/${p.slug}.md`);

  // Every non-null spec carries a source.
  for (const k of SPEC_KEYS) {
    const sv = p.specs[k];
    if (sv.value !== null && sv.value !== undefined && !sv.source) fail("spec-source", subject, `${k} has a value but no source URL`);
    if (typeof sv.value === "string") checkCopy("copy", `${subject}.specs.${k}`, sv.value);
  }
  // Numeric sanity.
  const spm = p.specs.maxSpm.value;
  if (spm !== null && (spm < 300 || spm > 6000)) fail("spec-range", subject, `maxSpm ${spm} out of range`);
  const throat = p.specs.throatIn.value;
  if (throat !== null && (throat < 4 || throat > 40)) fail("spec-range", subject, `throatIn ${throat} out of range`);
  const weight = p.specs.weightLb.value;
  if (weight !== null && (weight < 5 || weight > 200)) fail("spec-range", subject, `weightLb ${weight} out of range`);

  // Score and band.
  if (p.score < 0 || p.score > 10) fail("score", subject, `score ${p.score} out of range`);
  if (Math.round(p.score * 10) !== p.score * 10) fail("score", subject, "score must have one decimal");
  if (p.priceUsdSeen && bandForPrice(p.priceUsdSeen) !== p.priceBand) {
    warn("price-band", subject, `seen price $${p.priceUsdSeen} maps to band ${bandForPrice(p.priceUsdSeen)}, catalog says ${p.priceBand}`);
  }
  if (p.priceSeenDate && !isRealPastIsoDate(p.priceSeenDate)) fail("date", subject, `priceSeenDate ${p.priceSeenDate} is not a real past ISO date`);
  if (!isRealPastIsoDate(p.lastUpdated)) fail("date", subject, `lastUpdated ${p.lastUpdated} is not a real past ISO date`);
  if (p.specsVerified && !isRealPastIsoDate(p.specsVerified)) fail("date", subject, `specsVerified ${p.specsVerified} is not a real past ISO date`);
  if (!MACHINE_TYPES.includes(p.type)) fail("type", subject, `unknown machine type ${p.type}`);
  if (!p.jobs.includes(p.scoredFor)) fail("jobs", subject, `scoredFor ${p.scoredFor} is not in jobs`);

  // Editorial completeness.
  if (!p.verdict) fail("editorial", subject, "missing verdict");
  if (!p.whoFor) fail("editorial", subject, "missing whoFor");
  if (!p.skipIf) fail("editorial", subject, "missing skipIf");
  if (!p.keySpec) fail("editorial", subject, "missing keySpec");
  if (p.strengths.length < 3) warn("editorial", subject, `only ${p.strengths.length} strengths`);
  if (p.weaknesses.length < 3) warn("editorial", subject, `only ${p.weaknesses.length} weaknesses`);
  if (p.checks.length < 3) warn("editorial", subject, `only ${p.checks.length} checks`);
  if (p.realCost.length < 1) warn("editorial", subject, "empty realCost");
  if (p.alternatives.length < 1) fail("alternatives", subject, "no alternatives");
  for (const a of p.alternatives) {
    if (!getProduct(a.slug)) fail("alternatives", subject, `alternative ${a.slug} is not in the catalog`);
    if (a.slug === p.slug) fail("alternatives", subject, "alternative points at itself");
  }
  [p.verdict, p.whoFor, p.skipIf, p.keySpec, p.reason, p.context, ...p.strengths, ...p.weaknesses, ...p.realCost, ...p.checks.flatMap((c) => [c.title, c.body]), ...p.faqs.flatMap((f) => [f.q, f.a])].forEach((t) =>
    checkCopy("copy", subject, t),
  );

  // Money.
  if (p.buy.kind === "retailer" && !/sewingmachinesplus\.com/i.test(p.buy.url)) fail("affiliate", subject, `retailer buy URL is not Sewing Machines Plus: ${p.buy.url}`);
  if (p.buy.kind === "dealer" && !/^https?:\/\//.test(p.buy.url)) fail("affiliate", subject, "dealer URL malformed");
  if ((p.brand === "Baby Lock" || p.brand === "Bernina") && p.buy.kind === "retailer") warn("affiliate", subject, "dealer-only brand has a retailer buy route; confirm the retailer lists it for sale online");

  // Brand and series.
  const bslug = brandSlugFor(p.brand);
  if (!bslug) fail("brand", subject, `brand ${p.brand} has no entry in brands.ts`);
  if (p.discontinued && p.replacedBy && !getProduct(p.replacedBy)) warn("discontinued", subject, `replacedBy ${p.replacedBy} not in catalog`);
}

// -------------------------------------------------------------------- hubs
for (const h of hubs) {
  const subject = `hubs:${h.slug}`;
  const entries = allHubEntries(h);
  const seen = new Set<string>();
  let valuePicks = 0;
  let ourPicks = 0;
  for (const e of entries) {
    if (seen.has(e.slug)) fail("hub-dup", subject, `${e.slug} listed twice`);
    seen.add(e.slug);
    const p = getProduct(e.slug);
    if (!p) {
      fail("hub-slug", subject, `${e.slug} is not in the catalog`);
      continue;
    }
    if (!p.jobs.includes(h.job)) fail("hub-job", subject, `${e.slug} does not carry job ${h.job}`);
    if (e.pick === "value-pick") valuePicks += 1;
    if (e.pick === "our-pick") ourPicks += 1;
  }
  if (valuePicks > 1) fail("one-value-pick", subject, `${valuePicks} value picks; the design allows one per page`);
  if (ourPicks > 1) fail("one-our-pick", subject, `${ourPicks} our picks`);
  if (h.ranked.length < 4 && !h.feeder) warn("hub-size", subject, `only ${h.ranked.length} ranked machines; the spec calls for 5 to 8`);
  if (h.ranked.length > 8) fail("hub-size", subject, `${h.ranked.length} ranked machines; max 8`);
  for (const s of h.shortAnswer) {
    if (!getProduct(s.slug)) fail("hub-short", subject, `short answer slug ${s.slug} missing`);
    if (!seen.has(s.slug)) fail("hub-short", subject, `short answer ${s.slug} is not on the shortlist`);
  }
  for (const g of h.relatedGuides) if (!guides.find((x) => x.slug === g)) fail("hub-guides", subject, `guide ${g} missing`);
  for (const c of h.headToHeads) if (!comparisons.find((x) => x.slug === c)) fail("hub-compares", subject, `compare ${c} missing`);
  if (!exists(path.join(ROOT, "src", "app", h.slug, "page.tsx"))) fail("routes", subject, "no route file");
  if (!h.feeder && !nav.primary.find((n) => n.href === `/${h.slug}`)) fail("nav", subject, "primary hub is not in nav.primary");
  if (h.feeder && nav.primary.find((n) => n.href === `/${h.slug}`)) fail("nav", subject, "feeder hub must stay out of primary nav");
  [h.h1, h.metaTitle, h.metaDescription, h.scope, ...h.intro, ...h.shortAnswer.map((s) => s.sentence), ...h.faqs.flatMap((f) => [f.q, f.a])].forEach((t) => checkCopy("copy", subject, t));
}

// ------------------------------------------------------------- comparisons
for (const c of comparisons) {
  const subject = `compare:${c.slug}`;
  if (c.productSlugs.length !== 2 && c.productSlugs.length !== 3) fail("compare-size", subject, "exactly two products (three only for the Singer family)");
  if (c.productSlugs.length === 3 && !c.slug.startsWith("singer-")) fail("compare-size", subject, "three-way compares are the Singer Heavy Duty exception only");
  for (const s of c.productSlugs) if (!getProduct(s)) fail("compare-slug", subject, `${s} not in catalog`);
  if (!guides.find((g) => g.slug === c.relatedGuide)) fail("compare-guide", subject, `related guide ${c.relatedGuide} missing`);
  const buyIfSlugs = new Set(c.buyIf.map((b) => b.slug));
  for (const s of c.productSlugs) if (!buyIfSlugs.has(s)) fail("compare-buyif", subject, `no buyIf for ${s}`);
  for (const r of c.rows) {
    if (r.cells) for (const s of c.productSlugs) if (!(s in r.cells)) fail("compare-cells", subject, `row "${r.label}" missing cell for ${s}`);
    if (r.winners) for (const w of r.winners) if (!c.productSlugs.includes(w)) fail("compare-winners", subject, `winner ${w} not in this compare`);
  }
  if (!isRealPastIsoDate(c.lastUpdated)) fail("date", subject, "bad lastUpdated");
  [c.title, c.description, c.summary, ...c.buyIf.map((b) => b.text)].forEach((t) => checkCopy("copy", subject, t));
}

// ------------------------------------------------------------------ guides
for (const g of guides) {
  const subject = `guide:${g.slug}`;
  const h2s = g.blocks.filter((b) => b.type === "h2");
  if (h2s.length < 3) warn("guide-toc", subject, `only ${h2s.length} H2 sections`);
  const ids = h2s.map((b) => (b as { id: string }).id);
  if (new Set(ids).size !== ids.length) fail("guide-toc", subject, "duplicate H2 ids");
  if (g.ctaSlugs.length < 2 || g.ctaSlugs.length > 3) fail("guide-cta", subject, `${g.ctaSlugs.length} CTAs; guides end with 2 or 3`);
  for (const s of g.ctaSlugs) if (!getProduct(s)) fail("guide-cta", subject, `${s} not in catalog`);
  if (!isRealPastIsoDate(g.updated) || !isRealPastIsoDate(g.published)) fail("date", subject, "bad dates");
  if (g.updated < g.published) fail("date", subject, "updated before published");
  for (const b of g.blocks) {
    if (b.type === "p") checkCopy("copy", subject, b.html.replace(/<[^>]+>/g, ""));
    if (b.type === "definition") checkCopy("copy", subject, `${b.term} ${b.body}`);
    if (b.type === "short") checkCopy("copy", subject, b.text);
    if (b.type === "ul") b.items.forEach((i) => checkCopy("copy", subject, i));
  }
  [g.h1, g.standfirst, g.metaTitle, g.description, ...g.faqs.flatMap((f) => [f.q, f.a])].forEach((t) => checkCopy("copy", subject, t));
  if (g.status === "draft") warn("guide-draft", subject, "draft guide: noindex, out of the sitemap until copy is sourced");
}

// ------------------------------------------------------------------ brands
for (const b of brands) {
  const subject = `brand:${b.slug}`;
  for (const s of b.series) {
    if (s.hasHub) {
      const models = products.filter((p) => p.brand === b.name && (p.series?.toLowerCase() === s.code.toLowerCase() || p.series?.toLowerCase() === s.slug));
      if (models.length < 2) warn("series-hub", subject, `${s.code} series hub has ${models.length} model(s); hubs exist only where a brand has real series`);
    }
  }
  checkCopy("copy", subject, b.intro);
  checkCopy("copy", subject, b.metaDescription);
}
for (const p of products) {
  const b = brands.find((x) => x.name === p.brand);
  if (b && p.series && !b.series.find((s) => s.code.toLowerCase() === p.series!.toLowerCase() || s.slug === p.series!.toLowerCase())) {
    warn("series", `products:${p.slug}`, `series "${p.series}" has no decoder entry in brands.ts for ${p.brand}`);
  }
}
if (seriesHubs().length === 0) warn("series-hub", "brands", "no series hubs registered");

// Open Graph cards: every registry page should have a rendered card (npm run build:og).
{
  const og = ogManifest as Record<string, string>;
  const want = [
    ...products.map((p) => `/reviews/${p.slug}`),
    ...hubs.map((h) => `/${h.slug}`),
    ...guides.map((g) => `/guides/${g.slug}`),
    ...comparisons.map((c) => `/compare/${c.slug}`),
    ...brands.map((b) => `/brands/${b.slug}`),
  ];
  for (const w of want) {
    if (!og[w]) warn("og-card", w, "no Open Graph card in og-manifest.json; run npm run build:og");
    else if (!fs.existsSync(path.join(ROOT, "public", og[w]))) fail("og-card", w, `manifest points at ${og[w]} but the file is missing`);
  }
}

// ------------------------------------------------------------------ routes
const mustExist = [
  "src/app/page.tsx",
  "src/app/reviews/page.tsx",
  "src/app/reviews/[slug]/page.tsx",
  "src/app/compare/page.tsx",
  "src/app/compare/[slug]/page.tsx",
  "src/app/guides/page.tsx",
  "src/app/guides/[slug]/page.tsx",
  "src/app/brands/page.tsx",
  "src/app/brands/[brand]/page.tsx",
  "src/app/brands/[brand]/[series]/page.tsx",
  "src/app/about/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/not-found.tsx",
  "src/app/out/[slug]/route.ts",
  "src/app/sitemap.ts",
  "src/app/robots.ts",
  "src/app/llms.txt/route.ts",
  "src/app/llms-full.txt/route.ts",
];
for (const r of mustExist) if (!exists(path.join(ROOT, r))) fail("routes", r, "missing route file");

// /out/ must never enter the sitemap; check the source for the guard comment and no "/out" entry.
const sitemapSrc = read(path.join(ROOT, "src", "app", "sitemap.ts"));
if (/entry\(\s*[`"']\/out/.test(sitemapSrc)) fail("sitemap", "sitemap.ts", "/out/ must never enter the sitemap");
if (/new Date\(\)/.test(sitemapSrc)) fail("sitemap", "sitemap.ts", "never stamp lastmod as now");

// Buy buttons: every anchor with data-affiliate must render the word affiliate. Static check on the component.
const buySrc = read(path.join(ROOT, "src", "components", "ui", "BuyButton.tsx"));
if (!/Affiliate/.test(buySrc)) fail("affiliate-label", "BuyButton.tsx", "buy button must carry the word affiliate");
if (!/sponsored nofollow noopener/.test(read(path.join(ROOT, "src", "lib", "affiliates.ts")))) fail("affiliate-rel", "affiliates.ts", "retailer links need rel=sponsored nofollow noopener");

// ------------------------------------------------------------------ report
if (!QUIET || errors.length || warnings.length) {
  for (const w of warnings) console.log(`warn  [${w.rule}] ${w.subject}: ${w.message}`);
  for (const e of errors) console.log(`ERROR [${e.rule}] ${e.subject}: ${e.message}`);
  console.log(`\n${products.length} products · ${hubs.length} hubs · ${comparisons.length} compares · ${guides.length} guides · ${brands.length} brands`);
  console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
}
process.exit(errors.length ? 1 : 0);
