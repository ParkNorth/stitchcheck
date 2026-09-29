# Research briefing: `janome-8002d`

last_updated: 2026-09-29
manufacturer_url: https://www.janome.com/product/8002d/
retailer_url: https://www.sewingmachinesplus.com/Janome-8002D.php
status: draft
evidence: owner

<!--
Method note: janome.com and dealer pages were not fetchable (egress blocked). Values come from WebSearch snippets
attributed to the URLs noted. [verify] rows need a live-page check.
-->

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | serger (3/4 thread convertible, 2 needle) | janome.com product page |
| Stitch types or built-in stitches | 3-thread and 4-thread overlock, flatlock, rolled hem, blind hem | sergerpro.com review and Amazon copy; Janome page says "wide array of overlock functions" without a list |
| Max speed (spm) | 1,300 | janome.com product page |
| Threads (sergers/coverstitch) | 3 or 4 | janome.com product page |
| Differential feed | 0.5 to 2.25 | janome.com product page; SMP repeats |
| Cutting width (mm) | 3.1 to 7.3 | janome.com product page |
| Stitch length (mm) | 1.0 to 4.0 | Amazon listing spec block |
| Throat / arm space (in) | n/a | |
| Needle system | HAx1SP, sizes 11 and 14 | 8002D instruction manual, manualslib.com |
| Presser foot lift / knee lifter | Adjustable presser foot pressure; snap-on feet; lift height not published | sewingmachinesplus.com listing copy |
| Thread trimmer | Not published | |
| Feed system | Differential feed; retractable upper knife; rolled hem via needle plate knob at R | janome.com product page |
| Threading system | Manual, color-coded guides with threading chart | janome.com product page |
| Buttonhole | n/a | |
| Motor / drive | Not published | |
| Frame | Not published | |
| Weight (lb) | 13.4 | Amazon listing [verify] |
| Dimensions W x D x H (in) | 15 x 13.5 x 14.5 | Amazon listing, possibly packaged size [verify] |
| Included feet / accessories | Standard serger foot, needles, screwdrivers, tweezers, foot control and power cord, instruction book and video | kenssewingcenter.com dealer copy |
| Warranty (US) | 25 yr materials and workmanship, 5 yr electrical, 1 yr labor | janome.com/support/warranty |
| List price (USD) | 360.00 sale (399.00 regular) | Seen 2026-09-29 at Sewing Machines Plus; page title notes a sale that expired 8/25/2025 |

## Unit / naming checks

- "8002D" is a catalog number. The "D" is not documented by Janome in any captured text; owners read it as differential feed but that is inference. The 8002D is not "more machine" than the Magnolia 7034D, which owners call virtually identical.
- A separate "8002DX" appears in a PatternReview needle thread. Not confirmed as a Janome replacement SKU.
- Throat: not applicable.
- Speed: Janome 1,300 spm; Amazon and dealers repeat 1,300.

## Manufacturer claims (attribute, do not assert)

- "Affordable and fast and offers a wide array of overlock functions in a sturdy and economical model" (manufacturer claim, product page)
- "Extra-smooth seams" (Amazon listing title)
- "Professional" (Walmart listing title, not Janome)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP title advertises a "FREE BONUS" with an expired sale date. Standard box per dealer copy: one foot, needles, tools, foot control, manual and video. SMP also lists a refurbished 8002D.
- Price seen and date: $399.00 regular, $360.00 sale (2026-09-29, snippet).
- Authorized dealer statement present? Not seen in snippet. Do not assert.

## Spec conflicts

- Dimensions: 15 x 13.5 x 14.5 in (Amazon) reads like a box size. No Janome figure. [verify]
- Weight: 13.4 lb (Amazon) only. [verify]
- Price: $360 sale vs $399 regular on a page with an expired-sale title. Catalog uses $360 dealer-variable.
- Free arm: no source states whether the 8002D has one. Null.

## Buyer questions (PAA / forums)

1. Is the Janome 8002D good for beginners?
2. Does it do a rolled hem? (Yes, knob-set.)
3. What needles does it use? (HAx1SP 11 and 14 per manual.)
4. 8002D vs Brother 1034D?
5. Does it do 2-thread stitches? (No.)
6. How fast is it?
7. Is it the same as the Magnolia 7034D?
8. Does it have a free arm? (Not published.)

## Owner themes (paraphrase + attribute)

1. A new owner reports a clean 4-thread stitch out of the box that held after rethreading several times. (owner: https://sewing.patternreview.com/review/machine/2920/)
2. A long-term owner calls it reliable on knits including narrow rolled lettuce hems and near-identical to the Magnolia 7034D. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/128654)
3. Needle questions for the 8002D and 8002DX are answered with HAx1SP or standard 130/705H household needles. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/103660)

## Cross-shop set

1. `brother-1034d`: the default budget 3/4-thread serger, same speed, has a free arm, usually cheaper.
2. `brother-1034dx`: Brother's refresh with right-side dials at a similar price.
3. `juki-mo-654de`: step up to 2/3/4 thread and 1,500 spm.

## Editorial angle

For a first-serger buyer deciding between the Brother 1034D and the Janome 8002D; settles what the Janome adds (wider differential range, knob-set rolled hem, dealer network, 25-year warranty) and what it leaves open (free arm, weight, 2-thread).

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs/janome-8002d.json)
- [x] No hands-on claims
