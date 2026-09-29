# Foundations

last_updated: 2026-09-29
status: living

This file is the scope and money contract for Stitch Check. Anyone adding a page, model, or brand (human or agent) uses it. `AGENTS.md` is the editorial constitution. Do not copy rules from there into here. Do not use this file for URLs or linking (`docs/02-ia-and-linking.md`), SEO rules (`docs/03-seo-rules.md`), spec provenance (`docs/research/`), or current status (Linear project "Stitch", P-WEB-47).

## What this site is

Stitch Check (stitchcheck.com) is an independent buying guide for serious home sewing machines: heavy-duty and industrial machines for the home, sergers and coverstitch machines, and quilting machines up to long-arm. It checks manufacturer specs, cross-checks the retailer listing, gives a verdict scored for the job, and sends the reader to Sewing Machines Plus to buy.

Tone is workshop, not craft blog: neutral, spec-driven, no pastel sewing-room cliches. The reader is a hobbyist spending $300 to $3,000 who has already outgrown a beginner machine.

It is the same skeleton as Flail Path (flailpath.com) with more brands and more model pages. Read `North-Park-Group/failmower` for the patterns; do not copy its copy or catalog.

## Brand facts

| Field | Value | Source in repo |
|---|---|---|
| Brand | Stitch Check | `src/lib/site.ts` `name` |
| Legal | North Park, d/b/a Stitch Check | `site.legalName`; About, Privacy, Terms |
| Domain | stitchcheck.com (planned) | `site.domain` |
| Contact | hello@stitchcheck.com | `site.contactEmail` |
| Corrections | corrections@stitchcheck.com | `site.correctionsEmail` |
| Jurisdiction | Delaware | `site.governingState` |
| Editor | Stitch Check editors (spec-check; no hands-on claims) | `src/lib/byline.ts` |
| GitHub | `ParkNorth/stitchcheck` | remote |
| Linear | Stitch (P-WEB-47), team Web Projects | project |

## Audience

Write to the reader's job, not a demographic. Four stages one person moves through:

| Job | Arrives asking | Default pages | Agent must not |
|---|---|---|---|
| Does not know the machine type exists | "serger vs sewing machine", "what is a serger", "coverstitch" | `/guides/serger-vs-sewing-machine`, `/guides/what-is-a-serger`, `/guides/coverstitch-vs-serger` | Open with a product CTA. Pretend a sewing machine is never enough. |
| Outgrew a beginner machine, considering | "best heavy duty sewing machine", "best serger", "best sewing machine for quilting", "mechanical vs computerized" | The three job hubs, the feeder hub, decision guides | Rank on stitch count. Default to the affiliate pick when the fit is wrong. |
| Comparison shopper | Already knows the type; picking a model or brand | `/compare/*`, brand hubs, series hubs, reviews | Write a "what is a serger" lede. Score unlike specs as one cell. |
| Already owns one | Upgrade, second machine, "is mine the wrong tier" | Reviews' alternatives rows, quilting tier guide, long-arm cost guide | Re-explain the basics. Hide a limit (straight stitch only, dealer only, frame not included). |

**Not for** (one sentence, then send away): embroidery machine shoppers, handheld and kids' machines, industrial production buyers, non-US buyers as the design center (retailer and keyword data are US).

## Category scope

Use this before adding a model or brand. If it is out, stop. Do not add a page to "complete" a brand.

**In scope**

- Heavy-duty domestic machines (mechanical and computerized) and industrial single-needle lockstitch heads sold to home buyers with a table and motor.
- Sergers (overlockers) and coverstitch machines, including combination machines.
- Quilting machines: domestic straight-stitch quilters, sit-down mid-arms, stand-up long-arms and their frames.
- Brands: Juki, Janome, Brother, Singer, Baby Lock, Bernina, Handi Quilter, Grace Company. New brands need a decision and a row below.
- Decision guides that feed those hubs (type, tier, fabric, brand ranking, cost).

**Out of scope**

- Embroidery-only and sewing-and-embroidery combos (different buyer, different retailer mix).
- Handheld, mini, kids', toy machines.
- Walking-foot industrials and upholstery-class machines as catalog products (compare-to only, until a decision).
- Maintenance and how-to content (threading, oiling, jams) as standalone URLs; answer inside FAQs where it fits.
- Used-market listings.

A model that is in scope still needs a real manufacturer URL and published specs. No URL, no catalog row.

## Money

One retailer: **Sewing Machines Plus** (sewingmachinesplus.com). Research (`docs/research/_retailer-sewing-machines-plus.md`) found SMP on ShareASale at a published 10 percent commission with a 30-day cookie; confirm at application. The code supports Awin or ShareASale via env (`NEXT_PUBLIC_AFFILIATE_NETWORK`, IDs in `src/lib/affiliates.ts`). Until approved, `/out/{slug}` 302s to the plain SMP product URL with the same `rel`, so the page does not change when money switches on.

| Brand | Buy route | Notes |
|---|---|---|
| Juki, Janome, Brother, Singer | `/out/{slug}` to SMP listing | Primary money. `rel="sponsored nofollow noopener"`. |
| Handi Quilter, Grace Company | `/out/{slug}` where SMP lists the model | SMP lists Moxie and Q'nique; confirm stock before flipping to retailer. |
| Baby Lock, Bernina | Dealer locator, `rel="nofollow noopener external"` | Dealer-only pricing. No buy button, no affiliate relationship, honest copy. SMP research says it carries both; revisit if SMP sells them online with a price. |

Rules: only `BuyButton` renders a purchase link; the word "affiliate" is never dropped; the FTC disclosure stays in the footer, About and Terms; commission never sets the rank; the value pick is chosen for fit and there is one per page.

## Success funnel (directional)

Indexed launch URLs → organic clicks (GSC) → affiliate clicks (GA4 `affiliate_click`) → first approved SMP conversion → repeatable monthly revenue → LLM citation share. Work should trace to one stage. See `docs/05-measurement.md`.

## Repo isolation

Greenfield Next.js app. Not a Flail Path fork. Separate git history, Worker, GSC property, GA4 property. Flail Path and Chip It Right are read-only references for IA and affiliate plumbing.

## How this file gets updated

- Scope change: edit the lists above in the same PR as the first page that needs it.
- New brand: append a row to the money table in the same change that adds the brand to `src/lib/brands.ts`.
- Program approved: set the env vars, flip the row, do not touch page code.
- Do not put prices, model counts or status here. They rot.
