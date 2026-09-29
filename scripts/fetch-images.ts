#!/usr/bin/env tsx
/**
 * Product photos from the manufacturers.
 *
 * data/images.json is the worklist: one row per model with the manufacturer
 * page (`pageUrl`) and, once chosen, the exact image (`imageUrl`). This script
 * fetches each page, ranks its candidate images (og:image, JSON-LD Product
 * image, <img> tags whose src mentions the model number), downloads the best
 * one, fits it on a white 4:3 canvas at 1600x1200, and writes
 * public/images/products/{slug}.jpg plus src/lib/images-manifest.json, which
 * products.ts reads to fill `image`.
 *
 *   npm run fetch:images                 # everything without a file yet
 *   npm run fetch:images -- --dry        # list ranked candidates, download nothing
 *   npm run fetch:images -- --only juki-tl-2010q,singer-4452
 *   npm run fetch:images -- --pick juki-tl-2010q=https://.../tl2010q.jpg   # hand-pick
 *   npm run fetch:images -- --force      # re-download rows that already have a file
 *   npm run fetch:images -- --refit      # re-trim and re-fit files already on disk, no network
 *
 * Needs outbound access to the brand sites. Run it locally or in a session whose
 * network policy allows them. Every pick is recorded with its source URL so it
 * can be audited or replaced.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const flag = (n: string) => args.includes(n);
const opt = (n: string) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const WORKLIST = path.resolve(opt("--worklist") ?? path.join(ROOT, "data", "images.json"));
const OUT_DIR = path.resolve(opt("--out") ?? path.join(ROOT, "public", "images", "products"));
const MANIFEST = path.resolve(opt("--manifest") ?? path.join(ROOT, "src", "lib", "images-manifest.json"));
const PUBLIC_PREFIX = opt("--prefix") ?? "/images/products";
const DRY = flag("--dry");
const FORCE = flag("--force");
const ONLY = new Set((opt("--only") ?? "").split(",").filter(Boolean));
const PICKS = new Map(args.filter((a, i) => args[i - 1] === "--pick").map((a) => a.split(/=(.+)/).slice(0, 2) as [string, string]));

type Row = {
  slug: string;
  brand: string;
  model: string;
  pageUrl: string | null;
  imageUrl: string | null;
  pickedBy: string | null;
  credit: string;
  fetchedAt: string | null;
  note: string | null;
};
type ManifestEntry = { src: string; width: number; height: number; credit: string; sourceUrl: string; pageUrl: string | null };

const UA = "Mozilla/5.0 (compatible; StitchCheckBot/1.0; +https://stitchcheck.com/about)";

async function get(url: string, tries = 3): Promise<Response> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,image/*,*/*" }, redirect: "follow", signal: AbortSignal.timeout(25000) });
      if (r.ok) return r;
      last = new Error(`HTTP ${r.status}`);
      if (r.status < 500 && r.status !== 429) break;
    } catch (e) {
      last = e;
    }
    await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
  }
  throw last instanceof Error ? last : new Error(String(last));
}

const tokens = (model: string) => {
  const flat = model.toLowerCase().replace(/[^a-z0-9]/g, "");
  const parts = model.toLowerCase().split(/[\s/]+/).map((p) => p.replace(/[^a-z0-9]/g, "")).filter((p) => p.length >= 3);
  return Array.from(new Set([flat, ...parts]));
};

const BAD = /logo|icon|sprite|favicon|social|share|banner|badge|flag|payment|placeholder|pixel|\.svg(\?|$)|1x1|blank/i;

export function candidates(html: string, pageUrl: string, model: string): { url: string; score: number; why: string }[] {
  const out: { url: string; score: number; why: string }[] = [];
  const abs = (u: string) => {
    try {
      return new URL(u.trim().replace(/&amp;/g, "&"), pageUrl).toString();
    } catch {
      return null;
    }
  };
  const push = (u: string | null, score: number, why: string) => {
    if (!u || BAD.test(u)) return;
    const hit = out.find((o) => o.url === u);
    if (hit) hit.score = Math.max(hit.score, score) + 5;
    else out.push({ url: u, score, why });
  };
  const toks = tokens(model);
  const mentions = (u: string) => toks.some((t) => u.toLowerCase().replace(/[^a-z0-9]/g, "").includes(t));

  for (const m of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["'][^>]*content=["']([^"']+)["']/gi)) push(abs(m[1]), 70, "og:image");
  for (const m of html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["']/gi)) push(abs(m[1]), 70, "og:image");
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (v: unknown) => {
        if (!v || typeof v !== "object") return;
        const o = v as Record<string, unknown>;
        if (o["@type"] === "Product" || (Array.isArray(o["@type"]) && (o["@type"] as string[]).includes("Product"))) {
          const im = o.image;
          const list = Array.isArray(im) ? im : [im];
          for (const x of list) push(abs(typeof x === "string" ? x : ((x as Record<string, string>)?.url ?? "")), 80, "ld+json Product");
        }
        for (const k of Object.keys(o)) walk(o[k]);
      };
      walk(JSON.parse(m[1]));
    } catch {
      /* ignore malformed */
    }
  }
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = /(?:data-src|data-lazy-src|data-zoom-image|data-large_image|src)=["']([^"']+)["']/i.exec(tag)?.[1];
    const srcset = /(?:data-srcset|srcset)=["']([^"']+)["']/i.exec(tag)?.[1];
    const w = Number(/\bwidth=["']?(\d+)/i.exec(tag)?.[1] ?? 0);
    const alt = /\balt=["']([^"']*)["']/i.exec(tag)?.[1] ?? "";
    let best = src;
    if (srcset) {
      const parts = srcset.split(",").map((s) => s.trim().split(/\s+/)).map(([u, d]) => ({ u, n: Number((d ?? "0").replace(/[^0-9.]/g, "")) || 0 }));
      parts.sort((a, b) => b.n - a.n);
      if (parts[0]?.u) best = parts[0].u;
    }
    if (!best || best.startsWith("data:")) continue;
    const u = abs(best);
    if (!u) continue;
    let score = 20;
    if (mentions(u)) score += 30;
    if (mentions(alt)) score += 20;
    if (w >= 600) score += 10;
    if (/product|gallery|hero|main|zoom|large|media/i.test(u)) score += 8;
    push(u, score, `img${mentions(u) || mentions(alt) ? " (model match)" : ""}`);
  }
  return out.sort((a, b) => b.score - a.score);
}

/**
 * Trim the maker's white margins, then fit the machine on a white 4:3 canvas
 * with an 8 percent margin. Canvas is 1600x1200 when the source is big enough,
 * otherwise 4:3 at the source's width (never below 800) so small renditions are
 * not upscaled into mush.
 */
export async function fitToCanvas(input: Buffer | string, file: string) {
  const base = sharp(input).rotate().flatten({ background: "#ffffff" });
  let trimmed: Buffer;
  try {
    trimmed = await base.clone().trim({ background: "#ffffff", threshold: 12 }).toBuffer();
  } catch {
    trimmed = await base.clone().toBuffer();
  }
  const tm = await sharp(trimmed).metadata();
  const tw = tm.width ?? 0;
  const th = tm.height ?? 0;
  if (tw < 40 || th < 40) trimmed = await base.clone().toBuffer(); // trim ate the picture: not a white-background shot
  const srcW = (await sharp(trimmed).metadata()).width ?? 800;
  const canvasW = Math.min(1600, Math.max(800, Math.round(srcW / 0.84)));
  const canvasH = Math.round((canvasW * 3) / 4);
  const inner = await sharp(trimmed)
    .resize(Math.round(canvasW * 0.84), Math.round(canvasH * 0.84), { fit: "inside", withoutEnlargement: false })
    .toBuffer();
  await sharp({ create: { width: canvasW, height: canvasH, channels: 3, background: "#ffffff" } })
    .composite([{ input: inner, gravity: "centre" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(file);
}

async function handleRow(row: Row, manifest: Record<string, ManifestEntry>) {
  const file = path.join(OUT_DIR, `${row.slug}.jpg`);
  if (!FORCE && fs.existsSync(file) && manifest[row.slug]) return "kept";
  let imageUrl = PICKS.get(row.slug) ?? row.imageUrl;
  let pickedBy = PICKS.has(row.slug) ? "hand pick" : row.pickedBy;
  if (!imageUrl) {
    if (!row.pageUrl) return "no page url";
    const html = await (await get(row.pageUrl)).text();
    const ranked = candidates(html, row.pageUrl, row.model);
    if (DRY) {
      console.log(`\n${row.slug} (${row.pageUrl})`);
      for (const c of ranked.slice(0, 8)) console.log(`  ${String(c.score).padStart(3)}  ${c.why.padEnd(22)} ${c.url}`);
      return ranked.length ? "listed" : "no candidates";
    }
    if (!ranked.length) return "no candidates";
    imageUrl = ranked[0].url;
    pickedBy = ranked[0].why;
  }
  if (DRY) {
    console.log(`${row.slug}: would fetch ${imageUrl}`);
    return "listed";
  }
  const buf = Buffer.from(await (await get(imageUrl)).arrayBuffer());
  const meta = await sharp(buf).metadata();
  if (!meta.width || !meta.height || meta.width < 300) throw new Error(`image too small or unreadable (${meta.width}x${meta.height})`);
  await fitToCanvas(buf, file);
  const outMeta = await sharp(file).metadata();
  row.imageUrl = imageUrl;
  row.pickedBy = pickedBy;
  row.fetchedAt = new Date().toISOString().slice(0, 10);
  manifest[row.slug] = {
    src: `${PUBLIC_PREFIX}/${row.slug}.jpg`,
    width: outMeta.width ?? 1600,
    height: outMeta.height ?? 1200,
    credit: row.credit,
    sourceUrl: imageUrl,
    pageUrl: row.pageUrl,
  };
  return `saved ${outMeta.width}x${outMeta.height} from ${pickedBy}`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const rows: Row[] = JSON.parse(fs.readFileSync(WORKLIST, "utf8"));
  const manifest: Record<string, ManifestEntry> = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
  if (flag("--refit")) {
    // Re-run the trim and fit on files already on disk (no network). Useful after a fit change.
    for (const row of rows) {
      if (ONLY.size && !ONLY.has(row.slug)) continue;
      const file = path.join(OUT_DIR, `${row.slug}.jpg`);
      if (!fs.existsSync(file) || !manifest[row.slug]) continue;
      const tmp = `${file}.tmp.jpg`;
      await fitToCanvas(file, tmp);
      fs.renameSync(tmp, file);
      const m = await sharp(file).metadata();
      manifest[row.slug].width = m.width ?? manifest[row.slug].width;
      manifest[row.slug].height = m.height ?? manifest[row.slug].height;
      console.log(`${row.slug}: refit ${m.width}x${m.height}`);
    }
    fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
    return;
  }
  let ok = 0;
  let failed = 0;
  for (const row of rows) {
    if (ONLY.size && !ONLY.has(row.slug)) continue;
    try {
      const r = await handleRow(row, manifest);
      if (!DRY) console.log(`${row.slug}: ${r}`);
      if (r.startsWith("saved")) ok++;
    } catch (e) {
      failed++;
      row.note = `fetch failed ${new Date().toISOString().slice(0, 10)}: ${(e as Error).message}`;
      console.log(`${row.slug}: FAILED ${(e as Error).message}`);
    }
  }
  if (!DRY) {
    fs.writeFileSync(WORKLIST, `${JSON.stringify(rows, null, 2)}\n`);
    const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
    fs.writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);
    console.log(`\n${ok} saved, ${failed} failed, ${Object.keys(manifest).length} in manifest.`);
  }
  if (failed) process.exitCode = 1;
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
