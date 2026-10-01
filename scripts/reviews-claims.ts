#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- ledger rows are loose JSON */
/**
 * Claim extraction pipeline: spec claims, model comparisons, sibling differences.
 *
 *   npm run reviews:claims -- prep  --slug juki-tl-2010q [--chunk 40]
 *   npm run reviews:claims -- merge --slug juki-tl-2010q
 *
 * prep   keyword-filters reviews (items.jsonl + raw.jsonl) to segments that touch a spec field or
 *        name another machine, writes data/reviews/{slug}/claims-work/in-N.jsonl plus ref.json
 *        (spec values, manufacturer facts, sibling list). Hand each in-N.jsonl to a model with
 *        the prompt in .claude/skills/collect-reviews/claims-prompt.md; it writes out-N.jsonl.
 * merge  validates every out-N.jsonl row (known segment id, enum values, and the quote must appear
 *        verbatim in the source text and be 15 words or fewer) and writes claims.jsonl.
 *        Rows that fail validation go to claims-rejected.jsonl with the reason. Nothing is silently fixed.
 *
 * claims.jsonl (committed: paraphrase plus a <=15 word quote, attributed by item and URL):
 *   {type:"spec_claim", item_id, url, field, stance, scope, first_hand, claim, quote}
 *   {type:"comparison", item_id, url, other_model, dimension, favors, first_hand, claim, quote}
 *   {type:"difference", item_id, url, model_a, model_b, field, a_value, b_value, claim, quote}
 */
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const a = process.argv.slice(2);
const mode = a[0];
const val = (n: string) => a[a.indexOf(n) + 1];
const slug = val("--slug");
const CHUNK = Number(val("--chunk") ?? 40);
if (!slug || !["prep", "merge"].includes(mode)) throw new Error("usage: reviews-claims.ts prep|merge --slug X");
const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "data", "reviews", slug);
const WORK = path.join(DIR, "claims-work");
const read = (f: string): any[] => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);

const FIELDS: Record<string, RegExp> = {
  maxSpm: /\b(speed|spm|fast|1[,.]?500|slider|rabbit|turtle|stitches per minute|slow(ly)?)\b/i,
  throatIn: /\b(throat|harp|arm|work ?(area|space)|8\.5|9 ?(in|inch|")|room|bulky|king|queen|large quilt)\b/i,
  needleSystem: /\b(needle|130\/705|HA ?x?1|size \d\d|thread breakage|skipp)/i,
  presserFootLift: /\b(knee|lifter|clearance|12 ?mm|foot lift|thick|high ?shank|layers?)\b/i,
  threadTrimmer: /\b(trim|cutter|heel|thread cut|snip)/i,
  feedSystem: /\b(feed dogs?|drop feed|free.?motion|fmq|walking foot|even feed|feed)\b/i,
  weightLb: /\b(heav(y|ier)|weigh|lbs?|pounds?|portable|carry|haul|lift it)\b/i,
  dimensionsIn: /\b(table|footprint|cabinet|desk|vibrat|shake|wobble|walk|size of|compact)\b/i,
  includedFeet: /\b(1\/4|1\/5|quarter|hopping|zipper foot|walking foot|even feed|feet|foot)\b/i,
  warrantyUs: /\b(warranty|service|repair|dealer|support|customer service|technician)\b/i,
  motor: /\b(motor|power|punch|torque|stall|denim|leather|canvas|layers|servo|amp|watt)\b/i,
  frame: /\b(metal|aluminum|plastic|sturdy|build|solid|durab|tank|quality)\b/i,
  maintenance: /\b(oil|lubric|clean|lint|maintenance)\b/i,
  tension: /\b(tension|sub.?tension|pre.?tension|bobbin|thread nest|loop)/i,
  stitchTypes: /\b(zig ?zag|button ?hole|straight stitch only|decorative|stretch|serge|overcast)/i,
  lighting: /\b(led|light(s|ing)?|lamp|shadow)\b/i,
  threads: /\b(4.?thread|3.?thread|2.?thread|four thread|three thread|2\/3\/4|overlock|safety stitch|spools?|cones?)\b/i,
  threading: /\b(thread(ing|ed)?|lay.?in|looper|self.?threading|color.?coded|tweezers|retread|nightmare|knot)\b/i,
  differentialFeed: /\b(differential|feed ratio|gathering|stretch(y)?|knits?|ruffl|puckering|wavy|waving|lettuce)\b/i,
  cutting: /\b(blade|knife|trim(ming)?|cutting width|trim trap|cut(s|ting)? (the )?(fabric|seam|edge))\b/i,
  rolledHem: /\b(rolled hem|narrow hem|roll hem|rolled-hem|converter)\b/i,
  noise: /\b(noise|noisy|loud|quiet|hum|purr)\b/i,
  reliability: /\b(break|broke|fail|stopp?ed|froze|freeze|died|defect|lemon|reliab|no (issues|problems)|problem|issue)/i,
};
// Mentions of other machines or brands, plus comparison words. Model-specific names go in editor.json `others`.
const GENERIC_OTHERS =
  /\b(juki|janome|singer|brother|baby ?lock|bernina|bernette|pfaff|elna|husqvarna|viking|tacsew|consew|sailrite|vs\.?|versus|compared?|instead of|rather than|upgrade|better than|worse than|switched|replaced|industrial)\b/i;
const editorFile = path.join(DIR, "editor.json");
const extraOthers: RegExp | null = fs.existsSync(editorFile) && JSON.parse(fs.readFileSync(editorFile, "utf8")).others ? new RegExp(JSON.parse(fs.readFileSync(editorFile, "utf8")).others, "i") : null;
const OTHERS = { test: (t: string) => GENERIC_OTHERS.test(t) || Boolean(extraOthers?.test(t)) };

function loadAll() {
  const items = read(path.join(DIR, "items.jsonl"));
  const raw = new Map<string, string>(read(path.join(DIR, "raw.jsonl")).map((r) => [r.id, r.text]));
  const sources = new Map<string, any>(JSON.parse(fs.readFileSync(path.join(DIR, "sources.json"), "utf8")).map((s: any) => [s.id, s]));
  return { items, raw, sources };
}

if (mode === "prep") {
  const { items, raw, sources } = loadAll();
  const spec = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "specs", `${slug}.json`), "utf8"));
  const queries = fs.existsSync(path.join(DIR, "queries.json")) ? JSON.parse(fs.readFileSync(path.join(DIR, "queries.json"), "utf8")) : {};
  const manufacturer = fs.existsSync(path.join(DIR, "manufacturer.json")) ? JSON.parse(fs.readFileSync(path.join(DIR, "manufacturer.json"), "utf8")) : null;
  fs.rmSync(WORK, { recursive: true, force: true });
  fs.mkdirSync(WORK, { recursive: true });
  const segs: any[] = [];
  for (const it of items) {
    const text = raw.get(it.id);
    if (!text) continue;
    const src = sources.get(it.source_id);
    const base = { item_id: it.id, url: it.url, source_class: src?.class, thread_or_page_title: src?.title, page_kind: it.page_kind ?? null, rating: it.rating ?? null, created_utc: it.created_utc };
    // Pages are split into ~2500 char segments on paragraph breaks; reviews and comments stay whole.
    const parts: string[] = [];
    if (it.kind === "article" && text.length > 2800) {
      let cur = "";
      for (const p of text.split(/\n\s*\n/)) {
        if (cur.length + p.length > 2500 && cur) {
          parts.push(cur);
          cur = "";
        }
        cur += (cur ? "\n\n" : "") + p;
      }
      if (cur) parts.push(cur);
    } else parts.push(text);
    parts.forEach((t, n) => {
      if (t.length < 25) return;
      const fields = Object.entries(FIELDS).filter(([, re]) => re.test(t)).map(([f]) => f);
      const compares = OTHERS.test(t);
      if (!fields.length && !compares) return;
      segs.push({ seg_id: parts.length > 1 ? `${it.id}#${n}` : it.id, ...base, text: t.slice(0, 3500), hints: { fields, compares } });
    });
  }
  const n = Math.ceil(segs.length / CHUNK);
  for (let i = 0; i < n; i++) fs.writeFileSync(path.join(WORK, `in-${i + 1}.jsonl`), segs.slice(i * CHUNK, (i + 1) * CHUNK).map((s) => JSON.stringify(s)).join("\n") + "\n");
  fs.writeFileSync(path.join(WORK, "ref.json"), JSON.stringify({ model: spec.model, specs: Object.fromEntries(Object.entries(spec.specs).map(([k, v]: any) => [k, v.value])), manufacturer, fields: Object.keys(FIELDS), cross_shop: spec.crossShop, model_names: queries.model_names ?? [spec.model], confusable_siblings: queries.confusable_siblings ?? [] }, null, 2));
  console.log(`${segs.length} segments from ${items.length} items -> ${n} chunks of ${CHUNK} in ${path.relative(ROOT, WORK)}`);
}

if (mode === "merge") {
  const { raw } = loadAll();
  const segText = new Map<string, string>();
  const segItem = new Map<string, any>();
  for (const f of fs.readdirSync(WORK).filter((f) => /^in-\d+\.jsonl$/.test(f))) for (const s of read(path.join(WORK, f))) {
      segText.set(s.seg_id, s.text);
      segItem.set(s.seg_id, s);
    }
  const ref = JSON.parse(fs.readFileSync(path.join(WORK, "ref.json"), "utf8"));
  const STANCE = ["confirms", "contradicts", "adds"];
  const SCOPE = ["this", "sibling", "other", "unclear"];
  const FAVORS = ["this", "other", "neither", "mixed"];
  const norm = (s: string) => s.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
  const good: any[] = [];
  const bad: any[] = [];
  for (const f of fs.readdirSync(WORK).filter((f) => /^out-\d+\.jsonl$/.test(f))) {
    for (const r of read(path.join(WORK, f))) {
      const seg = segText.get(r.seg_id);
      const why = (() => {
        if (seg === undefined) return "unknown seg_id";
        if (!r.quote || r.quote.trim().split(/\s+/).length > 15) return "quote missing or over 15 words";
        if (!norm(seg).includes(norm(r.quote).replace(/\.\.\.|…/g, "").trim())) return "quote not found verbatim in source text";
        if (!r.claim || r.claim.split(/\s+/).length > 45) return "claim missing or over 45 words";
        if (r.type === "spec_claim") {
          if (!ref.fields.includes(r.field)) return "unknown field";
          if (!STANCE.includes(r.stance)) return "bad stance";
          if (!SCOPE.includes(r.scope)) return "bad scope";
        } else if (r.type === "comparison") {
          if (!r.other_model || !r.dimension || !FAVORS.includes(r.favors)) return "bad comparison row";
        } else if (r.type === "difference") {
          if (!r.model_a || !r.model_b || !r.field) return "bad difference row";
        } else return "unknown type";
        return null;
      })();
      if (why) bad.push({ ...r, reason: why });
      else {
        const s = segItem.get(r.seg_id);
        const { seg_id, ...rest } = r;
        const item_id = String(seg_id).split("#")[0];
        const claim_id = "c" + crypto.createHash("sha256").update(`${item_id}|${r.type}|${r.field ?? r.other_model}|${r.quote}`).digest("hex").slice(0, 8);
        good.push({ claim_id, ...rest, item_id, url: s.url, source_class: s.source_class, first_hand: !!r.first_hand });
      }
    }
  }
  void raw;
  fs.writeFileSync(path.join(DIR, "claims.jsonl"), good.map((g) => JSON.stringify(g)).join("\n") + "\n");
  fs.writeFileSync(path.join(DIR, "claims-rejected.jsonl"), bad.map((g) => JSON.stringify(g)).join("\n") + (bad.length ? "\n" : ""));
  const by = (k: string) => good.reduce((m: any, g) => ((m[g[k]] = (m[g[k]] ?? 0) + 1), m), {});
  console.log(`accepted ${good.length}, rejected ${bad.length}`, by("type"));
}
