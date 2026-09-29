# Content plan and milestones

last_updated: 2026-09-29
status: living. Linear project "Stitch" (P-WEB-47) is the tracker; this file is the map.

Every item below is a Linear issue with: what (the URL and page type), why (the keyword row from `docs/research/_keywords.md` and the funnel stage), and how (research needed, sources to check, definition of done). Volumes are Ahrefs US monthly as of 2026-09-29.

## Milestones

| # | Milestone | Outcome | Gate |
|---|---|---|---|
| M0 | Foundation | Repo, design system, registries, shared components, SEO plumbing, validator, CI, reference pages of every type built from real research | `check:catalog`, `typecheck`, `lint`, `build` green; screenshots at 390 and 1280 |
| M1 | Heavy duty cluster | Hub 1 + 9 reviews + the Singer three-way + thick-fabric and mechanical-vs-computerized guides, all specs verified against live manufacturer pages | Every review in the hub has `specsVerified` set and 0 unresolved `[verify]` on decision-critical rows (speed, stitches, throat, weight) |
| M2 | Sergers cluster | Hub 2 (+ coverstitch section) + 8 reviews + 2 compares + what-is-a-serger, serger-vs-sewing-machine, coverstitch-vs-serger guides | Same gate; `/guides/what-is-a-serger` owns the 8,700 TP topic |
| M3 | Quilting cluster | Hub 3 + 6 reviews + TL compare + how-to-choose and long-arm-cost guides (cost guide sourced and published) | Same gate; long-arm cost table fully sourced |
| M4 | Brands | 8 brand hubs + Juki TL/DDL/MO and Baby Lock serger hubs with 2+ models each; brand-ranked guide | Every series hub has 2+ models; every brand hub has 2+ models |
| M5 | Feeder and expansion | Beginner hub, backlog reviews by keyword volume (Janome HD9, Singer 6600C/6700C, Juki HZL-F600, Juki DNU-1541S, Babylock Imagine), brother-vs-singer brand compare decision | Each new page maps to a keyword row and a SERP format |
| M6 | Launch and measurement | Domain, Cloudflare, GA4, GSC, affiliate approval, sitemap submitted, rank tracking, weekly loop running | First 28 days of GSC data; first approved conversion |

## Research needed per page type (what, why, how)

**Model review.** What: `data/specs/{slug}.json` + `docs/research/{slug}.md`. Why: every number on the money page must trace to a manufacturer or dealer source; unverified numbers are the fastest way to lose reader trust and rankings. How: fetch the manufacturer product page and spec PDF, the SMP listing (bundle, price, date), two more dealer pages for conflicts; record stitch types and count, max spm, throat, needle system, presser-foot lift, trimmer, feed, buttonhole, motor, frame, weight, dimensions, included feet, US warranty; quote marketing claims as claims; paraphrase 2 to 4 owner threads with URLs; list 6 to 12 buyer questions; name the cross-shop set. Done: JSON valid, every non-null spec sourced, `specsVerified` set, `check:catalog` clean, review renders with 0 `[verify]` on speed, stitches, throat, weight.

**Job hub.** What: ranked shortlist of 5 to 8, short answer, side-by-side, FAQs. Why: the hubs own the highest-intent commercial keywords (1,600 to 2,000 volume each, KD 0 to 1). How: confirm every ranked model has a verified review; decide picks against the job's weights (About page); write the three intro lines and the short answer from the reviews, not the other way round; pull PAA questions for the FAQ. Done: hub renders, every card links a verified review, one value pick, related guides live.

**Compare.** What: rows, winners, buy-if copy. Why: the compare queries are exactly how the TL, 1034D and Singer buyers search. How: both reviews verified first; choose rows where the two differ; hand-declare winners only for text rows; write buyIf from the spec deltas. Done: tally correct, no `[verify]` in a winner row.

**Guide.** What: blocks, definition callouts, tables, FAQs, 2 or 3 CTAs. Why: awareness guides carry the biggest traffic potential on the site and feed the hubs. How: pull the facts from `_guide-facts.md` and source anything missing; check the SERP format note; draft to the standfirst-first structure; no CTA above the end section. Done: sourced tables, FAQ schema, TOC ids unique, status published.

**Brand hub / series hub.** What: intro, glance, decoder rows, model grid. Why: brand queries are large (Juki 14,000, Janome 11,000, Singer Heavy Duty 11,000) and low KD. How: `_brands.md` for series meanings and warranty; every model in the grid needs a review. Done: decoder complete, 2+ models per series hub.

## Issue list (by milestone)

### M0 Foundation (this PR)
- Design system extraction and tokens (`docs/01-design-system.md`, `globals.css`)
- Keyword research pull (`_keywords.md`)
- Registries, shared components, SEO plumbing, validator, CI, screenshots script
- Reference pages: home, heavy-duty hub, Juki brand hub, Juki TL series hub, Juki TL-2010Q review, TL-2010Q vs TL-2000Qi, Singer 4423 vs 4432 vs 4452, serger vs sewing machine guide, reviews index, about, 404
- Retailer research (`_retailer-sewing-machines-plus.md`), brands research (`_brands.md`), SERP notes, guide facts

### M1 Heavy duty
- Verify and publish reviews: juki-tl-2010q (2,300), juki-tl-2000qi (800), juki-ddl-8700 (3,300), singer-4452 (3,500), singer-4423 (3,500), singer-4432 (1,200), janome-hd3000 (5,400), janome-mc6650 (400), brother-st371hd (1,500)
- Hub: best-heavy-duty-sewing-machines (1,600, TP 2,000)
- Compare: singer-4423-vs-4432-vs-4452 (200 + 200 + 100)
- Guides: sewing-machine-for-thick-fabric (200 + leather 800 + denim 300), mechanical-vs-computerized (150)
- Research: industrial-for-home section facts (servo vs clutch, table, needle systems) for the DDL review and hub

### M2 Sergers
- Verify and publish reviews: brother-1034d (2,000), brother-1034dx (800), juki-mo-654de (450), juki-mo-1000 (100), babylock-vibrant (250), brother-2340cv (250), janome-coverpro-2000cpx (80), singer-14t968dc
- Hub: best-sergers (400 + 500 + 450 + coverstitch machine 2,000 section)
- Compares: brother-1034d-vs-1034dx (250), brother-1034d-vs-juki-mo-654de
- Guides: what-is-a-serger (1,600, TP 8,700), serger-vs-sewing-machine (1,700), coverstitch-vs-serger (300)

### M3 Quilting
- Verify and publish reviews: handi-quilter-moxie (250), juki-tl-18qvp (350), grace-qnique-15r, brother-pq1600s, bernina-570-qe (350), plus juki-tl-2010q, juki-tl-2000qi, janome-mc6650 from M1
- Hub: best-quilting-machines (2,000, TP 3,200)
- Compare: juki-tl-2010q-vs-tl-2000qi
- Guides: how-to-choose-a-quilting-machine (large-throat 300, TP 3,900), how-much-does-a-long-arm-cost (150 + 60) sourced from `_long-arm-cost.md` and published

### M4 Brands
- Brand hubs: juki (14,000), janome (11,000), singer (11,000 Heavy Duty), brother (2,200 serger), babylock (1,000), bernina (7,200, KD 14), handi-quilter, grace-company
- Series hubs: juki/tl (450, TP 1,400), juki/ddl (3,300 for DDL 8700), juki/mo (1,500 juki serger), babylock/sergers (1,000); each needs a second model: juki-ddl-5550 (450), juki-mo-644d (250), babylock-victory (200) or babylock-imagine (200, TP 2,500)
- Guide: sewing-machine-brands-ranked (500 best brands + 70)

### M5 Feeder and expansion
- Hub: best-sewing-machines-for-beginners (7,900, TP 6,900)
- Backlog reviews by volume: janome-hd9 (1,400), singer-hd6600c (1,500), janome-hd1000 (1,300), bernina-1008 (1,300), singer-hd6700c (900), juki-hzl-f300 (800), singer-4411 (800), juki-dnu-1541s (700), janome-hd5000 (700), juki-hzl-f600 (500), janome-8002d (500), singer-14cg754 (500), handi-quilter-amara (300), brother-1634d (200)
- Compare decision: brother-vs-singer-sewing-machine (400) brand-level format
- Guide decision: industrial-sewing-machine-for-home (6,200 head term) once hub 1 ranks

### M6 Launch and measurement
- Domain and Cloudflare Worker, GA4 and GSC properties, sitemap submission, affiliate application and env, Ahrefs project, weekly loop per `docs/05-measurement.md`

## Backlog rules

Add a page only when it maps to a keyword row with a real parent topic, the SERP format matches the page type, and it has a commercial role or feeds a page that does. Do not add a page to complete a brand.
