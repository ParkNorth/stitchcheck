# Claim extraction prompt (for `npm run reviews:claims`)

Give a model `data/reviews/{slug}/claims-work/ref.json` and one or more `in-N.jsonl` chunks. It writes `out-N.jsonl` (one JSON object per line, nothing else). Then run `merge`, which rejects any row whose quote is not found verbatim in the segment text.

## Task

Each input line is one segment: `seg_id`, `text`, `source_class`, `thread_or_page_title`, `page_kind`, `rating`, and `hints` (keyword guesses, may be wrong). `ref.json` has the machine's `model` and `model_names` (aliases), its published `specs` (our current values), `manufacturer` facts (the maker's own documents), `cross_shop` machines and `confusable_siblings`.

Read every segment and emit zero or more rows of three types. Emit nothing for segments with no concrete, checkable claim. Most segments should yield zero or one row; do not pad.

1. **spec_claim**: the writer says something concrete about one spec or performance field of THIS model.
   `{"type":"spec_claim","seg_id":"...","field":"<one of ref.fields>","stance":"confirms|contradicts|adds","scope":"this|sibling|other|unclear","first_hand":true|false,"claim":"<=30 word neutral paraphrase","quote":"<=15 words copied exactly from the text"}`
   - stance is relative to `ref.specs` and `ref.manufacturer`: `confirms` agrees with a published value, `contradicts` disagrees with one (for example an owner saying 1/5 in feet ship in the box when Juki lists them as optional), `adds` is new information or an experience no published value covers (reliability, noise, tension behaviour).
   - scope: `this` only when the text is about `ref.model` or one of its `model_names` (the thread title counts as context). `sibling` for any of `ref.confusable_siblings`. `other` for unrelated machines. `unclear` when you cannot tell (for example a commenter says only "my serger" in a thread about several machines). Never attribute a sibling's trait to this model (rule 9).
   - first_hand: true only if the writer says they own or used it, or the page is an owner's review.
2. **comparison**: the writer compares this model with another machine.
   `{"type":"comparison","seg_id":"...","other_model":"e.g. Janome HD9","dimension":"e.g. power on thick layers | price | throat space | ease of use | noise | support","favors":"this|other|neither|mixed","first_hand":true|false,"claim":"<=30 words","quote":"<=15 words exact"}`
3. **difference**: a page or post states how two near-identical models differ (feature, price, included accessories). Only when it names both models.
   `{"type":"difference","seg_id":"...","model_a":"<ref.model>","model_b":"<the sibling>","field":"short field name","a_value":"...","b_value":"...","claim":"<=30 words","quote":"<=15 words exact"}`

## Rules

- The quote must be copied character for character from the segment text (straight or curly quotes both fine). No ellipses, no editing. If you cannot find a <=15 word exact span that supports the claim, drop the row.
- Paraphrase the claim in your own words; never pad it with marketing language. No em-dashes or en-dashes.
- One row per distinct claim; a segment may produce several.
- Do not infer. Do not use outside knowledge about the machine; judge only from the text and ref.json.
- Fields: use exactly the names in `ref.fields` (spec fields such as maxSpm, throatIn, includedFeet, plus topics such as tension, reliability, noise, and for sergers threads, threading, differentialFeed, cutting, rolledHem).
- Output file must contain only JSON lines. Write it with the Write tool to the path you are given.
