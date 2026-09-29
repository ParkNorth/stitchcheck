#!/usr/bin/env tsx
/**
 * Screenshot routes at 390 and 1280 wide (plus a 390 fold crop) into .screenshots/.
 *
 *   npm run screenshots -- --serve /reviews/juki-tl-2010q /compare/juki-tl-2010q-vs-tl-2000qi
 *
 * With --serve it starts `next start` on port 3111 against the last build.
 * Without it, set BASE_URL to a running server.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const serve = args.includes("--serve");
const routes = args.filter((a) => a.startsWith("/"));
if (!routes.length) routes.push("/");
const PORT = 3111;
const base = process.env.BASE_URL ?? `http://localhost:${PORT}`;
const outDir = path.resolve(process.cwd(), ".screenshots");
fs.mkdirSync(outDir, { recursive: true });

async function waitFor(url: string, ms = 60000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status === 404) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not answer at ${url}`);
}

async function main() {
  let server: ReturnType<typeof spawn> | undefined;
  if (serve) {
    server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore" });
    await waitFor(base);
  }
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
  try {
    for (const route of routes) {
      const name = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_");
      for (const [w, h] of [
        [390, 844],
        [1280, 900],
      ]) {
        const page = await browser.newPage({ viewport: { width: w, height: h } });
        await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
        await page.screenshot({ path: path.join(outDir, `${name}@${w}.png`), fullPage: true });
        if (w === 390) await page.screenshot({ path: path.join(outDir, `${name}@${w}-fold.png`), fullPage: false });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 0) console.log(`  overflow ${overflow}px on ${route} @${w}`);
        await page.close();
      }
      console.log(`shot ${route}`);
    }
  } finally {
    await browser.close();
    server?.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
