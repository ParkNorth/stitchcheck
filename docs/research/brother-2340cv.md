# Research briefing: `brother-2340cv`

last_updated: 2026-09-29
manufacturer_url: https://www.brother-usa.com/products/2340cv
retailer_url: https://sewingmachinesplus.com/products/brother-2340cv-coverstitch
status: draft
evidence: owner

<!--
Method note: brother-usa.com and dealer pages were not fetchable (egress blocked). Values come from WebSearch snippets
attributed to the URLs noted. [verify] rows need a live-page check.
-->

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | coverstitch (chain and cover stitch; no knife) | brother-usa.com product page |
| Stitch types or built-in stitches | narrow cover 3 mm, wide cover 6 mm, triple cover, 2-thread chain stitch | brother-usa.com |
| Max speed (spm) | 1,100 | brother-usa.com |
| Threads (sergers/coverstitch) | 1, 2 or 3 needles plus 1 looper (2, 3 or 4 threads) | brother-usa.com |
| Differential feed | 0.7 to 2.0 | officedepot.com listing spec [verify on Brother page] |
| Stitch width (mm) | 3 or 6 | brother-usa.com |
| Stitch length (mm) | 2.0 to 4.0 | officedepot.com listing spec [verify] |
| Throat / arm space (in) | not published | |
| Needle system | SCHMETZ 130/705H 90/14; 130/705H SUK ball point for knits | Brother manual via manualslib.com/manual/22076 |
| Presser foot lift / knee lifter | about 5 to 6 mm | sewingmachinefun.com review citing manual [verify] |
| Thread trimmer | not published | |
| Feed system | differential feed; no cutting knife | brother-usa.com; dealer copy |
| Threading system | color-coded lay-in; looper threading lever | brother-usa.com |
| Chain stitch | yes, 1 needle, 2 thread | brother-usa.com |
| Free arm | not published in results | |
| Buttonhole | n/a | |
| Motor / drive | not published | |
| Frame | metal frame | officedepot.com listing ("sturdy metal frame") |
| Weight (lb) | 16.7 | officedepot.com listing spec |
| Dimensions W x D x H (in) | not published in results | |
| Included feet / accessories | standard foot and hem sewing foot; accessory bag: needle set, 4 thread nets, tweezers, 4 spool caps, 4 spool mats, cleaning brush, hex wrench, soft cover, manual | Sewing Machines Plus listing copy |
| Warranty (US) | 25 yr chassis casting; 6 yr electronic components and PCBs (labor excluded); 2 yr parts, labor, accessories | Sewing Machines Plus listing copy of Brother warranty |
| List price (USD) | 579.99 | Seen 2026-09-29 at Walmart (search snippet, listing URL not captured); eBay listing also $579.99; SMP price not in snippet |

## Unit / naming checks

- Model number vs anything it implies: "CV" = cover stitch. Retailer titles say "Coverstitch Serger"; it is not a serger (no knife, no overlock).
- Throat: not published.
- Speed: Brother 1,100 spm; retailer titles match.

## Manufacturer claims (attribute, do not assert)

- "Professional hems, chain stitch and decorative stitching" (manufacturer claim, product page)
- "Sturdy metal frame" (retailer listing title)
- "Easy looper threading" (manufacturer feature copy)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP title "Brother 2340CV Chain and Cover Stitch Machine with 1, 2 or 3 Thread Stitching"; listing copy gives the accessory bag list above and two feet. A refurbished listing also exists.
- Price seen and date: not in snippet for SMP; Walmart $579.99 on 2026-09-29.
- Authorized dealer statement present? Not seen. Do not claim.

## Spec conflicts

- Price: Walmart/eBay $579.99 vs SMP not captured. Catalog will use $579.99 labeled marketplace.
- Stitch length 2.0 to 4.0 mm from retailer; Brother figure not captured. Flag [verify].
- "Serger" in retailer titles vs coverstitch-only function. Catalog type: coverstitch.

## Buyer questions (PAA / forums)

1. Can the Brother 2340CV do a chain stitch? (Yes.)
2. Can the 2340CV serge or overlock? (No.)
3. How do you unpick a coverstitch from the 2340CV?
4. What needles does the 2340CV use? (130/705H; SUK ball point for knits.)
5. Does the 2340CV have a free arm?
6. Why does the 2340CV skip stitches on knits?
7. How does the 2340CV compare with the Janome CoverPro 2000CPX?
8. What feet come with the 2340CV?
9. Is the 2340CV worth it for hemming t-shirts?

## Owner themes (paraphrase + attribute)

1. One owner who replaced a Baby Lock coverstitch says it has never skipped; others say it skips until needles are fresh and matched to the fabric. (owner: https://sewing.patternreview.com/review/machine/5678)
2. A long thread runs from "greatest machine ever" to "throw it out the window"; the split tracks with needle choice and stabilizer on thin knits. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/21953)
3. No automatic tension release; removing work and unpicking is the weak point in the design. (owner/blog: https://growyourownclothes.com/2017/07/27/brother-2340cv-cover-stitch-machine-survival-guide/)

## Cross-shop set

1. `janome-coverpro-2000cpx`: wider bed, free arm, tension release lever, a few hundred more.
2. `singer-14t968dc`: serger and coverstitch combo at a similar price.
3. `brother-1034d`: the serger most owners pair with the 2340CV.

## Editorial angle

For a serger owner deciding whether the cheapest brand-name dedicated coverstitch is enough, or whether the Janome's bed size and tension release justify the price gap.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs JSON)
- [x] No hands-on claims
