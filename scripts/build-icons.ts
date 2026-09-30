#!/usr/bin/env tsx
/**
 * Render the favicon set from public/icon.svg (the source of truth) into
 * public/: favicon.ico (16, 32, 48), icon-192.png, apple-touch-icon.png (180).
 * The tile is full-bleed with the mark inside the centre circle, because
 * Google Search crops favicons to a circle and Apple rounds the corners.
 * Commit the output: the deploy runner has no browser.
 *
 *   npm run build:icons
 *   PW_CHROMIUM=/path/to/chrome npm run build:icons   (when playwright's own build is missing)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const PUBLIC = path.resolve(__dirname, "..", "public");
const svg = fs.readFileSync(path.join(PUBLIC, "icon.svg"), "utf8");

async function main() {
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const page = await browser.newPage();
  const png = async (size: number): Promise<Buffer> => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<!doctype html><style>*{margin:0}html,body{width:${size}px;height:${size}px;overflow:hidden}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
    );
    return page.screenshot({ type: "png", clip: { x: 0, y: 0, width: size, height: size } });
  };

  fs.writeFileSync(path.join(PUBLIC, "icon-192.png"), await png(192));
  fs.writeFileSync(path.join(PUBLIC, "apple-touch-icon.png"), await png(180));

  // PNG-in-ICO: a 6-byte header, one 16-byte directory entry per image, then the PNGs.
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(png));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((size, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size, 0);
    e.writeUInt8(size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(images[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += images[i].length;
    return e;
  });
  fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), Buffer.concat([header, ...entries, ...images]));

  await browser.close();
  console.log("wrote favicon.ico, icon-192.png, apple-touch-icon.png");
}

main();
