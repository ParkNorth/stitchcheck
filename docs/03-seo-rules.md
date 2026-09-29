# SEO rules

last_updated: 2026-09-29
status: living

The on-page, technical and content-quality rules every URL follows. Written to Google's helpful-content and E-E-A-T guidance and to what the SERP research (`docs/research/_seo-serp-notes.md`) says the top results already do. The "SEO brain" reference the brief points to was not accessible from this session; this file states the standard we apply and should be reconciled with that document when it is available.

## Keyword to URL

- One primary keyword per URL, recorded in `docs/research/_keywords.md` with Ahrefs volume, KD, TP and intent on the pull date.
- Secondary keywords fold into the same page (H2s, FAQ, table rows). Never a second URL for a variant of the same intent ("best serger" and "best serger sewing machine" are one hub).
- A page is built only when the dominant SERP format matches the page type we would build (listicle → hub, single review → review, explainer → guide, head-to-head → compare) and it has a commercial role or feeds a page that does.
- Informational queries with volume are answered in FAQ blocks on the page that owns the parent topic, not as standalone URLs.

## Titles and descriptions

- `<title>`: primary keyword first, then a specific modifier, then the year in parentheses where the SERP shows years. Reviews: `{Brand} {Model} Review (2026): {kind} Specs Checked, Who It's For`. Hubs: `Best {Job} (2026): {scope}`. Compares: `{A} vs {B}: Spec-by-Spec, Which to Buy (2026)`. Under about 60 characters where possible; the site name is appended by the template except where `absolute` is used.
- Meta description: 140 to 160 characters, states the verdict or the answer, names what the page checks. Generated from the verdict for reviews (`reviewMetaDescription`), hand-written for hubs and guides.
- Every page has one H1 containing the primary keyword or its natural phrasing. H2s are the on-page TOC.

## Content quality (helpful content)

- Every page must be better than the manufacturer page and the top result for the query: a verdict, a who-it's-for and a skip-if, sourced specs, conflicts named, alternatives, a real-cost line.
- Spec-check, not field test: no invented first-hand experience. Owner evidence is paraphrased and attributed by URL and labelled by evidence level.
- No filler intros. Hubs open with three lines and "The short answer". Guides open with the answer and a definition.
- No em-dashes; short sentences; numbers in mono with a source line.
- Dates: "Specs checked {Month Year}" in every verdict box; `dateModified` in schema equals the page's `lastUpdated`; `lastmod` in the sitemap comes from content dates, never from build time.

## Structured data

- Every page: `BreadcrumbList`, `Organization` and `WebSite` in the root layout.
- Review: `Review` with `itemReviewed: Product` (brand, description, `AggregateOffer` with the price band range, no availability claim) and `reviewRating` 0 to 10. `FAQPage` when FAQs render.
- Hub and index pages: `ItemList` of the ranked or listed URLs. Hubs add `FAQPage`.
- Compare: `Article` + `ItemList` of the compared products.
- Guide: `Article` + `FAQPage`.
- About: `AboutPage`. Brand: `Brand`.
- All JSON-LD comes from `src/lib/schema.ts`; visible content and schema must agree.

## Technical

- Static generation for every indexable route (`generateStaticParams`, `dynamicParams = false`). `/out/[slug]` is the only dynamic route.
- Canonical on every page via `alternates.canonical` (apex, no trailing slash). `www` 301s to apex in `src/middleware.ts`. `*.workers.dev` previews are `noindex` and serve `Disallow: /`.
- `robots.txt`: allow all, disallow `/out/`, explicit allow rows for AI crawlers (GPTBot, ClaudeBot, PerplexityBot and friends). Cloudflare managed robots.txt stays off.
- `sitemap.xml` from `src/app/sitemap.ts`: every indexable HTML URL, priorities by role (home 1.0, hubs 0.9, reviews 0.85, compares 0.8, guides 0.75 to 0.8, brands 0.75, indexes 0.7, trust 0.2 to 0.4). Draft guides and `/out/` never appear.
- `/llms.txt` and `/llms-full.txt` per llmstxt.org, `X-Robots-Tag: noindex`, linked from `<head>`.
- Fonts self-hosted via `next/font/local` (Archivo variable, IBM Plex Sans variable, IBM Plex Mono 400/500/600), `display: swap`. No third-party font requests.
- Images: `next/image`, white-background 4:3 product shots, `alt` written as the product plus view. The hatched photo well renders until a shot lands; never a stock photo.
- Core Web Vitals budget: no layout shift from fonts or images (fixed well heights), no client JS on the critical path except the picker, filters, TOC, sticky bar and mobile nav, all progressive enhancements over server-rendered HTML.
- Security headers in middleware: HSTS, nosniff, referrer policy, frame options.
- Every outbound purchase link: `/out/{slug}`, `rel="sponsored nofollow noopener"`, `target="_blank"`. Dealer and source links: `rel="nofollow noopener external"`.
- 404 returns a real 404 with search and the three hub links; discontinued model URLs stay live and link forward, never 410.

## Internal linking

See `docs/02-ia-and-linking.md`. The short version: hub-and-spoke, every spoke links its hub and brand, every compare links both reviews and a guide, guides link their hub at the end, no orphans.

## Measurement hooks

- GA4 with `affiliate_click` events on every `BuyButton` (`data-affiliate`, `data-slug` attributes; the client hook is `trackAffiliateClick` in `src/lib/analytics.ts`).
- GSC property `sc-domain:stitchcheck.com`; submit `/sitemap.xml` on launch.
- Ahrefs rank tracking on the hub, guide and top review keywords from `_keywords.md`.

## Launch checklist (per URL)

- [ ] Primary keyword row exists in `_keywords.md`
- [ ] Title, description, H1, canonical rendered
- [ ] Schema validates (Rich Results Test) and matches visible content
- [ ] Specs sourced; `[verify]` count noted in the Linear issue
- [ ] Buy button says affiliate and routes through `/out/`
- [ ] Links: up to hub and brand, across to alternatives or compares, out to a guide
- [ ] Screenshot at 390 and 1280 with no horizontal overflow
- [ ] `check:catalog`, `typecheck`, `lint`, `build` green
