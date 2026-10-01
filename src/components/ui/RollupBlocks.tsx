import type { ReactNode } from "react";
import type { Rollup, RollupDocumentCheck, RollupExample } from "@/lib/rollups";
import { visibleThemes } from "@/lib/rollups";
import { HeaderCard } from "./Panels";

const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");

const CLASS_LABEL: Record<string, string> = {
  reddit: "Reddit",
  forum: "forums",
  editorial: "blogs and reviews",
  retailer: "retailer reviews",
  youtube: "YouTube",
};

function SourceLink({ url }: { url: string }) {
  return (
    <a href={url} rel="nofollow noopener external" target="_blank" className="m text-[13px] text-steel no-underline hover:text-enamel break-all">
      {host(url)}
    </a>
  );
}

function Example({ e }: { e: RollupExample }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[15px] leading-[1.5] text-ink-soft">{e.claim}</span>
      <SourceLink url={e.url} />
    </div>
  );
}

/** Stacked share bar: positive, mixed, negative among voices on a theme. Counts are also written out as text. */
function PolarityBar({ p }: { p: { positive: number; negative: number; mixed: number; neutral: number } }) {
  const judged = p.positive + p.mixed + p.negative;
  if (!judged) return null;
  const pct = (n: number) => `${(n / judged) * 100}%`;
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-[2px] border border-graphite" role="img" aria-label={`${p.positive} positive, ${p.mixed} mixed, ${p.negative} negative`}>
      <span style={{ width: pct(p.positive) }} className="bg-enamel" />
      <span style={{ width: pct(p.mixed) }} className="bg-rule-soft" />
      <span style={{ width: pct(p.negative) }} className="bg-brass" />
    </div>
  );
}

/** Counted owner themes with breadth and attributed examples. */
export function OwnerSignals({ rollup }: { rollup: Rollup }) {
  const themes = visibleThemes(rollup);
  return (
    <div className="card flex flex-col">
      {themes.map((t, i) => {
        const pos = t.examples.find((e) => e.polarity === "positive");
        const neg = t.examples.find((e) => e.polarity === "negative");
        const mixed = t.examples.find((e) => e.polarity === "mixed");
        const shown = [neg ?? mixed, pos].filter((e): e is RollupExample => Boolean(e));
        return (
          <div key={t.theme} className={`px-5 py-4 md:px-6 grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-3 md:gap-6 ${i < themes.length - 1 ? "border-b border-rule" : ""}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <strong className="text-[16px]">{t.label}</strong>
                <span className={`cap ${t.recurrence === "recurring" ? "text-enamel" : "text-steel"}`}>{t.recurrence}</span>
              </div>
              <PolarityBar p={t.polarity} />
              <span className="m text-[13px] text-steel leading-[1.5]">
                {t.polarity.positive} positive · {t.polarity.mixed} mixed · {t.polarity.negative} negative
                <br />
                {t.voices} voices · {t.sources} threads or pages · {t.sourceClasses.length} source types
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {shown.map((e) => (
                <Example key={e.claim_id} e={e} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** How the collection was done: coverage, ratings as seen, and limits. */
export function MethodologyBox({ rollup, retailerNote }: { rollup: Rollup; retailerNote?: ReactNode }) {
  const m = rollup.method;
  const classes = Object.entries(m.byClass)
    .filter(([, v]) => v.sources > 0)
    .map(([k, v]) => `${v.sources} ${CLASS_LABEL[k] ?? k}`)
    .join(", ");
  return (
    <HeaderCard title="How we collected this" caption={`Refreshed ${rollup.generated}`} as="div">
      <div className="px-5 py-4 md:px-6 md:py-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            [String(m.sources), "sources read"],
            [m.itemsCollected.toLocaleString("en-US"), "reviews, comments and pages"],
            [String(m.ownerVoices), "owner voices counted"],
            [m.dateRange ? `${m.dateRange[0]} to ${m.dateRange[1]}` : "n/a", "years covered"],
          ].map(([n, l]) => (
            <div key={l} className="flex flex-col gap-0.5">
              <span className="m text-[22px] font-semibold">{n}</span>
              <span className="text-[14px] text-steel leading-[1.4]">{l}</span>
            </div>
          ))}
        </div>
        <p className="m-0 text-[15px] leading-[1.55] text-ink-soft">
          Sources: {classes}. Evidence level: <strong>{m.evidence}</strong> ({m.thresholds}).
        </p>
        {rollup.ratings.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="cap text-steel">Ratings seen at retailers, not ours</span>
            {rollup.ratings.map((r) => (
              <span key={r.url} className="text-[15px] leading-[1.5] text-ink-soft">
                <a href={r.url} rel="nofollow noopener external" target="_blank" className="lnk">
                  {r.retailer}
                </a>
                : {r.pageRating} out of 5 from {r.pageCount} reviews, {r.lowRated} rated 3 or lower. Seller-collected, seen {r.fetched}.
              </span>
            ))}
          </div>
        )}
        {retailerNote}
        {rollup.notes && rollup.notes.length > 0 && (
          <ul className="m-0 pl-5 text-[14px] leading-[1.55] text-steel flex flex-col gap-1">
            {rollup.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>
    </HeaderCard>
  );
}

const STATUS_LABEL: Record<RollupDocumentCheck["status"], string> = {
  confirmed: "Confirmed",
  differs: "Differs",
  unverified: "Unverified",
  "dealer only": "Dealer only",
};

/** Maker's own documents against dealer and owner statements. */
export function DocumentChecks({ checks, brand }: { checks: RollupDocumentCheck[]; brand: string }) {
  if (!checks.length) return null;
  return (
    <HeaderCard title={`${brand}'s documents vs dealers`} caption={`${checks.length} checks`} as="div">
      <div className="flex flex-col">
        {checks.map((c, i) => (
          <div key={c.label} className={`px-5 py-4 md:px-6 grid grid-cols-1 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)_110px] gap-2 md:gap-5 ${i < checks.length - 1 ? "border-b border-rule" : ""}`}>
            <strong className="text-[15px]">{c.label}</strong>
            <div className="flex flex-col gap-0.5">
              <span className="cap text-steel">{brand} says</span>
              <span className="text-[15px] leading-[1.5]">{c.juki}</span>
              <span className="flex gap-3 flex-wrap">
                {c.links.map((l) => (
                  <a key={l.url + l.label} href={l.url} rel="nofollow noopener external" target="_blank" className="m text-[13px] text-steel no-underline hover:text-enamel">
                    {l.label}
                  </a>
                ))}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="cap text-steel">Dealers and owners</span>
              <span className="text-[15px] leading-[1.5] text-ink-soft">{c.others}</span>
            </div>
            <span className={`cap md:text-right ${c.status === "confirmed" ? "text-enamel" : c.status === "differs" ? "text-brass-ink" : "text-steel"}`}>{STATUS_LABEL[c.status]}</span>
          </div>
        ))}
      </div>
    </HeaderCard>
  );
}

/** Claimed differences from sibling models, counted by independent pages. */
export function SiblingDifferences({ rollup, modelName }: { rollup: Rollup; modelName: string }) {
  const sibs = rollup.siblings.filter((s) => s.rows.length > 0);
  if (!sibs.length) return null;
  return (
    <div className="flex flex-col gap-4">
      {sibs.map((s) => (
        <HeaderCard key={s.model} title={`${modelName} vs Juki ${s.model}`} caption="claimed differences" as="div">
          <div className="flex flex-col">
            {s.rows.map((r, i) => (
              <div key={r.feature} className={`px-5 py-3.5 md:px-6 grid grid-cols-1 md:grid-cols-[170px_minmax(0,1fr)_150px] gap-1.5 md:gap-5 ${i < s.rows.length - 1 ? "border-b border-rule" : ""}`}>
                <strong className="text-[15px]">{r.feature}</strong>
                <span className="text-[15px] leading-[1.5] text-ink-soft">{r.summary}</span>
                <span className="m text-[13px] text-steel leading-[1.5] md:text-right">
                  {r.urls} {r.urls === 1 ? "page" : "pages"}
                  <br />
                  {r.check}
                </span>
              </div>
            ))}
          </div>
        </HeaderCard>
      ))}
    </div>
  );
}

/** What buyers say when they weigh this machine against rivals. Counts of claims, not votes. */
export function RivalSignals({ rollup, modelName }: { rollup: Rollup; modelName: string }) {
  if (!rollup.rivals.length) return null;
  return (
    <HeaderCard title="Against other machines" caption="claims, not votes" as="div">
      <div className="flex flex-col">
        {rollup.rivals.map((r, i) => (
          <div key={r.model} className={`px-5 py-4 md:px-6 grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-2 md:gap-6 ${i < rollup.rivals.length - 1 ? "border-b border-rule" : ""}`}>
            <div className="flex flex-col gap-0.5">
              <strong className="text-[16px]">{r.model}</strong>
              <span className="m text-[13px] text-steel leading-[1.5]">
                {r.claims} claims from {r.sources} {r.sources === 1 ? "thread or page" : "threads or pages"}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {r.dimensions.this.length > 0 && (
                <span className="text-[15px] leading-[1.5]">
                  <span className="cap text-enamel">Credited to {modelName} ({r.favors.this})</span>{" "}
                  {r.dimensions.this.map((d) => d.dimension).join(", ")}
                </span>
              )}
              {r.dimensions.other.length > 0 && (
                <span className="text-[15px] leading-[1.5]">
                  <span className="cap text-brass-ink">Credited to {r.model} ({r.favors.other})</span>{" "}
                  {r.dimensions.other.map((d) => d.dimension).join(", ")}
                </span>
              )}
              {r.examples.map((e) => (
                <div key={e.claim_id} className="flex flex-col gap-0.5">
                  <span className="text-[15px] leading-[1.5] text-ink-soft">{e.claim}</span>
                  <SourceLink url={e.url} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </HeaderCard>
  );
}
