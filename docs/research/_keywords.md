# Keyword research (Ahrefs, US, pulled 2026-09-29)

Source: Ahrefs Keywords Explorer API v3 (`keywords-explorer-overview`, `keywords-explorer-matching-terms`), country US. Volume is monthly. KD is Ahrefs Keyword Difficulty (0 to 100). TP is Traffic Potential of the #1 page. CPC in USD. Every number below is a snapshot; re-pull monthly per `docs/05-measurement.md`.

Reading rule: a page is worth building when (a) it maps to one primary keyword with a real parent topic, (b) the dominant SERP format matches the page type we would build, and (c) it has a commercial role (a buy button that fits, or it feeds a hub that does). KD is near zero across this niche; the constraint is content quality and E-E-A-T, not link volume.

## Job hubs (primary money pages)

| URL | Primary keyword | Vol | KD | TP | CPC | Intent | Secondary keywords to fold in |
|---|---|---|---|---|---|---|---|
| `/best-heavy-duty-sewing-machines` | best heavy duty sewing machine | 1,600 | 0 | 2,000 | $0.40 | commercial | heavy duty sewing machine (6,000, parent topic is Singer Heavy Duty), sewing machine heavy duty (900), industrial heavy duty sewing machine (150, TP 3,700), best industrial sewing machine (350), best sewing machine for leather (200, TP 1,600), heavy duty sewing machine for leather (400, TP 2,800), upholstery sewing machine (1,000, TP 1,600), walking foot sewing machine (2,900) |
| `/best-sergers` | best serger | 400 | 2 | 1,000 | $0.40 | commercial | best serger sewing machine (500, TP 800), best sergers (200), best serger for beginners (450), best serger machine (200, TP 900), serger machine (11,000, KD 4, TP 7,100: informational-first, the `/guides/what-is-a-serger` page should own this), coverstitch machine (2,000, KD 0) as the coverstitch section, best coverstitch machine (150) |
| `/best-quilting-machines` | best sewing machine for quilting | 2,000 | 1 | 3,200 | $0.35 | commercial | best quilting sewing machine (700, TP 3,000), best quilting machine (150, TP 3,200), quilting machine (1,600), quilting sewing machine (1,200, TP 1,800), best quilting sewing machine with large throat (300, TP 3,900), best long arm quilting machine (150), mid arm quilting machine (250), long arm quilting machine (3,500, TP 10: SERP is shopping/brand; do not chase as a hub) |
| `/best-sewing-machines-for-beginners` (feeder) | best sewing machine for beginners | 7,900 | 0 | 6,900 | $0.40 | commercial | best beginner sewing machine (3,700), best sewing machine for beginners 2025 (1,100), best starter sewing machine (450, TP 9,900), best basic sewing machine (300, TP 9,400), best sewing machine for home use (500, TP 7,200), which sewing machine is best for home use (400), what is the best sewing machine for beginners (350) |

Note on `/best-heavy-duty-sewing-machines`: "heavy duty sewing machine" (6,000) has parent topic "heavy duty singer sewing machines" and TP 30, meaning the SERP is dominated by the Singer Heavy Duty product line and shopping results. We rank the hub for "best heavy duty sewing machine" and let the Singer 44xx reviews plus the three-way compare catch the brand-led volume.

## Brand hubs

| URL | Primary keyword | Vol | KD | TP | Notes |
|---|---|---|---|---|---|
| `/brands/juki` | juki sewing machine | 14,000 | 3 | 7,900 | Also juki (3,100, KD 42, navigational), juki sewing machines (1,300), sewing machine juki (350, TP 7,900). Strong brand demand and low KD. Priority 1 brand hub. |
| `/brands/juki/tl` | juki tl | 450 | 1 | 1,400 | juki tl2010q (2,300) + juki tl-2010q (900) + juki 2010q (700) + juki tl 2010q (700) all cluster to the review; juki tl-2000qi (800), juki tl18qvp (350), juki tl15 (300) |
| `/brands/juki/ddl` | juki ddl 8700 | 3,300 | 0 | 1,100 | juki industrial sewing machine (2,200, KD 3, TP 2,300), juki ddl-8700 (700), juki 8700 (600), juki ddl 5550 (450), juki ddl-8700 price (200, TP 900) |
| `/brands/juki/mo` | juki serger | 1,500 | 0 | 900 | juki mo654de (450), juki mo-654de (400), juki 654de (200), juki mo-644d (250), juki coverstitch machine (250) |
| `/brands/janome` | janome sewing machine | 11,000 | 0 | 10 (SERP is retail) | janome (3,600, TP 11,000), janome sewing machines (1,200, TP 6,200), janome sewing machine models (800, TP 3,000), janome quilting machine (500, TP 8,400), janome hd3000 (5,400) |
| `/brands/brother` | brother serger | 2,200 | 0 | 1,100 | brother heavy duty sewing machine (600, TP 700, parent st371hd), brother quilting machine (400), brother coverstitch (250, TP 700); embroidery (pe800 5,300, pe900 5,500, se600 5,400) is out of scope, do not build |
| `/brands/singer` | singer heavy duty sewing machine | 11,000 | 0 | 5,400 | singer heavy duty (8,000, TP 3,400), heavy duty singer sewing machine (800, TP 1,800), singer serger (1,100, TP 900), singer profinish serger (500), singer heavy duty serger (350) |
| `/brands/babylock` | babylock serger | 1,000 | 0 | 2,700 | baby lock serger (800), babylock sewing machine (1,500, KD 9, TP 6,400), baby lock vibrant serger (500), baby lock triumph (300), victory (300), celebrate (300), imagine (200, TP 2,500), acclaim (200). Dealer-only brand: no buy button, honest "where to buy" copy. |
| `/brands/bernina` | bernina sewing machine | 7,200 | 14 | 350 | bernina (3,300, KD 8), bernina serger (600, TP 900), bernina 1008 (1,300), bernina 570 (350), bernina 990 (1,100). Watch: "bernina express" (train) pollutes brand-only queries. Dealer-only brand. |

## Model reviews (`/reviews/[slug]`)

| Slug | Primary keyword | Vol | KD | TP | Also targets |
|---|---|---|---|---|---|
| juki-tl-2010q | juki tl2010q | 2,300 | 0 | 1,800 | juki tl-2010q (900), juki 2010q (700), juki tl 2010q (700), juki tl-2010q sewing & quilting machine (400), juki tl-2010q review (50), juki 2010 (200, TP 1,400) |
| juki-tl-2000qi | juki tl-2000qi | 800 | 0 | 350 | juki tl 2000qi (300, TP 500), juki tl2000qi (300), juki 2000qi (250) |
| juki-ddl-8700 | juki ddl 8700 | 3,300 | 0 | 1,100 | juki ddl-8700 (700), juki 8700 (600, TP 1,200), juki ddl8700 (200, TP 1,300), juki ddl-8700 industrial lockstitch (300), juki ddl-8700 price (200), juki ddl 8700 review (10, TP 1,200) |
| juki-mo-654de | juki mo654de | 450 | 0 | 800 | juki mo-654de (400, CPC $0.50), juki 654de (200), juki mo 654 (200) |
| juki-mo-1000 | juki mo-1000 | 100 | 0 | 150 | air thread serger (200), self threading serger parent |
| brother-1034d | brother serger 1034d | 2,000 | 1 | 1,800 | brother 1034d (1,700, TP 1,900), brother 1034d serger (1,300), brother 1034d review (40, TP 200) |
| brother-1034dx | brother 1034dx | 800 | 0 | 350 | brother serger 1034dx (700), brother 1034dx 3/4 thread serger (450), brother 1034dx serger (300) |
| brother-2340cv | brother 2340cv | 250 | 0 | 40 | brother coverstitch (250, TP 700), brother 2340cv review (20, TP 80) |
| singer-4452 | singer 4452 | 3,500 | 0 | 1,200 | singer heavy duty 4452 (2,000, TP 1,100), singer heavy duty 4452 sewing machine (900), singer 4452 heavy duty sewing machine (400, TP 2,200), singer 4452 review (70), singer heavy duty 4452 sewing machine reviews (150) |
| singer-4423 | singer 4423 | 3,500 | 0 | 250 | singer heavy duty 4423 sewing machine (800, TP 3,200), singer 4423 heavy duty sewing machine (500, TP 3,200), singer 4423 review (300), singer heavy duty sewing machine 4423 (200, TP 3,300) |
| singer-4432 | singer 4432 | 1,200 | 0 | 500 | singer 4432 heavy duty sewing machine (1,200), singer 4432 review (100, TP 500), singer heavy duty sewing machine 4432 (350) |
| janome-hd3000 | janome hd3000 | 5,400 | 0 | 300 | janome hd3000 heavy duty sewing machine (450, TP 2,100), janome hd 3000 (500, TP 1,800), janome hd3000 sewing machine (700), janome hd3000 review (100, TP 600), janome jw8100 (900, HD3000 Black Edition parent) |
| janome-mc6650 | janome mc6650 | 400 | 0 | 700 | janome memory craft 6650 (450), janome memory craft 6650 sewing & quilting machine (150) |
| handi-quilter-moxie | handi quilter moxie | 250 | 1 | 300 | moxie quilting machine (150), handi quilter moxie review (0) |
| brother-st371hd | brother st371hd | 1,500 | 0 | 200 | brother heavy duty sewing machine (600) |
| babylock-vibrant | babylock vibrant | 250 | 0 | 400 | baby lock vibrant serger (500) |
| janome-coverpro-2000cpx | janome coverpro 2000cpx | 80 | 0 | 40 | janome cover pro 1000cpx (50) as the discontinued predecessor |
| juki-tl-18qvp | juki tl18qvp | 350 | 0 | 400 | juki tl-18qvp (250), juki tl18 (350) |
| juki-hzl-f600 (built 2026-09-29, verification pending) | juki hzl-f600 | 500 | 0 | 250 | juki f600 (500), juki hzl f600 (200), juki hzl-f600 review (80) |
| juki-hzl-f300 (built 2026-09-29, verification pending) | juki hzl-f300 | 800 | 0 | 100 | juki f300 (500, TP 500) |
| janome-hd9 (built 2026-09-29, verification pending) | janome hd9 | 1,400 | 0 | 600 | straight-stitch heavy duty, direct TL-2010Q rival |
| janome-hd1000 (built 2026-09-29, verification pending) | janome hd1000 | 1,300 | 0 | 500 | |
| janome-hd5000 (built 2026-09-29, verification pending) | janome hd5000 | 700 | 0 | 300 | |
| singer-hd6600c (built 2026-09-29, verification pending) | singer heavy duty 6600c sewing machine | 1,500 | 0 | 900 | singer heavy duty 6600c (150, TP 800) |
| singer-hd6700c (built 2026-09-29, verification pending) | singer heavy duty 6700c sewing machine | 900 | 0 | 300 | |
| singer-4411 (built 2026-09-29, verification pending) | singer heavy duty 4411 sewing machine | 800 | 0 | 350 | singer 4411 heavy duty sewing machine (400, TP 800) |
| juki-dnu-1541s (built 2026-09-29, verification pending) | juki 1541 | 700 | 0 | 350 | juki 1541s (500, TP 600), juki dnu-1541s (450); walking-foot industrial for upholstery |
| janome-8002d (built 2026-09-29, verification pending) | janome 8002d serger | 500 | 0 | 150 | |
| singer-14cg754 (built 2026-09-29, verification pending) | singer profinish serger | 500 | 0 | 350 | singer pro finish serger (200) |
| babylock-imagine (built 2026-09-29, verification pending) | babylock imagine serger | 200 | 0 | 2,500 | |
| brother-1634d (built 2026-09-29, verification pending) | brother 1634d serger | 200 | 0 | 150 | |
| handi-quilter-amara (built 2026-09-29, verification pending) | handi quilter amara | 300 | 1 | 200 | |
| bernina-1008 (built 2026-09-29, verification pending) | bernina 1008 | 1,300 | 0 | 700 | mechanical, discontinued in some markets: check |

## Compare pages (`/compare/[slug]`)

| Slug | Primary keyword | Vol | KD | TP | Notes |
|---|---|---|---|---|---|
| singer-4423-vs-4432-vs-4452 | singer 4423 vs 4452 | 200 | 0 | 200 | singer 4432 vs 4452 (200), singer 4423 vs 4432 (100), singer 4423 vs 4432 vs 4452 (20). One three-way page owns all four queries. |
| brother-1034d-vs-1034dx | brother 1034d vs 1034dx | 250 | 0 | 250 | Clean head-to-head query. |
| juki-tl-2010q-vs-tl-2000qi | juki tl-2010q vs tl-2000qi | 0 (10 to 20 est.) | n/a | n/a | Low volume but high CPC ($0.70) and it is the decision every TL buyer makes. Feeds both reviews. |
| brother-1034d-vs-juki-mo-654de | brother 1034d vs juki mo654de | 0 | n/a | n/a | Cross-brand value vs quality split; the home page value pick links here. |
| brother-vs-singer-sewing-machine (built as a guide) | brother vs singer sewing machine | 400 | 0 | 500 | singer vs brother sewing machine (200), brother or singer sewing machine (150, TP 600). Decision 2026-09-29: brand-level compare built with guide blocks at `/guides/brother-vs-singer-sewing-machine`; no new page type. |
| serger-vs-overlock (fold into guide) | serger vs overlock | 300 | 0 | 90 | overlock vs serger (250). Same thing, answer inside `/guides/what-is-a-serger`. |

## Guides (`/guides/[slug]`)

| Slug | Primary keyword | Vol | KD | TP | CPC | Format on SERP | Role |
|---|---|---|---|---|---|---|---|
| serger-vs-sewing-machine | serger vs sewing machine | 1,700 | 0 | 450 | $0.02 | explainer, video | Unaware page. CTAs at end only. Also sewing machine vs serger (200). |
| what-is-a-serger | what is a serger | 1,600 | 0 | 8,700 | $0.01 | explainer, AI overview | Biggest TP on the site. Also what is a serger sewing machine (1,200, TP 5,800), what does a serger do (800, TP 7,400), what does a serger sewing machine do (300, TP 9,100), what is a serger used for (300), what is a serger machine (250), serger stitch (800), serger sewing (600, TP 8,700), serger vs overlock (300). Feeds `/best-sergers`. |
| coverstitch-vs-serger | coverstitch vs serger | 300 | 0 | 400 | $0.02 | explainer | Also coverstitch (1,100), coverstitch machine (2,000, commercial: link to the coverstitch section of the hub). |
| mechanical-vs-computerized | mechanical vs computerized sewing machine | 150 | 0 | 200 | $0.15 | explainer | Small but decision-critical; links to both hubs. |
| how-to-choose-a-quilting-machine | best quilting sewing machine with large throat | 300 | 0 | 3,900 | $0.30 | listicle/explainer | Owns throat-space education; also mid arm quilting machine (250), what is the best sewing machine for quilting (150, TP 3,800). |
| how-much-does-a-long-arm-cost | how much is a long arm quilting machine | 150 | 0 | 900 | $0.30 | explainer | Also how much does a long arm quilting machine cost (60, TP 800), long arm quilting machine for sale (350), used long arm quilting machines for sale (350). |
| sewing-machine-brands-ranked | best sewing machine brands | 500 | 3 | 700 | $0.30 | listicle, Reddit | Also sewing machine brands ranked (70, TP 1,200). |
| sewing-machine-for-thick-fabric | sewing machine for thick fabric | 200 | 0 | 300 | $0.30 | explainer | Also sewing machine for leather (800, TP 1,400), sewing machine for denim (300, TP 600), sewing machine for upholstery (100), what is a walking foot sewing machine (500), walking foot for sewing machine (350, TP 700). |
| industrial-sewing-machine-for-home (backlog) | industrial sewing machine | 6,200 | 2 | 1,800 | $0.25 | mixed retail | industrial sewing machine for home use (20), semi industrial sewing machine (300), industrial sewing machine table (200), used industrial sewing machine (150). Built 2026-09-29 as `/guides/industrial-sewing-machine-for-home` (also semi industrial sewing machine 300, servo motor sewing machine 150, industrial sewing machine table 200). Compare candidates checked and rejected the same day: janome hd9 vs juki tl2010q 10/mo, brother 1034d vs janome 8002d 0/mo. |
| what-is-a-walking-foot (backlog) | walking foot sewing machine | 2,900 | 0 | 10 | $0.20 | product/retail | Parent is Consew CP206RL, a product SERP. Fold into thick-fabric guide unless demand proves out. |

## Questions worth answering on-page (FAQ blocks)

Informational queries with volume that belong inside existing pages, never as standalone URLs: how to thread a singer heavy duty sewing machine (250), what is a walking foot sewing machine (500), how to quilt on a sewing machine (200), what sewing machine should i buy (200, TP 1,800), how much does a sewing machine cost (450), why does my sewing machine keep jamming (500, out of scope: maintenance).

## Out of scope (do not build)

Embroidery machines (brother pe800 5,300, pe900 5,500, se600 5,400, se1900 2,300, janome embroidery machine 1,900): different buyer, different retailer mix. Handheld machines (best handheld sewing machine 1,100). History queries (who invented the sewing machine 2,000). Kids machines. Bernina Express train queries.
