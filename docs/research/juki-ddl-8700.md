# Research briefing: `juki-ddl-8700`

last_updated: 2026-09-29
manufacturer_url: https://juki.com/ddl-8700 (catalog PDF: https://www.juki.co.jp/industrial_e/download_e/catalog_e/ddl8700.pdf)
retailer_url: https://sewingmachinesplus.com/products/sewing-machines-industrial-juki-ddl8700
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

Research method note: juki.com and dealer sites were blocked by the egress proxy. Values come from WebSearch snippets; the URL is the page the snippet was drawn from. Industrial: true. This is a head only. It requires a table, stand and motor, sold as a dealer bundle.

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | mechanical, industrial single needle lockstitch, head only | juki.com/ddl-8700 |
| Stitch types or built-in stitches | Straight stitch only (1) | juki.com/ddl-8700 |
| Max speed (spm) | 5,500 | juki.com/ddl-8700 spec table |
| Threads (sergers/coverstitch) | n/a | |
| Differential feed | n/a | |
| Throat / arm space (in) | Not found on juki.com in snippets. A review site says about 11 in needle to arm (not manufacturer) | bestsewingmachinereviewspot.com; treat as unverified |
| Needle system | DBx1 (16x231), sizes 9 to 18 | juki.com/ddl-8700 spec table |
| Presser foot lift / knee lifter | 13 mm max foot lift; knee lift via stand linkage | juki.com/ddl-8700 spec table |
| Thread trimmer | None on base 8700. DDL-8700-7 variant adds auto trimmer and foot lift | goldstartool.com DDL-8700-7 listing |
| Feed system | Drop feed, 4-row feed dog; max stitch length 5 mm; needle bar stroke 30.7 mm | juki.com/ddl-8700 spec table |
| Buttonhole | None | |
| Motor / drive | Not included with head. Bundles ship a clutch or servo motor; servo has a speed dial under the table | cutsew.com overview; dealer bundle listings |
| Frame | Cast industrial head; automatic lubricating full rotary hook, sealed oil pan; Juki New Defrix Oil No. 1 | juki.com/ddl-8700; jukijunkies.com listing |
| Weight (lb) | Head 28 kg (61.7 lb converted). Table and motor weight not published | juki.com/ddl-8700 spec table |
| Dimensions W x D x H (in) | Not found (head or table) | |
| Included feet / accessories | Dealer complete set: head, table, stand, motor, light, drawer. SMP: "Table Comes Assembled" with servo motor | sewingmachinesplus.com listing title; cutsew.com |
| Warranty (US) | Not found in snippets | |
| List price (USD) | 999 (servo + table + LED lamp, assembly required) | Seen 2026-09-29 at Walmart marketplace (snippet). SMP price not in snippet |

## Unit / naming checks

- Model number vs anything it implies: DDL-8700 is the standard light-to-medium head. Suffix -7 adds automatic thread trimming and foot lifting; -H is the heavy weight version; -B is a newer generation. Listings mix these.
- Throat measured needle-to-body or including the harp height? Not published in accessible sources.
- Speed: manufacturer max 5,500 spm. Actual speed depends on motor and pulley; a servo motor allows dialing down.
- Weight: Juki states kg for the head only; lb is a conversion.

## Manufacturer claims (attribute, do not assert)

- "High-speed, 1-needle, Lockstitch Machine" (manufacturer description, juki.com)
- "Fully Assembled Ready To Sew" (dealer claim, Cut Sew listing title)
- "Table Comes Assembled" (dealer claim, Sewing Machines Plus listing title)
- "incredible punching power" (review-site copy, not manufacturer)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP sells the head with table and servo motor, table shipped assembled. Juki sells the head only. Motor brand and wattage not in snippet.
- Price seen and date: not shown in snippet (2026-09-29). Walmart $999 and $899.99 for DIY servo bundles; $1,004.40 for the -H variant.
- Authorized dealer statement present? Not seen in snippets. Do not assert.

## Spec conflicts

- Head weight: 28 kg (Juki). No lb figure published; 61.7 lb is our conversion.
- Arm space: about 11 in (review site) vs not stated by Juki in snippets. Catalog leaves null with [verify].
- Price: $999 vs $899.99 (two Walmart listings) vs SMP unknown. Catalog will show $999 with "servo + table, DIY assembly" qualifier.
- Trimmer: base 8700 none; -7 has one. Some retail titles put "automatic" on the base model.
- Replacement: DDL-8000A (direct drive, built-in trimmer) is Juki's newer value line; DDL-8700 is still listed on juki.com. discontinued: false.

## Buyer questions (PAA / forums)

1. Does the Juki DDL-8700 come with a table and motor?
2. Should I get a servo motor or a clutch motor on a DDL-8700?
3. Can the Juki DDL-8700 sew leather?
4. How fast is the Juki DDL-8700 and can it be slowed down?
5. What needles does the DDL-8700 use?
6. Is the DDL-8700 self oiling?
7. What is the difference between the DDL-8700, DDL-8700-7 and DDL-8700-H?
8. Is the Juki DDL-8700 discontinued or replaced by the DDL-8000A?
9. Does the DDL-8700 use home sewing machine feet?
10. How heavy is a Juki DDL-8700 with the table?

## Owner themes (paraphrase + attribute)

1. Bag making upgrade: a PatternReview owner moving from domestics says she no longer hand cranks bulky seams; another says the servo makes speed very controllable. (owner: https://sewing.patternreview.com/review/machine/6136 ; https://sewing.patternreview.com/review/machine/6664)
2. First industrial nerves: newcomers ask if it can be sewn slowly and whether it handles leather coats; replies point to servo motors and the -H variant. (owner: https://sewing.patternreview.com/SewingDiscussions/topic/47594)
3. Feet and supplies: Quiltingboard members note it takes standard high shank feet and that bobbins and needles are easy to buy online; they recommend the servo. (owner: https://www.quiltingboard.com/main-f1/has-anyone-used-juki-ddl8700-t215960.html)
4. Motor swap: a gear-sewing forum thread walks through replacing a clutch motor with a servo for quieter, slower work. (owner: https://backpackinglight.com/forums/topic/juki-ddl-8700-motor-upgrade-help/)

## Cross-shop set

1. `juki-tl-2010q`: portable straight-stitch head for buyers without room for a 48 in table.
2. `juki-tl-2000qi`: same trade at the lower TL price.
3. `janome-hd3000`: beginners searching "heavy duty" need to see what a real industrial costs and requires.

## Editorial angle

For makers deciding whether to move from a domestic to a table-mounted industrial; settles what the DDL-8700 needs (table, servo motor, second machine) and which suffix fits their fabric.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (juki.com not fetchable; snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs/juki-ddl-8700.json)
- [x] No hands-on claims ("we tested", "in our hands")
