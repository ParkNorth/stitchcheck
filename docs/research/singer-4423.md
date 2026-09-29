# Research briefing: `singer-4423`

last_updated: 2026-09-29
manufacturer_url: https://www.singer.com/products/singer-4423-heavy-duty-sewing-machine
retailer_url: https://www.sewingmachinesplus.com/singer4423.php
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

Research method note: singer.com and dealer sites were blocked by the egress proxy. Values come from WebSearch snippets; the URL is the page the snippet was drawn from.

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | mechanical | singer.com product page |
| Stitch types or built-in stitches | 23 built-in: 6 basic, 4 stretch, 12 decorative, 1 one-step buttonhole | singer.com product page |
| Max speed (spm) | 1,100 | singer.com product page |
| Threads (sergers/coverstitch) | n/a | |
| Differential feed | n/a | |
| Throat / arm space (in) | Not published | |
| Needle system | Not found in snippets | |
| Presser foot lift / knee lifter | Adjustable presser foot pressure; lift height not published | singer.com product page |
| Thread trimmer | None (manual cutter not mentioned in snippets) | |
| Feed system | Drop feed; top drop-in bobbin | singerco.co.uk/4423.html spec block |
| Buttonhole | 1-step automatic | singer.com product page |
| Motor / drive | Not published. Singer: "strong motor" | singer.com product page |
| Frame | Heavy-duty metal interior frame; stainless steel bedplate | singer.com product page |
| Weight (lb) | 14.6 | sewingpartsonline.com listing spec block ("Machine Weight") |
| Dimensions W x D x H (in) | 18.1 x 8.8 x 13.9 | sewingpartsonline.com listing ("13.9 H x 18.1 W x 8.8 D") |
| Included feet / accessories | All-purpose, zipper, buttonhole, button sewing feet (4 snap-on); seam ripper and lint brush, quilting guide, needles, bobbins, screwdriver, auxiliary spool pin, spool pin felt, soft dust cover | singerco.co.uk/4423.html accessory list |
| Warranty (US) | 25 yr limited head; 2 yr motor, light, wiring, switches, speed control, electronics; 90 days adjustments, belts, rings, bulbs, attachments | singer.com/pages/singer-sewing-machine-warranty-coverage |
| List price (USD) | 289.99 | Seen 2026-09-29 at Sewing Machines Plus (snippet; open box $179). Michaels and Walmart $229.99 |

## Unit / naming checks

- Model number vs anything it implies: "Heavy Duty" is a Singer series name, not a duty rating. "97 stitch applications" in retail titles is not 97 stitches; Singer lists 23.
- Throat measured needle-to-body or including the harp height? Not published.
- Speed: manufacturer max 1,100 spm; retailer copy matches.

## Manufacturer claims (attribute, do not assert)

- "designed with your heavy duty projects in mind, from denim to canvas" (manufacturer claim, singer.com product page)
- "powerful motor provides extra high sewing speed" (manufacturer claim, singer.com product page)
- "heavy-duty metal frame ensures stability" (manufacturer claim, singer.com product page)
- "50% more power for denim and canvas" (retailer copy, Amazon title; baseline undefined)
- "true workhorse" (retailer copy, Walmart)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP listing title "23 Stitch Patterns, 1,100 SPM & Stainless Steel Bed" matches Singer. Open box unit listed separately.
- Price seen and date: $289.99 regular, $179 open box (snippet, 2026-09-29).
- Authorized dealer statement present? Not seen in snippets. Do not assert.

## Spec conflicts

- Price: $289.99 (SMP) vs $229.99 (Michaels, Walmart). Catalog will use SMP as retailer of record and note the spread.
- Stitch count: 23 (Singer) vs "44-Stitch" (a Walmart listing title) vs "97 applications" (Amazon). Catalog uses 23.
- Weight: 14.6 lb (Sewing Parts Online). Singer.com weight not in snippet.

## Buyer questions (PAA / forums)

1. Is the Singer 4423 really heavy duty?
2. Can the Singer 4423 sew leather?
3. Can the Singer 4423 sew through multiple layers of denim?
4. What is the difference between the Singer 4423 and 4432?
5. Is the Singer 4423 good for beginners?
6. Does the Singer 4423 have a walking foot?
7. What needles does the Singer 4423 use?
8. Why does my Singer 4423 keep jamming or looping thread?
9. How heavy is the Singer 4423?
10. Can the Singer 4423 do free motion quilting?

## Owner themes (paraphrase + attribute)

1. Same head, different packs: PatternReview members treat the 4423, 4432 and 4452 as one machine with different stitch counts and accessories, and advise buying on price. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/111789)
2. Recurring faults: a roundup pooling 50 plus complaints from Reddit and PatternReview finds bobbin case, tension looping and skipped stitches dominate, mostly from threading missteps; owners hand-crank very thick seams to avoid needle breaks. (owner-derived: https://threadedmachines.com/brands/singer/4423-review/problems/)
3. Versus Janome: a PatternReview thread says the Janome HD3000 is quieter and smoother but the Singer wins on value. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/117318)

## Cross-shop set

1. `singer-4432`: nine more stitches, otherwise the same machine.
2. `janome-hd3000`: quieter aluminum-bodied mechanical with adjustable pressure at a higher price.
3. `brother-st371hd`: Brother's entry heavy fabric machine with 37 stitches and a nonstick foot.

## Editorial angle

For first-machine buyers who typed "heavy duty sewing machine" and need to know what the 4423 will and will not sew before they pick between it, its siblings and the Janome.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (singer.com not fetchable; snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs/singer-4423.json)
- [x] No hands-on claims ("we tested", "in our hands")
