# IA and linking

last_updated: 2026-09-29
status: living

This file is the URL and internal-linking contract. `npm run check:catalog` enforces the mechanical bits. Scope and money live in `docs/00-foundations.md`. Editorial rules live in `AGENTS.md`. SEO rules live in `docs/03-seo-rules.md`.

## Registries (source of URLs)

| What | File | Rule |
|---|---|---|
| Models | `src/lib/products.ts` + `src/lib/catalog-data.ts` (generated from `data/specs/`) | Review URL is `/reviews/{slug}`. No hand-written review page. |
| Job hubs | `src/lib/hubs.ts` | One route file per hub under `src/app/{slug}/page.tsx` renders `HubPage`. |
| Brands and series | `src/lib/brands.ts` | `/brands/{brand}` always; `/brands/{brand}/{series}` only where `hasHub: true`. |
| Compares | `src/lib/comparisons.ts` | Exactly two `productSlugs`; three only for `singer-4423-vs-4432-vs-4452`. |
| Guides | `src/lib/guides.ts` | Block-based content; `status: "draft"` keeps a guide noindex and out of the sitemap. |
| Outbound | `src/lib/affiliates.ts` | `/out/{slug}` for retailer buy routes only. |

## URL map

| Section | Path | Role | Audience job |
|---|---|---|---|
| Home | `/` | 3 job paths, machine type picker, one Juki lead, one honest value pick, how-we-check strip | All |
| Job hub 1 | `/best-heavy-duty-sewing-machines` | Heavy duty + industrial-for-home + leather/denim/canvas/upholstery | Considering |
| Job hub 2 | `/best-sergers` | Sergers + coverstitch section (coverstitch is a section, not a 4th hub) | Considering |
| Job hub 3 | `/best-quilting-machines` | Domestic quilting (Juki TL tier) + mid-arm + long-arm | Considering |
| Feeder hub | `/best-sewing-machines-for-beginners` | Not in primary nav; feeds the three above | Considering |
| Brands index | `/brands` | Lineup directory | Comparison shopper |
| Brand hub | `/brands/{juki,janome,brother,singer,babylock,bernina,handi-quilter,grace-company}` | Overview, series decoder, model grid | Comparison shopper |
| Series hub | `/brands/juki/{tl,ddl,mo}`, `/brands/babylock/sergers` (+ Brother PE/SE if embroidery ever comes in scope: it is out) | Same layout, narrower grid | Comparison shopper |
| Reviews index | `/reviews` | All models, filters by type, band, brand | Comparison shopper |
| Review | `/reviews/{slug}` | The money page: verdict box, specs, size, strengths, checks, retailer block, owners, FAQ, alternatives, sticky buy bar | Comparison shopper; owner via alternatives |
| Compare index | `/compare` | Head-to-head directory | Comparison shopper |
| Compare | `/compare/{slug}` | Two products, row winners, summary verdict top and bottom | Comparison shopper |
| Guides index | `/guides` | Guide directory | Considering / unaware |
| Guide | `/guides/{slug}` | Long-form with TOC, definition callouts, inline tables, 2 or 3 CTAs at the end only | Unaware / considering |
| Outbound | `/out/{slug}` | Affiliate mask. Noindex. Robots disallow. Never in the sitemap. | n/a |
| Trust | `/about`, `/privacy`, `/terms` | E-E-A-T + legal | All |
| 404 | `/not-found` | Search + three job links; no top bar | All |
| LLMO | `/llms.txt`, `/llms-full.txt` | AI crawler briefs, `X-Robots-Tag: noindex` | n/a |

Slugs: lowercase kebab-case, `{brand}-{model}` for reviews (`juki-tl-2010q`, `singer-4452`), `{a}-vs-{b}` for compares with the brand dropped on the second side when it repeats (`juki-tl-2010q-vs-tl-2000qi`). Hyphens in model numbers follow the maker (`tl-2010q`, `mo-654de`, `ddl-8700`, `1034d`).

## Internal linking

These are the rules `check:catalog` enforces or the page components guarantee.

1. **Review → brand hub + every job hub it sits in + series hub where one exists.** The breadcrumb and the context line under the H1 carry them. Alternatives (2 or 3) link sibling reviews with a one-word reason ("Cheaper", "Needs zigzag", "Go industrial"). Head-to-heads list every compare the model is in.
2. **Compare → both reviews + one guide.** The related guide is required in the registry. The bottom summary panel repeats the review links.
3. **Guides end with 2 or 3 product CTAs and a "more" link to the hub they feed.** Awareness guides (`awareness: true`) never open with a CTA. Guides link sibling guides in the body.
4. **Hubs** link related guides (3), head-to-heads (1 to 2) and the other two jobs in the sticky aside; every ranked card links its review; the side-by-side table links every review.
5. **Home** links the three hubs, the picker's hub and guide, the lead review, the value pick's review and its compare, and About.
6. **Brand hub** links every series hub and every model review; series hub links back to the brand.
7. **Nav**: Heavy duty, Sergers, Quilting, Brands, Compare, Guides. The feeder hub stays out of primary nav and lives in the footer as "First serious machine".
8. **Footer** carries Jobs, Brands (Juki, Janome, Brother, all), Guides (serger vs sewing machine, thick fabric, long-arm cost, all) and Site.

No orphan pages: every registry entry is reachable from an index page and the sitemap.

## How a new URL gets made

- **Model / review:** research loop writes `data/specs/{slug}.json` and `docs/research/{slug}.md`; run `npm run build:catalog`; add `siteFields[slug]` in `products.ts` (score, scoredFor, alternatives, reason, context, imageAlt, lastUpdated); add the model to the hub(s) in `hubs.ts`. `/reviews/{slug}` renders. No new page file.
- **Compare:** add to `comparisons.ts` with rows and buyIf. Only when the briefing's cross-shop set names the pair with a reason.
- **Guide:** add to `guides.ts` with blocks, CTAs and FAQs. New guides need a keyword row in `docs/research/_keywords.md` and a SERP format note in `_seo-serp-notes.md`.
- **Brand / series:** add to `brands.ts`; a series hub only where the brand has 2 or more models in that series (Juki TL, DDL, MO and Baby Lock sergers are the launch set per the brief).
- **Job hub:** human decision. Do not add a fourth job hub; coverstitch stays a section.

## How this file gets updated

- New URL pattern (new section): add a row to the URL map in the same PR.
- New linking rule: edit the numbered list and the matching check in `scripts/verify-catalog.ts` in the same PR.
- Do not keep a content calendar here; that is `docs/04-content-plan.md` and Linear.
