# Research briefing: `singer-hd6700c`

last_updated: 2026-09-29
manufacturer_url: https://www.singer.com/products/singer-heavy-duty-6700c-sewing-machine
retailer_url: https://www.sewingmachinesplus.com/230255112.php
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

Research method note: singer.com and dealer sites were blocked by the egress proxy. Values come from WebSearch snippets; the URL is the page the snippet was drawn from. "Not found in snippets" means no snippet surfaced the figure, not that Singer does not publish it.

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | computerized | singer.com product page |
| Stitch types or built-in stitches | Basic, stretch, decorative plus lettering font; marketed as 411 stitch applications; singer.com quoted at 200 built-in stitch applications; no plain pattern count found | Amazon B08JH88BRN; bobbinhub 6700C vs 6800C |
| Max speed (spm) | 1,100 | Amazon B08JH88BRN title; bobbinhub |
| Threads (sergers/coverstitch) | n/a | |
| Differential feed | n/a | |
| Throat / arm space (in) | 6.4 (163 mm), needle to tower | sewingmachinesplus.com/230255112.php |
| Needle system | Not found in snippets | |
| Presser foot lift / knee lifter | Not found in snippets; presser foot pressure adjustable | sewingmachinesplus.com/230255112.php |
| Thread trimmer | None; tie-off button; auto cutter is a 6800C feature | bobbinhub.com/singer-6700c-vs-6800c/ |
| Feed system | Not found in snippets | |
| Buttonhole | 1-step automatic, 7 styles | kenssewingcenter.com 6700C page |
| Motor / drive | Not published. Singer: "powerful motor", "extra high sewing speed" | sewingmachinesplus.com/230255112.php |
| Frame | Full metal interior frame; stainless steel bedplate | sewingmachinesplus.com/230255112.php |
| Weight (lb) | 15.4 | sewingpartsonline.com 6700C listing; see conflicts |
| Dimensions W x D x H (in) | 17.5 x 7.5 x 11 | Amazon B08JH88BRN |
| Included feet / accessories | 10 feet: all purpose, zipper, buttonhole, blind hem, button sewing, Sew Easy, satin stitch, even feed (walking), open toe, cording; 4 Class 15 transparent bobbins; spool holders; spool pin felt; auxiliary spool pin; L screwdriver; brush and seam ripper; soft cover; needles | Amazon B08JH88BRN |
| Warranty (US) | 25 yr head; 2 yr electrical; 90 days adjustments | singer.com/pages/singer-sewing-machine-warranty-coverage |
| List price (USD) | 329.99 sale, 419.99 regular | Seen 2026-09-29 at Sewing Machines Plus (snippet). Bobbinhub quotes $329 |

## Unit / naming checks

- Model number vs anything it implies: "Heavy Duty" is a Singer series name. "6700C" does not encode a stitch count. "411 stitch applications" is a count of techniques, not stitches.
- Throat measured needle-to-body or including the harp height? Retailer copy: "working space between the needle and tower", 6.4 in.
- Speed: manufacturer max 1,100 spm; retailer copy matches.
- Type label: sewingpartsonline titles it "Mechanical Sewing Machine"; every other source says computerized. Dealer typo.

## Manufacturer claims (attribute, do not assert)

- "a workhorse with endless possibilities" (manufacturer claim, via SMP listing)
- "Strong Motor with Enhanced Piercing Power" (manufacturer claim, Walmart listing title)
- "able to sew through thick fabrics like denim and leather with ease" (manufacturer claim, singer.com via search summary)
- "411 stitch applications" (manufacturer count)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: SMP lists optional add-on packages; base list not in snippet. Amazon lists the 10-foot pack recorded above. Walmart sells an HD6700EXTBUN bundle with extension table.
- Price seen and date: $329.99 sale, $419.99 regular, 60-day money back and price match noted (snippet, 2026-09-29).
- Authorized dealer statement present? Not seen in snippets. Do not assert.

## Spec conflicts

- Stitch count: 200 built-in stitch applications (singer.com as quoted) vs 411 stitch applications (Amazon, Walmart, dealers). Catalog leaves stitchCount null.
- Weight: 15.4 lb (parts dealer) vs 14.6 lb (Amazon) vs 16.3 lb (review blog). Catalog uses 15.4 flagged [verify].
- Buttonhole styles: 7 (Ken's) vs unspecified (Amazon). [verify]

## Buyer questions (PAA / forums)

1. What is the difference between the Singer 6700C and 6800C?
2. Does the Singer 6700C have a thread cutter?
3. Does the Singer 6700C have needle up/down?
4. Does the Singer 6700C come with a walking foot?
5. How many stitches does the Singer 6700C have?
6. Is the Singer 6700C good for quilting?
7. How much does the Singer 6700C weigh?
8. Can the Singer 6700C do lettering?
9. Is the Singer 6700C good for beginners?

## Owner themes (paraphrase + attribute)

1. Tension on new units: owner help threads describe looping top thread after a clean test swatch; answers point to rethreading, lint in the bobbin area and the bobbin case screw. (owner Q&A: https://www.justanswer.com/small-appliance/oazku-new-heavy-duty-6700c-i-ve-using-few.html)
2. Retail verdict: Walmart owners rate it 4 of 5 over about 200 reviews, calling it smooth for quilting and clothing, with one saying it suits an experienced sewer more than a beginner. (retail owner reviews: https://www.walmart.com/reviews/product/454976108)
3. Line launch skepticism: PatternReview members note earlier Heavy Duty models were mechanical and ask what electronics add on a budget frame. (owner forum: https://sewing.patternreview.com/SewingDiscussions/topic/116413)

## Cross-shop set

1. `singer-hd6600c`: same head with fewer stitches and 5 feet for about $30 less.
2. `singer-4452`: the mechanical Heavy Duty with a walking foot; dials vs LCD.
3. `janome-mc6650`: the step up for quilters wanting a wider harp and knee lifter.

## Editorial angle

For a buyer weighing the three computerized Heavy Duty machines; settles whether the 6700C's feet and speed slider are worth more than the 6800C's thread cutter.

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (singer.com not fetchable; snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs/singer-hd6700c.json)
- [x] No hands-on claims ("we tested", "in our hands")
