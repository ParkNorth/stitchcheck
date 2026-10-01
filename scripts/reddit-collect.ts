#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any -- Reddit API JSON is untyped */
/**
 * Reddit collector for the collect-reviews skill.
 *
 * Reads data/reviews/{slug}/queries.json (reddit.searches, reddit.subreddits),
 * searches Reddit via the official API (app-only OAuth), and upserts threads and
 * comments into sources.json and items.jsonl in the same folder. A per-thread
 * `cursor_utc` makes reruns incremental: only comments newer than the cursor are
 * added. Nothing is scored or summarised here; classification is a later stage.
 *
 *   npm run collect:reddit -- --slug juki-tl-2010q
 *   npm run collect:reddit -- --slug juki-tl-2010q --dry          # list threads, write nothing
 *   npm run collect:reddit -- --slug juki-tl-2010q --max-threads 40
 *   npm run collect:reddit -- --slug juki-tl-2010q --thread 1lf3gp8,18kzcgc   # add specific threads by id
 *
 * Env (from .env.local, gitignored): REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USER_AGENT.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const opt = (n: string) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const slug = opt("--slug");
const DRY = args.includes("--dry");
const THREADS = (opt("--thread") ?? "").split(",").filter(Boolean);
const MAX_THREADS = Number(opt("--max-threads") ?? 60);
if (!slug) {
  console.error("usage: reddit-collect.ts --slug <slug> [--dry] [--max-threads N]");
  process.exit(1);
}

const DIR = path.join(ROOT, "data", "reviews", slug);
const envFile = path.join(ROOT, ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}
const { REDDIT_CLIENT_ID: ID, REDDIT_CLIENT_SECRET: SECRET } = process.env;
const UA = process.env.REDDIT_USER_AGENT ?? "stitchcheck-reviews/0.1";
if (!ID || !SECRET) {
  console.error("Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in .env.local");
  process.exit(1);
}

type Source = {
  id: string;
  url: string;
  class: "reddit";
  method: "reddit-api";
  title: string;
  subreddit: string;
  thread_id: string;
  first_seen: string;
  last_fetched: string;
  status: "ok" | "dead" | "thin";
  cursor_utc: number;
  discovered_by: string[];
  content_hash: string;
};
type Item = {
  id: string;
  source_id: string;
  url: string;
  kind: "post" | "comment";
  author_type: "unknown";
  created_utc: number;
  score: number;
  classified: null;
};

const readJson = <T>(f: string, fallback: T): T =>
  fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf8")) as T) : fallback;
const queries = readJson<{ reddit?: { searches: string[]; subreddits: string[] } }>(path.join(DIR, "queries.json"), {});
if (!queries.reddit) {
  console.error(`No reddit block in ${path.relative(ROOT, path.join(DIR, "queries.json"))}`);
  process.exit(1);
}
const sources = readJson<Source[]>(path.join(DIR, "sources.json"), []);
const itemsFile = path.join(DIR, "items.jsonl");
const items: Item[] = fs.existsSync(itemsFile)
  ? fs.readFileSync(itemsFile, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l))
  : [];
// Raw text is kept out of git (rights, size): data/reviews/{slug}/raw.jsonl is gitignored.
const rawFile = path.join(DIR, "raw.jsonl");
const raw = new Map<string, string>();
const haveItem = new Set(items.map((i) => i.id));
const bySource = new Map(sources.map((s) => [s.id, s]));

let token = "";
let tokenAt = 0;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function auth() {
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${ID}:${SECRET}`).toString("base64"),
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`reddit auth ${res.status}`);
  token = ((await res.json()) as { access_token: string }).access_token;
  tokenAt = Date.now();
}
async function api(p: string): Promise<any> {
  if (!token || Date.now() - tokenAt > 20 * 3600_000) await auth();
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`https://oauth.reddit.com${p}`, { headers: { Authorization: `bearer ${token}`, "User-Agent": UA } });
    const left = Number(res.headers.get("x-ratelimit-remaining") ?? 100);
    if (res.status === 429 || left < 2) {
      await sleep(Number(res.headers.get("x-ratelimit-reset") ?? 10) * 1000 + 500);
      if (res.status === 429) continue;
    }
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`reddit ${res.status} ${p}`);
    await sleep(700);
    return res.json();
  }
  throw new Error(`reddit gave up ${p}`);
}

const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
const now = new Date().toISOString();

// A thread must name this exact model (rule 9). Names come from the spec model plus `model_names` in
// queries.json. Each is matched on a word boundary with a suffix guard, so "1034D" does not match
// "1034DX" and "TL-2010Q" does not match "TL-2010Qi".
const spec = readJson<{ model: string }>(path.join(ROOT, "data", "specs", `${slug}.json`), { model: "" });
const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const namePatterns = [...new Set([spec.model, ...((queries as any).model_names ?? [])])]
  .filter(Boolean)
  .map((n) => n.toLowerCase().split(/[\s-]+/).filter(Boolean).map(esc).join("[\\s-]*"))
  .map((body) => new RegExp(`(^|[^a-z0-9])${body}(?![a-z0-9])`, "i"));
const mentionsModel = (t: string) => namePatterns.some((re) => re.test(t));

type Found = { id: string; comments?: number; permalink: string; title: string; subreddit: string; selftext: string; created_utc: number; score: number; by: string };
async function discover(): Promise<Map<string, Found>> {
  const found = new Map<string, Found>();
  if (THREADS.length) {
    for (const id of THREADS) {
      const d = (await api(`/comments/${id}?limit=1`))?.[0]?.data?.children?.[0]?.data;
      if (d) found.set(d.id, { id: d.id, permalink: d.permalink, title: d.title, subreddit: d.subreddit, selftext: d.selftext ?? "", created_utc: d.created_utc, score: d.score, by: "manual-thread" });
    }
    return found;
  }
  const r = queries.reddit!;
  const jobs: { path: string; by: string }[] = [];
  for (const q of r.searches) {
    jobs.push({ path: `/search?q=${encodeURIComponent(q)}&sort=relevance&t=all&limit=50&type=link`, by: `all:${q}` });
    for (const sub of r.subreddits) {
      jobs.push({ path: `/r/${sub}/search?q=${encodeURIComponent(q)}&restrict_sr=1&sort=relevance&t=all&limit=50`, by: `r/${sub}:${q}` });
    }
  }
  for (const j of jobs) {
    const data = await api(j.path);
    for (const c of data?.data?.children ?? []) {
      const d = c.data;
      if (!mentionsModel(`${d.title} ${d.selftext}`)) continue;
      const f = found.get(d.id);
      if (f) f.by += `; ${j.by}`;
      else found.set(d.id, { comments: d.num_comments, id: d.id, permalink: d.permalink, title: d.title, subreddit: d.subreddit, selftext: d.selftext ?? "", created_utc: d.created_utc, score: d.score, by: j.by });
    }
  }
  return found;
}

function flatten(children: any[], out: any[] = []) {
  for (const c of children) {
    if (c.kind === "t1") {
      out.push(c.data);
      if (c.data.replies?.data?.children) flatten(c.data.replies.data.children, out);
    }
  }
  return out;
}

async function main() {
  const found = await discover();
  // Rank by evidence value, not popularity: model in the title first, then discussion size. Viral project
  // posts that only mention the machine in passing have a high score but few relevant comments.
  const inTitle = (t: Found) => (mentionsModel(t.title) ? 1 : 0);
  const threads = [...found.values()].filter((t) => (t.comments ?? 0) >= 2 || inTitle(t)).sort((a, b) => inTitle(b) - inTitle(a) || (b.comments ?? 0) - (a.comments ?? 0)).slice(0, MAX_THREADS);
  console.log(`threads mentioning ${spec.model}: ${found.size} found, taking ${threads.length}`);
  if (DRY) {
    for (const t of threads) console.log(`  ${t.comments}c\t${inTitle(t)}\tr/${t.subreddit}\t${t.title.slice(0, 90)}`);
    return;
  }
  let newItems = 0;
  for (const t of threads) {
    const sid = `reddit:${t.id}`;
    const existing = bySource.get(sid);
    const cursor = existing?.cursor_utc ?? 0;
    const data = await api(`/comments/${t.id}?limit=500&depth=10&sort=old`);
    if (!data) {
      if (existing) existing.status = "dead";
      continue;
    }
    const comments = flatten(data[1]?.data?.children ?? []);
    const fresh: Item[] = [];
    const push = (i: Item & { text: string }) => {
      if (!haveItem.has(i.id) && i.text.trim() && i.text !== "[deleted]" && i.text !== "[removed]") {
        const { text, ...meta } = i;
        raw.set(i.id, text);
        fresh.push(meta);
        haveItem.add(i.id);
      }
    };
    if (!existing) {
      push({ id: `${sid}:post`, source_id: sid, url: `https://www.reddit.com${t.permalink}`, kind: "post", author_type: "unknown", created_utc: t.created_utc, score: t.score, text: `${t.title}\n\n${t.selftext}`.trim(), classified: null });
    }
    for (const c of comments) {
      if (c.created_utc <= cursor) continue;
      push({ id: `${sid}:${c.id}`, source_id: sid, url: `https://www.reddit.com${c.permalink}`, kind: "comment", author_type: "unknown", created_utc: c.created_utc, score: c.score, text: c.body ?? "", classified: null });
    }
    const maxUtc = Math.max(cursor, t.created_utc, ...comments.map((c) => c.created_utc));
    const row: Source = {
      id: sid,
      url: `https://www.reddit.com${t.permalink}`,
      class: "reddit",
      method: "reddit-api",
      title: t.title,
      subreddit: t.subreddit,
      thread_id: t.id,
      first_seen: existing?.first_seen ?? now,
      last_fetched: now,
      status: fresh.length + (existing ? 1 : 0) < 2 && comments.length === 0 ? "thin" : "ok",
      cursor_utc: maxUtc,
      discovered_by: [...new Set([...(existing?.discovered_by ?? []), ...t.by.split("; ")])],
      content_hash: sha(JSON.stringify(comments.map((c) => [c.id, c.body]))),
    };
    bySource.set(sid, row);
    items.push(...fresh);
    newItems += fresh.length;
    console.log(`  ${sid} r/${t.subreddit} +${fresh.length}`);
  }
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(path.join(DIR, "sources.json"), JSON.stringify([...bySource.values()], null, 2) + "\n");
  fs.writeFileSync(itemsFile, items.map((i) => JSON.stringify(i)).join("\n") + "\n");
  fs.appendFileSync(rawFile, [...raw].map(([id, text]) => JSON.stringify({ id, text })).join("\n") + (raw.size ? "\n" : ""));
  console.log(`done: ${bySource.size} reddit sources, ${newItems} new items, ${items.length} total`);
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
