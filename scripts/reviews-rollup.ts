#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows are loose JSON */
/**
 * Roll up validated claims into counts the page can render. Counts only: no prose is generated here.
 *
 *   npm run reviews:rollup -- tag-prep  --slug juki-tl-2010q [--chunk 200]   # chunks for the tagger
 *   npm run reviews:rollup -- tag-merge --slug juki-tl-2010q                 # validate tags -> tags.jsonl
 *   npm run reviews:rollup -- build     --slug juki-tl-2010q                 # -> rollup.json
 *   npm run reviews:rollup -- check     --slug juki-tl-2010q                 # every referenced claim exists
 *
 * Tagger (a model, see .claude/skills/collect-reviews/tag-prompt.md) reads tag-in-N.jsonl and writes
 * tag-out-N.jsonl rows {claim_id, theme, polarity}. tag-merge rejects unknown ids and enum values.
 *
 * rollup.json carries `status: "draft" | "approved"`. The build step (npm run build:catalog) compiles
 * only approved rollups into src/lib/rollup-data.ts. Approval is an editor decision (AGENTS.md rule 22):
 * set status, reviewedBy and reviewedOn by hand after reading rollup.json and spot-checking claims.
 * Re-running `build` keeps an existing approval only if the counts did not change; otherwise it drops
 * back to draft.
 *
 * Deterministic remap: any statement whose claim or quote contains "threader" is moved to the theme
 * `needle_threader` after tagging (the tagger taxonomy had no slot for it and scattered these across
 * feet, reliability and trimmer). The tags file itself is not changed.
 *
 * Definitions:
 *   statement  one accepted spec_claim with scope "this" (the tagged writer is describing this model)
 *   voice      one distinct item (review, comment or page) behind statements; a voice counts once per theme
 *   source     one thread or page (item id minus its last segment); retailer review pages are one source
 *   owner voice  a voice whose claim was tagged first_hand
 */
import fs from "node:fs";
import path from "node:path";

const a = process.argv.slice(2);
const mode = a[0];
const val = (n: string) => a[a.indexOf(n) + 1];
const slug = val("--slug");
const CHUNK = Number(val("--chunk") ?? 200);
if (!slug || !["tag-prep", "tag-merge", "build", "check"].includes(mode)) throw new Error("usage: reviews-rollup.ts tag-prep|tag-merge|build|check --slug X");
const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "data", "reviews", slug);
const WORK = path.join(DIR, "claims-work");
const read = (f: string): any[] => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const THEMES = ["stitch_quality", "build_quality", "speed", "power_heavy_fabric", "thread_trimmer", "tension", "oiling_maintenance", "reliability_defects", "noise_vibration", "throat_workspace", "feet_accessories", "walking_foot", "free_motion", "lighting", "value_price", "support_service", "weight_portability", "learning_curve", "other"];
const POLARITY = ["positive", "negative", "neutral", "mixed"];
const THEME_LABEL: Record<string, string> = {
  stitch_quality: "Stitch quality",
  build_quality: "Build quality",
  speed: "Speed and speed control",
  power_heavy_fabric: "Power on heavy fabric",
  thread_trimmer: "Thread trimmer",
  tension: "Tension",
  oiling_maintenance: "Oiling and maintenance",
  reliability_defects: "Reliability and defects",
  noise_vibration: "Noise and vibration",
  throat_workspace: "Throat and workspace",
  feet_accessories: "Feet and accessories",
  walking_foot: "Walking foot",
  free_motion: "Free-motion quilting",
  lighting: "Lighting",
  value_price: "Value and price",
  support_service: "Dealer support and service",
  weight_portability: "Weight and portability",
  learning_curve: "Learning curve",
  needle_threader: "Automatic needle threader",
  other: "Other",
};
const srcOf = (itemId: string) => itemId.replace(/:[^:]+$/, "");
const year = (t: number | null | undefined) => (t ? new Date(t * 1000).getUTCFullYear() : null);

if (mode === "tag-prep") {
  const claims = read(path.join(DIR, "claims.jsonl")).filter((c) => c.type === "spec_claim");
  fs.mkdirSync(WORK, { recursive: true });
  for (const f of fs.readdirSync(WORK).filter((f) => /^tag-(in|out)-\d+\.jsonl$/.test(f))) fs.unlinkSync(path.join(WORK, f));
  const n = Math.ceil(claims.length / CHUNK);
  for (let i = 0; i < n; i++)
    fs.writeFileSync(
      path.join(WORK, `tag-in-${i + 1}.jsonl`),
      claims.slice(i * CHUNK, (i + 1) * CHUNK).map((c) => JSON.stringify({ claim_id: c.claim_id, field: c.field, scope: c.scope, first_hand: c.first_hand, claim: c.claim, quote: c.quote })).join("\n") + "\n",
    );
  console.log(`${claims.length} spec claims -> ${n} tag chunks`);
}

if (mode === "tag-merge") {
  const claims = new Set(read(path.join(DIR, "claims.jsonl")).map((c) => c.claim_id));
  const good = new Map<string, any>();
  const bad: any[] = [];
  for (const f of fs.readdirSync(WORK).filter((f) => /^tag-out-\d+\.jsonl$/.test(f))) {
    for (const r of read(path.join(WORK, f))) {
      const why = !claims.has(r.claim_id) ? "unknown claim_id" : !THEMES.includes(r.theme) ? "bad theme" : !POLARITY.includes(r.polarity) ? "bad polarity" : null;
      if (why) bad.push({ ...r, reason: why });
      else good.set(r.claim_id, { claim_id: r.claim_id, theme: r.theme, polarity: r.polarity });
    }
  }
  const spec = read(path.join(DIR, "claims.jsonl")).filter((c) => c.type === "spec_claim");
  const missing = spec.filter((c) => !good.has(c.claim_id)).length;
  fs.writeFileSync(path.join(DIR, "tags.jsonl"), [...good.values()].map((g) => JSON.stringify(g)).join("\n") + "\n");
  console.log(`tags accepted ${good.size}, rejected ${bad.length}, spec claims untagged ${missing}`);
  if (bad.length) fs.writeFileSync(path.join(DIR, "tags-rejected.jsonl"), bad.map((b) => JSON.stringify(b)).join("\n") + "\n");
}

const claimsAll = () => read(path.join(DIR, "claims.jsonl"));

if (mode === "build") {
  const claims = claimsAll();
  const tags = new Map<string, any>(read(path.join(DIR, "tags.jsonl")).map((t) => [t.claim_id, t]));
  const items = new Map<string, any>(read(path.join(DIR, "items.jsonl")).map((i) => [i.id, i]));
  const sources: any[] = JSON.parse(fs.readFileSync(path.join(DIR, "sources.json"), "utf8"));
  const manufacturer = JSON.parse(fs.readFileSync(path.join(DIR, "manufacturer.json"), "utf8"));
  // editor.json is hand-written: notes shown with the methodology, and per-feature sibling summaries.
  const editor = fs.existsSync(path.join(DIR, "editor.json")) ? JSON.parse(fs.readFileSync(path.join(DIR, "editor.json"), "utf8")) : { notes: [], siblingSummaries: {} };

  // ---- owner signals by theme
  const stmts = claims.filter((c) => c.type === "spec_claim" && c.scope === "this" && tags.has(c.claim_id));
  type Acc = { claims: any[]; voices: Map<string, any> };
  const byTheme = new Map<string, Acc>();
  for (const c of stmts) {
    const t = { ...tags.get(c.claim_id) };
    if (/threader/i.test(`${c.claim} ${c.quote}`)) t.theme = "needle_threader";
    const acc: Acc = byTheme.get(t.theme) ?? { claims: [], voices: new Map() };
    acc.claims.push({ ...c, ...t });
    const v = acc.voices.get(c.item_id) ?? { item_id: c.item_id, first_hand: false, pol: {} as Record<string, number> };
    v.first_hand = v.first_hand || c.first_hand;
    v.pol[t.polarity] = (v.pol[t.polarity] ?? 0) + 1;
    acc.voices.set(c.item_id, v);
    byTheme.set(t.theme, acc);
  }
  const voicePolarity = (v: any) => {
    const p = v.pol;
    const pos = p.positive ?? 0, neg = p.negative ?? 0;
    return pos && neg ? "mixed" : neg ? "negative" : pos ? "positive" : p.mixed ? "mixed" : "neutral";
  };
  const themes = [...byTheme.entries()]
    .filter(([k]) => k !== "other")
    .map(([theme, acc]) => {
      const voices = [...acc.voices.values()];
      const srcs = new Set(voices.map((v) => srcOf(v.item_id)));
      const classes = new Set(acc.claims.map((c) => c.source_class));
      const yrs = acc.claims.map((c) => year(items.get(c.item_id)?.created_utc)).filter(Boolean) as number[];
      const pol = { positive: 0, negative: 0, mixed: 0, neutral: 0 } as Record<string, number>;
      for (const v of voices) pol[voicePolarity(v)]++;
      const firstHand = voices.filter((v) => v.first_hand).length;
      const label = voices.length >= 5 && srcs.size >= 3 && classes.size >= 2 ? "recurring" : voices.length >= 2 && srcs.size >= 2 ? "reported" : "one-off";
      // Exemplars: shortest quotes first, preferring first-hand, one per source, up to 2 per polarity.
      const ex: any[] = [];
      for (const polarity of ["negative", "positive", "mixed"]) {
        const seen = new Set<string>();
        for (const c of acc.claims.filter((c) => c.polarity === polarity && c.first_hand).sort((x, y) => x.quote.length - y.quote.length)) {
          if (seen.has(srcOf(c.item_id))) continue;
          seen.add(srcOf(c.item_id));
          ex.push({ claim_id: c.claim_id, polarity, claim: c.claim, quote: c.quote, url: c.url, source_class: c.source_class });
          if (seen.size >= 2) break;
        }
      }
      return {
        theme,
        label: THEME_LABEL[theme] ?? theme,
        statements: acc.claims.length,
        voices: voices.length,
        ownerVoices: firstHand,
        sources: srcs.size,
        sourceClasses: [...classes].sort(),
        polarity: pol,
        years: yrs.length ? [Math.min(...yrs), Math.max(...yrs)] : null,
        recurrence: label,
        examples: ex,
        claimIds: acc.claims.map((c) => c.claim_id),
      };
    })
    .sort((x, y) => y.voices - x.voices);

  // ---- global coverage
  const allVoices = new Set(stmts.map((c) => c.item_id));
  const ownerVoices = new Set(stmts.filter((c) => c.first_hand).map((c) => c.item_id));
  const classTally: Record<string, { sources: number; items: number }> = {};
  for (const s of sources.filter((s) => s.status === "ok")) {
    const n = [...items.values()].filter((i) => i.source_id === s.id).length;
    const t = (classTally[s.class] ??= { sources: 0, items: 0 });
    t.sources++;
    t.items += n;
  }
  const dates = [...items.values()].map((i) => i.created_utc).filter(Boolean) as number[];
  const ownerYears = [...ownerVoices].map((id) => year(items.get(id)?.created_utc)).filter(Boolean) as number[];
  const strong = ownerVoices.size >= 15 && new Set(stmts.filter((c) => c.first_hand).map((c) => c.source_class)).size >= 3 && ownerYears.length > 0 && Math.max(...ownerYears) - Math.min(...ownerYears) >= 3;

  // ---- retailer ratings as seen (attributed, dated; never schema)
  const ratings = sources
    .filter((s) => s.site_review_count)
    .map((s) => {
      const rs = [...items.values()].filter((i) => i.source_id === s.id && i.rating);
      const dist: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
      rs.forEach((r) => dist[String(r.rating)]++);
      return { retailer: new URL(s.url).hostname.replace(/^www\./, ""), url: s.url, pageRating: s.site_rating, pageCount: s.site_review_count, fetched: new Date(s.last_fetched).toLocaleDateString("en-CA"), distribution: dist, lowRated: dist["1"] + dist["2"] + dist["3"] };
    });

  // ---- sibling differences
  const SIB: [RegExp, string][] = [[/18\s*-?\s*q?v?p|haruka|qvp|tl-?18/i, "TL-18QVP"], [/2000/i, "TL-2000Qi"], [/tl-?15\b/i, "TL-15"]];
  const FEATURE: [RegExp, string][] = [
    [/float|micro/i, "Micro-lift (float)"],
    [/led|light/i, "LED lighting"],
    [/mount|attach/i, "Mounting plate"],
    [/sub.?tension|pre.?tension|tension disc|tension knob|tensioner/i, "Sub-tension unit"],
    [/speed/i, "Speed slider"],
    [/feet|foot|hemm|zipper/i, "Included feet"],
    [/price|\$|cost/i, "Price"],
    [/weight|lbs/i, "Weight"],
    [/throat/i, "Throat space"],
  ];
  const diffs = claims.filter((c) => c.type === "difference");
  const sib = new Map<string, Map<string, any[]>>();
  for (const d of diffs) {
    const other = SIB.find(([re]) => re.test(`${d.model_a} ${d.model_b}`) && !/2010/i.test(String(d.model_b).replace(/.*vs.*/, "")))?.[1] ?? SIB.find(([re]) => re.test(String(d.model_b)))?.[1];
    if (!other) continue;
    const text = `${d.field}`;
    const feats = FEATURE.filter(([re]) => re.test(text)).map(([, f]) => f);
    for (const f of feats.length ? feats : ["Other"]) {
      const m = sib.get(other) ?? new Map();
      m.set(f, [...(m.get(f) ?? []), d]);
      sib.set(other, m);
    }
  }
  const siblings = [...sib.entries()].map(([model, m]) => ({
    model,
    rows: [...m.entries()]
      .filter(([f]) => f !== "Other" && editor.siblingSummaries?.[model]?.[f])
      .map(([feature, rows]) => ({
        feature,
        urls: new Set(rows.map((r) => r.url.replace(/#.*/, "").replace(/\/comment\/.*/, ""))).size,
        classes: [...new Set(rows.map((r) => r.source_class))].sort(),
        summary: editor.siblingSummaries[model][feature].summary,
        check: editor.siblingSummaries[model][feature].check,
        examples: rows.slice(0, 3).map((r) => ({ claim_id: r.claim_id, claim: r.claim, quote: r.quote, url: r.url })),
        claimIds: rows.map((r) => r.claim_id),
      }))
      .sort((x, y) => y.urls - x.urls),
  }));

  // ---- rivals (comparison claims)
  const RIV: [RegExp, string][] = [[/hd-?9/i, "Janome HD9"], [/pq-?1[56]00/i, "Brother PQ1500SL"], [/bernina|bernette/i, "Bernina"], [/sailrite|ultrafeed/i, "Sailrite Ultrafeed"], [/jazz/i, "Baby Lock Jazz II"], [/pfaff/i, "Pfaff"], [/brother/i, "Brother (other models)"], [/singer/i, "Singer"], [/8700|ddl/i, "Juki DDL-8700"]];
  const cmp = claims.filter((c) => c.type === "comparison");
  const rv = new Map<string, any[]>();
  for (const c of cmp) {
    const k = RIV.find(([re]) => re.test(c.other_model))?.[1];
    if (k) rv.set(k, [...(rv.get(k) ?? []), c]);
  }
  const tally = (rows: any[]) => [...rows.reduce((m: Map<string, number>, r) => m.set(r.dimension.toLowerCase().trim(), (m.get(r.dimension.toLowerCase().trim()) ?? 0) + 1), new Map()).entries()].sort((x, y) => y[1] - x[1]).slice(0, 4).map(([dimension, n]) => ({ dimension, n }));
  const rivals = [...rv.entries()]
    .map(([model, rows]) => {
      const cats = ["this", "other"].map((k) => ({ k, rows: rows.filter((r) => r.favors === k) })).filter((c) => c.rows.length).sort((x, y) => y.rows.length - x.rows.length);
      return {
        model,
        claims: rows.length,
        sources: new Set(rows.map((r) => srcOf(r.item_id))).size,
        favors: { this: rows.filter((r) => r.favors === "this").length, other: rows.filter((r) => r.favors === "other").length, mixed: rows.filter((r) => ["mixed", "neither"].includes(r.favors)).length },
        dimensions: { this: tally(rows.filter((r) => r.favors === "this")), other: tally(rows.filter((r) => r.favors === "other")) },
        examples: cats.map((c) => {
          const r = [...c.rows].sort((x, y) => Number(y.first_hand) - Number(x.first_hand) || x.quote.length - y.quote.length)[0];
          return { claim_id: r.claim_id, dimension: r.dimension, favors: r.favors, claim: r.claim, quote: r.quote, url: r.url };
        }),
        claimIds: rows.map((r) => r.claim_id),
      };
    })
    .filter((r) => r.claims >= 4 && r.sources >= 3)
    .sort((x, y) => y.claims - x.claims);

  // ---- manufacturer vs dealers (curated rows in manufacturer.json: facts[].site)
  const documentChecks = manufacturer.facts.filter((f: any) => f.site).map((f: any) => ({ ...f.site, field: f.field, source: f.source }));

  const out: any = {
    slug,
    status: "draft",
    reviewedBy: null,
    reviewedOn: null,
    generated: new Date().toLocaleDateString("en-CA"), // local date, like the site's lastUpdated stamps
    method: {
      sources: sources.filter((s) => s.status === "ok").length,
      itemsCollected: items.size,
      statements: stmts.length,
      voices: allVoices.size,
      ownerVoices: ownerVoices.size,
      dateRange: dates.length ? [year(Math.min(...dates)), year(Math.max(...dates))] : null,
      byClass: classTally,
      blocked: sources.filter((s) => s.status === "blocked").length,
      evidence: strong ? "strong" : ownerVoices.size >= 5 ? "moderate" : "thin",
      thresholds: "strong = at least 15 owner voices, 3 source classes and a 3 year span; recurring theme = at least 5 voices from 3 sources in 2 source classes",
    },
    notes: editor.notes,
    themes,
    ratings,
    documentChecks,
    siblings,
    rivals,
  };
  const outFile = path.join(DIR, "rollup.json");
  if (fs.existsSync(outFile)) {
    const prev = JSON.parse(fs.readFileSync(outFile, "utf8"));
    const same = (x: any) => JSON.stringify({ t: x.themes, s: x.siblings, r: x.rivals, m: x.method, d: x.documentChecks, g: x.ratings });
    if (prev.status === "approved" && same(prev) === same(out)) Object.assign(out, { status: "approved", reviewedBy: prev.reviewedBy, reviewedOn: prev.reviewedOn });
    else if (prev.status === "approved") console.log("counts changed: approval dropped, set status again after review");
  }
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + "\n");
  console.log(`rollup: ${themes.length} themes, ${stmts.length} statements, ${allVoices.size} voices (${ownerVoices.size} owner), evidence ${out.method.evidence}, status ${out.status}`);
}

if (mode === "check") {
  const ids = new Set(claimsAll().map((c) => c.claim_id));
  const roll = JSON.parse(fs.readFileSync(path.join(DIR, "rollup.json"), "utf8"));
  let bad = 0;
  const chk = (id: string, where: string) => {
    if (!ids.has(id)) {
      console.error(`missing claim ${id} in ${where}`);
      bad++;
    }
  };
  roll.themes.forEach((t: any) => [...t.claimIds, ...t.examples.map((e: any) => e.claim_id)].forEach((id: string) => chk(id, `theme ${t.theme}`)));
  roll.siblings.forEach((s: any) => s.rows.forEach((r: any) => [...r.claimIds, ...r.examples.map((e: any) => e.claim_id)].forEach((id: string) => chk(id, `sibling ${s.model}`))));
  roll.rivals.forEach((r: any) => [...r.claimIds, ...r.examples.map((e: any) => e.claim_id)].forEach((id: string) => chk(id, `rival ${r.model}`)));
  console.log(bad ? `FAILED: ${bad} dangling claim ids` : "rollup check ok: every referenced claim exists");
  process.exit(bad ? 1 : 0);
}
