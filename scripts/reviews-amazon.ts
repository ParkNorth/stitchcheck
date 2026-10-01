#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- API and ledger rows are loose JSON */
/**
 * Amazon rating, rating count, listing details and top reviews via DataForSEO (Merchant API, live endpoints).
 *
 *   npm run reviews:amazon -- --slug brother-1034d                  # search Amazon for "{brand} {model}", pick the ASIN, ingest
 *   npm run reviews:amazon -- --slug brother-1034d --asin B0000CBK1L # ingest a known ASIN
 *   npm run reviews:amazon -- --slug brother-1034d --search-only     # print candidate ASINs, ingest nothing
 *   npm run reviews:amazon -- --slug brother-1034d --from-file resp.json   # ingest a saved ASIN response (no credentials needed)
 *
 * What it returns is a sample: the page's own rating and rating count, the listing's item details (weight, dimensions,
 * warranty description), and about a dozen top reviews (US top reviews plus a few from other countries). It is not
 * the full review history, so the reviews are marked sampled and never carry theme counts alone; the rating and count
 * are the point. Cost is about $0.005 per ASIN and $0.0033 per search.
 *
 * Credentials: DATAFORSEO_LOGIN (or DATAFORSEO_USERNAME) and DATAFORSEO_PASSWORD, from the environment or .env.local.
 * `--from-claude-config` additionally reads them from the dataforseo entry in ~/.claude.json; use it only when you have
 * said so. Nothing is printed. Reviewer names go to raw.jsonl (gitignored), never to items.jsonl.
 *
 * Amazon pools ratings across the ASINs that share a parent. The source row records parent_asin and product_asins and
 * sets pooled_variations, which reviews:checks warns about.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const a = process.argv.slice(2);
const val = (n: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined);
const slug = val("--slug");
if (!slug) throw new Error("usage: reviews-amazon.ts --slug <slug> [--asin B..|--search-only|--from-file f] [--from-claude-config]");
const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "data", "reviews", slug);
const spec = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "specs", `${slug}.json`), "utf8"));

function creds(): { login: string; password: string } | null {
  const env: Record<string, string | undefined> = { ...process.env };
  const f = path.join(ROOT, ".env.local");
  if (fs.existsSync(f)) for (const l of fs.readFileSync(f, "utf8").split("\n")) {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  let login = env.DATAFORSEO_LOGIN ?? env.DATAFORSEO_USERNAME;
  let password = env.DATAFORSEO_PASSWORD;
  if ((!login || !password) && a.includes("--from-claude-config")) {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".claude.json"), "utf8"))?.mcpServers?.dataforseo?.env ?? {};
    login = cfg.DATAFORSEO_LOGIN ?? cfg.DATAFORSEO_USERNAME;
    password = cfg.DATAFORSEO_PASSWORD;
  }
  return login && password ? { login, password } : null;
}

async function post(endpoint: string, body: any) {
  const c = creds();
  if (!c) throw new Error("DataForSEO credentials not found: set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in the environment or .env.local (or pass --from-claude-config)");
  const res = await fetch(`https://api.dataforseo.com${endpoint}`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${c.login}:${c.password}`).toString("base64"), "Content-Type": "application/json" },
    body: JSON.stringify([body]),
  });
  const j: any = await res.json();
  const t = j.tasks?.[0];
  if (!res.ok || j.status_code >= 40000 || (t && t.status_code >= 40000)) throw new Error(`DataForSEO ${t?.status_code ?? j.status_code}: ${t?.status_message ?? j.status_message}`);
  return { items: t?.result?.[0]?.items ?? [], cost: t?.cost ?? 0 };
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const PARTS = /needle plate|blade|knife|thread guide|\bfoot\b|\bfeet\b|carrying case|\boil\b|cones?|compatible|fits|replacement|for brother|for juki|for janome|for singer|cover\b/i;

async function search() {
  const kw = val("--keyword") ?? `${spec.brand} ${spec.model} ${spec.type === "serger" ? "serger" : "sewing machine"}`;
  const { items, cost } = await post("/v3/merchant/amazon/products/live/advanced", { keyword: kw, location_code: 2840, language_code: "en_US", depth: 20 });
  const cands = items
    .filter((i: any) => i.type === "amazon_serp" && i.data_asin)
    .map((i: any) => ({ asin: i.data_asin, title: i.title ?? "", price: i.price_from ?? null, rating: i.rating?.value ?? null, votes: i.rating?.votes_count ?? null }));
  const me = norm(spec.model);
  const pick = cands.find((c: any) => norm(c.title).includes(me) && !PARTS.test(c.title) && (c.votes ?? 0) >= 20);
  console.log(`search "${kw}" cost $${cost}`);
  for (const c of cands.slice(0, 8)) console.log(`  ${c.asin === pick?.asin ? ">" : " "} ${c.asin} $${c.price} ${c.rating}/${c.votes} ${c.title.slice(0, 70)}`);
  return { cands, pick };
}

function ingest(resp: any) {
  const info = (resp.items ?? []).find((i: any) => i.type === "amazon_product_info") ?? resp;
  if (!info?.data_asin) throw new Error("no amazon_product_info in the response");
  const asin = info.data_asin as string;
  const url = `https://www.amazon.com/dp/${asin}`;
  const sid = `web:${crypto.createHash("sha256").update(url).digest("hex").slice(0, 16)}`;
  const now = new Date().toISOString();
  const srcFile = path.join(DIR, "sources.json");
  const sources: any[] = fs.existsSync(srcFile) ? JSON.parse(fs.readFileSync(srcFile, "utf8")) : [];
  let row = sources.find((s) => s.id === sid);
  if (!row) sources.push((row = { id: sid, url, class: "retailer", title: "Amazon customer reviews", first_seen: now, discovered_by: ["dataforseo-amazon"] }));
  const details = (info.product_information ?? []).filter((p: any) => p.type === "product_information_details_item").reduce((m: any, p: any) => ({ ...m, ...(p.body ?? {}) }), {});
  const reviews = [...(info.top_local_reviews ?? []).map((r: any) => ({ ...r, scope: "local" })), ...(info.top_global_reviews ?? []).map((r: any) => ({ ...r, scope: "global" }))];
  Object.assign(row, {
    method: "dataforseo-asin",
    last_fetched: now,
    status: "ok",
    site_rating: info.rating?.value ?? null,
    site_review_count: info.rating?.votes_count ?? null,
    asin,
    parent_asin: info.parent_asin ?? null,
    product_asins: info.product_asins ?? [],
    pooled_variations: (info.product_asins ?? []).length > 1,
    sampled: `${reviews.length} top reviews (${reviews.filter((r: any) => r.scope === "local").length} US, ${reviews.filter((r: any) => r.scope === "global").length} other countries) of ${info.rating?.votes_count ?? "?"} ratings`,
    listing: { title: info.title, price_usd: info.price_from ?? null, best_sellers_rank: details["Best Sellers Rank"] ?? null, details: Object.fromEntries(Object.entries(details).filter(([k]) => /weight|dimension|warranty|model|included|material|color|manufacturer|part number/i.test(k))) },
  });
  fs.writeFileSync(srcFile, JSON.stringify(sources, null, 2) + "\n");
  const read = (f: string): any[] => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
  const itemsF = path.join(DIR, "items.jsonl");
  const rawF = path.join(DIR, "raw.jsonl");
  const items = read(itemsF).filter((i) => !i.id.startsWith(sid + ":"));
  const raws = read(rawF).filter((i) => !i.id.startsWith(sid + ":"));
  for (const r of reviews) {
    const rid = String(r.url ?? "").match(/R[0-9A-Z]{8,}/)?.[0] ?? crypto.createHash("sha256").update(`${r.title}|${r.publication_date}|${(r.review_text ?? "").slice(0, 60)}`).digest("hex").slice(0, 10);
    const id = `${sid}:${rid}`;
    if (items.some((i) => i.id === id)) continue;
    const t = Date.parse(r.publication_date);
    items.push({ id, source_id: sid, url, kind: "review", author_type: "buyer", created_utc: Number.isNaN(t) ? null : t / 1000, rating: r.rating?.value ?? null, verified_buyer: r.verified ?? null, helpful_votes: r.helpful_votes ?? null, review_scope: r.scope, extraction: "verbatim", classified: null });
    raws.push({ id, text: [r.title, r.review_text].filter(Boolean).join("\n\n"), reviewer: r.user_profile?.name ?? null });
  }
  fs.writeFileSync(itemsF, items.map((i) => JSON.stringify(i)).join("\n") + (items.length ? "\n" : ""));
  fs.writeFileSync(rawF, raws.map((i) => JSON.stringify(i)).join("\n") + (raws.length ? "\n" : ""));
  console.log(`amazon ${asin}: rating ${row.site_rating} from ${row.site_review_count}, ${reviews.length} reviews, pooled_variations ${row.pooled_variations}${row.listing.details["Warranty Description"] ? `, listing warranty: ${row.listing.details["Warranty Description"]}` : ""}`);
}

async function main() {
  fs.mkdirSync(DIR, { recursive: true });
  const file = val("--from-file");
  if (file) return ingest(JSON.parse(fs.readFileSync(file, "utf8")));
  let asin = val("--asin");
  if (!asin) {
    const { pick } = await search();
    if (a.includes("--search-only")) return;
    if (!pick) throw new Error("no confident ASIN match; rerun with --asin after reading the candidates");
    asin = pick.asin;
  }
  const { items, cost } = await post("/v3/merchant/amazon/asin/live/advanced", { asin, location_code: 2840, language_code: "en_US" });
  console.log(`asin ${asin} cost $${cost}`);
  ingest({ items });
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
