#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows and spec files are loose JSON */
/**
 * Draft, validate and (after sign-off) apply the page edits for one model.
 *
 *   npm run reviews:draft -- prep  --slug X   # writes data/reviews/X/draft-page/inputs.json: everything a drafting agent needs
 *   npm run reviews:draft -- check --slug X   # validates the drafts, writes draft-page/check.json
 *   npm run reviews:draft -- apply --slug X   # applies them to data/specs, products.ts, comparisons.ts; needs a human sign-off
 *
 * The drafting agent (see .claude/skills/collect-reviews/draft-prompt.md) writes three files in draft-page/:
 *   spec.json      { specs, conflicts, claims, evidence, price, sources, editorial }  -> merged into data/specs/{slug}.json
 *   site.json      { verdict, reason, specsVerified, lastUpdated, buy, alternativeNotes } -> the model's siteFields in src/lib/products.ts
 *   compares.json  [{ slug, description, summary, buyIf: {slug: text}, lastUpdated }]  -> entries in src/lib/comparisons.ts
 * Scheduled runs stop after `check`. `apply` refuses without a sign-off in data/reviews/_plan.json (reviews:plan signoff),
 * then also sets the rollup to approved, recording the sign-off, and rebuilds the catalog.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const a = process.argv.slice(2);
const cmd = a[0];
const slug = a[a.indexOf("--slug") + 1];
if (!["prep", "check", "apply"].includes(cmd) || !slug) throw new Error("usage: reviews-draft.ts prep|check|apply --slug <slug>");
const ROOT = path.resolve(__dirname, "..");
const D = path.join(ROOT, "data", "reviews", slug);
const DP = path.join(D, "draft-page");
const SPEC = path.join(ROOT, "data", "specs", `${slug}.json`);
const PRODUCTS = path.join(ROOT, "src", "lib", "products.ts");
const COMPARES = path.join(ROOT, "src", "lib", "comparisons.ts");
const readJson = (f: string, fb: any = null) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : fb);
const today = new Date().toLocaleDateString("en-CA");

// ---- source-file helpers (products.ts and comparisons.ts are hand-edited TypeScript; edits are targeted and re-typechecked)
function productBlock(src: string) {
  const start = src.indexOf(`\n  "${slug}": {`);
  if (start < 0) throw new Error(`no siteFields block for ${slug} in products.ts`);
  const end = src.indexOf("\n  },", start) + "\n  },".length;
  return { start: start + 1, end, text: src.slice(start + 1, end) };
}
function compareBlock(src: string, cslug: string) {
  const at = src.indexOf(`    slug: "${cslug}",`);
  if (at < 0) throw new Error(`no comparison ${cslug} in comparisons.ts`);
  const start = src.lastIndexOf("\n  {", at) + 1;
  const end = src.indexOf("\n  },", at) + "\n  },".length;
  return { start, end, text: src.slice(start, end) };
}
const STR = '"(?:[^"\\\\]|\\\\.)*"';
function setKey(block: string, key: string, literal: string) {
  const one = new RegExp(`^(    ${key}:) [^\\n]*,$`, "m");
  const two = new RegExp(`^(    ${key}:)\\n      ${STR},$`, "m");
  if (two.test(block)) return block.replace(two, (_m, k) => `${k}\n      ${literal},`);
  if (one.test(block)) return block.replace(one, (_m, k) => `${k} ${literal},`);
  return block.replace(/\n  \},$/, `\n    ${key}: ${literal},\n  },`);
}
const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------------------------------------------------------------------------------------------- prep
if (cmd === "prep") {
  const spec = readJson(SPEC);
  const roll = readJson(path.join(D, "rollup.json"));
  const man = readJson(path.join(D, "manufacturer.json"));
  const checks = readJson(path.join(D, "checks.json"));
  const ed = readJson(path.join(D, "editor.json"));
  const src = fs.readFileSync(PRODUCTS, "utf8");
  const cmpSrc = fs.readFileSync(COMPARES, "utf8");
  const cmps = [...cmpSrc.matchAll(/\n  \{\n    slug: "([a-z0-9-]+)",[\s\S]*?\n  \},/g)].filter((m) => m[0].includes(`"${slug}"`)).map((m) => m[0]);
  const inputs = {
    slug,
    today,
    rules: "AGENTS.md rules 1 to 12 apply: spec-check not field-test, owner evidence labelled, paraphrase and attribute, no em or en dashes, never invent a spec, claims quoted not asserted, every spec sourced, model name is not a spec, conflicts listed, price bands not live prices.",
    spec,
    manufacturer: man ? { documents: man.documents, facts: man.facts } : null,
    rollup: roll && {
      status: roll.status,
      method: roll.method,
      ownerNote: roll.ownerNote,
      notes: roll.notes,
      ratings: roll.ratings,
      themes: roll.themes.filter((t: any) => t.theme !== "other" && t.voices >= 5).map((t: any) => ({ label: t.label, voices: t.voices, ownerVoices: t.ownerVoices, sources: t.sources, polarity: t.polarity, classVoices: t.classVoices, recurrence: t.recurrence, examples: t.examples.map((e: any) => ({ polarity: e.polarity, claim: e.claim, url: e.url })) })),
      siblings: roll.siblings.map((s: any) => ({ label: s.label, rows: s.rows.map((r: any) => ({ feature: r.feature, summary: r.summary, check: r.check })) })),
      rivals: roll.rivals.map((r: any) => ({ model: r.model, claims: r.claims, favors: r.favors, dimensions: r.dimensions })),
    },
    checks: checks?.items?.filter((i: any) => i.level !== "info") ?? [],
    editorNotes: ed && { notes: ed.notes, ownerNote: ed.ownerNote },
    siteFieldsNow: productBlock(src).text,
    comparesNow: cmps,
  };
  fs.mkdirSync(DP, { recursive: true });
  fs.writeFileSync(path.join(DP, "inputs.json"), JSON.stringify(inputs, null, 2) + "\n");
  console.log(`wrote draft-page/inputs.json (${Math.round(JSON.stringify(inputs).length / 1024)} KB). Draft spec.json, site.json and compares.json next (draft-prompt.md).`);
}

// ---------------------------------------------------------------------------------------------- check
if (cmd === "check") {
  const items: { level: string; message: string }[] = [];
  const add = (level: string, message: string) => items.push({ level, message });
  const spec = readJson(path.join(DP, "spec.json"));
  const site = readJson(path.join(DP, "site.json"));
  const cmps = readJson(path.join(DP, "compares.json"), []);
  const inputs = readJson(path.join(DP, "inputs.json"));
  if (!spec) add("error", "draft-page/spec.json missing");
  if (!site) add("error", "draft-page/site.json missing");
  if (!inputs) add("error", "draft-page/inputs.json missing: run prep");
  const all = JSON.stringify({ spec, site, cmps });
  if (/[–—]/.test(all)) add("error", "en or em dash in draft copy (rule 4)");
  if (/\b(we|our team)\b[^.]{0,40}\b(tested|sewed|operated|tried)\b|in our hands|hands-on|we have sewn/i.test(all)) add("error", "draft claims hands-on use (rule 1)");
  const ed = spec?.editorial;
  if (spec && !ed) add("error", "spec.json has no editorial block");
  if (ed) {
    for (const k of ["verdict", "whoFor", "skipIf", "keySpec"]) if (!String(ed[k] ?? "").trim()) add("error", `editorial.${k} empty`);
    if (!(ed.realCost ?? []).length) add("error", "editorial.realCost needs 1 to 4 items (what the buyer also needs to buy)");
    for (const k of ["strengths", "weaknesses", "checks"]) if ((ed[k] ?? []).length !== 3) add("error", `editorial.${k} needs exactly 3 entries (has ${(ed[k] ?? []).length})`);
    const nf = (ed.faqs ?? []).length;
    if (nf < 6 || nf > 12) add("error", `editorial.faqs needs 6 to 12 entries (has ${nf})`);
    for (const f of ed.faqs ?? []) if (!f.q || !f.a) add("error", "a faq is missing q or a");
    if (String(ed.verdict ?? "").length > 220) add("warn", "verdict is long; one sentence");
  }
  for (const [k, v] of Object.entries<any>(spec?.specs ?? {})) if (v.value !== null && !v.source) add("error", `spec ${k} has a value but no source URL (rule 8)`);
  if (spec && !(spec.conflicts ?? []).length && (inputs?.manufacturer?.facts ?? []).some((f: any) => f.vs_spec === "contradicts")) add("error", "maker documents contradict our specs but draft conflicts is empty (rule 12)");
  const conf = (spec?.conflicts ?? []).join(" ").toLowerCase();
  const ALIAS: Record<string, string[]> = { msrp: ["price"], dimensionsIn: ["dimension", "height", "size"], bed: ["table"], weightLb: ["weight"], stitchWidthMm: ["stitch width"], warrantyUs: ["warranty"], threads: ["thread"], maxSpm: ["speed"], includedFeet: ["feet", "foot"], throatIn: ["throat"], needleSystem: ["needle"] };
  for (const f of inputs?.manufacturer?.facts ?? []) {
    if (f.vs_spec !== "contradicts") continue;
    const words = [...String(f.field).replace(/([A-Z])/g, " $1").toLowerCase().split(/\s+/).filter((w) => w.length > 3), ...(ALIAS[f.field] ?? [])];
    if (!words.some((w) => conf.includes(w))) add("warn", `maker fact "${f.field}" contradicts our spec but no conflict line mentions it`);
  }
  // Every number in the copy should exist somewhere in the evidence we gave the drafter.
  const corpus = JSON.stringify(inputs ?? {}).replace(/,/g, "").toLowerCase();
  const nums = new Set<string>();
  for (const m of JSON.stringify({ ed, site, cmps }).matchAll(/\$?\d[\d,]*(?:\.\d+)?/g)) {
    const raw = m[0].replace(/[$,]/g, "");
    if (raw.replace(".", "").length >= 2 && !/^20\d\d$/.test(raw)) nums.add(raw);
  }
  const unknown = [...nums].filter((n) => !corpus.includes(n.toLowerCase()));
  if (unknown.length) add("warn", `numbers in the copy that are not in the evidence bundle: ${unknown.slice(0, 12).join(", ")}`);
  if (spec?.evidence && inputs?.rollup) {
    const owners = inputs.rollup.method.ownerVoices as number;
    const want = owners >= 15 ? "owner" : owners >= 5 ? "mixed" : "positioning";
    if (spec.evidence !== want) add("warn", `evidence label "${spec.evidence}" but ${owners} first-hand voices suggests "${want}" (rule 2)`);
  }
  for (const f of ["specsVerified", "lastUpdated"]) if (site?.[f] && (!/^\d{4}-\d{2}-\d{2}$/.test(site[f]) || site[f] > today)) add("error", `site.${f} must be a real date not in the future`);
  for (const k of Object.keys(spec?.price ?? {})) if (!["priceSeen", "priceSeenDate", "priceSeenAt"].includes(k)) add("error", `spec.json price has unknown key "${k}" (use priceSeen, priceSeenDate, priceSeenAt)`);
  if (spec?.price?.priceSeenDate && spec.price.priceSeenDate > today) add("error", "priceSeenDate is in the future");
  const cmpSrc = fs.readFileSync(COMPARES, "utf8");
  for (const c of cmps) if (!cmpSrc.includes(`slug: "${c.slug}",`)) add("error", `comparison ${c.slug} does not exist`);
  const out = { slug, generated: new Date().toISOString(), counts: { error: items.filter((i) => i.level === "error").length, warn: items.filter((i) => i.level === "warn").length }, items };
  fs.mkdirSync(DP, { recursive: true });
  fs.writeFileSync(path.join(DP, "check.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(`${slug} draft: ${out.counts.error} error, ${out.counts.warn} warn`);
  for (const i of items) console.log(`  ${i.level.padEnd(5)} ${i.message}`);
  process.exit(out.counts.error ? 1 : 0);
}

// ---------------------------------------------------------------------------------------------- apply
if (cmd === "apply") {
  const plan = readJson(path.join(ROOT, "data", "reviews", "_plan.json"), { signoffs: {} });
  const sign = plan.signoffs?.[slug];
  if (!sign) throw new Error(`${slug} has no sign-off in data/reviews/_plan.json: read the review sheet, then reviews:plan -- signoff`);
  const chk = readJson(path.join(DP, "check.json"));
  if (!chk || chk.counts.error) throw new Error("draft-page/check.json missing or has errors: run reviews:draft -- check and fix");
  const spec = readJson(SPEC);
  const d = readJson(path.join(DP, "spec.json"));
  const site = readJson(path.join(DP, "site.json"));
  const cmps = readJson(path.join(DP, "compares.json"), []);

  // data/specs/{slug}.json
  for (const [k, v] of Object.entries<any>(d.specs ?? {})) spec.specs[k] = { value: v.value ?? null, source: v.source ?? null };
  for (const k of ["conflicts", "claims", "evidence"]) if (d[k] !== undefined) spec[k] = d[k];
  if (d.price) Object.assign(spec, d.price);
  if (d.retailerUrl !== undefined) spec.retailerUrl = d.retailerUrl;
  for (const u of d.sources ?? []) if (!spec.sources.includes(u)) spec.sources.push(u);
  if (d.editorial) spec.editorial = { ...(spec.editorial ?? {}), ...d.editorial };
  fs.writeFileSync(SPEC, JSON.stringify(spec, null, 2) + "\n");

  // src/lib/products.ts siteFields
  let src = fs.readFileSync(PRODUCTS, "utf8");
  const pb = productBlock(src);
  let blk = pb.text;
  for (const k of ["verdict", "reason", "specsVerified", "lastUpdated"]) if (site[k] !== undefined) blk = setKey(blk, k, JSON.stringify(site[k]));
  if (site.buy) blk = setKey(blk, "buy", site.buy.kind === "retailer" ? `{ kind: "retailer", url: ${JSON.stringify(site.buy.url)} }` : site.buy.kind === "dealer" ? `{ kind: "dealer", url: ${JSON.stringify(site.buy.url)}, label: ${JSON.stringify(site.buy.label)} }` : `{ kind: "none" }`);
  for (const [s, note] of Object.entries<string>(site.alternativeNotes ?? {})) {
    const re = new RegExp(`(\\{ slug: "${esc(s)}", label: "[^"]*", note: )${STR}`);
    if (!re.test(blk)) throw new Error(`alternative ${s} not found in ${slug} siteFields`);
    blk = blk.replace(re, (_m, pre) => `${pre}${JSON.stringify(note)}`);
  }
  src = src.slice(0, pb.start) + blk + src.slice(pb.end);
  fs.writeFileSync(PRODUCTS, src);

  // src/lib/comparisons.ts
  let csrc = fs.readFileSync(COMPARES, "utf8");
  for (const c of cmps) {
    const cb = compareBlock(csrc, c.slug);
    let t = cb.text;
    const keyed = (key: string, val: string) => {
      const two = new RegExp(`^(    ${key}:)\\n      ${STR},$`, "m");
      const oneL = new RegExp(`^(    ${key}:) ${STR},$`, "m");
      if (two.test(t)) t = t.replace(two, (_m, k) => `${k}\n      ${JSON.stringify(val)},`);
      else if (oneL.test(t)) t = t.replace(oneL, (_m, k) => `${k} ${JSON.stringify(val)},`);
      else throw new Error(`comparison ${c.slug}: key ${key} not found`);
    };
    if (c.description) keyed("description", c.description);
    if (c.summary) keyed("summary", c.summary);
    for (const [s, text] of Object.entries<string>(c.buyIf ?? {})) {
      const re = new RegExp(`(\\{ slug: "${esc(s)}", text: )${STR}`);
      if (!re.test(t)) throw new Error(`comparison ${c.slug}: buyIf for ${s} not found`);
      t = t.replace(re, (_m, pre) => `${pre}${JSON.stringify(text)}`);
    }
    if (c.lastUpdated) t = t.replace(/lastUpdated: "[^"]*"/, `lastUpdated: ${JSON.stringify(c.lastUpdated)}`);
    csrc = csrc.slice(0, cb.start) + t + csrc.slice(cb.end);
  }
  fs.writeFileSync(COMPARES, csrc);

  // rollup approval follows the sign-off
  const rp = path.join(D, "rollup.json");
  const roll = readJson(rp);
  if (roll) {
    roll.status = "approved";
    roll.reviewedBy = `Claude editor pass, draft applied after human sign-off by ${sign.by}`;
    roll.reviewedOn = today;
    fs.writeFileSync(rp, JSON.stringify(roll, null, 2) + "\n");
  }
  execSync("npm run -s build:catalog && npm run -s check:catalog && npm run -s typecheck", { cwd: ROOT, stdio: "inherit" });
  console.log(`applied ${slug}: spec, site fields, ${cmps.length} comparison(s), rollup approved (sign-off by ${sign.by}). Review the diff, then open the publish PR.`);
}
