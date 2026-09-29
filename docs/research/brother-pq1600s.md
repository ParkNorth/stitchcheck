# Research briefing: `brother-pq1600s`

last_updated: 2026-09-29
manufacturer_url: https://www.brother-usa.com/products/pq1600s
retailer_url: https://www.sewingmachinesplus.com/PQ1600S.php
status: draft
evidence: mixed

<!--
Method note: brother-usa.com and retailer domains were blocked by the egress proxy; values come from search result snippets with the source page named.
-->

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | mechanical (high speed straight stitch) | brother-usa.com |
| Stitch types or built-in stitches | Straight stitch only | brother-usa.com |
| Max speed (spm) | 1,500 | brother-usa.com |
| Max stitch length | 7 mm | brother-usa.com |
| Threads (sergers/coverstitch) | n/a | |
| Differential feed | n/a | |
| Throat / arm space (in) | 8.7 in wide x 5.7 in tall needle to arm | brother-usa.com ("5.7 x 8.7 needle-to-arm space") |
| Throat height (in) | 5.7 in (Brother) / 5.75 in (sewingpartsonline.com) | see conflicts |
| Stitch regulation | None | |
| Needle system | not published / not found | |
| Needle threader | F.A.S.T. automatic threader | sewingmachinesplus.com PQ1600S listing |
| Bobbin | Side loading | sewingpartsonline.com |
| Presser foot lift / knee lifter | Built in knee lifter; 4 level color coded presser foot pressure dial | brother-usa.com |
| Thread trimmer | Thread cutter (owner report; Brother copy lists automatic features) | forum.missouriquiltco.com |
| Feed system | Pin feed mechanism swaps feed dogs for a single pin; 4 level feed dog height | brother-usa.com |
| Buttonhole | n/a | |
| Motor / drive | not published / not found | |
| Frame | not published / not found | |
| Weight (lb) | 23.8 lb | amazon.com PQ1600S listing |
| Dimensions W x D x H (in) | 18.1 x 7.7 x 12.6 | amazon.com PQ1600S listing |
| Included feet / accessories | 7 accessory feet; 11.1 x 23.3 in wide table | brother-usa.com |
| Warranty (US) | 1 yr labor / 2 yr electrical / 25 yr limited | sewingmachinesplus.com PQ1600S listing |
| List price (USD) | $579.99 | Seen 2026-09-29 in search snippet for the Brother / Sewing Machines Plus listing set; page not opened, [verify] |

## Unit / naming checks

- Model number vs anything it implies: PQ1600S succeeds the PQ1500SL; the 1500 in the old name and the 1,500 spm speed are the same number by coincidence of naming, the 1600 is not a speed.
- Throat measured needle-to-body or including the harp height? Brother gives both: 8.7 in width and 5.7 in height.
- Speed: 1,500 spm consistent across manufacturer and retailers.

## Manufacturer claims (attribute, do not assert)

- "maximum fabric control" (manufacturer, brother-usa.com)
- "Heavy-Duty Quilting" (dealer listing title, premierstitching.com)
- "powerhouse" (owner and retailer language)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP title "High Speed 1500 SPM Straight Stitch Sewing and Quilting Machine"; feet count not compared because the page could not be opened.
- Price seen and date: $579.99 appeared in snippet set; not confirmed on page (2026-09-29).
- Authorized dealer statement present? Not verified.

## Spec conflicts

- Throat: 8.7 x 5.7 in (Brother) vs 8.5 in x 5.75 in (sewingpartsonline.com). Catalog will use Brother's figures and note the retailer's.
- Price: snippet only. Catalog will render [verify] until read on page.
- Needle system: not published. Do not inherit the PQ1500SL's 130/705H without a source.

## Buyer questions (PAA / forums)

1. Is the Brother PQ1600S the same as the PQ1500SL?
2. Brother PQ1600S or Juki TL-2010Q for quilting?
3. How much throat space does the PQ1600S have?
4. What is the pin feed on the PQ1600S for?
5. Does the PQ1600S do zigzag?
6. Does the PQ1600S have a knee lifter and thread cutter?
7. What is the Brother PQ1600S warranty?
8. Can the PQ1600S go on a quilting frame?

## Owner themes (paraphrase + attribute)

1. Chose the Brother on price, has finished several king and queen quilts, values the knee lift and thread cutter, does not do detailed free motion. (owner: https://forum.missouriquiltco.com/forum/we-don-t-know-much-but-we-know-quilters/general-discussion/67733-juki-2010q-vs-brother-1500-pq-1500s)
2. Juki owners in the same comparisons describe heavier, quieter machines that need frequent oiling; Brother positioned as the value buy. (owners: https://sewing.patternreview.com/SewingDiscussions/topic/106516)
3. Beginner groups ask PQ1600S or TL-2010Q directly, confirming the cross shop. (group: https://www.facebook.com/groups/quiltforbeginner/posts/1181044963379200/)

## Cross-shop set

1. `juki-tl-2010q`: the direct rival, die cast body, usually more expensive
2. `juki-tl-18qvp`: dealer Juki with micro lifter at about three times the price
3. `janome-mc6650`: utility stitches and 10 in throat instead of straight stitch speed
4. `handi-quilter-moxie`: skip the domestic step and buy a frame longarm

## Editorial angle

For the quilter choosing between the Brother and the Juki TL on price, and who needs the throat numbers stated plainly.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified (manufacturer page not opened; snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ, verdict, whoFor, skipIf, strengths, weaknesses, checks, realCost, alternatives (in JSON)
- [x] No hands-on claims
