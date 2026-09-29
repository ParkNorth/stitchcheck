# Research briefing: `{slug}`

last_updated: YYYY-MM-DD
manufacturer_url:
retailer_url: (Sewing Machines Plus listing if one exists)
status: draft | verified
evidence: owner | mixed | positioning

<!--
Rules (see AGENTS.md):
- Every number that lands in src/lib/products.ts must appear here, in the manufacturer's units, with a source note (URL + where on the page).
- "Not published" is a valid value. A guess is not. Unpublished rows render as [verify] on the page.
- Marketing language ("heavy duty", "industrial strength", "sews through anything") goes under Manufacturer claims, never in the spec table.
- Conflicts between sources are listed, not resolved here. The catalog entry picks a value and says why.
- Owner themes are paraphrased and attributed by URL. Never quote at length. Never invent a thread.
-->

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | mechanical / computerized / serger / coverstitch / long-arm | |
| Stitch types or built-in stitches | | |
| Max speed (spm) | | |
| Threads (sergers/coverstitch) | | |
| Differential feed | | |
| Throat / arm space (in) | | |
| Needle system | | |
| Presser foot lift / knee lifter | | |
| Thread trimmer | | |
| Feed system | | |
| Buttonhole | | |
| Motor / drive | | |
| Frame | | |
| Weight (lb) | | |
| Dimensions W x D x H (in) | | |
| Included feet / accessories | | |
| Warranty (US) | | |
| List price (USD) | | Seen YYYY-MM-DD at {retailer} |

## Unit / naming checks

- Model number vs anything it implies (e.g. "TL-2010Q" is not a 20" arm; "Heavy Duty" is a Singer series name, not a rating):
- Throat measured needle-to-body or including the harp height?
- Speed: manufacturer max vs retailer copy:

## Manufacturer claims (attribute, do not assert)

- "…" (manufacturer claim, product page)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents:
- Price seen and date:
- Authorized dealer statement present?

## Spec conflicts

- Field: value A (where) vs value B (where). Catalog will use: … because …

## Buyer questions (PAA / forums)

1. …

## Owner themes (paraphrase + attribute)

1. Theme: paraphrase. (owner: https://…)

## Cross-shop set

1. `{slug}`: why buyers compare these two

## Editorial angle

One sentence: who this page is for and what decision it settles.

## Exit checklist

- [ ] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked
- [ ] Claims attributed; conflicts listed; unit check written
- [ ] FAQ (6–12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives
- [ ] No hands-on claims ("we tested", "in our hands")
