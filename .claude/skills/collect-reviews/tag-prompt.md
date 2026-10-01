# Tagging prompt (for `npm run reviews:rollup -- tag-merge`)

Input: `claims-work/tag-in-N.jsonl`, one claim per line: `claim_id, field, scope, first_hand, claim, quote`. Output: `claims-work/tag-out-N.jsonl`, one line per input line, same order, JSON only:

`{"claim_id":"...","theme":"<theme>","polarity":"positive|negative|neutral|mixed"}`

Themes (pick exactly one, the best fit; use `other` only if none fits): stitch_quality, build_quality, speed, power_heavy_fabric, thread_trimmer, tension, oiling_maintenance, reliability_defects, noise_vibration, throat_workspace, feet_accessories, walking_foot, free_motion, lighting, value_price, support_service, weight_portability, learning_curve, other.

Polarity is the writer's stance about the machine on that theme, judged only from `claim` and `quote`: `positive` (praise, works well), `negative` (complaint, defect, limitation), `mixed` (both), `neutral` (a plain fact or question with no judgment). The `field` column is a keyword hint and may disagree with the text; the text wins. Do not use outside knowledge. Every input line gets one output line.
