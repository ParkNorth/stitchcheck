# Research briefing: `brother-st371hd`

last_updated: 2026-09-29
manufacturer_url: https://www.brother-usa.com/products/st371hd
retailer_url: (no Sewing Machines Plus listing surfaced in search results)
status: draft
evidence: positioning

<!--
Rules (see AGENTS.md):
- Every number that lands in src/lib/products.ts must appear here, in the manufacturer's units, with a source note (URL + where on the page).
- "Not published" is a valid value. A guess is not. Unpublished rows render as [verify] on the page.
- Marketing language ("heavy duty", "industrial strength", "sews through anything") goes under Manufacturer claims, never in the spec table.
- Conflicts between sources are listed, not resolved here. The catalog entry picks a value and says why.
- Owner themes are paraphrased and attributed by URL. Never quote at length. Never invent a thread.
-->

Research method note: brother-usa.com and dealer sites were blocked by the egress proxy. Values come from WebSearch snippets; the URL is the page the snippet was drawn from. No owner forum thread specific to this model surfaced; evidence is positioning.

## Specs (from manufacturer)

| Field | Value | Source note |
|---|---|---|
| Machine type | mechanical | brother-usa.com product page |
| Stitch types or built-in stitches | 37 utility and decorative stitches (blind hem, stretch, buttonhole, zipper) | brother-usa.com product page |
| Max speed (spm) | 800 (third-party comparison; not seen in Brother snippet) | bobbinhub.com Singer 4423 vs ST371HD; [verify] |
| Threads (sergers/coverstitch) | n/a | |
| Differential feed | n/a | |
| Throat / arm space (in) | Not published | |
| Needle system | Not found in snippets | |
| Presser foot lift / knee lifter | Fixed presser foot pressure (third-party comparison); lift height not found | bobbinhub.com comparison |
| Thread trimmer | Not found | |
| Feed system | Drop feed for free motion; metal needle plate; Quick-Set drop-in top bobbin; free arm | brother-usa.com product page |
| Buttonhole | One-step (buttonhole foot included) | brother-usa.com product page |
| Motor / drive | Not published | |
| Frame | Not found in snippets | |
| Weight (lb) | 14.3 (6.5 kg) | sewingmachinedirectory.com/sewing-machine/brother-st371hd/ |
| Dimensions W x D x H (in) | 16.1 x 7.9 x 12.2 (48.9 x 20 x 31 cm) | sewingmachinedirectory.com spec block |
| Included feet / accessories | 6 feet: spring action zigzag, nonstick, blind stitch, zipper, buttonhole, button sewing; heavyweight needles | brother-usa.com product page |
| Warranty (US) | Not found in snippets (Brother support page blocked) | |
| List price (USD) | 229.99 | Seen 2026-09-29 at Michaels (snippet). No SMP listing found |

## Unit / naming checks

- Model number vs anything it implies: "ST" is Brother's Strong & Tough series; "HD" in the model code and "Heavy Duty" in the page title are series names, not ratings. GX37 and XR3774 share the 37-stitch count but are different models.
- Throat measured needle-to-body or including the harp height? Not published.
- Speed: 800 spm comes from a comparison site, not from Brother. Flag [verify] until the Brother spec sheet is read.

## Manufacturer claims (attribute, do not assert)

- "Strong & Tough" (Brother series name, product page)
- "everyday sewing and mending on everything from durable outdoor fabrics to lightweight elegant silks" (manufacturer claim, brother-usa.com)
- "jam-resistant Quick-Set drop-in top bobbin" (manufacturer claim, brother-usa.com)
- "metal needle plate for smoother fabric feeding" (manufacturer claim, brother-usa.com)

## Retailer cross-check (Sewing Machines Plus)

- Bundle contents on the listing vs manufacturer box contents: no SMP listing surfaced. Michaels, Walmart, Pocono Sew and Vac and Amazon list it; Brother's 6-foot list is the box standard.
- Price seen and date: $229.99 at Michaels (snippet, 2026-09-29). A comparison site quotes $199, undated.
- Authorized dealer statement present? Not applicable; no SMP listing seen.

## Spec conflicts

- Max speed: 800 spm (bobbinhub.com) vs not stated in any Brother snippet. [verify]
- Price: $229.99 (Michaels) vs $199 (bobbinhub.com, undated). Catalog uses $229.99.
- Frame, warranty, needle system: not found. Null.

## Buyer questions (PAA / forums)

1. Is the Brother ST371HD really heavy duty?
2. Brother ST371HD vs Singer 4423: which is better for denim?
3. Can the Brother ST371HD sew leather or vinyl?
4. How fast is the Brother ST371HD?
5. Does the Brother ST371HD have adjustable presser foot pressure?
6. Does the Brother ST371HD have a walking foot?
7. What is the Brother ST371HD warranty?
8. Is the Brother ST371HD good for beginners?
9. Does the Brother ST371HD have a free arm?

## Owner themes (paraphrase + attribute)

1. Denim with care: a comparison sewing four layers of denim and five of duck cloth found the ST371HD finished the hems but needed slower feeding at thick seams because pressure is fixed and the motor is slower than the Singer 4423's. (positioning: https://bobbinhub.com/singer-4423-vs-brother-st371hd/)
2. Tough little mender: an independent review praises the nonstick foot and drop-in bobbin for everyday mending and light heavy fabric work. (positioning: https://sewnstudio.com/brother-st371hd-review/)

## Cross-shop set

1. `singer-4423`: faster with adjustable pressure, fewer stitches, more documented complaints.
2. `singer-4452`: for buyers who want the nonstick foot and a walking foot in the box.
3. `janome-hd3000`: aluminum-bodied mechanical for buyers prioritizing build over stitch count.

## Editorial angle

For beginners choosing between the Brother ST371HD and the Singer 4423; settles what "Strong & Tough" covers (denim hems, six feet, free arm) and where it stops (fixed pressure, slower motor).

## Exit checklist

- [x] Every products.ts number appears above with a source note
- [ ] specsVerified set to the date the manufacturer page was checked (brother-usa.com not fetchable; snippets only)
- [x] Claims attributed; conflicts listed; unit check written
- [x] FAQ (6 to 12), verdict, whoFor, skipIf, strengths (3), weaknesses (3), checks (3), realCost, alternatives (in data/specs/brother-st371hd.json)
- [x] No hands-on claims ("we tested", "in our hands")
