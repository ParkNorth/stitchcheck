# grace-qnique-15r run log

2026-10-02, Tier 2 treatment, interactive run, stopped at drafted. Stages ticked: maker, marketplaces, collected, claims, tags, rollup, checks, drafted (all eight per reviews:plan status). Rollup status left draft.

## Sources and counts
- Maker: graceframe.com 15R page, 15 Pro page, warranty page, 15R manual PDF (44 pages, file dated 2018-12-17; text extracted, needle pages OCRed). Grace's old 15R product page and the Sew Vac Direct / Premier Stitching 15R bundle listing now redirect to home pages.
- 25 sources ok (9 Reddit, 9 editorial incl. maker and dealer pages, 6 forum, 1 retailer), 9 blocked or dead, 192 items, 161 claim segments (above the 150 floor). Claims: 94 accepted, 0 rejected (78 spec: this 58, sibling 5, unclear 13; 6 comparison; 10 difference). Tags 78. Themes 8, 23 voices, 17 first-hand, evidence label owner (voices are per page or thread, so a forum thread is one voice; Leah Day, a disclosed Grace dealer and partner, is 3 of the 17).
- Budget used: about 10 Firecrawl scrapes plus 1 search, 3 DataForSEO calls (Amazon search twice at about $0.003, one SERP pull), 2 Ahrefs pulls (limit 25).

## Marketplaces
- Amazon: no 15R listing (two searches). Walmart: none found. Grace store page: 15R shown as out of stock, product page redirects home.
- Only retailer rating: Sewing Machines Plus "Qnique long arm quilter" 4.49 of 5, 79 reviews, 2014 to 2024. It sells a recertified 15 PRO and pools several Q'nique heads: 3 of 79 reviews name the 15R, 2 the 15 PRO, 1 the 15M. scopeRules added so only reviews naming the 15R count. The stage ticks only because of this pooled listing; do not present the rating as a 15R rating.

## Blocked and gaps
- Facebook groups (Quilting With Grace has the most 15R threads): 7 posts registered as blocked. sewnbysophia.com review: DNS fails (plain HTTP and Firecrawl), only the briefing snippet exists. justanswer.com 403. APQS forum thread is a 811 character for-sale post. YouTube recorded as titles only.
- Reddit collector only finds threads naming the model in title or post (9 threads, 2 with the model in the title); 15R comments inside other threads are missed. Q'nique 14+ and BlockRockIt names added as aliases on Leah Day's say that 14+ is the same machine; a few claims are scope unclear for that reason.
- Needle system, included presser feet: not in Grace's documents (manual names none).

## Changes the page needs (conflicts, listed not resolved)
- Status: Grace's 15R page says "No longer available for new purchase" and points to the 15 Pro; the briefing and one dealer say the 15 PRO was discontinued and replaced by the 16X; Leah Day lists 15R as now 16x. data/specs has discontinued false and a $5,198 bundle price from a listing that no longer resolves.
- Machine-only MSRP is now published: $4,499.95 (15 PRO $4,999.95, 15M $3,499.95); packages $6,499.90 hoop, $6,699.90 Queen, $7,499.90 Continuum II. Recertified 15R $3,099 via Google Shopping.
- Warranty: machine page says electronics 1 yr, warranty page lists the electronic parts under the 2 year term; not transferable. data/specs says "mechanical parts"; Grace says non-moving.
- data/specs cites the manual for needle 135x5 but the manual does not state it; only a dealer's 15 PRO page does. Draft spec.json moves the source and flags it.
- Manual adds: dimensions 19 x 15.5 x 23 in, 300 W peak, 90 to 1,800 spm, 4 to 16 SPI, oil schedule, M class bobbin, 42 lb.
- Throat: Grace measures 15 in to the back of the work area (needle to body, rule 11), 8.5 in high; Leah Day's "almost 10 in vertical space" is usable width. 15 in head is an entry long-arm on a frame.
- 15R and 15 PRO both show 300 W peak, so "more powerful motor" is a speed rating.
- Rollup has no rivals block (Moxie comparisons too few) and siblings 15M has maker rows only; the 19X sibling row rests on one reviewer, Grace's 19X page not fetched.

## Checks
reviews:checks: 0 errors, 3 warnings (few Reddit titles; maker contradicts needleSystem and warrantyUs, which the draft spec.json conflicts cover but data/specs does not yet). reviews:draft check: 0 errors, 0 warnings. reviews:sheet wrote reports/review-sheet.md (outside this folder, regenerated, may replace another model's sheet).
paa: DataForSEO returned 9 PAA, mostly Grace frame and brand questions; all Ahrefs question keywords volume 0; head terms 20 to 40 a month. 9 FAQs used.
