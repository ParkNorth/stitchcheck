#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows are loose JSON */
/**
 * Fetch whole web pages (blogs, forum threads, comparison posts, dealer pages) as verbatim text.
 *
 *   npm run reviews:page -- --slug juki-tl-2010q --kind comparison --url URL [--url URL ...]
 *   npm run reviews:page -- --slug juki-tl-2010q --kind review --url URL --replace   # swap lossy items
 *
 * One item per page (kind "article"), full visible text in raw.jsonl, same text in cache/pages/.
 * Replies and comments on the page are part of the text. --kind is stored on the item
 * (review | comparison | reference) so later stages can route it. Plain HTTP only; pages that
 * fail are logged on the source row as blocked/dead and need the Firecrawl/browser fallback.
 * Idempotent per URL.
 *
 * Bot-blocked pages (PatternReview, Missouri Star forum): scrape them with Firecrawl
 * (formats ["rawHtml"]; big results are auto-saved to a file) and pass
 *   --firecrawl "URL=/path/to/saved.json"
 * to ingest that HTML through the same text extraction instead of fetching.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const a = process.argv.slice(2);
const val = (n: string) => a[a.indexOf(n) + 1];
const urls = [...a.flatMap((x, i) => (x === "--url" ? [a[i + 1]] : []))];
const slug = val("--slug");
const kind = val("--kind") ?? "review";
const REPLACE = a.includes("--replace");
const saved = new Map(a.flatMap((x, i) => (x === "--firecrawl" ? [a[i + 1].split(/=(.+)/).slice(0, 2) as [string, string]] : [])));
for (const u of saved.keys()) if (!urls.includes(u)) urls.push(u);
if (!slug || !urls.length) throw new Error("need --slug and at least one --url");
const DIR = path.resolve(__dirname, "..", "data", "reviews", slug);
fs.mkdirSync(path.join(DIR, "cache", "pages"), { recursive: true });

const cls = (u: string) => {
  const h = new URL(u).hostname.replace(/^www\./, "");
  if (/youtube|youtu\.be/.test(h)) return "youtube";
  if (/reddit/.test(h)) return "reddit";
  if (/patternreview|quiltingboard|missouriquiltco|sewingmachineforum|facebook/.test(h)) return "forum";
  if (/jukijunkies|sewingmachinesplus|weidner|meissner|janomesewingcentre|rockymountain|amazon|ebay/.test(h)) return "retailer";
  return "editorial";
};
const canon = (u: string) => {
  const x = new URL(u);
  x.hash = "";
  ["srsltid", "utm_source", "utm_medium", "utm_campaign", "styleid"].forEach((k) => x.searchParams.delete(k));
  return x.toString().replace(/\/$/, "");
};
const decode = (s: string) =>
  s.replace(/&nbsp;/g, " ").replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
function visibleText(html: string) {
  let h = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|noscript|svg|nav|header|footer|form|iframe)\b[\s\S]*?<\/\1>/gi, "");
  const main = h.match(/<(article|main)\b[\s\S]*?<\/\1>/i);
  if (main && main[0].length > 2500) h = main[0];
  return decode(h.replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr|blockquote)>/gi, "\n").replace(/<[^>]+>/g, " "))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}
const title = (html: string) => decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");

const read = (f: string): any[] => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const sources: any[] = JSON.parse(fs.readFileSync(path.join(DIR, "sources.json"), "utf8"));
let items = read(path.join(DIR, "items.jsonl"));
let raws = read(path.join(DIR, "raw.jsonl"));

async function main() {
  for (const raw of urls) {
    const url = canon(raw);
    const sid = `web:${crypto.createHash("sha256").update(url).digest("hex").slice(0, 16)}`;
    const now = new Date().toISOString();
    let row = sources.find((s) => s.id === sid || s.url.replace(/\/$/, "") === url);
    if (!row) sources.push((row = { id: sid, url, class: cls(url), method: "http-page", title: "", first_seen: now, discovered_by: [`comparison-search:${kind}`] }));
    try {
      let html: string;
      const file = saved.get(raw);
      if (file) html = JSON.parse(fs.readFileSync(file, "utf8")).rawHtml;
      else {
        const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; stitchcheck-reviews/0.1)" }, redirect: "follow" });
        if (!res.ok) throw new Error(String(res.status));
        html = await res.text();
      }
      const text = visibleText(html);
      if (text.length < 400) throw new Error("thin");
      row.title = title(html) || row.title;
      row.status = "ok";
      row.method = "http-page";
      row.last_fetched = now;
      row.content_hash = crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
      row.chars = text.length;
      row.page_kind = kind;
      if (REPLACE) {
        items = items.filter((i) => i.source_id !== row.id);
        raws = raws.filter((r) => !r.id.startsWith(row.id + ":"));
      } else {
        items = items.filter((i) => i.source_id !== row.id || i.kind !== "article");
        raws = raws.filter((r) => r.id !== `${row.id}:page`);
      }
      const id = `${row.id}:page`;
      items.push({ id, source_id: row.id, url, kind: "article", page_kind: kind, author_type: "unknown", created_utc: null, extraction: "verbatim", classified: null });
      raws.push({ id, text });
      fs.writeFileSync(path.join(DIR, "cache", "pages", `${row.id.replace(":", "-")}.txt`), text);
      console.log(`ok   ${String(text.length).padStart(6)}  ${url}`);
    } catch (e: any) {
      row.status = e.message === "thin" ? "thin" : /^4\d\d$/.test(e.message) && e.message !== "403" ? "dead" : "blocked";
      row.last_fetched = now;
      row.note = `http-page: ${e.message}`;
      console.log(`FAIL ${e.message.padEnd(6)} ${url}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  fs.writeFileSync(path.join(DIR, "sources.json"), JSON.stringify(sources, null, 2) + "\n");
  fs.writeFileSync(path.join(DIR, "items.jsonl"), items.map((i) => JSON.stringify(i)).join("\n") + "\n");
  fs.writeFileSync(path.join(DIR, "raw.jsonl"), raws.map((r) => JSON.stringify(r)).join("\n") + "\n");
}
main();
