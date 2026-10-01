#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- Reddit API JSON is untyped */
/**
 * Register discovered non-Reddit URLs in data/reviews/{slug}/sources.json.
 *
 *   npm run reviews:register -- --slug juki-tl-2010q --query "Juki TL-2010Q review" \
 *     --url "https://a.com/x|editorial|Title" --url "https://b.com/y|forum|Title"
 *
 * Each --url is `url|class|title`. Existing rows only gain the query in discovered_by.
 * New rows start as status "pending" until fetched (pending -> ok/blocked/dead/thin).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const a = process.argv.slice(2);
const val = (n: string) => a[a.indexOf(n) + 1];
const all = (n: string) => a.flatMap((x, i) => (x === n ? [a[i + 1]] : []));
const slug = val("--slug");
const query = val("--query");
if (!slug || !query) throw new Error("need --slug and --query");
const file = path.resolve(__dirname, "..", "data", "reviews", slug, "sources.json");
const rows: any[] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
const now = new Date().toISOString();
const canon = (u: string) => {
  const x = new URL(u);
  x.hash = "";
  ["srsltid", "utm_source", "utm_medium", "utm_campaign"].forEach((k) => x.searchParams.delete(k));
  return x.toString().replace(/\/$/, "");
};
for (const spec of all("--url")) {
  const [raw, cls, title] = spec.split("|");
  const url = canon(raw);
  const id = `web:${crypto.createHash("sha256").update(url).digest("hex").slice(0, 16)}`;
  const ex = rows.find((r) => r.id === id);
  if (ex) {
    if (!ex.discovered_by.includes(query)) ex.discovered_by.push(query);
    continue;
  }
  rows.push({ id, url, class: cls, method: "firecrawl", title: title ?? "", first_seen: now, last_fetched: null, status: "pending", content_hash: null, discovered_by: [query] });
}
fs.writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
console.log(`${rows.length} sources`);
