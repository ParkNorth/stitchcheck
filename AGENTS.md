# Stitch Check editorial constitution

Stitch Check (stitchcheck.com) is an independent, spec-first buying guide for serious home sewing machines: heavy-duty and industrial-for-home, sergers and coverstitch, quilting up to long-arm. Every page is a spec check against manufacturer data, cross-checked at the retailer, scored for the job. Nothing here is a field test. These rules are hard rules; each carries its reason in one line. `npm run check:catalog` enforces the mechanical ones.

Read first: `docs/00-foundations.md` (scope, money), `docs/02-ia-and-linking.md` (URLs, linking), `docs/03-seo-rules.md` (on-page and technical SEO), `docs/01-design-system.md` (the visual contract).

## Evidence and voice

1. **Spec-check, not field-test.** We never claim to have operated, sewn on, or tested a machine. Reason: the byline (`src/lib/byline.ts`) and About say so; a hands-on claim would be a fabricated E-E-A-T signal.
2. **Owner evidence carries a label and the label drives chrome.** `evidence` in the research JSON is `owner`, `mixed`, or `positioning`; the review section heading reads "What owners say", "Owner and buyer signals", or "Buyer signals" from it. Reason: no "owners say" heading on a page with no owner evidence.
3. **Paraphrase and attribute forum material by URL; never quote at length or invent a thread.** Reason: owner themes are evidence, not marketing.
4. **No em-dashes or en-dashes in published copy** (use a period, comma, or colon; write ranges as "8.5 to 10 in"). Reason: the shared chrome was scrubbed of the main AI-writing tell, and the validator fails on them.
5. **Workshop, not craft room.** No pastels, florals, "cozy sewing nook". Numbers in mono. One-sentence verdicts. Reason: the design brief and the reader, who has outgrown a beginner machine.

## Numbers

6. **Never invent a spec.** If the manufacturer does not publish it, the value is `null` and renders as `[verify]`. Reason: a plausible guess is indistinguishable from a verified figure once it is on the page.
7. **Manufacturer marketing words are quoted as claims, never stated as fact.** "Heavy Duty" is a Singer series name; "industrial-quality" is a Juki claim. They live under `claims`, not in the spec table. Reason: we cannot verify capability claims.
8. **Every non-null spec has a source URL** in `data/specs/{slug}.json`, and every catalog entry has a briefing in `docs/research/{slug}.md`. `check:catalog` fails otherwise. Reason: a reviewer can audit any figure without redoing the research.
9. **Model name is not a spec.** "TL-2010Q" is not a 20 in arm; "Long-Arm" in a retailer title does not make 8.5 in a long-arm; "1034DX" is not more machine than "1034D". Write the unit check in the briefing. Reason: the most repeated confusion in this category.
10. **Price bands, never live prices, in chrome.** Prices seen are recorded with date and source and shown only in the "Last seen" line. Reason: prices drift weekly; bands do not.
11. **Throat space is needle-to-body, in inches**, and every size diagram uses the same scale. Mid-arm is 16 to 18 in; long-arm 18 in and up; 15 in heads marketed as long-arm are called "entry long-arm on a frame". Reason: throat space decides the quilting tier and the terms are marketed loosely.
12. **Conflicts between sources are listed, not resolved silently.** They render under "Where sources disagree" on the review. Reason: the reader deserves to know which number is soft.

## Affiliate policy

13. **One retailer, one mask.** Every buy link goes through `/out/{slug}` via `BuyButton` with `rel="sponsored nofollow noopener"`. Never hand-write an outbound purchase anchor. Reason: FTC compliance and one place to audit.
14. **While an affiliate program is live (`SHOW_AFFILIATE_LABEL` in `src/lib/affiliates.ts`, false until launch; flip it in the launch commit), the word "affiliate" is never dropped from a buy button**, even at the smallest size; with no program live, buy buttons carry no affiliate chip or line and the disclosure copy must not claim one. Reason: the label must match reality in both directions.
15. **Dealer-only brands (Baby Lock, Bernina) get no buy button and no affiliate relationship**; they link to the maker's dealer locator with `rel="nofollow"`. Never fake a hop. Reason: honesty, and the program does not exist.
16. **Commission never sets the rank.** The value pick is chosen for fit and labelled in brass, one per page. Reason: the About page promises it.

## Pages and components

17. **New pages compose existing shared components only** (`src/components/ui/*`, `compare/*`, `hub/*`, `brand/*`). No inline `<table>` outside the table components, no one-off CSS classes or tokens inside a content run. A genuinely new component need is flagged in the PR. Reason: chrome fixes are one change, many URLs.
18. **Reviews, compares, guides, hubs and brand pages are data-driven.** Add to the registry (`products.ts`, `comparisons.ts`, `guides.ts`, `hubs.ts`, `brands.ts`); do not hand-write a page file. Reason: sitemap, llms.txt, internal links and schema pick registries up automatically.
19. **Internal-linking rules (docs/02):** every review links its brand hub and every job hub it sits in; every compare links both reviews and one guide; guides end with 2 or 3 product CTAs and never open with one; hubs link related guides, head-to-heads and the other jobs. Reason: the hub-and-spoke model is how the site ranks.
20. **Last-modified discipline.** When a page's copy, specs or schema change, set its date stamp to today (`lastUpdated`, `specsVerified`, guide `updated`, compare `lastUpdated`). Never `new Date()` in the sitemap; never a future date; `/out/` never enters the sitemap. Reason: lastmod is a trust signal only if it is true.
21. **Schema and metadata come from the shared helpers** (`src/lib/schema.ts`, `src/lib/seo-meta.ts`) so JSON-LD, OG and the visible page agree. Reason: one place to fix.

## Loop conduct

22. **The research loop writes `data/specs/{slug}.json` and `docs/research/{slug}.md`; the editor writes `siteFields` in `products.ts`.** Run `npm run build:catalog` after any change under `data/specs/`. Reason: provenance stays separate from judgment.
23. **Gates are gates.** `check:catalog`, `typecheck`, `lint`, `build` green before a PR. Reason: a red push costs a cycle.
24. **Corrections ratchet.** When a review corrects a rule, fold it into this file in the same PR. Reason: the mistake cannot recur.

## Tooling map

- Validator: `scripts/verify-catalog.ts` (`npm run check:catalog`).
- Catalog compiler: `scripts/build-catalog.ts` (`npm run build:catalog`).
- Screenshots: `npm run screenshots -- --serve /route ...` (390 and 1280 into `.screenshots/`).
- Product images: `scripts/fetch-images.ts` (`npm run fetch:images`) fills `public/images/products/` and `src/lib/images-manifest.json` from `data/images.json`; process and rights in `docs/07-images.md`.
- Open Graph cards: `scripts/build-og.ts` (`npm run build:og`) renders `public/og/*.png` and `src/lib/og-manifest.json`; re-run after adding a page or changing a title. Commit the PNGs; the deploy runner has no browser.
- Favicons: `public/icon.svg` is the source (full-bleed tile, mark inside the centre circle, since Google crops to a circle); `scripts/build-icons.ts` (`npm run build:icons`) renders `favicon.ico`, `icon-192.png` and `apple-touch-icon.png`. Commit the output; the deploy runner has no browser.
- Research template: `docs/research/_template.md`; JSON schema: `docs/research/_spec-json-schema.md`.
- Keyword data: `docs/research/_keywords.md` (Ahrefs, re-pull monthly).
