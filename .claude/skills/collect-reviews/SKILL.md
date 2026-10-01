---
name: collect-reviews
description: Collect owner, buyer and editorial reviews for one sewing machine model into a re-runnable source ledger (data/reviews/{slug}/). Collection only, no scoring or site copy. Modes collect, update, audit. Use when asked to gather, refresh or audit reviews for a model slug.
---

# collect-reviews {mode} {slug}

Research-loop skill (AGENTS.md rule 22): it writes provenance under `data/reviews/{slug}/` and the "Reviews collected" section of `docs/research/{slug}.md`. It never writes `siteFields`, star averages, verdicts or site copy. Rollups are a separate later skill that reads only this data.

## Files per model (`data/reviews/{slug}/`)

| File | Committed | Purpose |
|---|---|---|
| `queries.json` | yes | Exact searches, subreddits, retailer and forum domains. A rerun replays these. Hand-edit to add queries. |
| `sources.json` | yes | One row per source URL: `id, url, class, method, title, first_seen, last_fetched, status (ok/blocked/dead/thin), content_hash, discovered_by[]`, plus `cursor_utc` for Reddit. |
| `items.jsonl` | yes | One row per review or comment unit: `id, source_id, url, kind, author_type, created_utc, score, classified`. No raw text. |
| `raw.jsonl` | no (gitignored) | `{id, text}` raw text for classification. Regenerable. |
| `manufacturer.json` | yes | First-party facts from the maker's product page, manual and brochure, each compared with `data/specs/{slug}.json` (confirms, contradicts, adds). Written by hand from the documents. |
| `claims.jsonl` | yes | Validated claims: `spec_claim`, `comparison`, `difference` rows, each with a paraphrase, a quote of 15 words or fewer and the item URL. Built by `reviews:claims`. `claims-rejected.jsonl` holds rows that failed validation. |
| `claims-work/` | no (gitignored) | Chunked inputs and model outputs for the claims pipeline. |
| `reviews.jsonl` | no (gitignored) | Export: every item merged with its full text, source url/class, date, rating. The file to hand to another AI model for sorting. Build with `npm run reviews:export -- --slug {slug}`. |
| `cache/` | no (gitignored) | Fetched page markdown from Firecrawl or browser. |

Source classes: `reddit`, `retailer`, `forum`, `editorial`, `youtube`. Source ids are `{class}:{stable key}` (Reddit: `reddit:{thread_id}`; others: `web:{sha16 of canonical URL}`).

## Step 0: load context (all modes)

1. Read `data/specs/{slug}.json`, `docs/research/{slug}.md` and the `_keywords.md` row.
2. Take the exact model name, aliases and confusable siblings (rule 9: 2010Q vs 2000Qi, 1034D vs 1034DX). Put them in `queries.json` as `model_names` and `confusable_siblings`.
3. Discard any thread or page where the model is not named. When a page covers a sibling, keep only the passages that name this model.
4. Credentials live in `.env.local` (gitignored): `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT`. Never write them into any tracked file or print them.

## Mode: collect (first run)

1. **Seed queries.** If `queries.json` is missing, create it from the model name and siblings. Include a `searchapi` list ("{model} review", "{model} owner review problems", "{model} vs {sibling}", "{model} forum", "{model} patternreview", "{model} quilting board"), Reddit `searches` and `subreddits`, retailer and forum domains.
2. **Reddit.** Run `npm run collect:reddit -- --slug {slug}` (`--dry` first to list threads). It uses the official API, keeps only threads that name the model, and writes sources, items and raw text with a per-thread cursor.
3. **Discover the rest.** SearchAPI `google_search` for each `searchapi` query (also "{model} reviews", "{model} buy"). Scan each result for **review signals**: a rating or review count in the rich snippet, "reviews" or "customer reviews" in the snippet or title, or a retailer product page. Domains with signals are fetch targets; log the signal in `discovered_by`. Also run Ahrefs `serp-overview` on "{model} review" to see which domains Google treats as authoritative, and target those first. Record each URL in `sources.json` (`npm run reviews:register`). YouTube: record title, channel and URL only; comments and transcripts are out of scope for now. Facebook groups are unsupported by Firecrawl: mark `blocked`.
4. **Fetch retailer product pages first with the HTTP adapters.** `npm run reviews:fetch -- --slug {slug} --url {product page}` pulls every on-page review verbatim (rating, date, title, text) for Judge.me (Shopify) and BigCommerce stores and records the page's own aggregate (`site_rating`, `site_review_count`). It needs no browser and is idempotent. If it reports an unknown platform, fall back to Firecrawl `firecrawl_scrape` (markdown, `waitFor` 4000; large results are auto-saved to a file you can copy into `cache/`) or the browser MCP, and add an adapter if the platform recurs (Yotpo, Bazaarvoice, Amazon). Always check the fetched count against the page's stated count. Set `status`: `ok`, `blocked` (403 or captcha), `dead` (404 or gone), `thin` (fetched but no review content). Do not retry blocked pages more than once; log the gap.
5. **Extract units.** Extract verbatim review text from the page markdown or HTML. Do not use Firecrawl JSON-schema extraction for evidence: in the TL-2010Q pilot it produced generic paraphrases and unreliable owner/buyer labels (items tagged `firecrawl-json-lossy` are hints only). For each ok page, add `items.jsonl` rows, one per review or comment, with `author_type` (`owner`, `buyer`, `editorial`, `unknown`), `created_utc` if shown, and a star rating in a `rating` field when the page shows one. Store the raw text in `raw.jsonl`. Reddit items start `author_type: "unknown"`; ownership is decided in the classify stage, not guessed here.
6. **Export.** Run `npm run reviews:export -- --slug {slug}` so `reviews.jsonl` holds every review with full text.
7. **Report.** Append or replace a "Reviews collected" section in `docs/research/{slug}.md`: source counts per class, item counts, date range, gaps (blocked or thin sources), and the `evidence` label suggested by what was actually collected (`owner`, `mixed`, `positioning`, rule 2). List conflicts between sources; do not resolve them (rule 12). Attribute by URL; paraphrase, and quote at most about 15 words (rule 3).

## Research steps beyond reviews (run in collect, and on update when sources change)

**A. Manufacturer documents (first-party baseline).** Fetch the maker's product page with Firecrawl (`formats: ["markdown","links"]`). Download the instruction manual and brochure PDFs from its links with `curl -L` into `cache/manufacturer/`, extract text with `pypdf` (an image-only PDF needs OCR; note it as a gap). Write `manufacturer.json`: one fact per field with value, units, document and page, and `vs_spec` set to `confirms`, `contradicts` or `adds` against `data/specs/{slug}.json`. Manual pages settle many questions dealers disagree on: box contents, optional vs standard accessories, needle sizes, dimensions in cm, oiling schedule. Prefer the manual over the web page when they differ, and log the conflict (rule 12). Note that a figure found only in dealer copy is not the maker's figure (rules 6, 9, 11).

**B. Sibling and competitor comparisons.** From the briefing's `crossShop` and the confusable siblings, SearchAPI "{model} vs {sibling}" and "{model} difference" for each. Fetch the result pages with `npm run reviews:page -- --slug {slug} --kind comparison --url ...` (plain HTTP). Pages that return 403 (PatternReview, Missouri Star forum, some dealers): scrape with Firecrawl `formats: ["rawHtml"]`, which auto-saves large results to a file, and pass `--firecrawl "URL=/path/to/file.json"`. Add explicit Reddit comparison threads with `npm run collect:reddit -- --slug {slug} --thread id1,id2`. Dealer comparison charts (for example a "TL series comparison chart") are the best source for feature deltas between siblings.

**C. Claims pipeline (spec claims, comparisons, claimed differences).**
1. `npm run reviews:claims -- prep --slug {slug}` keyword-filters every review, comment and page segment and writes chunks plus `ref.json`.
2. Give each `in-N.jsonl` to a model with `claims-prompt.md` (subagents in parallel, about 4 chunks each) to write `out-N.jsonl`.
3. `npm run reviews:claims -- merge --slug {slug}` accepts only rows whose quote appears verbatim in the source segment, and writes `claims.jsonl`; review `claims-rejected.jsonl` for the failure rate.
Results answer, per spec field, what owners confirm, contradict or add; how buyers weigh the model against each rival; and which differences between siblings are claimed, by whom. A difference claimed by only one source stays `unverified` until a second independent source or a maker document agrees. Sibling claims must never be credited to this model (rule 9).

**D. Rollup for the review page (counts only).**
1. `npm run reviews:rollup -- tag-prep --slug {slug}` chunks the spec claims; give each `tag-in-N.jsonl` to a model with `tag-prompt.md` to write `tag-out-N.jsonl` (theme and polarity per claim); `tag-merge` validates into `tags.jsonl`.
2. Write `data/reviews/{slug}/editor.json` by hand: `notes` (caveats shown under the methodology box) and `siblingSummaries` (one sentence per feature per sibling, and what a Juki document does or does not confirm). Rows without a summary are not shown.
3. `npm run reviews:rollup -- build --slug {slug}` writes `rollup.json`: themes with voice, source and source-class counts, polarity, recurrence label, attributed examples; retailer ratings as seen; maker-document checks (curated `site` rows in `manufacturer.json`); sibling differences; rival tallies. It writes status `draft`. `check` fails if any referenced claim id is missing from `claims.jsonl`.
4. An editor reads `rollup.json`, spot-checks claims against their URLs, and sets `status: "approved"`, `reviewedBy`, `reviewedOn`. Any later change to the counts drops it back to draft. `npm run build:catalog` compiles approved rollups only into `src/lib/rollup-data.ts`; the review page then shows the owner signals, methodology, document checks, sibling and rival blocks (`src/components/ui/RollupBlocks.tsx`). Never use these counts for `AggregateRating` schema.

**E. Retailer listings that need a browser (Walmart) and pooled listings.** Walmart blocks plain HTTP. Scrape `walmart.com/reviews/product/{id}?ratings=N&page=M` with Firecrawl (`proxy: "stealth"`, `formats: ["rawHtml"]`, which auto-saves the large result) for every low-star page you can afford plus the top relevance pages, then run `npm run reviews:walmart -- --slug {slug} --product {id} --dir {tool-results dir}`. The page's own rating, count and distribution are stored on the source row because the ingested set is a deliberate sample. A listing can pool reviews of near-identical models (Walmart's 1034DX listing carries reviews that name the 1034D, some dated before the DX existed). Measure it (how many reviews name each model), and if it is pooled add `scopeRules` to `editor.json` so only reviews that name this model count, and say so in `notes` and `ownerNote`. New-model bootstrap: `queries.json` needs `model_names` and `confusable_siblings` (the Reddit collector matches the exact model with a suffix guard so 1034D never matches 1034DX), and `editor.json` needs `siblings`, `features`, `rivals`, `others`, `siblingSummaries` and optional `siblingExtras` for rows backed by the maker's documents.

## Mode: update (incremental)

1. Replay `queries.json`; diff discovered URLs against `sources.json`; add only new ones.
2. Reddit: rerun the script. It only adds comments newer than each thread's `cursor_utc`.
3. Re-fetch web sources whose `last_fetched` is older than 90 days; compare `content_hash`; add only new units. Mark HTTP 404 sources `dead` and keep the row.
4. Print "what changed": new sources by class, new items, newly dead or blocked sources, new coverage gaps. Update the "Reviews collected" section and its date.
5. Classify only items whose `classified` is null (a later stage; skip if it does not exist yet).

## Mode: audit (no collection)

Link-check every `sources.json` URL (HEAD or Firecrawl), update `status`, and report coverage: classes hit, counts, date range, source classes with zero items, stale rows. Change nothing else.

## Classification stage (not built yet)

Later, `classified` will hold theme tags from a fixed taxonomy (reliability, motor and power, thick-fabric performance, tension, noise, support, value, and so on), `claim_type` and `is_owner`, stamped with the classifier version. The classifier is a swappable stage (Jev via api.typesafe.ai is the candidate; see the jev-quality-raters-guideline project for its typed-question approach). Rollups must cite item ids and be reviewed by the editor before they reach `products.ts`.

## Guardrails

- Never invent a source, thread or quote. Every claim traces to a `sources.json` row.
- No `AggregateRating` schema from third-party ratings; ratings are reported as attributed and dated page copy only (rule 21).
- Commit `queries.json`, `sources.json`, `items.jsonl` and the briefing edit. Never commit `raw.jsonl`, `cache/` or `.env.local`.
