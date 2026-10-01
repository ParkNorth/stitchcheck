# Review pipeline runbook (unattended and interactive runs)

Read `SKILL.md` for what each stage does. This file is the operating contract for scheduled runs. The plan,
tiers and families live in `data/reviews/_plan.json`; `npm run reviews:plan -- status` shows where every model is.

## Hard rules

1. **Never publish.** Do not merge, do not mark a PR ready, do not push to `claude/pensive-goodall-ren1mc` (the default branch, which deploys to production). Work only on the staging branch below.
2. **Only write under `data/reviews/`** (the model's ledger and `_plan.json`). Do not edit `data/specs/`, `src/`, `docs/`, `AGENTS.md` or `package.json`. Page edits, spec corrections and rollup approval are interactive editor work done at publish time.
3. **A model is publishable only when `complete` and signed off by a human.** `build:catalog` refuses to compile an approved rollup without a sign-off in `_plan.json`. Never write a sign-off yourself.
4. **No secrets in the repo.** Never print, log or commit credentials. `.env.local` stays gitignored. Reviewer names stay in `raw.jsonl` (gitignored).
5. **Stop and log, do not improvise.** If a step fails twice, blocked sources stay `blocked` in `sources.json`, write the reason in the model's `data/reviews/{slug}/run-log.md`, and move on to the next model. Do not spend credits retrying.
6. **Budgets per run:** at most 120 Firecrawl scrapes, at most $0.50 of DataForSEO, at most 10 subagents at once (use sonnet). Tier 0 never spawns extraction agents.
7. **Dates:** use today's local date. Never a future date.

## Staging branch

```
cd ~/Documents/Projects/stichcheck-staging 2>/dev/null || git -C ~/Documents/Projects/stichcheck worktree add ~/Documents/Projects/stichcheck-staging -B reviews-staging origin/claude/pensive-goodall-ren1mc
cd ~/Documents/Projects/stichcheck-staging
git fetch origin && git merge --no-edit origin/claude/pensive-goodall-ren1mc   # keep staging current; resolve generated-file conflicts by rerunning build:catalog
npm ci --silent
```

Commit per model per run (`reviews({slug}): {stages done}`), push `reviews-staging`, and keep one DRAFT PR titled "Review pipeline staging (do not merge)". Credentials: `.env.local` is gitignored, so copy it into the worktree from `~/Documents/Projects/stichcheck/.env.local` if it is missing.

## Linear

Each model has a ticket in `_plan.json` (`models.{slug}.linear`, project "Stitch", team "Web Projects"). If a Linear connector is available in the session, add one comment per model when a run finishes its stages (what was collected, counts, findings that change the page, gaps). Never change a ticket's status. If no Linear connector is available, put the same text in `data/reviews/{slug}/run-log.md`; an interactive session posts it.

## Tier 0: maker documents and marketplace ratings (cheap, every model)

`npm run reviews:plan -- next --tier 0 --count 4` lists models and their next stage. For each:

1. `npm run reviews:bootstrap -- --slug X` if `data/reviews/X/` has no `queries.json`.
2. **maker**: fetch the maker's product page (Firecrawl markdown), then the manual and warranty PDFs it links (curl, then `pymupdf` text; image-only PDFs by tesseract OCR at 150 dpi). Write `manufacturer.json`: one fact per field with value, document and page, `vs_spec` (`confirms`, `contradicts`, `adds`) against `data/specs/X.json`, and curated `site` rows (label, maker says, dealers say, status, links) for the facts the page should show. Quote nothing at length. Warranty terms, weight, dimensions, included feet, needle, price, and anything the maker's own pages contradict about itself.
3. **marketplaces**: `npm run reviews:amazon -- --slug X` (Amazon rating, count, listing details, top reviews). Walmart: find the product id, scrape `walmart.com/reviews/product/{id}?ratings=1..3&page=N` with Firecrawl (`proxy: stealth`, `formats: ["rawHtml"]`), then `npm run reviews:walmart`. Dealer pages with a Judge.me or BigCommerce widget: `npm run reviews:fetch -- --slug X --url ...`. Note any listing that pools reviews of several models.
4. `npm run reviews:checks -- --slug X` and commit.

## Tier 1 and 2: full machine pipeline (stops before editor work)

After Tier 0 for the model: `collect:reddit` (use `--dry` first and read the thread list), `reviews:page` for the discovery results (SearchAPI queries from `queries.json`, comparison pages for each sibling), `reviews:export`, `reviews:claims -- prep`, extraction agents (4 chunks each, sonnet, `claims-prompt.md`), `reviews:claims -- merge`, `reviews:rollup -- tag-prep`, tagging agents (`tag-prompt.md`), `tag-merge`, fill `editor.json` (siblingSummaries from the difference claims, siblingExtras from `manufacturer.json`, `scopeRules` for any pooled listing, `ownerNote`), `reviews:rollup -- build` (leaves status `draft`), `reviews:checks`, `reviews:sheet -- --slug X`. Tier 2 models run the claims pipeline only if `claims-work/in-*.jsonl` holds at least 150 segments; otherwise stop after Tier 0 and say so in `run-log.md`.

Do not approve the rollup. Leave `status: "draft"`.

## What "complete" means

All eight stages true in `reviews:plan -- status` (maker, marketplaces, collected, claims, tags, rollup, checks, page), where `page` means an editor approved the rollup and edited the spec, copy and compare pages. Unattended runs end at `checks`. Then a human reads `reports/review-sheet.md`, `reviews:plan -- signoff` records it, and an interactive session opens the publish PR.

## Refresh (monthly, published models only)

`collect:reddit` picks up new comments by cursor, `reviews:amazon` and the Walmart ingest refresh ratings and counts, `reviews:rollup -- build` (drops approval if counts moved), `reviews:checks`. Stage on `reviews-staging`; a changed approved rollup needs the editor again before it ships.
