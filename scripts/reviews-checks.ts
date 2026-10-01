#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows are loose JSON */
/**
 * Quality gates for one model's review ledger. Each check encodes a mistake we made or nearly made.
 *
 *   npm run reviews:checks -- --slug brother-1034dx            # writes data/reviews/{slug}/checks.json
 *   npm run reviews:checks -- --all                            # every slug that has a ledger
 *
 * Levels: error blocks "complete" in reviews:plan, warn needs a look, info is context.
 *
 *   config         queries.json and editor.json have the keys the pipeline reads
 *   siblings       confusable siblings listed; every sibling has a pattern in editor.json
 *   pooled-listing a retailer listing whose reviews mostly name a sibling, or neither model, is pooled: it needs
 *                  scopeRules in editor.json or an explicit note (the 1034DX Walmart listing)
 *   amazon-parent  an Amazon listing shared by several ASINs pools their ratings
 *   scope          claims scoped sibling or unclear above a threshold: extraction or sibling config is off
 *   rejects        quote validation rejected more than 5 percent of rows
 *   reddit         few Reddit threads with the model in the title means the collector is on loose matches
 *   conflicts      a maker document fact that contradicts our spec is not mentioned in the spec's conflicts
 *   owner-note     rollup dominated by Reddit voices needs ownerNote, and sampled sources need a note
 *   evidence       evidence level, voices, source mix, for the review sheet
 */
import fs from "node:fs";
import path from "node:path";

const a = process.argv.slice(2);
const ROOT = path.resolve(__dirname, "..");
const readJson = (f: string, fb: any) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : fb);
const jl = (f: string): any[] => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const modelRe = (m: string) => new RegExp(`(^|[^a-z0-9])${m.toLowerCase().split(/[\s-]+/).filter(Boolean).map(esc).join("[\\s-]*")}(?![a-z0-9])`, "i");

function check(slug: string) {
  const D = path.join(ROOT, "data", "reviews", slug);
  const items: any[] = [];
  const add = (level: "error" | "warn" | "info", id: string, message: string) => items.push({ level, id, message });
  const spec = readJson(path.join(ROOT, "data", "specs", `${slug}.json`), null);
  const q = readJson(path.join(D, "queries.json"), null);
  const ed = readJson(path.join(D, "editor.json"), null);
  const man = readJson(path.join(D, "manufacturer.json"), null);
  const sources: any[] = readJson(path.join(D, "sources.json"), []);
  const claims = jl(path.join(D, "claims.jsonl"));
  const rejected = jl(path.join(D, "claims-rejected.jsonl"));
  const roll = readJson(path.join(D, "rollup.json"), null);
  const rawText = new Map<string, string>(jl(path.join(D, "raw.jsonl")).map((r) => [r.id, r.text]));
  const itemsAll = jl(path.join(D, "items.jsonl"));

  if (!spec) add("error", "config", `no data/specs/${slug}.json`);
  if (!q) add("error", "config", "queries.json missing: run reviews:bootstrap");
  if (!ed) add("error", "config", "editor.json missing: run reviews:bootstrap");
  if (q && !(q.model_names?.length && q.reddit?.searches?.length)) add("error", "config", "queries.json needs model_names and reddit.searches");
  if (ed) for (const k of ["notes", "siblings", "features", "rivals", "others", "scopeRules", "siblingSummaries"]) if (!(k in ed)) add("error", "config", `editor.json missing "${k}"`);

  if (q && ed) {
    const sibs: string[] = q.confusable_siblings ?? [];
    if (!sibs.length) add("warn", "siblings", "no confusable siblings listed; confirm this model has none (rule 9)");
    const have = new Set((ed.siblings ?? []).map((s: any) => String(s.model).toLowerCase()));
    // Only worth a warning when claims actually compare against that sibling.
    const diffs = claims.filter((c) => c.type === "difference");
    for (const s of sibs) {
      const n = diffs.filter((d) => modelRe(s).test(`${d.model_a} ${d.model_b}`)).length;
      if (!have.has(s.toLowerCase()) && n >= 3) add("warn", "siblings", `${n} difference claims compare against ${s} but editor.json siblings has no pattern for it`);
    }
  }

  // Pooled retailer listings: measure which model each sampled review names.
  if (q) {
    const mine = (q.model_names ?? []).map(modelRe);
    const sibRes = (q.confusable_siblings ?? []).map(modelRe);
    for (const s of sources.filter((x) => x.class === "retailer" && x.site_review_count)) {
      const its = itemsAll.filter((i) => i.source_id === s.id);
      if (its.length < 20) continue;
      let me = 0,
        sib = 0,
        none = 0;
      for (const i of its) {
        const t = rawText.get(i.id) ?? "";
        const m = mine.some((r: RegExp) => r.test(t));
        const o = sibRes.some((r: RegExp) => r.test(t));
        if (m) me++;
        else if (o) sib++;
        else none++;
      }
      const host = new URL(s.url).hostname.replace(/^www\./, "");
      const ruled = (ed?.scopeRules ?? []).some((r: any) => String(s.url).includes(r.sourceUrl));
      add("info", "pooled-listing", `${host}: of ${its.length} sampled reviews, ${me} name this model, ${sib} name a sibling only, ${none} name neither`);
      if (sib / its.length >= 0.05 && !ruled) add("error", "pooled-listing", `${host} listing carries reviews that name a sibling (${sib} of ${its.length}); add a scopeRule to editor.json or explain why not`);
      if (me / its.length < 0.1 && (q.confusable_siblings ?? []).length && !ruled) add("warn", "pooled-listing", `${host}: only ${me} of ${its.length} reviews name this model while siblings exist; confirm the listing is not pooled`);
    }
    for (const s of sources.filter((x) => x.pooled_variations)) add("warn", "amazon-parent", `${new URL(s.url).hostname}: listing shares a parent with ${s.product_asins?.length ?? "several"} ASINs (${(s.product_asins ?? []).join(", ")}); its rating pools them, so say so beside the number`);
  }

  if (claims.length) {
    const sc = claims.filter((c) => c.type === "spec_claim");
    const n = sc.length || 1;
    const sib = sc.filter((c) => c.scope === "sibling").length / n;
    const unc = sc.filter((c) => c.scope === "unclear").length / n;
    add("info", "scope", `spec claims: ${sc.length}, this ${sc.filter((c) => c.scope === "this").length}, sibling ${sc.filter((c) => c.scope === "sibling").length}, unclear ${sc.filter((c) => c.scope === "unclear").length}`);
    if (sib > 0.25) add("warn", "scope", `${Math.round(sib * 100)}% of spec claims are about a sibling: collection is pulling the wrong model's threads`);
    if (unc > 0.35) add("warn", "scope", `${Math.round(unc * 100)}% of spec claims have unclear scope: many threads cover several machines`);
    const rr = rejected.length / (claims.length + rejected.length);
    if (rr > 0.05) add("warn", "rejects", `${Math.round(rr * 100)}% of extracted rows failed quote validation`);
  }

  const reddit = sources.filter((s) => s.class === "reddit" && s.status === "ok");
  if (q && reddit.length) {
    const mine = (q.model_names ?? []).map(modelRe);
    const inTitle = reddit.filter((s) => mine.some((r: RegExp) => r.test(s.title ?? ""))).length;
    add("info", "reddit", `${reddit.length} Reddit threads, ${inTitle} with the model in the title`);
    if (inTitle < Math.min(5, reddit.length)) add("warn", "reddit", "few Reddit threads name the model in the title; collection may be on loose matches");
  }

  if (man && spec) {
    const conf = (spec.conflicts ?? []).join(" ").toLowerCase();
    for (const f of man.facts ?? []) {
      if (f.vs_spec !== "contradicts") continue;
      const ALIAS: Record<string, string[]> = { msrp: ["price"], dimensionsIn: ["dimension", "height", "size"], bed: ["table"], weightLb: ["weight"], stitchWidthMm: ["stitch width"], warrantyUs: ["warranty"], threads: ["thread"], maxSpm: ["speed"], includedFeet: ["feet", "foot"] };
      const key = String(f.field).replace(/([A-Z])/g, " $1").toLowerCase().replace(/ in$| mm$| lb$/, "").trim();
      const words = [...key.split(/\s+/).filter((w: string) => w.length > 3), ...(ALIAS[f.field] ?? [])];
      if (!words.some((w: string) => conf.includes(w))) add("warn", "conflicts", `maker documents contradict our "${f.field}" but the spec's conflicts do not mention it`);
    }
  }

  if (roll) {
    const total = Object.values<any>(roll.method?.byClass ?? {}).reduce((x: number, v: any) => x + v.items, 0) || 1;
    const redditShare = (roll.method?.byClass?.reddit?.items ?? 0) / total;
    for (const f of man?.facts ?? []) if (f.site && !["confirmed", "differs", "unverified", "dealer only"].includes(f.site.status)) add("error", "config", `manufacturer fact ${f.field}: site.status "${f.site.status}" is not one of confirmed, differs, unverified, dealer only`);
    if (redditShare > 0.8 && !roll.ownerNote) add("error", "owner-note", `${Math.round(redditShare * 100)}% of items are Reddit and rollup has no ownerNote (editor.json ownerNote)`);
    if (roll.ratings?.some((r: any) => r.sampled) && !(roll.notes ?? []).some((n: string) => /sampled/i.test(n))) add("warn", "owner-note", "a retailer source is sampled but notes do not say so");
    add("info", "evidence", `evidence ${roll.method?.evidence}, ${roll.method?.voices} voices (${roll.method?.ownerVoices} first-hand), ${roll.method?.sources} sources, status ${roll.status}`);
  }

  const out = { slug, generated: new Date().toISOString(), counts: { error: items.filter((i) => i.level === "error").length, warn: items.filter((i) => i.level === "warn").length }, items };
  if (fs.existsSync(D)) fs.writeFileSync(path.join(D, "checks.json"), JSON.stringify(out, null, 2) + "\n");
  return out;
}

const all = a.includes("--all");
const slugs = all
  ? fs.readdirSync(path.join(ROOT, "data", "reviews")).filter((f) => !f.startsWith("_") && fs.statSync(path.join(ROOT, "data", "reviews", f)).isDirectory())
  : [a[a.indexOf("--slug") + 1]];
if (!slugs[0]) throw new Error("usage: reviews-checks.ts --slug <slug> | --all");
let bad = 0;
for (const s of slugs) {
  const r = check(s);
  console.log(`\n${s}: ${r.counts.error} error, ${r.counts.warn} warn`);
  for (const i of r.items) console.log(`  ${i.level.padEnd(5)} ${i.id.padEnd(14)} ${i.message}`);
  bad += r.counts.error;
}
process.exit(bad ? 1 : 0);
