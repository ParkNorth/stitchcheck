# Design system: workshop spec sheet

last_updated: 2026-09-29
status: living
source_of_truth: the designer's mockup (`Stitch_Check.html`, 14 boards, v1 Sep 2026). This file is the written contract that `src/app/globals.css` and `src/components/ui/*` implement. When they disagree, fix the code.

## Tone

Workshop, not craft room. Paper, graphite and machine enamel. No pastels, florals, buttons-and-bows or script type. The page should feel like a machine's manual and rating plate. Numbers are the hero and are always set in mono. One action colour: enamel green means buy (and compare-row winner), nothing else. Brass marks the one honest value pick per page.

Voice: "Straight stitch only. At 1,500 stitches a minute it outruns every domestic machine on this list, but you'll still want a serger to finish seams." Not: "The perfect little machine for your cozy sewing nook."

## Colour tokens

| Token | Hex | Use |
|---|---|---|
| `--color-paper` | `#F2F0EA` | page ground |
| `--color-card` | `#FBFAF7` | card and table surfaces |
| `--color-rule` | `#D6D2C8` | hairlines inside cards and tables |
| `--color-rule-soft` | `#CFCABE` | meter off-state, disabled bars |
| `--color-well` | `#E4E0D5` | photo well base (hatched) |
| `--color-steel` | `#5E6368` | captions, secondary labels. Lightest grey allowed for text |
| `--color-ink-soft` | `#3E4246` | body copy on cards |
| `--color-ink-body` | `#24272A` | long-form article body |
| `--color-graphite` | `#16181A` | ink, borders, type badges, dark panels |
| `--color-enamel` | `#1F4A3A` | buy button, links, winner check, active nav underline |
| `--color-enamel-dark` | `#163829` | buy hover |
| `--color-enamel-tint` | `#E1EBE4` | compare winner cell |
| `--color-brass` | `#C98A2B` | value pick badge, summary verdict eyebrow on dark |
| `--color-brass-ink` | `#8A5510` | brass-toned text on paper (weakness dashes, "honest value" label) |
| `--color-brass-tint` | `#F7EEDD` | value pick card background |
| `--color-footer-text` | `#D9D5CB` | footer links and top bar text |
| `--color-footer-muted` | `#8A8F94` | footer captions |
| `--color-enamel-on-dark` | `#8FC1A8` | logo check on dark footer |

Text contrast floor is 4.5:1. Steel is the lightest text colour. No shadows, no gradients (the hatched photo well and seam line are patterns, not gradients in the design sense).

## Type

| Role | Family | Size / line | Notes |
|---|---|---|---|
| Display (`.d`) | Archivo, weight 800, `font-stretch: 115%` (wordmark 125%), letter-spacing -0.01em | H1 56 to 96 / 0.95 to 1.07 | Archivo Expanded 800 for headings, scores, rank numerals |
| Reading | IBM Plex Sans 400/500/600/700 | body 17/27 on cards, 18/1.7 article | |
| Mono (`.m`) | IBM Plex Mono 400/500/600 | spec 15 to 16 | Every number, badge, label, source line |
| Label (`.cap`) | IBM Plex Mono 600, 13px, tracking .08em, uppercase | | Short labels only, never sentences |

Scale used in the boards: H1 56 to 76 (home 76, hub 64, brand 96, review 64, compare 56 to 60, guide 60, about 72); H2 32 to 40; H3 22 to 26; body 16 to 18; label 13; spec 15 to 16; footer 14; top bar 13.

Readability floor: labels 13px, captions 14px, card copy 16px, article body 18px.

Fonts load via `next/font/google` (Archivo with `axes: ["wdth"]`, IBM Plex Sans, IBM Plex Mono), `display: swap`, latin subset.

## Layout

- 12-column grid, 1440 canvas, 64px page margin, 24px gutter. Mobile margin 20px.
- Spacing scale: 4, 8, 16, 24, 40, 64. Section gap on home 88, elsewhere 48 to 64.
- Radius 4px on cards, buttons, panels; 3px on badges; 2px on the inline "Affiliate" chip.
- Borders 1.5px graphite on cards, buttons, tables. 1px rule for interior hairlines.
- Top bar: graphite band, 13px mono, left "Independent buying guide · every spec checked against the manufacturer". Hidden on 404.
- Header: 76px, bottom border 1.5px, logo (30px stitched-check mark + STITCH CHECK wordmark at 20px, stretch 125%), nav Heavy duty / Sergers / Quilting / Brands / Compare / Guides, active item gets `inset 0 -2px 0 enamel` underline, 44px search button (outlined). Mobile header 60px with hamburger.
- Footer: graphite, 56/64/36 padding, 5-column grid (2fr 1fr 1fr 1fr 1fr): brand blurb, Jobs, Brands, Guides, Site. Dashed seam in `#D9D5CB` at .3, then © line and "Specs change. Check the manufacturer before you buy."

## Motifs

- **Seam line**: 2px, `repeating-linear-gradient(90deg, graphite 0 9px, transparent 9px 15px)`, opacity .4. Section divider.
- **Stitch meter**: score out of 10 rendered as ten 12x4 (16x5 on the style board) bars, gap 3, filled enamel, partial bar via a hard-stop gradient, off bars in `rule-soft`. Always next to the numeral (Archivo 30 to 76) with "/10" in mono steel.
- **Photo well**: `#E4E0D5` with a 135deg hatch (`transparent 0 10px, rgba(22,24,26,.07) 10px 11px`), 4px radius, caption bottom-left in `.cap` steel. Used until a product shot lands; product shots are white background, 4:3.
- **Logo**: 30x30 rounded square (rx 3) stroke graphite 2, dashed check stroke enamel 3 (`stroke-dasharray 4 2.5`).

## Components (design once, reuse everywhere)

### Badges
- **Price band** (`.band`): outlined 1.5px graphite, 3px radius, mono 13/600, padding 3/7. Values: `$ under 500`, `$$ 500–1k`, `$$$ 1–2k`, `$$$$ 2–3k`, `$$$$$ 3k+`. Never a live price.
- **Machine type** (`.type`): solid graphite, paper text, mono 12/600 uppercase tracking .08em, padding 4/7. Values: Mechanical, Computerized, Serger, Coverstitch, Long-arm.
- **Our pick**: `.type` in enamel with white text.
- **Value pick** (`.value`): brass fill, graphite text. One per page.
- **Discontinued / Replaced by [model]**: `.type` in steel fill.

### Buy button (`.buy`)
Enamel fill, white 15/600, 48px min height (60 in verdict box and review rail, 44 in tables and grid cards), 4px radius, padding 0 18, `justify-content: space-between`. Always labelled as an affiliate link: large variant is the label and arrow only; compact variant carries the `.aff` chip ("AFFILIATE", 11px mono, 1px white .6 border). Every buy link routes through `/out/[slug]` with `rel="sponsored nofollow noopener"` and `target="_blank"`. The word "affiliate" is never dropped, even at the smallest size. Trailing 16px external-link arrow on the large variant.

### Secondary button (`.sec`)
Outlined 1.5px graphite, 44px, 15/600. "Read review", "vs Juki TL-2000Qi".

### Text link (`.lnk`)
Enamel, 600, underline offset 3px.

### Verdict box
Card with a graphite header strip (`.cap`: "Verdict" left, "Specs checked against {Brand} data · {Mon YYYY}" right). Three columns `220px | 1fr | 380px`: score column (numeral 72 to 76 + "/10", stitch meter, "How we score" link), verdict column (one-sentence verdict in Archivo 26 to 27, then two columns "Who it's for" (enamel label) and "Skip it if" (steel label)), buy column (price band row, large buy button, "Last seen [$price] on [date] at Sewing Machines Plus. Today's price is on their page."). Footer strip on paper: "Real cost to get sewing" `.cap` + mono chain "Machine $$$ 1–2k + TL-series feet + A solid table + A zigzag machine, if this is your first". Only things the job needs, never upsells. Mobile: stacks, score row horizontal, who/skip as stacked rows with hairlines.

### Product card, three sizes
- **A · Hub card** (ranked shortlist): grid `56px 190px 1fr 210px`, padding 24. Rank numeral Archivo 44, photo well 150 to 165 tall, badges row (Our pick / type / band), name Archivo 24, key spec mono 14/500, one-line reason 16/1.5 ink-soft, right column with hairline: score 30 + "/10", compact buy button full width, secondary "Read review". Value pick row uses brass-tint background.
- **B · Grid card** (brand, index): 16 padding, photo well 170 to 200, badges row (type, band, optional series code right-aligned mono steel), name Archivo 19 to 22 with score mono 16/600 right, key spec mono 15 ink-soft, row: compact buy (flex-grow, 44px) + "Review" text link.
- **C · Alternatives row** (review footer): grid `88 to 96px | 1fr`, padding 14, small photo well 72 to 80, eyebrow `.cap` steel ("Cheaper", "Needs zigzag", "Go industrial"), name 700/16 to 17, one line 15 ink-soft. Whole card is the link.
- Grid card discontinued state: photo well at .55 opacity, steel Discontinued badge, "Replaced by the [new model]. Worth it used at the right price.", secondary "See the replacement". No buy button unless the retailer still lists stock.

### Spec table
Card surface, 1.5px border, graphite header row (`.cap` paper text), label column `.cap` steel 34 to 36% wide, values mono 15, row hairlines, padding 14/16 to 14/18. Missing data renders as `[verify]` in brackets: we never fill a spec we can't source. Source line below in mono 13 steel. Compare variant: 2 or 3 value columns; winner cell gets enamel-tint background, weight 600 and a 14px check glyph with `aria-label="Winner"` so it reads without colour. Ties stay plain. Shared wins highlight every winning cell.

### Definition callout (guides)
Grid `140px | 1fr`, graphite label cell "Definition" (`.cap` paper), body: term 700/17 to 18 and definition 16 to 17/1.55 ink-soft.

### Short answer / summary verdict (dark panel)
Graphite panel, 4px radius, brass `.cap` eyebrow ("Summary verdict", "Short answer", "Machine type picker"), verdict in Archivo 24 to 26 (compare) or Plex 19/1.5 (guide), optional mono tally column "TL-2010Q wins 2 rows / TL-2000Qi wins 1 row / 4 ties".

### The short answer strip (hubs)
Card with graphite left cell "The short answer" and three rows `200px | 1fr | 160px`: label (`.cap` enamel "Best overall", brass-ink "Honest value", ink-soft "Go industrial"), sentence with bold model name, right "Jump to #N" link.

### Mobile sticky buy bar
Fixed bottom, card surface, 1.5px top border, padding 12/16/14 (22 bottom for safe area): 48px photo well, name 700/15, mono "8.6/10 · $$$ 1–2k", compact buy button "Check lowest price"; second line right-aligned mono 13 steel "Affiliate link to Sewing Machines Plus". Appears after the verdict box scrolls off. Review and compare pages only. On desktop it becomes the sticky right-rail summary card (72px photo, name, score line, large buy, seam, "On this page" TOC).

### Size diagram (throat space to scale)
Card, rows of `200 to 240px label | bar`. Scale ruler 0 / 6 / 12 / 18 / 24 in (22 to 30px per inch, same scale on every page). Current machine bar in graphite, category ranges in `rule-soft` with hatched extension for the range top. Rows: Typical beginner machine (about 6 in), current machine, Mid-arm 16–18 in, Long-arm on a frame 18–26 in. Caption: "Throat space is the distance from the needle to the machine body: how much rolled quilt fits through."

### Retailer block
Card with header "Buying from Sewing Machines Plus" (Archivo 26) and `.cap` steel "Checked [date]", then a 2x2 grid with hairlines: Warranty, Returns, Servicing, Setup and lessons (`.cap` enamel labels, 16/1.5 body). Bracketed placeholders until verified.

### Check before you buy
Card with header row (Archivo 26 + `.cap` "3 checks"), numbered rows `40px | 1fr` (mono enamel 01 02 03, bold title 16, body 15 ink-soft).

### Strengths / weaknesses
Two columns, H2 Archivo 26, rows `.pl` grid `22px | 1fr` with hairline tops: plus glyph in enamel for strengths, dash in brass-ink for weaknesses.

### Machine type picker (home, dark panel)
Graphite panel, 48 padding, 12-col grid: left 5 cols (brass eyebrow, H2 Archivo 40 "Which machine type do I need?", "What will you sew most?" in `#BDB8AD`, five `.opt` buttons 56px outlined, selected one inverted paper on graphite with a mono mark), right 6 cols paper card: `.cap` steel "You need", result Archivo 44, why 18/1.55, seam, mono "look for" line, graphite buy-style button linking to the hub, text link to the guide. Progressive enhancement: renders a default state without JS.

### Discontinued banner (review)
Grid `170px | 1fr | auto`, steel label cell "Discontinued", body 16/1.5 "[Brand] stopped making this model in [year] and replaced it with the [new model]. This review stays up for people buying used or finding old stock.", right link "Read the [new model] review". Old URLs stay live and link forward.

### Filters (index pages)
Chip buttons (`.chip`) 40px outlined mono 13/600, active inverted. Rows: Type, Price band, Brand (select) + Sort (select). "Showing N of M · filters" line with "Clear filters" link. Pagination chips.

### TOC (guides, utility)
Left column 220 to 260px, sticky top 24, links 15 ink-soft with a 2px left border rule; active item ink 600 with enamel border.

## Page layouts (per board)

- **Home** (2800 tall): hero 12-col (H1 76 "Pick the machine for the job, not the feature list." spanning 8, intro 18 + "How we check" link spanning 4); three job cards (photo well 220, "Job 01" eyebrow, Archivo 30 title, copy, footer row mono types + enamel arrow link); machine type picker dark panel; lead review (8 cols: 360px photo well + copy with three mono stat cells Max speed / Stitch / Score, large buy + "Read the review") beside value pick card (4 cols, brass tint); "How we check" 4-up trust strip with mono 01 to 04 numerals; footer.
- **Job hub** (3260): breadcrumb mono 14, H1 64 spanning 7 with mono meta on the right ("5 machines · specs checked Sep 2026", scope line); The short answer strip; 2-col `1fr | 280px`: ranked hub cards (rank 01 to 05) and sticky aside with three `.side` lists (Related guides, Head-to-heads, Other jobs); seam; "Side by side" comparison table (Machine, Type, Price band, Max speed, Stitches, Also budget for, Score, buy); source line.
- **Brand hub** (2460): 12-col header (H1 96 "Juki", 19px intro, right "Juki at a glance" card with rows Strongest at / Weaker at / Price span / We cover); "Series decoder" 4-up cards with graphite header (series code Archivo 48 + inverted type badge), title 700/17, rows Built for / Band / Watch for, footer "TL series hub" link or mono "No series hub · models below"; "Juki models we cover" with series filter tabs (`.tab`) and 3-up grid cards with series code right-aligned. Series sub-page: same layout, narrower grid, decoder collapses to the one series.
- **Model review** (4460): header grid `1fr | 440px` (breadcrumb, H1 64, badges + mono context "Straight-stitch quilter · in Heavy duty and Quilting hubs"; 300px photo well right); verdict box with real-cost footer; 2-col `1fr | 360px`: Specs table (with source line and the bracket rule caption), Size and space (size diagram + two stat cards Weight / Table footprint), Strengths / Weaknesses, Check before you buy, Buying from Sewing Machines Plus, Head-to-heads secondary buttons; sticky rail card; seam; Alternatives 3-up.
- **Review mobile** (390): 60px header, breadcrumb, H1 34, badges, stacked verdict box (score 52 + meter, verdict 19, who/skip rows), Specs (3 rows shown), sticky buy bar.
- **Compare two-way** (2320): breadcrumb, H1 60; dark summary verdict panel `160px | 1fr | 260px` (tally column); heads `1fr | 80px "vs" | 1fr` each a card with 200px photo, Our pick / band badges, name 26, score 34, compact buy + Review link; "Spec by spec" table with row-winner legend; two-column "Buy the X if / Buy the Y if" card each with large buy button; summary verdict repeats at bottom.
- **Compare three-way** (1640): heads as a 3-up row (`260px | 1fr 1fr 1fr`) with the first cell holding the variant note; table gains a column, `table-layout: fixed`; value pick head has brass tint.
- **Compare mobile** (390): summary verdict panel, "Showing 2 of 3 · Swipe for 4452", label column fixed (104px, paper, 1.5px right border) and three 112px machine columns in a horizontal scroller, dot indicators, sticky buy bar for the value pick.
- **Reviews index** (2040): H1 60 with section switcher (Reviews / Compares / Guides / Brands) on the right; filter block between 1.5px rules; result count line; 4-up grid cards; pagination chips.
- **Guide** (3160): 3-col `260px | 760px | 1fr`: sticky TOC left, article centre (H1 60, standfirst 21, byline mono "Stitch Check editors · Updated Sep 2026", H2 Archivo 34, body 18/1.7, definition callout, inline spec table `.it`, dark "Short answer" panel, related text links); after the article a seam and "Machines we'd start with" 3-up grid cards with "All serger picks" link. CTAs at the end only.
- **About** (2180): 2-col `220px | 1fr` with sticky site nav (About · how we check / Privacy / Terms); H1 72, standfirst 21; four `.step` rows `120px | 1fr | 1fr` (numeral 56, title 24 + body, mono "On the page:" note with left hairline); "What the score weighs" table (Job / Weighs most / Weighs least); two cards How we're paid / Spotted a wrong spec. Privacy and terms reuse this template.
- **404** (900): no top bar; 2-col: Error 404 eyebrow, "404" Archivo 200, seam, H1 40 "Page not found", copy; right: search field + graphite button, "Or start from a job" three `.jp` link rows to the hubs.

## Rules the validator can check

- Every buy button has the word "affiliate" in its rendered text and routes to `/out/`.
- No em-dashes in published copy.
- Type badge values come from the fixed set; price band from the fixed set.
- One value pick per page.
- Spec tables never render an empty cell: `null` renders `[verify]`.
