# Research briefing: `singer-4432`

last_updated: 2026-09-29
manufacturer_url: https://www.singer.com/products/singer-heavy-duty-4432-sewing-machine
retailer_url: https://sewingmachinesplus.com/smp-7464374432.php
status: draft
evidence: mixed

<!--
Rules (see AGENTS.md):
- Every number that lands in src/lib/products.ts must appear here, in the manufacturer's units, with a source note (URL + where on the page).
- "Not published" is a valid value. A guess is not. Unpublished rows render as [verify] on the page.
- Marketing language ("heavy duty", "industrial strength", "sews through anything") goes under Manufacturer claims, never in the spec table.
- Conflicts between sources are listed, not resolved here. The catalog entry picks a value and says why.
- Owner themes are paraphrased and attributed by URL. Never quote at length. Never invent a thread.
-->

Research method note: singer.com and dealer sites were blocked by the egress proxy. Values come from WebSearch snippets; the URL is the page the snippet was drawn from. Fewer snippets surfaced for the 4432 than for its siblings; several rows are "not found".

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | mechanical | singer.com product page |
| Stitch types or built-in stitches | 32 built-in, including basic, stretch and decorative; 1 one-step buttonhole | singer.com product page |
| Max speed (spm) | 1,100 | singer.com product page |
| Threads (sergers/coverstitch) | n/a | |
| Differential feed | n/a | |
| Throat / arm space (in) | Not published | |
| Needle system | Not found in snippets | |
| Presser foot lift / knee lifter | Not found in snippets (adjustable pressure claimed by retail copy; not confirmed from Singer snippet) | |
| Thread trimmer | None | |
| Feed system | Drop feed | sewingpartsonline.com listing |
| Buttonhole | 1-step automatic | singer.com product page |
| Motor / drive | Not published. Retail copy: "60% stronger than a standard sewing machine motor" | sewingpartsonline.com listing (retail copy) |
| Frame | Metal interior frame; stainless steel bed plate | singer.com product page |
| Weight (lb) | Not found. 17.42 lb appears in an Amazon-derived snippet and is likely shipping weight | see conflicts |
| Dimensions W x D x H (in) | Not found. 15.2 x 12 x 6.2 in in the same snippet does not match the 4423 body | see conflicts |
| Included feet / accessories | General purpose foot, zipper foot, buttonhole foot, button sewing foot, edge and quilting guide, needles, Class 15 transparent bobbins, spool caps, auxiliary spool pin | sewingpartsonline.com listing accessory list |
| Warranty (US) | 25 yr limited head; 2 yr electrical; 90 days adjustments and attachments | singer.com/pages/singer-sewing-machine-warranty-coverage |
| List price (USD) | Not found | No price in any accessible snippet, including SMP |

## Unit / naming checks

- Model number vs anything it implies: "Heavy Duty" is a series name. "110 stitch applications" in retail titles is not 110 stitches; Singer lists 32.
- Throat measured needle-to-body or including the harp height? Not published.
- Speed: manufacturer max 1,100 spm; retailer copy matches.

## Manufacturer claims (attribute, do not assert)

- "powerful motor" and "extra high sewing speed" (manufacturer claim, singer.com product page)
- "heavy-duty metal frame" (manufacturer claim, singer.com product page)
- "60% stronger than a standard sewing machine motor" (retail copy, Sewing Parts Online; baseline undefined)
- "50% more power for thick fabrics" (retail copy, Amazon title)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP listing title "Heavy Duty Extra-High Sewing Speed Sewing Machine"; accessory list not in snippet.
- Price seen and date: not shown in snippet (2026-09-29).
- Authorized dealer statement present? Not seen in snippets. Do not assert.

## Spec conflicts

- Weight: 17.42 lb (Amazon-derived snippet) vs 14.6 lb published for the same-body 4423. Catalog leaves 4432 weight null with [verify] rather than borrow the 4423 figure.
- Dimensions: 15.2 x 12 x 6.2 in (same snippet) is inconsistent with the 4423's 18.1 x 8.8 x 13.9 in. Null with [verify].
- Price: none found. Comparison sites say about $26 above the 4423, which is not a price.
- Adjustable presser foot pressure: retail copy says all four feet "have adjustable pressure"; Singer snippet for the 4432 did not mention it. Null.

## Buyer questions (PAA / forums)

1. What is the difference between the Singer 4432 and 4452?
2. Is the Singer 4432 better than the 4423?
3. Can the Singer 4432 sew leather or canvas?
4. How many stitches does the Singer 4432 have?
5. Does the Singer 4432 come with a walking foot?
6. Is the Singer 4432 good for quilting?
7. How much does the Singer 4432 weigh?
8. What bobbins does the Singer 4432 use?

## Owner themes (paraphrase + attribute)

1. Same head, different packs: PatternReview members treat the 4423, 4432 and 4452 as one machine with different stitch counts and accessories. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/111789)
2. Value pick: comparison writers and forum posters call the 4432 the best value in the line, 32 stitches for a small step over the 4423 and the same head as the 4452 without the accessory pack. (positioning: https://bobbinhub.com/singer-4432-vs-4423/ ; https://sewways.com/brands/singer-heavy-duty-comparison/)
3. Shared faults: the bobbin, tension and skipped-stitch complaints documented for the 4423 apply to this shared head. (owner-derived: https://threadedmachines.com/brands/singer/4423-review/problems/)

## Cross-shop set

1. `singer-4423`: same head with nine fewer stitches.
2. `singer-4452`: same head plus walking foot, nonstick foot and clearance plate.
3. `janome-hd3000`: fewer stitches, quieter, adjustable pressure.

## Editorial angle

For buyers stuck between the three Singer Heavy Duty models; settles that the 4432 is the 4423 head with more stitches and the 4452 head without the accessory pack.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (singer.com not fetchable; snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs/singer-4432.json)
- [x] No hands-on claims ("we tested", "in our hands")
