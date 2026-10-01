#!/usr/bin/env tsx
/**
 * Merge items.jsonl (metadata) and raw.jsonl (text) into one file for downstream AI sorting.
 *
 *   npm run reviews:export -- --slug juki-tl-2010q
 *
 * Writes data/reviews/{slug}/reviews.jsonl (gitignored): one JSON row per review or comment with
 * source url, source class, date, rating, author_type and the full text. Regenerate any time.
 */
import fs from "node:fs";
import path from "node:path";

const a = process.argv.slice(2);
const slug = a[a.indexOf("--slug") + 1];
if (!slug) throw new Error("need --slug");
const DIR = path.resolve(__dirname, "..", "data", "reviews", slug);
const lines = (f: string) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const sources = new Map<string, { class: string; title: string }>(JSON.parse(fs.readFileSync(path.join(DIR, "sources.json"), "utf8")).map((s: { id: string; class: string; title: string }) => [s.id, s]));
const rawRows = new Map<string, { text: string; reviewer?: string }>(lines(path.join(DIR, "raw.jsonl")).map((r) => [r.id, r]));
const out = lines(path.join(DIR, "items.jsonl")).map((i) => {
  const s = sources.get(i.source_id);
  return { ...i, reviewer: rawRows.get(i.id)?.reviewer, source_class: s?.class, source_title: s?.title, text: rawRows.get(i.id)?.text ?? null };
});
fs.writeFileSync(path.join(DIR, "reviews.jsonl"), out.map((o) => JSON.stringify(o)).join("\n") + "\n");
const withText = out.filter((o) => o.text).length;
console.log(`${out.length} rows, ${withText} with full text, ${out.length - withText} metadata-only (lossy or not yet re-fetched)`);
