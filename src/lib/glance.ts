import { PRICE_BANDS, formatUsd } from "./price-bands";
import { formatSpec, type Job, type Product, type SpecKey } from "./products";
import type { Rollup } from "./rollups";

/**
 * The "At a glance" overview shown under the H1 (src/components/ui/AtAGlance.tsx) and reused as the
 * schema `reviewBody`. The lead is built only from catalog data: nulls are left out, never guessed
 * (AGENTS.md rule 6). The owner paragraph is editor-written (editor.json `summary`) and only exists for
 * approved rollups, so a page with no owner evidence never claims any (rule 2).
 */

const TYPE_NOUN: Record<Product["type"], string> = {
  mechanical: "mechanical sewing machine",
  computerized: "computerized sewing machine",
  serger: "serger",
  coverstitch: "coverstitch machine",
  "long-arm": "long-arm quilting machine",
};

const JOB_PHRASE: Record<Job, string> = {
  "heavy-duty": "heavy-duty sewing",
  serger: "serger buyers",
  quilting: "quilting",
  beginner: "a first serious machine",
};

/** Spec keys worth a mention in one sentence, in order, per machine type. Three at most. */
const HEADLINE_KEYS: Record<Product["type"], SpecKey[]> = {
  mechanical: ["maxSpm", "throatIn", "stitchCount"],
  computerized: ["maxSpm", "throatIn", "stitchCount"],
  serger: ["threads", "maxSpm"],
  coverstitch: ["threads", "maxSpm"],
  "long-arm": ["throatIn", "maxSpm"],
};

function phrase(p: Product, key: SpecKey): string | null {
  const value = p.specs[key].value;
  const shown = formatSpec(key, value);
  if (!shown) return null;
  switch (key) {
    case "maxSpm":
      return `a top speed of ${shown}`;
    case "throatIn":
      return `${shown} of throat space`;
    case "stitchCount":
      return `${shown} built-in ${value === 1 ? "stitch" : "stitches"}`;
    case "threads":
      // Free text in the spec ("3 or 4 thread, 2 needles"); only a bare count like "2/3/4" reads cleanly in a sentence.
      return /^\d(?:\/\d)+$|^\d(?: or \d)+$/.test(shown) ? `${shown} threads` : null;
    default:
      return null;
  }
}

function joinList(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** "$500 to $1,000", "under $500", "$3,000 and up". Ranges use "to", never a dash. */
function bandText(p: Product): string {
  const b = PRICE_BANDS[p.priceBand];
  if (b.min === 0) return `under ${formatUsd(b.max ?? 0)}`;
  if (b.max === null) return `${formatUsd(b.min)} and up`;
  return `${formatUsd(b.min)} to ${formatUsd(b.max)}`;
}

export interface Glance {
  /** Entity-complete lead: names the model, the type, the price band, the score and the published headline specs. */
  lead: string;
  /** Editor-written owner overview from the approved rollup, or null when the page has none. */
  ownerSummary: string | null;
  /** Shown when there is no owner overview, so the page still says what kind of evidence it is. */
  specCheckLine: string;
  /** Plain text for the schema `reviewBody`: lead, owner overview or spec-check line, then the verdict. */
  reviewBody: string;
}

export function glanceFor(p: Product, rollup?: Rollup): Glance {
  const specParts = HEADLINE_KEYS[p.type].map((k) => phrase(p, k)).filter((x): x is string => Boolean(x));
  const sentences = [
    `${p.name} is a ${TYPE_NOUN[p.type]} in the ${bandText(p)} price band, scored ${p.score.toFixed(1)} out of 10 for ${JOB_PHRASE[p.scoredFor]}.`,
    ...(specParts.length ? [`${p.brand} publishes ${joinList(specParts)}.`] : []),
    ...(p.discontinued ? ["It is discontinued."] : []),
  ];
  const lead = sentences.join(" ");
  const ownerSummary = rollup?.summary?.trim() || null;
  const specCheckLine = "This page is a spec check against manufacturer data.";
  const reviewBody = [lead, ownerSummary ?? specCheckLine, `Verdict: ${p.verdict}`].join(" ");
  return { lead, ownerSummary, specCheckLine, reviewBody };
}
