# Product images

last_updated: 2026-09-29

Product photos come from the manufacturers' own product pages. Each one is chosen, downloaded, normalised to a white 4:3 canvas and recorded with its source so it can be audited or swapped.

## Pipeline

1. `data/images.json` is the worklist: one row per catalog model with `pageUrl` (the manufacturer page from the spec JSON), `imageUrl` (the exact picture once chosen), `pickedBy`, `credit` and `fetchedAt`.
2. `npm run fetch:images -- --dry` fetches every page and prints the ranked candidates: `og:image`, the JSON-LD Product image, and `<img>` tags whose file name or alt text mentions the model number. Logos, icons, social banners and SVGs are excluded.
3. `npm run fetch:images` downloads the top candidate for every row without a file, fits it on a 1600x1200 white canvas (JPEG, quality 82), writes `public/images/products/{slug}.jpg`, and updates `src/lib/images-manifest.json`. `products.ts` reads the manifest to fill `image` and `imageCredit`; `PhotoWell`, the review hero, the cards, the JSON-LD Product node and the Open Graph cards pick it up with no further change.
4. Review the results in the browser. Where the automatic pick is wrong (a lifestyle shot, a bundle, the wrong colourway), re-run with a hand pick: `npm run fetch:images -- --pick {slug}={url} --force`. The manifest records `hand pick`.
5. `npm run build:og` after images change, so the review cards carry the photo.
6. Commit the JPEGs, the worklist and the manifest. The deploy runner does not fetch.

## Source order

1. The manufacturer's product page or press kit. Credit "Photo: {Brand}".
2. When the manufacturer publishes nothing usable (no image, or only a rendition under 300 px), the retailer we link, Sewing Machines Plus, or another authorized dealer's listing of the same model. Credit "Photo: Sewing Machines Plus" (or the dealer's name) and record the listing URL in the row. Decision 2026-09-29: retailer photos are allowed when needed.
3. Never a marketplace seller photo, a review site, or a stock library.

## Where to run it

The fetcher needs outbound access to the brand sites: jukihome.com, jukiquilting.com, juki.com, janome.com, brother-usa.com, singer.com, babylock.com, bernina.com, handiquilter.com, graceframe.com, and whatever image CDN each one serves from. Run it on a laptop, or in a Claude Code cloud session whose environment network access allows those hosts.

## Picking the best shot

- Three-quarter view on white, machine only, no hands, no fabric, no bundle extras.
- The current colourway and SKU (HD9 V2, DDL-5550N, Grace 19X) even when the page title uses the old name; note the difference in the briefing.
- Largest available rendition; the script prefers the biggest `srcset` entry. Anything under 300 px wide is rejected.
- Dealer-only brands (Baby Lock, Bernina) are fine to picture; the buy route stays the dealer locator.

## Rights

These are the manufacturers' marketing images used to identify the product in an independent editorial review, with a visible credit and a recorded source. Where a brand publishes a press or dealer asset kit, prefer that rendition and keep the kit's terms with the row in `data/images.json`. Remove or replace any image on request from the rights holder; the worklist row is the audit trail.
