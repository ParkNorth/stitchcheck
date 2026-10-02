# Research briefing: `juki-tl-18qvp`

last_updated: 2026-09-29
manufacturer_url: https://jukiquilting.com/products/haruka-tl-18qvp.html
retailer_url: https://sewingmachinesplus.com/products/juki-tl18qvp (listing exists; price not visible in results)
status: draft
evidence: mixed

<!--
Method note: manufacturer and retailer domains were blocked by the egress proxy; values come from search result snippets with the source page named.
-->

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | mechanical (single needle lockstitch, portable) | jukiquilting.com product page |
| Stitch types or built-in stitches | Straight stitch only | jukiquilting.com |
| Max speed (spm) | 1,500 (range 200 to 1,500) | qualitysewing.com listing; sewingpartsonline.com TL-2010Q vs TL-18QVP explainer |
| Max stitch length | 6 mm | jukiquilting.com |
| Threads (sergers/coverstitch) | n/a | |
| Differential feed | n/a | |
| Throat / arm space (in) | 8.5 in | sewingpartsonline.com product page |
| Throat height (in) | not published / not found | |
| Stitch regulation | None | |
| Needle system | HAx1 (130/705H) | qualitysewing.com spec page |
| Presser foot lift / knee lifter | Knee lifter lever included; Float function (micro lifter) 0 to 2 mm | qualitysewing.com; jackmansfabrics.com |
| Thread trimmer | Automatic | qualitysewing.com |
| Feed system | not published in snippets (drop feed on TL platform per TL-2010Q page, do not carry over without source) | |
| Buttonhole | n/a | |
| Motor / drive | not published / not found | |
| Frame | Aluminum die casting | jukiquilting.com |
| Weight (lb) | 25.4 lb (11.52 kg) | sewingpartsonline.com; meissnersewing.com |
| Dimensions W x D x H (in) | 17.8 x 8.6 x 13.8 (452 x 219 x 350 mm) | qualitysewing.com spec page |
| Included feet / accessories | Nine presser feet; power cord, 2 screwdrivers, HAx1 needles, 4 bobbins, knee lifter lever, oiler, spool cap, cleaning brush | jackmansfabrics.com; qualitysewing.com |
| Warranty (US) | 5 yr defective materials and workmanship; 2 yr motors, light, wiring, switches, speed control, electrical | qualitysewing.com spec page |
| List price (USD) | $1,899.00 | Seen 2026-09-29 at Quality Sewing (qualitysewing.com/products/juki-tl-18qvp-haruka-high-speed-sewing-and-quilting-machine); Juki says contact an authorized QVP dealer |

## Unit / naming checks

- Model number vs anything it implies: "TL-18QVP" is not an 18 in arm. Throat is 8.5 in. Juki gives no expansion for QVP; it appears only as a product-line label.
- Throat measured needle-to-body or including the harp height? 8.5 in is the needle to body width used across the TL family. Height not published.
- Speed: jukiquilting.com snippet reads "15000 SPM", an evident typo for 1,500. Dealers and brochure say 1,500.

## Manufacturer claims (attribute, do not assert)

- "industrial-quality sewing" (manufacturer, jukiquilting.com)
- "single-needle, lockstitch workhorse" (manufacturer, jukiquilting.com)
- "industrial-grade features" (dealer, qualitysewing.com)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP lists the model (regular and open box); contents not compared because the page could not be opened.
- Price seen and date: not visible in results (2026-09-29).
- Authorized dealer statement present? Not verified.

## Spec conflicts

- Speed: "15000" (jukiquilting.com typo) vs 1,500 (brochure, dealers). Catalog will use 1,500.
- Weight: 25.4 lb (Juki spec via dealers) vs 25.0 lb (Amazon). Catalog will use 25.4.
- Price: $1,899 (Quality Sewing) vs dealer only (Juki). Catalog will show $1,899 as a seen dealer price, not MSRP.

## Buyer questions (PAA / forums)

1. What is the difference between the Juki TL-18QVP and the TL-2010Q?
2. Is the TL-18QVP a long arm?
3. How big is the throat on the TL-18QVP?
4. What is the Float function on the Haruka?
5. Does the TL-18QVP do zigzag or only straight stitch?
6. What needles does the TL-18QVP use?
7. Can the TL-18QVP go on a quilting frame?
8. What is the Juki QVP warranty?
9. Why does the TL-18QVP price vary by dealer?

## Owner themes (paraphrase + attribute)

1. TL owners say there is not much difference from the TL-2010Q except price; the micro lift is small but useful on very thick seams. (owner: https://www.quiltingboard.com/main-f1/question-juki-tl-owners-t324265.html)
2. Retailer explainer: the TL-18QVP adds more feet and the micro lifter; throat and speed match the TL-2010Q. (retailer: https://www.sewingpartsonline.com/blogs/education/difference-between-juki-tl-2010q-and-juki-tl-18vp-straight-stitch-sewing-machines)

## Cross-shop set

1. `juki-tl-2010q`: same platform, lower price, no Float function
2. `brother-pq1600s`: other 1,500 spm straight stitch quilter, usually cheaper
3. `handi-quilter-moxie`: domestic quilter versus entry frame longarm
4. `janome-mc6650`: computerized 10 in throat at a similar price

## Editorial angle

For the quilter who has already decided on a Juki TL and needs to know whether the QVP version's Float function and dealer support justify the premium over the TL-2010Q.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified (manufacturer page not opened; snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ, verdict, whoFor, skipIf, strengths, weaknesses, checks, realCost, alternatives (in JSON)
- [x] No hands-on claims
