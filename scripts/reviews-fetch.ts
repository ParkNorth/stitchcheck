#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows are loose JSON */
/**
 * Fetch on-page customer reviews from retailer product pages into the ledger.
 *
 *   npm run reviews:fetch -- --slug juki-tl-2010q --url https://sewingmachinesplus.com/products/juki-2010q-machine
 *   npm run reviews:fetch -- --slug juki-tl-2010q --url https://jukijunkies.com/juki-tl-2010q-high-speed-sewing-and-quilting-machine/
 *
 * Adapters are detected from the page HTML, plain HTTP, no browser or Firecrawl:
 *   judgeme      Shopify stores with the Judge.me widget (paged via api.judge.me)
 *   bigcommerce  Stencil themes (productReviews-list, paged via ?revpage=N)
 * Unknown platforms exit non-zero: fall back to Firecrawl/browser per the skill.
 *
 * Re-running replaces that source's items (idempotent) and refreshes the page's own
 * aggregate (site_rating, site_review_count). Metadata goes to items.jsonl; review text
 * goes to raw.jsonl (gitignored). `npm run reviews:export` merges both into reviews.jsonl.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const a = process.argv.slice(2);
const val = (n: string) => a[a.indexOf(n) + 1];
const slug = val("--slug");
const pageUrl = val("--url");
if (!slug || !pageUrl) throw new Error("need --slug and --url");
const DIR = path.resolve(__dirname, "..", "data", "reviews", slug);
const UA = "Mozilla/5.0 (compatible; stitchcheck-reviews/0.1)";

type Review = { reviewer: string; title: string; body: string; rating: number | null; date: string | null; verified: boolean | null };
type Result = { reviews: Review[]; rating: number | null; count: number | null };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const get = async (u: string) => {
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  return r.text();
};
const unesc = (s: string) =>
  s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

function parseJudgeme(html: string): Review[] {
  const out: Review[] = [];
  for (const block of html.split("<div class='jdgm-rev jdgm-divider-top'").slice(1)) {
    const g = (re: RegExp) => block.match(re)?.[1] ?? "";
    out.push({
      reviewer: unesc(g(/class='jdgm-rev__author'>([^<]*)</)),
      title: unesc(g(/class='jdgm-rev__title'>([^<]*)</)),
      body: unesc(g(/class='jdgm-rev__body'>([\s\S]*?)<\/div>\s*<div class='jdgm-rev__pics'/)),
      rating: Number(g(/data-score='(\d)'/)) || null,
      date: g(/datetime='([^']+)'/).slice(0, 10) || null,
      verified: /data-verified-buyer='true'/.test(block),
    });
  }
  return out;
}

async function judgeme(html: string): Promise<Result> {
  const shop = html.match(/shopDomain\\?":\\?"([^"\\]+)/)?.[1];
  const pid = html.match(/data-product-id="(\d+)"/)?.[1];
  // Scope to the main widget: related-product cards on the page carry their own counts.
  const widget = html.match(/class='jdgm-rev-widg'[^>]*>/)?.[0] ?? "";
  const count = Number(widget.match(/data-number-of-reviews='(\d+)'/)?.[1] ?? 0);
  const rating = Number(widget.match(/data-average-rating='([\d.]+)'/)?.[1] ?? 0) || null;
  if (!shop || !pid) throw new Error("judgeme: shop domain or product id not found");
  const reviews: Review[] = [];
  for (let page = 1; reviews.length < count && page <= 100; page++) {
    const r = await get(`https://api.judge.me/reviews/reviews_for_widget?url=${shop}&shop_domain=${shop}&platform=shopify&product_id=${pid}&per_page=10&page=${page}`);
    const batch = parseJudgeme(JSON.parse(r).html);
    if (!batch.length) break;
    reviews.push(...batch);
    await sleep(400);
  }
  return { reviews, rating, count };
}

async function bigcommerce(html: string, url: string): Promise<Result> {
  const parse = (h: string): Review[] =>
    h.split('<li class="productReview">').slice(1).map((b) => {
      const who = unesc(b.match(/class="productReview-author">\s*([\s\S]*?)<\/p>/)?.[1] ?? "");
      const m = who.match(/^Posted by (.*) on (.+)$/);
      const d = m ? new Date(`${m[2]} UTC`) : null;
      return {
        reviewer: m?.[1] ?? who,
        title: unesc(b.match(/class="productReview-title">([\s\S]*?)<\/h5>/)?.[1] ?? ""),
        body: unesc(b.match(/class="productReview-body">([\s\S]*?)<\/p>/)?.[1] ?? ""),
        rating: Number(b.match(/productReview-ratingNumber">(\d)/)?.[1]) || null,
        date: d && !isNaN(+d) ? d.toISOString().slice(0, 10) : null,
        verified: null,
      };
    });
  const count = Number(html.match(/\((\d+) reviews?\)/)?.[1] ?? 0);
  const reviews = parse(html);
  for (let p = 2; reviews.length < count && p <= 50; p++) {
    const batch = parse(await get(`${url.split("?")[0]}?revpage=${p}`));
    if (!batch.length) break;
    reviews.push(...batch);
    await sleep(400);
  }
  const avg = reviews.filter((r) => r.rating).map((r) => r.rating!);
  return { reviews, rating: avg.length ? +(avg.reduce((x, y) => x + y, 0) / avg.length).toFixed(2) : null, count };
}

async function main() {
  const html = await get(pageUrl!);
  const res = html.includes("jdgm-rev-widg") ? await judgeme(html) : html.includes("productReviews-list") ? await bigcommerce(html, pageUrl!) : null;
  if (!res) throw new Error("no known review platform on page; use Firecrawl/browser fallback");

  const canon = new URL(pageUrl!);
  canon.search = "";
  canon.hash = "";
  const url = canon.toString().replace(/\/$/, "");
  const sid = `web:${crypto.createHash("sha256").update(url).digest("hex").slice(0, 16)}`;
  const now = new Date().toISOString();

  const srcFile = path.join(DIR, "sources.json");
  const sources: any[] = fs.existsSync(srcFile) ? JSON.parse(fs.readFileSync(srcFile, "utf8")) : [];
  let row = sources.find((s) => s.id === sid);
  if (!row) sources.push((row = { id: sid, url, class: "retailer", title: "", first_seen: now, discovered_by: ["user-supplied"] }));
  Object.assign(row, {
    method: "http-" + (html.includes("jdgm-rev-widg") ? "judgeme" : "bigcommerce"),
    last_fetched: now,
    status: res.reviews.length ? "ok" : "thin",
    site_rating: res.rating,
    site_review_count: res.count,
    content_hash: crypto.createHash("sha256").update(JSON.stringify(res.reviews)).digest("hex").slice(0, 16),
  });
  row.title ||= new URL(url).hostname + " product reviews";
  fs.writeFileSync(srcFile, JSON.stringify(sources, null, 2) + "\n");

  const itemsFile = path.join(DIR, "items.jsonl");
  const rawFile = path.join(DIR, "raw.jsonl");
  const keep = (f: string, keyOf: (l: any) => string) =>
    fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).filter((l) => !keyOf(JSON.parse(l)).startsWith(sid + ":")) : [];
  const items = keep(itemsFile, (i) => i.id);
  const raws = keep(rawFile, (i) => i.id);
  res.reviews.forEach((r, n) => {
    const id = `${sid}:${crypto.createHash("sha256").update(`${r.reviewer}|${r.date}|${r.body}`).digest("hex").slice(0, 10)}`;
    items.push(JSON.stringify({ id, source_id: sid, url, kind: "review", author_type: "buyer", created_utc: r.date ? Date.parse(r.date) / 1000 : null, rating: r.rating, verified_buyer: r.verified, extraction: "verbatim", classified: null }));
    // Reviewer names stay in raw.jsonl (gitignored): the committed ledger holds no personal names.
    raws.push(JSON.stringify({ id, text: [r.title, r.body].filter(Boolean).join("\n\n"), reviewer: r.reviewer }));
    void n;
  });
  fs.writeFileSync(itemsFile, items.join("\n") + "\n");
  fs.writeFileSync(rawFile, raws.join("\n") + "\n");
  console.log(`${url}\n  ${res.reviews.length} reviews fetched (page says ${res.count}, rating ${res.rating})`);
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
