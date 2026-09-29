# Research briefing: `singer-4411`

last_updated: 2026-09-29
manufacturer_url: https://www.singer.com/products/singer-heavy-duty-4411-sewing-machine
retailer_url: https://www.sewingmachinesplus.com/singer4411.php
status: draft
evidence: owner

<!--
Rules (see AGENTS.md):
- Every number that lands in src/lib/products.ts must appear here, in the manufacturer's units, with a source note (URL + where on the page).
- "Not published" is a valid value. A guess is not. Unpublished rows render as [verify] on the page.
- Marketing language ("heavy duty", "industrial strength", "sews through anything") goes under Manufacturer claims, never in the spec table.
- Conflicts between sources are listed, not resolved here. The catalog entry picks a value and says why.
- Owner themes are paraphrased and attributed by URL. Never quote at length. Never invent a thread.
-->

Research method note: singer.com and dealer sites were blocked by the egress proxy. Values come from WebSearch snippets; the URL is the page the snippet was drawn from. "Not found in snippets" means no snippet surfaced the figure, not that Singer does not publish it.

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | mechanical | singer.com product page |
| Stitch types or built-in stitches | 11 built-in: 6 basic, 4 decorative, 1 four-step buttonhole; marketed as 69 stitch applications | singer.com product page; Amazon B003VWXZKG title |
| Max speed (spm) | 1,100 | singer.com product page |
| Threads (sergers/coverstitch) | n/a | |
| Differential feed | n/a | |
| Throat / arm space (in) | 6.25, dealer measurement "from the motor of the machine to the needle"; Singer does not publish | leahday.com/products/singer-heavy-duty-4411 |
| Needle system | Not found in snippets | |
| Presser foot lift / knee lifter | Not found in snippets; presser foot pressure adjustable | singer.com product page |
| Thread trimmer | Not found in snippets | |
| Feed system | Not found in snippets | |
| Buttonhole | 4-step | singer.com product page |
| Motor / drive | Not published. Singer: "60% stronger" than a standard motor | singer.com product page |
| Frame | Metal interior frame; stainless steel bedplate | singer.com product page |
| Weight (lb) | 14 | sewingpartsonline.com 4411 listing; 14.5 lb at sewingmachinedirectory |
| Dimensions W x D x H (in) | 15.5 x 6.2 x 12 (39.4 x 15.7 x 30.5 cm) | sewingmachinedirectory.com/sewing-machine/singer-4411/ |
| Included feet / accessories | All purpose, zipper, buttonhole, button sewing feet; quilting guide; needles; bobbins; spool caps; large and small spool holders; auxiliary spool pin; spool pin felt; screwdrivers; seam ripper and lint brush; soft dust cover | Amazon B003VWXZKG; singer.com product page |
| Warranty (US) | 25 yr head; 2 yr electrical; 90 days adjustments | singer.com/pages/singer-sewing-machine-warranty-coverage |
| List price (USD) | 209.99 sale, 269.99 regular | Seen 2026-09-29 at Sewing Machines Plus (snippet). Amazon deal post $179.99 |

## Unit / naming checks

- Model number vs anything it implies: "Heavy Duty" is a Singer series name. "4411" is the base 44-series head; 11 is the stitch count, which happens to match the last digits. "69 stitch applications" is not 69 stitches.
- Throat measured needle-to-body or including the harp height? Dealer measurement only, 6.25 in body to needle. Singer does not publish it. [verify]
- Speed: manufacturer max 1,100 spm; retailer copy matches.
- Needle threader: manual on the 4411; the automatic threader is the 4423 difference.

## Manufacturer claims (attribute, do not assert)

- "60% stronger" motor than a standard sewing machine motor (manufacturer claim, singer.com product page)
- "50% more power for denim and canvas" (Amazon listing title; a second figure from the same maker)
- "built to handle tough fabrics like denim, canvas, and leather" (retailer copy, Michaels listing)
- "professional-grade stitching" (retailer copy, Michaels listing)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP describes the machine and a parts and accessories collection; box list not in snippet. Singer and Amazon list 4 feet recorded above.
- Price seen and date: $209.99 sale from $269.99 regular (snippet, 2026-09-29). Singer also sells a refurbished 4411 on its own site.
- Authorized dealer statement present? Not seen in snippets. Do not assert.

## Spec conflicts

- Weight: 14 lb (parts dealer) vs 14.5 lb / 6.6 kg (directory). Catalog uses 14 lb flagged [verify].
- Motor claim: "60% stronger" (singer.com) vs "50% more power" (Amazon). Both claims, no baseline.
- Throat: dealer figure, not manufacturer. [verify]
- Price: $209.99 (SMP) vs $179.99 (Amazon deal) vs $90 clearance (forum). Catalog uses SMP.

## Buyer questions (PAA / forums)

1. What is the difference between the Singer 4411 and 4423?
2. Does the Singer 4411 have an automatic needle threader?
3. Is the Singer 4411 buttonhole 1-step or 4-step?
4. Can the Singer 4411 sew leather?
5. How much does the Singer 4411 weigh?
6. Is the Singer 4411 good for beginners?
7. What is the throat space on the Singer 4411?
8. Does the Singer 4411 have a free arm?
9. Is the Singer 4411 worth it or should I buy the 4423?

## Owner themes (paraphrase + attribute)

1. Layers: a PatternReview owner calls it a truly heavy machine that gets through more layers than most current domestics. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/53758)
2. Reputation and warranty: Quiltingboard members asked about the 4411 for jeans and jackets say they have not heard good things, and one owner reports a warranty refusal inside a year. (owner: https://www.quiltingboard.com/main-f1/singer-heavy-duty-t201481.html)
3. Canvas yes, leather with a hand start: marketplace buyer reviews praise six layers of canvas and simple setup, while critics cite the 4-step buttonhole, short pedal cable and the motor needing a hand start on leather. (buyer reviews: https://ebay.com/itm/154447978095)

## Cross-shop set

1. `singer-4423`: same head, 23 stitches, auto threader, 1-step buttonhole for a few dollars more.
2. `singer-4432`: 32 stitches and a nonstick foot on the same frame.
3. `brother-st371hd`: Brother's entry heavy fabric mechanical at a similar price.

## Editorial angle

For the buyer who found the 4411 on sale; settles whether the missing needle threader and 1-step buttonhole are worth the small step up to the 4423.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (singer.com not fetchable; snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs/singer-4411.json)
- [x] No hands-on claims ("we tested", "in our hands")
