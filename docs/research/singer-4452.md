# Research briefing: `singer-4452`

last_updated: 2026-09-29
manufacturer_url: https://www.singer.com/products/singer-heavy-duty-4452-sewing-machine
retailer_url: https://www.sewingmachinesplus.com/4452.php
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

Research method note: singer.com and dealer sites were blocked by the egress proxy. Values come from WebSearch snippets; the URL is the page the snippet was drawn from. The Home Depot hosted PDF is Singer's own product sheet.

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
| Presser foot lift / knee lifter | Not found in snippets | |
| Thread trimmer | None | |
| Feed system | Drop feed (shared 44-series head) | sewingpartsonline.com 4432 listing; Singer sheet lists even feed foot as accessory |
| Buttonhole | 1-step automatic | singer.com product page |
| Motor / drive | Not published. Singer: "powerful motor" | singer.com product page |
| Frame | Heavy-duty metal frame; stainless steel bedplate | singer.com product page |
| Weight (lb) | Not found in snippets | |
| Dimensions W x D x H (in) | 15.4 x 6.3 x 11.8 (39 x 16 x 30 cm converted; third party) | sewingmachinedirectory.com/sewing-machine/singer-4452/ ; see conflicts |
| Included feet / accessories | All purpose, zipper, buttonhole, button sewing, non-stick, even feed (walking) feet; clearance plate; 2 packs needles; Class 15 transparent bobbins; edge and quilting guide; spool caps; large and small spool holders; auxiliary spool pin; spool pin felt; L screwdriver; seam ripper and lint brush; soft dust cover; foot control and power cord | Singer product sheet PDF hosted at images.thdstatic.com (5a5da577...pdf) |
| Warranty (US) | 25 yr limited head; 2 yr electrical; 90 days adjustments and attachments | singer.com/pages/singer-sewing-machine-warranty-coverage |
| List price (USD) | 299.00 | Seen 2026-09-29 at Sewing Machines Plus (snippet; factory serviced $159.99). Singer.com reported at $309.99 second hand |

## Unit / naming checks

- Model number vs anything it implies: "Heavy Duty" is a series name. "110 stitch applications" is not 110 stitches; Singer lists 32.
- Throat measured needle-to-body or including the harp height? Not published.
- Speed: manufacturer max 1,100 spm; retailer copy matches.
- Dimensions: the 39 x 16 x 30 cm figure is from a directory site and is smaller than the 4423 body Singer dealers list (18.1 x 8.8 x 13.9 in). Treat as unverified.

## Manufacturer claims (attribute, do not assert)

- "designed with your heavy duty projects in mind, from denim to canvas" (manufacturer claim, singer.com product page)
- "Non-Stick Foot ... allows for effortless sewing of leather, plastic, vinyl" (manufacturer claim, Singer product sheet)
- "Even Feed / Walking Foot evenly feeds multiple layers ... eliminating slipping and puckering" (manufacturer claim, Singer product sheet)
- "50% more power for thick fabrics" (retail copy, Amazon title)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP has a new listing and a "Factory Serviced" listing. Accessory list on SMP not in snippet; Singer sheet list recorded above.
- Price seen and date: $299.00 regular; $159.99 factory serviced (snippet, 2026-09-29).
- Authorized dealer statement present? Not seen in snippets. Do not assert.

## Spec conflicts

- Accessory pack: Singer sheet lists even feed foot, non-stick foot and clearance plate as the 4452 extras; one comparison site says the difference is a satin stitch foot. Catalog uses Singer's list.
- Price: $299.00 (SMP) vs $309.99 (singer.com, second hand). Catalog uses $299.
- Dimensions: third-party cm figure inconsistent with the sibling 4423. [verify]
- Weight: not found. Null.

## Buyer questions (PAA / forums)

1. What is the difference between the Singer 4452 and 4432?
2. Does the Singer 4452 come with a walking foot?
3. Can the Singer 4452 sew leather and vinyl?
4. Is the Singer 4452 good for quilting?
5. How much does the Singer 4452 weigh?
6. Is the Singer 4452 good for beginners?
7. What is the clearance plate for on the Singer 4452?
8. Is the Singer 4452 worth the extra money over the 4423?
9. What needles does the Singer 4452 use?

## Owner themes (paraphrase + attribute)

1. Same head, different packs: PatternReview members treat the 4423, 4432 and 4452 as one machine with different stitch counts and accessories. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/111789)
2. Accessories are the reason: review roundups say the walking and nonstick feet justify the 4452 over the 4432, and the head is identical. (positioning: https://bobbinhub.com/singer-4432-vs-4452/)
3. Denim yes, tension sometimes: a dealer review page repeats the 44-series pattern of strong denim hems with a minority of tension and bobbin complaints. (positioning: https://arlingtonsew.com/singer-4452-heavy-duty-sewing-machine-review/)

## Cross-shop set

1. `singer-4432`: identical head without the accessory pack.
2. `brother-st371hd`: rival with a nonstick foot in the box, 37 stitches, slower motor.
3. `juki-tl-2010q`: the step up for buyers who outgrow the Singer on quilts or bags.

## Editorial angle

For beginners who want the accessories a heavy fabric project needs on day one; settles whether the 4452 pack is worth its premium over the 4432.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (singer.com not fetchable; snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs/singer-4452.json)
- [x] No hands-on claims ("we tested", "in our hands")
