#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows are loose JSON */
/**
 * Ingest Walmart product reviews from Firecrawl-saved pages (walmart.com/reviews/product/{id}).
 *
 *   npm run reviews:walmart -- --slug brother-1034d --product 1723621 --dir /path/to/tool-results
 *
 * Walmart blocks plain HTTP. Scrape each page with Firecrawl (proxy "stealth", formats ["rawHtml"], which
 * auto-saves the large result to a file), using the rating filter to sample the tail:
 *   ?ratings=1&page=N   ?ratings=2&page=N   ?ratings=3&page=N   ?page=N (most relevant)
 * This script scans --dir for saved results of that product, reads each page's __NEXT_DATA__ review list,
 * dedupes by reviewId and writes items.jsonl (metadata, rating, date) and raw.jsonl (title, text, nickname;
 * gitignored). The page's own totals and rating distribution go on the source row (site_distribution), because
 * the ingested set is a sample, not the full list. Idempotent.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const a = process.argv.slice(2);
const val = (n: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined);
const slug = val("--slug");
const product = val("--product");
const dir = val("--dir");
if (!slug || !product || !dir) throw new Error("need --slug, --product and --dir");
const DIR = path.resolve(__dirname, "..", "data", "reviews", slug);
const read = (f: string): any[] => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);

const seen = new Map<string, any>();
let totals: any = null;
let pages = 0;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".txt"))) {
  let html = "";
  try {
    html = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).rawHtml ?? "";
  } catch {
    continue;
  }
  if (!html.includes(`/reviews/product/${product}`)) continue;
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) continue;
  const r = JSON.parse(m[1])?.props?.pageProps?.initialData?.data?.reviews;
  if (!r?.customerReviews) continue;
  pages++;
  totals ??= r;
  for (const c of r.customerReviews) if (c.reviewId && !seen.has(c.reviewId)) seen.set(c.reviewId, c);
}
if (!seen.size) throw new Error("no Walmart reviews found in --dir");

const url = `https://www.walmart.com/reviews/product/${product}`;
const sid = `web:${crypto.createHash("sha256").update(url).digest("hex").slice(0, 16)}`;
const now = new Date().toISOString();
const sources: any[] = JSON.parse(fs.readFileSync(path.join(DIR, "sources.json"), "utf8"));
let row = sources.find((s) => s.id === sid);
if (!row) sources.push((row = { id: sid, url, class: "retailer", title: "Walmart customer reviews", first_seen: now, discovered_by: ["search:walmart"] }));
const dist: Record<string, number> = { "1": totals.ratingValueOneCount, "2": totals.ratingValueTwoCount, "3": totals.ratingValueThreeCount, "4": totals.ratingValueFourCount, "5": totals.ratingValueFiveCount };
Object.assign(row, {
  method: "firecrawl-stealth-next-data",
  last_fetched: now,
  status: "ok",
  site_rating: totals.averageOverallRating,
  site_review_count: totals.totalReviewCount,
  site_distribution: dist,
  sampled: `${seen.size} of ${totals.totalReviewCount} reviews: every 1 to 3 star page plus the top relevance pages (${pages} pages read)`,
});
fs.writeFileSync(path.join(DIR, "sources.json"), JSON.stringify(sources, null, 2) + "\n");

const items = read(path.join(DIR, "items.jsonl")).filter((i) => !i.id.startsWith(sid + ":"));
const raws = read(path.join(DIR, "raw.jsonl")).filter((i) => !i.id.startsWith(sid + ":"));
for (const c of seen.values()) {
  const id = `${sid}:${String(c.reviewId).slice(-10)}`;
  const t = Date.parse(c.reviewSubmissionTime);
  items.push({ id, source_id: sid, url, kind: "review", author_type: "buyer", created_utc: Number.isNaN(t) ? null : t / 1000, rating: c.rating, verified_buyer: (c.badges ?? []).some((b: any) => /verified/i.test(b.text ?? b.id ?? "")) || null, syndication: c.syndicationSource?.name ?? null, extraction: "verbatim", classified: null });
  raws.push({ id, text: [c.reviewTitle, c.reviewText].filter(Boolean).join("\n\n"), reviewer: c.userNickname ?? null });
}
fs.writeFileSync(path.join(DIR, "items.jsonl"), items.map((i) => JSON.stringify(i)).join("\n") + "\n");
fs.writeFileSync(path.join(DIR, "raw.jsonl"), raws.map((r) => JSON.stringify(r)).join("\n") + "\n");
const byRating = [...seen.values()].reduce((m: any, c) => ((m[c.rating] = (m[c.rating] ?? 0) + 1), m), {});
console.log(`walmart ${product}: ${seen.size} reviews from ${pages} pages, by rating`, byRating, `page says ${totals.totalReviewCount} reviews, ${totals.averageOverallRating}`);
