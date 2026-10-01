#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows are loose JSON */
/**
 * Pipeline plan and status for every catalog model. Nothing is published until a model is complete.
 *
 *   npm run reviews:plan -- init                       # (re)write data/reviews/_plan.json tiers, families, waves
 *   npm run reviews:plan -- status [--tier N]          # one row per model: stages, complete, signoff, published
 *   npm run reviews:plan -- next --tier N [--count K]  # the next K models with an unfinished stage, and the stage
 *   npm run reviews:plan -- tickets [--json]          # per Linear ticket: its models and their real state
 *   npm run reviews:plan -- signoff --slug X --by NAME # human sign-off after reading the review sheet
 *
 * Stages (derived from files, never typed by hand):
 *   maker        manufacturer.json with 4+ facts and a fetched maker document
 *   marketplaces 1+ retailer source with the page's own rating and count (Amazon, Walmart, a dealer)
 *   collected    10+ Reddit threads or 5+ other sources in sources.json, items.jsonl present
 *   claims       claims.jsonl
 *   tags         tags.jsonl
 *   rollup       rollup.json exists
 *   checks       checks.json with no errors (run reviews:checks)
 *   drafted      draft-page/{spec,site}.json exist and reviews:draft check passes (or the rollup is already approved, i.e. applied)
 * complete = every stage true. publishable = complete AND a human sign-off recorded here.
 * published = the rollup is in src/lib/rollup-data.ts on the default branch.
 *
 * Tiers: 0 = every model gets maker + marketplaces (cheap). 1 = full pipeline for high-traffic models.
 * 2 = full pipeline only where the evidence supports it. Scheduled runs stage their work on a branch and
 * open draft PRs; they never merge. Only `publishable` models are proposed for merge.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const a = process.argv.slice(2);
const cmd = a[0];
const val = (n: string) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined);
const ROOT = path.resolve(__dirname, "..");
const PLAN = path.join(ROOT, "data", "reviews", "_plan.json");
const specs: Record<string, any> = Object.fromEntries(
  fs.readdirSync(path.join(ROOT, "data", "specs")).filter((f) => f.endsWith(".json")).map((f) => {
    const d = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "specs", f), "utf8"));
    return [d.slug, d];
  }),
);

const FAMILIES: Record<string, string[]> = {
  "juki-sergers": ["juki-mo-654de", "juki-mo-644d", "juki-mo-1000"],
  "juki-industrial": ["juki-ddl-8700", "juki-ddl-5550", "juki-dnu-1541s"],
  "singer-hd": ["singer-4452", "singer-4432", "singer-4423", "singer-4411", "singer-hd6600c", "singer-hd6700c"],
  "janome-hd": ["janome-hd9", "janome-hd1000", "janome-hd3000", "janome-hd5000"],
  "janome-other": ["janome-mc6650", "janome-8002d", "janome-coverpro-2000cpx"],
  "juki-tl": ["juki-tl-2010q", "juki-tl-2000qi", "juki-tl-18qvp"],
  brother: ["brother-1034d", "brother-1034dx", "brother-st371hd", "brother-1634d", "brother-2340cv", "brother-pq1600s", "brother-cs7000x"],
  babylock: ["babylock-imagine", "babylock-vibrant", "babylock-victory"],
  bernina: ["bernina-1008", "bernina-570-qe", "bernina-l-850"],
  longarm: ["handi-quilter-moxie", "handi-quilter-amara", "handi-quilter-sweet-sixteen", "grace-qnique-15r", "grace-qnique-19x"],
  "singer-sergers": ["singer-14cg754", "singer-14hd854", "singer-14t968dc"],
  "juki-computerized": ["juki-hzl-f600", "juki-hzl-f300"],
};
// Tier 1 by traffic potential (docs/research/_keywords.md), in run order.
const TIER1 = ["juki-mo-654de", "juki-ddl-8700", "singer-4452", "singer-hd6600c", "janome-mc6650", "bernina-1008", "janome-hd9", "babylock-imagine", "janome-hd1000", "singer-4432", "babylock-vibrant", "juki-tl-18qvp"];
const DONE_FULL = ["juki-tl-2010q", "brother-1034d", "brother-1034dx"];
const TIER2 = ["juki-tl-2000qi", "juki-dnu-1541s", "singer-14cg754", "singer-4411", "handi-quilter-moxie", "janome-hd3000", "janome-hd5000", "singer-hd6700c", "juki-hzl-f600", "singer-4423", "brother-st371hd", "handi-quilter-amara", "brother-1634d", "janome-8002d", "juki-mo-1000", "juki-hzl-f300"];

// Linear tickets (project Stitch, team Web Projects) that track each model, so runs can comment as stages finish.
const LINEAR: Record<string, string> = {
  "juki-tl-2010q": "WEB-94", "juki-tl-2000qi": "WEB-95", "juki-ddl-8700": "WEB-96",
  "singer-4423": "WEB-97", "singer-4432": "WEB-97", "singer-4452": "WEB-97",
  "janome-hd3000": "WEB-98", "janome-mc6650": "WEB-99", "brother-st371hd": "WEB-100",
  "brother-1034d": "WEB-105", "brother-1034dx": "WEB-105",
  "juki-mo-654de": "WEB-106", "juki-mo-1000": "WEB-106",
  "brother-2340cv": "WEB-107", "janome-coverpro-2000cpx": "WEB-107", "singer-14t968dc": "WEB-107",
  "babylock-vibrant": "WEB-108", "handi-quilter-moxie": "WEB-113",
  "juki-tl-18qvp": "WEB-114", "brother-pq1600s": "WEB-114", "grace-qnique-15r": "WEB-114", "bernina-570-qe": "WEB-115",
  "janome-hd9": "WEB-127", "janome-hd1000": "WEB-127", "janome-hd5000": "WEB-127", "singer-hd6600c": "WEB-127", "singer-hd6700c": "WEB-127", "singer-4411": "WEB-127", "juki-dnu-1541s": "WEB-127",
  "juki-mo-644d": "WEB-128", "janome-8002d": "WEB-128", "singer-14cg754": "WEB-128", "babylock-imagine": "WEB-128", "brother-1634d": "WEB-128", "bernina-l-850": "WEB-128",
  "juki-hzl-f600": "WEB-129", "juki-hzl-f300": "WEB-129", "handi-quilter-amara": "WEB-129", "handi-quilter-sweet-sixteen": "WEB-129", "bernina-1008": "WEB-129", "brother-cs7000x": "WEB-129",
};

const readJson = (f: string, fb: any) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : fb);
const lines = (f: string) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).length : 0);

function defaultBranchRollups(): Set<string> {
  try {
    const out = execSync("git show origin/claude/pensive-goodall-ren1mc:src/lib/rollup-data.ts", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 26 }).toString();
    return new Set([...out.matchAll(/^  "([a-z0-9-]+)": \{/gm)].map((m) => m[1]));
  } catch {
    return new Set();
  }
}

function stages(slug: string) {
  const d = path.join(ROOT, "data", "reviews", slug);
  const man = readJson(path.join(d, "manufacturer.json"), null);
  const src: any[] = readJson(path.join(d, "sources.json"), []);
  const roll = readJson(path.join(d, "rollup.json"), null);
  const checks = readJson(path.join(d, "checks.json"), null);
  return {
    maker: Boolean(man && (man.facts?.length ?? 0) >= 4 && man.documents?.some((x: any) => x.fetched)),
    marketplaces: src.some((s) => s.class === "retailer" && s.site_review_count) || (DEALER_ONLY.some((b) => slug.startsWith(b)) && /no marketplace listing, dealer-only/.test(fs.existsSync(path.join(d, "run-log.md")) ? fs.readFileSync(path.join(d, "run-log.md"), "utf8") : "")),
    collected: lines(path.join(d, "items.jsonl")) > 0 && (src.filter((s) => s.class === "reddit" && s.status === "ok").length >= 10 || src.filter((s) => s.class !== "reddit" && s.status === "ok").length >= 5),
    claims: lines(path.join(d, "claims.jsonl")) > 0,
    tags: lines(path.join(d, "tags.jsonl")) > 0,
    rollup: Boolean(roll),
    checks: Boolean(checks && !checks.items?.some((i: any) => i.level === "error")),
    drafted: Boolean(
      (roll?.status === "approved" && roll?.reviewedOn) ||
        (fs.existsSync(path.join(d, "draft-page", "spec.json")) && fs.existsSync(path.join(d, "draft-page", "site.json")) && (() => { const c = readJson(path.join(d, "draft-page", "check.json"), null); return Boolean(c && !c.counts?.error); })()),
    ),
  };
}

const DEALER_ONLY = ["babylock-", "bernina-"];
const plan = readJson(PLAN, null) ?? { signoffs: {} };

if (cmd === "init") {
  const famOf: Record<string, string> = {};
  for (const [f, ms] of Object.entries(FAMILIES)) ms.forEach((m) => (famOf[m] = f));
  const out = {
    generated: new Date().toLocaleDateString("en-CA"),
    note: "Tier and wave assignments from traffic potential in docs/research/_keywords.md. Edit by hand; `init` keeps signoffs.",
    families: FAMILIES,
    tiers: { "0": Object.keys(specs).filter((s) => !DONE_FULL.includes(s)), "1": TIER1, "2": TIER2, done: DONE_FULL },
    models: Object.fromEntries(Object.keys(specs).map((s) => [s, { family: famOf[s] ?? null, linear: LINEAR[s] ?? null, tier: DONE_FULL.includes(s) ? "done" : TIER1.includes(s) ? 1 : TIER2.includes(s) ? 2 : 3 }])),
    signoffs: plan.signoffs ?? {},
  };
  fs.writeFileSync(PLAN, JSON.stringify(out, null, 2) + "\n");
  console.log(`wrote ${path.relative(ROOT, PLAN)}: ${Object.keys(specs).length} models`);
}

const rows = () => {
  const pub = defaultBranchRollups();
  return Object.keys(plan.models ?? {}).map((slug) => {
    const st = stages(slug);
    const complete = Object.values(st).every(Boolean);
    const sign = plan.signoffs?.[slug] ?? null;
    return { slug, tier: plan.models[slug].tier, family: plan.models[slug].family, ...st, complete, signoff: sign, publishable: complete && Boolean(sign), published: pub.has(slug) };
  });
};

if (cmd === "status") {
  const t = val("--tier");
  const r = rows().filter((x) => t === undefined || String(x.tier) === t);
  const mark = (b: boolean) => (b ? "x" : ".");
  console.log("slug".padEnd(28), "tier fam".padEnd(22), "maker mkts coll clms tags roll chk drft  complete signoff published");
  for (const x of r) console.log(x.slug.padEnd(28), `${String(x.tier).padEnd(5)}${(x.family ?? "-").padEnd(16)}`, [x.maker, x.marketplaces, x.collected, x.claims, x.tags, x.rollup, x.checks, x.drafted].map((b) => mark(b).padEnd(5)).join(""), mark(x.complete).padEnd(9), mark(Boolean(x.signoff)).padEnd(8), mark(x.published));
  console.log(`\n${r.filter((x) => x.complete).length}/${r.length} complete, ${r.filter((x) => x.publishable).length} publishable, ${r.filter((x) => x.published).length} published`);
}

if (cmd === "tickets") {
  const by: Record<string, any[]> = {};
  for (const r of rows()) {
    const t = plan.models[r.slug].linear ?? "none";
    (by[t] ??= []).push(r);
  }
  const STAGES = ["maker", "marketplaces", "collected", "claims", "tags", "rollup", "checks", "drafted"];
  const out = Object.entries(by).map(([ticket, ms]) => ({
    ticket,
    models: ms.map((m) => ({ slug: m.slug, tier: m.tier, done: STAGES.filter((k) => (m as any)[k]), missing: STAGES.filter((k) => !(m as any)[k]), complete: m.complete, signoff: m.signoff, published: m.published })),
    allPublished: ms.every((m) => m.published),
    allComplete: ms.every((m) => m.complete),
  }));
  if (a.includes("--json")) console.log(JSON.stringify(out, null, 2));
  else for (const t of out) {
    console.log(`${t.ticket}  ${t.allPublished ? "ALL PUBLISHED" : t.allComplete ? "all complete, awaiting sign-off/publish" : "in progress"}`);
    for (const m of t.models) console.log(`    ${m.slug.padEnd(26)} tier ${m.tier}  ${m.published ? "published" : m.complete ? "complete" : `${m.done.length}/8, next: ${m.missing[0]}`}`);
  }
}

if (cmd === "next") {
  const tier = val("--tier");
  const count = Number(val("--count") ?? 1);
  const order = (tier === "0" ? plan.tiers["0"] : tier === "1" ? plan.tiers["1"] : tier === "2" ? plan.tiers["2"] : Object.keys(plan.models).filter((s) => plan.models[s].tier === 3)) as string[];
  const stageOrder = tier === "0" ? ["maker", "marketplaces"] : ["maker", "marketplaces", "collected", "claims", "tags", "rollup", "checks", "drafted"];
  const todo: any[] = [];
  for (const slug of order) {
    const st: any = stages(slug);
    const missing = stageOrder.filter((s) => !st[s]);
    if (missing.length) todo.push({ slug, next_stage: missing[0], missing });
    if (todo.length >= count) break;
  }
  console.log(JSON.stringify(todo, null, 2));
}

if (cmd === "signoff") {
  const slug = val("--slug");
  const by = val("--by");
  if (!slug || !by) throw new Error("need --slug and --by");
  const r = rows().find((x) => x.slug === slug);
  if (!r?.complete) throw new Error(`${slug} is not complete: run status`);
  plan.signoffs = { ...(plan.signoffs ?? {}), [slug]: { by, on: new Date().toLocaleDateString("en-CA") } };
  fs.writeFileSync(PLAN, JSON.stringify(plan, null, 2) + "\n");
  console.log(`signed off ${slug} by ${by}`);
}
