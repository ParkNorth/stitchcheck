# Drafting the page edits for one model

You are drafting, not publishing. Read `AGENTS.md` first (rules 1 to 12 are hard). Input: `data/reviews/{slug}/draft-page/inputs.json` (made by `npm run reviews:draft -- prep --slug {slug}`). It holds the current spec, the maker documents' facts (with `vs_spec`), the rollup summary, open checks, editor notes, the model's current siteFields block and the compare entries that mention it. Use only what is in that file. If a number is not there, it does not go in the copy.

Write three files in `data/reviews/{slug}/draft-page/`. Do not touch anything outside that folder.

## spec.json
`{ specs, conflicts, claims, evidence, price, sources, editorial }`, the same shapes as `data/specs/{slug}.json`.
- `specs`: only fields to change. Where a maker document contradicts a spec (`vs_spec: contradicts`), use the maker value with the document URL as `source`, and list the disagreement in `conflicts` (one plain sentence each, both numbers, both sources). Where it adds a spec we hold as null, fill it. Never invent: null stays null.
- `claims`: maker marketing words, quoted as claims, never as fact.
- `evidence`: `owner` when the rollup has 15 or more first-hand voices, `mixed` for 5 to 14, `positioning` otherwise.
- `editorial`: verdict (one sentence, under 200 characters), whoFor, skipIf, keySpec, realCost (2 to 4 short items the buyer also needs: thread, needles, oil, accessories; sourced from the inputs), exactly 3 strengths, 3 weaknesses, 3 checks, 6 to 12 faqs `{q, a}`. Strengths and weaknesses come from rollup themes with 5 or more voices, worded as "owners report", never "we found". Sibling and rival differences use the sibling rows, with maker-document rows labelled as such.
- Do not copy review text. Paraphrase; attribute by source name when a point rests on one thread.

## site.json
`{ verdict, reason, specsVerified, lastUpdated, buy, alternativeNotes }`. Dates are today (`inputs.today`) only for fields whose content you changed. `buy` only if the retailer or dealer situation in the inputs changed. `alternativeNotes` maps alternative slug to a one-sentence note, only for ones you change. Do not change `score`, `scoredFor` or the value pick: the editor sets those.

## compares.json
`[{ slug, description, summary, buyIf: { productSlug: "text" }, lastUpdated }]` for compares in `inputs.comparesNow` whose claims the new evidence changes. Empty array if none.

## Rules of voice
Spec-check, not field-test. No "we tested", "in our hands", hands-on claims. No em dashes or en dashes: write ranges as "8.5 to 10 in". Numbers in plain digits. One-sentence verdicts. Workshop tone.

When done, run `npm run reviews:draft -- check --slug {slug}`, fix every error, and read each warning. Warnings about numbers not in the evidence bundle mean you used a figure you cannot source: remove it or add the source.
