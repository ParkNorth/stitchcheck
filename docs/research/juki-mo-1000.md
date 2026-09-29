# Research briefing: `juki-mo-1000`

last_updated: 2026-09-29
manufacturer_url: https://www.jukihome.com/products/serging/mo-1000.html
retailer_url: https://www.sewingmachinesplus.com/juki-mo-1000.php
status: draft
evidence: owner

<!--
Method note: jukihome.com and dealer pages were not fetchable (egress blocked). Values come from WebSearch snippets
attributed to the URLs noted. [verify] rows need a live-page check.
-->

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | serger (2/3/4 thread, 2 needle, jet air looper threading) | jukihome.com product page |
| Stitch types or built-in stitches | 2, 3 and 4-thread overlock stitches, rolled hem; stitch count not published | jukihome.com |
| Max speed (spm) | 1,500 | jukihome.com |
| Threads (sergers/coverstitch) | 2, 3 or 4 | jukihome.com |
| Differential feed | knob-adjustable; ratio not published in results | jukihome.com feature copy |
| Stitch width (mm) | overlock width up to 9 (0.4 in); reviews give right needle 3 to 7, left needle 5 to 9 | jukihome.com (9 mm); sergerpro.com review (per-needle) |
| Stitch length (mm) | 1 to 4 (max 0.2 in) | jukihome.com (max); review (min) |
| Throat / arm space (in) | throat height 72.4 mm (2.85 in) | jukihome.com brochure PDF (mo-1000_brochure_web.pdf) |
| Needle system | not captured | |
| Presser foot lift / knee lifter | adjustable presser foot pressure; lift height not published | jukihome.com |
| Thread trimmer | not published | |
| Feed system | differential feed; knife disengages mid-seam | quiltersreview.com; clothhabit.com |
| Threading system | jet air looper threading (push button, upper and lower, any order); automatic needle threader; upper looper converter for 2/3 thread | jukihome.com |
| Rolled hem | yes | jukihome.com |
| Buttonhole | n/a | |
| Motor / drive | not published (air burst "sent from the electric motor" per Juki) | |
| Frame | not published | |
| Weight (lb) | not published (see conflicts) | |
| Dimensions W x D x H (in) | not recorded (review figure 15.4 x 15.2 x 16.3 reads as carton) | |
| Included feet / accessories | standard foot; instructional DVD, thread nets, oiler, needle set, tweezers, scrap catcher, looper threader, spool caps, screwdriver, brush/needle inserter, dust cover, electronic foot control, foam thread pad, cone holders | quiltersreview.com accessory list [verify against Juki box list] |
| Warranty (US) | not confirmed for this model | one dealer quotes "1 year service warranty"; Juki household terms not captured |
| List price (USD) | 1,499.00 (sale; regular $2,299.00) | Seen 2026-09-29 at Sewing Machines Plus (juki-mo-1000.php) |

## Unit / naming checks

- Model number vs anything it implies: "MO-1000" is a catalog code; "1000" is not a speed or stitch count.
- Throat: Juki publishes throat height (72.4 mm), not width.
- Speed: Juki 1,500 spm; dealers match. Juki's "10,000 stitches in under seven minutes" is the same figure restated.

## Manufacturer claims (attribute, do not assert)

- "Threads itself at the push of a button using only a burst of air" (manufacturer claim, product page)
- "You do not need to thread in order" (manufacturer claim, product page)
- "Specially designed to reduce vibration while sewing" (manufacturer claim, product page)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP has two listings, "juki-mo-1000.php" (base) and "mo-1000-kit.php" (kit). Kit contents not captured.
- Price seen and date: $1,499.00 sale, $2,299.00 regular, 2026-09-29 (base listing).
- Authorized dealer statement present? Not seen. Do not claim.

## Spec conflicts

- Weight: 20 lb (Walmart/dealer copy) vs 23 lb (sergerpro.com) vs 25.4 lb (one review). Juki figure not captured. Catalog leaves weight null and renders [verify].
- Dimensions: 15.4 x 15.2 x 16.3 in from a review; reads as carton. Not recorded.
- Warranty: dealer "1 year service" vs Juki household norm (5 yr mechanical, 2 yr electrical) not confirmed for MO-1000. Left null.

## Buyer questions (PAA / forums)

1. Does the MO-1000 thread the needles automatically too? (Yes, lever-type needle threader.)
2. Can you thread the MO-1000 by hand if the air system is not used?
3. Is the MO-1000 loud?
4. What comes in the box with the MO-1000?
5. Is air threading worth the price jump from the MO-654DE?
6. How much does the MO-1000 weigh?
7. What is the MO-1000 warranty?
8. Does the MO-1000 have a free arm?
9. Can the MO-1000 do a 2-thread stitch? (Yes, with the upper looper converter.)

## Owner themes (paraphrase + attribute)

1. Air threading and auto tension are the reasons owners buy it; the vacuum-style ports need less thread fed in than bellows systems. (owner: https://sewing.patternreview.com/review/machine/5344 ; https://sewcanshe.com/2016-10-3-product-review-juki-mo-1000-serger-with-jet-air/)
2. Tying on new thread and pulling through can leave a looper thread outside its tension disk; owners rethread fully with the air button. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/82262)
3. Dealer availability for service and a threader that is "good but not Bernina-level" are the cautions raised. (owner/blog: https://clothhabit.com/choosing-a-new-serger/)

## Cross-shop set

1. `juki-mo-654de`: same stitches and speed, manual threading, far cheaper.
2. `babylock-vibrant`: dealer-brand entry point for buyers heading toward Baby Lock's air-threading Celebrate.
3. `brother-1034d`: the budget anchor the MO-1000 premium is measured against.

## Editorial angle

For a sewist who has priced manual-threading sergers and wants to know exactly what the extra $1,000 buys: looper air threading, a needle threader and a taller throat, with the same stitch range.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs JSON)
- [x] No hands-on claims
