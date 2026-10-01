#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows are loose JSON */
/**
 * One human review sheet for the models that have a rollup: what the page will say, the checks that fired, and
 * a seeded spot-check list of claims to verify against their sources. The point is a ten minute read per model.
 *
 *   npm run reviews:sheet                          # every model with a rollup -> reports/review-sheet.md
 *   npm run reviews:sheet -- --slug brother-1034dx # one model
 *   npm run reviews:sheet -- --pending             # only complete models without a sign-off
 *
 * After reading, record the decision with `npm run reviews:plan -- signoff --slug X --by NAME`.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const a = process.argv.slice(2);
const ROOT = path.resolve(__dirname, "..");
const readJson = (f: string, fb: any) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : fb);
const jl = (f: string): any[] => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const plan = readJson(path.join(ROOT, "data", "reviews", "_plan.json"), { signoffs: {} });

// Seeded shuffle so the same spot-check list comes back for the same claims.
const pick = <T,>(arr: T[], n: number, seed: string) => {
  const key = (x: any) => crypto.createHash("sha256").update(seed + JSON.stringify(x)).digest("hex");
  return [...arr].sort((x, y) => key(x).localeCompare(key(y))).slice(0, n);
};

const wanted = a.includes("--slug") ? [a[a.indexOf("--slug") + 1]] : fs.readdirSync(path.join(ROOT, "data", "reviews")).filter((f) => !f.startsWith("_") && fs.existsSync(path.join(ROOT, "data", "reviews", f, "rollup.json")));
const out: string[] = [`# Review sheet`, ``, `Generated ${new Date().toLocaleString("en-CA")}. Read each model, tick the boxes, then run \`npm run reviews:plan -- signoff --slug X --by NAME\`.`, ``];
let n = 0;
for (const slug of wanted) {
  const D = path.join(ROOT, "data", "reviews", slug);
  const r = readJson(path.join(D, "rollup.json"), null);
  if (!r) continue;
  const sign = plan.signoffs?.[slug];
  if (a.includes("--pending") && sign) continue;
  const checks = readJson(path.join(D, "checks.json"), null);
  const claims = jl(path.join(D, "claims.jsonl"));
  const m = r.method;
  n++;
  out.push(`## ${slug}`, ``);
  out.push(`- Rollup ${r.status}${r.reviewedBy ? ` (${r.reviewedBy.split("(")[0].trim()}, ${r.reviewedOn})` : ""}. Sign-off: ${sign ? `${sign.by} on ${sign.on}` : "none"}.`);
  out.push(`- Evidence **${m.evidence}**: ${m.voices} voices (${m.ownerVoices} first-hand) from ${m.sources} sources, ${m.dateRange?.join(" to ")}. Mix: ${Object.entries(m.byClass).filter(([, v]: any) => v.sources).map(([k, v]: any) => `${k} ${v.items}`).join(", ")}.`);
  for (const x of r.ratings ?? []) out.push(`- Rating shown: ${x.retailer} ${x.pageRating} from ${x.pageCount}${x.sampled ? ` (sampled: ${x.sampled})` : ""}.`);
  if (r.ownerNote) out.push(`- Owner note: ${r.ownerNote}`);
  if (checks) {
    const flagged = checks.items.filter((i: any) => i.level !== "info");
    out.push(`- Checks: ${checks.counts.error} error, ${checks.counts.warn} warn.${flagged.length ? "" : " Clean."}`);
    for (const i of flagged) out.push(`  - ${i.level}: [${i.id}] ${i.message}`);
  } else out.push(`- Checks: not run yet.`);
  out.push(``, `**What the page shows** (themes with 8+ voices):`, ``);
  for (const t of r.themes.filter((t: any) => t.theme !== "other" && t.voices >= 8)) {
    const neg = t.examples.find((e: any) => e.polarity === "negative");
    const pos = t.examples.find((e: any) => e.polarity === "positive");
    out.push(`- ${t.label}: ${t.voices} voices, ${t.polarity.positive} positive, ${t.polarity.mixed} mixed, ${t.polarity.negative} negative (${Object.entries(t.classVoices ?? {}).map(([k, v]) => `${k} ${v}`).join(", ")})`);
    if (pos) out.push(`  - positive example: ${pos.claim} ${pos.url}`);
    if (neg) out.push(`  - negative example: ${neg.claim} ${neg.url}`);
  }
  out.push(``, `**Sibling and rival blocks:** ${r.siblings.map((s: any) => `${s.label} (${s.rows.length} rows)`).join(", ") || "none"}; rivals ${r.rivals.map((v: any) => v.model).join(", ") || "none"}.`);
  out.push(``, `**Spot-check these claims** (open the link, find the quote, confirm it supports the claim and the scope):`, ``);
  for (const c of pick(claims.filter((c) => c.type === "spec_claim" && c.scope === "this"), 5, slug)) out.push(`- [ ] ${c.claim} — "${c.quote}" ${c.url}`);
  out.push(``, `**Decision:** [ ] numbers look right  [ ] examples fair  [ ] caveats visible  [ ] sign off`, ``, `---`, ``);
}
fs.mkdirSync(path.join(ROOT, "reports"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "reports", "review-sheet.md"), out.join("\n"));
console.log(`wrote reports/review-sheet.md for ${n} model(s)`);
