#!/usr/bin/env tsx
/**
 * Render Open Graph cards (1200x630) for every registry page into public/og/
 * plus public/og-default.png, and write src/lib/og-manifest.json so
 * seo-meta can map a path to its card without touching the filesystem at
 * request time. Commit the output: the deploy runner has no browser.
 *
 *   npm run build:og
 *   PW_CHROMIUM=/path/to/chrome npm run build:og   (when playwright's own build is missing)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { products, MACHINE_TYPE_LABEL } from "../src/lib/products";
import { hubs } from "../src/lib/hubs";
import { guides } from "../src/lib/guides";
import { comparisons } from "../src/lib/comparisons";
import { brands, seriesHubs } from "../src/lib/brands";
import { bandLabel } from "../src/lib/price-bands";
import { monthYear, site } from "../src/lib/site";
import imagesManifest from "../src/lib/images-manifest.json";

const IMAGES: Record<string, { src: string }> = imagesManifest;

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "og");
const FONTS = path.join(ROOT, "src", "fonts");
fs.mkdirSync(OUT, { recursive: true });

type Card = {
  key: string; // file name without extension
  path: string; // site path the card belongs to
  eyebrow: string;
  title: string;
  sub?: string;
  badge?: string; // e.g. "8.6 /10"
  badgeTone?: "enamel" | "brass";
  meta?: string;
  photo?: string; // absolute file path of a product photo
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fontUrl = (f: string) => `file://${path.join(FONTS, f)}`;

function html(c: Card): string {
  const titleSize = c.title.length > 44 ? 64 : c.title.length > 30 ? 76 : 88;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;src:url(${fontUrl("archivo-variable-latin.woff2")}) format("woff2");font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:PlexMono;src:url(${fontUrl("plex-mono-500-latin.woff2")}) format("woff2");font-weight:500}
@font-face{font-family:PlexMono;src:url(${fontUrl("plex-mono-600-latin.woff2")}) format("woff2");font-weight:600}
@font-face{font-family:PlexSans;src:url(${fontUrl("plex-sans-variable-latin.woff2")}) format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;background:#F2F0EA;color:#16181A;font-family:PlexSans,system-ui,sans-serif;overflow:hidden}
.top{height:44px;background:#16181A;color:#F2F0EA;display:flex;align-items:center;justify-content:space-between;padding:0 56px;font-family:PlexMono,monospace;font-size:15px;letter-spacing:.08em;text-transform:uppercase}
.body{padding:44px 56px 0;display:flex;flex-direction:column;height:586px}
.eyebrow{font-family:PlexMono,monospace;font-weight:600;font-size:18px;letter-spacing:.1em;text-transform:uppercase;color:#5E6368}
.title{font-family:Archivo,sans-serif;font-weight:800;font-stretch:115%;letter-spacing:-.01em;line-height:.98;margin-top:18px;font-size:${c.photo ? Math.min(titleSize, 64) : titleSize}px;max-width:${c.photo ? (c.badge ? 440 : 620) : 1000}px}
.sub{font-family:PlexMono,monospace;font-weight:500;font-size:22px;color:#16181A;margin-top:26px;max-width:${c.photo ? 620 : 960}px;line-height:1.4}
.seam{margin-top:auto;height:0;border-top:2px dashed #16181A;opacity:.9}
.foot{display:flex;align-items:center;justify-content:space-between;padding:22px 0 30px}
.mark{display:flex;align-items:center;gap:14px}
.word{font-family:Archivo,sans-serif;font-weight:800;font-stretch:125%;letter-spacing:.02em;font-size:26px}
.meta{font-family:PlexMono,monospace;font-size:16px;color:#5E6368;letter-spacing:.04em}
.photo{position:absolute;right:56px;top:84px;width:420px;height:315px;background:#fff;border:2px solid #16181A;display:flex;align-items:center;justify-content:center;overflow:hidden}
.photo img{width:100%;height:100%;object-fit:contain}
.badge{position:absolute;right:${c.photo ? "496px" : "56px"};top:96px;width:168px;height:168px;border:2px solid #16181A;background:#FBFAF7;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:PlexMono,monospace}
.badge b{font-family:Archivo,sans-serif;font-weight:800;font-stretch:115%;font-size:64px;line-height:1;color:${c.badgeTone === "brass" ? "#C98A2B" : "#1F4A3A"}}
.badge span{font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:#5E6368;margin-top:8px}
</style></head><body>
<div class="top"><span>${esc(site.topBar.left)}</span><span>stitchcheck.com</span></div>
<div class="body">
  <div class="eyebrow">${esc(c.eyebrow)}</div>
  <div class="title">${esc(c.title)}</div>
  ${c.sub ? `<div class="sub">${esc(c.sub)}</div>` : ""}
  <div class="seam"></div>
  <div class="foot">
    <div class="mark">
      <svg width="34" height="34" viewBox="0 0 30 30" fill="none"><rect x="1" y="1" width="28" height="28" rx="3" stroke="#16181A" stroke-width="2"/><path d="M7 15.5l5.5 5.5L23 9.5" stroke="#1F4A3A" stroke-width="3" stroke-dasharray="4 2.5"/></svg>
      <span class="word">STITCH CHECK</span>
    </div>
    <div class="meta">${esc(c.meta ?? "Spec-checked, not field-tested")}</div>
  </div>
</div>
${c.photo ? `<div class="photo"><img src="file://${c.photo}"></div>` : ""}
${c.badge ? `<div class="badge"><b>${esc(c.badge)}</b><span>our score</span></div>` : ""}
</body></html>`;
}

function cards(): Card[] {
  const list: Card[] = [];
  list.push({
    key: "og-default",
    path: "/",
    eyebrow: "Independent buying guide",
    title: "Spec-checked buying guides for serious home sewing machines",
    sub: "Heavy duty and industrial-for-home · sergers and coverstitch · quilting up to long-arm",
    meta: `Specs checked ${monthYear(site.lastUpdated)}`,
  });
  for (const p of products) {
    const kind = p.industrial ? "Industrial" : MACHINE_TYPE_LABEL[p.type];
    list.push({
      key: `reviews_${p.slug}`,
      path: `/reviews/${p.slug}`,
      eyebrow: `${kind} · ${bandLabel(p.priceBand)} · review`,
      title: p.name,
      sub: p.keySpec,
      badge: p.score.toFixed(1),
      badgeTone: "enamel",
      meta: `Specs checked ${monthYear(p.lastUpdated)}`,
      photo: IMAGES[p.slug] ? path.join(ROOT, "public", IMAGES[p.slug].src) : undefined,
    });
  }
  for (const h of hubs) {
    list.push({ key: h.slug, path: `/${h.slug}`, eyebrow: "Ranked for the job", title: h.h1, sub: h.scope.replace(/\s·\s/g, " · "), meta: `Updated ${monthYear(h.lastUpdated)}` });
  }
  for (const g of guides) {
    list.push({ key: `guides_${g.slug}`, path: `/guides/${g.slug}`, eyebrow: "Guide", title: g.h1, sub: g.standfirst.length > 150 ? undefined : g.standfirst, meta: `Updated ${monthYear(g.updated)}` });
  }
  for (const c of comparisons) {
    list.push({ key: `compare_${c.slug}`, path: `/compare/${c.slug}`, eyebrow: c.productSlugs.length === 3 ? "Three-way compare" : "Head-to-head", title: c.title, sub: c.summary.length > 170 ? undefined : c.summary, meta: `Updated ${monthYear(c.lastUpdated)}` });
  }
  for (const b of brands) {
    list.push({ key: `brands_${b.slug}`, path: `/brands/${b.slug}`, eyebrow: "Brand decoder", title: `${b.name} sewing machines, decoded`, sub: `Strongest at ${b.glance.strongest.toLowerCase()}`, meta: b.dealerOnly ? "Dealer-only brand, no affiliate link" : `Updated ${monthYear(b.dateModified)}` });
  }
  for (const { brand, series } of seriesHubs()) {
    list.push({ key: `brands_${brand.slug}_${series.slug}`, path: `/brands/${brand.slug}/${series.slug}`, eyebrow: `${brand.name} series`, title: `${brand.name} ${series.code}: ${series.name}`, sub: `${series.builtFor} · ${series.band}`, meta: `Updated ${monthYear(series.dateModified)}` });
  }
  return list;
}

async function main() {
  const all = cards();
  const only = process.argv.slice(2);
  const todo = only.length ? all.filter((c) => only.includes(c.key) || only.includes(c.path)) : all;
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const c of todo) {
    await page.setContent(html(c), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const file = c.key === "og-default" ? path.join(ROOT, "public", "og-default.png") : path.join(OUT, `${c.key}.png`);
    await page.screenshot({ path: file, type: "png" });
  }
  await browser.close();
  const manifest: Record<string, string> = {};
  for (const c of all) if (c.key !== "og-default") manifest[c.path] = `/og/${c.key}.png`;
  fs.writeFileSync(path.join(ROOT, "src", "lib", "og-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Rendered ${todo.length} card(s); manifest has ${Object.keys(manifest).length} paths.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
