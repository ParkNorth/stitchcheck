import Link from "next/link";
import type { Check, Product } from "@/lib/products";
import { getProduct } from "@/lib/products";
import { site, monthYear } from "@/lib/site";
import { HeaderCard } from "./Panels";
import { AltCard } from "./ProductCards";
import { Verify } from "./SpecTable";

function Plus() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-[3px]">
      <path d="M3 9h12M9 3v12" stroke="#1F4A3A" strokeWidth="2.4" />
    </svg>
  );
}
function Dash() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-[3px]">
      <path d="M3 9h12" stroke="#8A5510" strokeWidth="2.4" />
    </svg>
  );
}

export function ProsCons({ product: p, id = "strengths" }: { product: Product; id?: string }) {
  return (
    <section id={id} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 scroll-mt-24">
      <div className="flex flex-col">
        <h2 className="d m-0 mb-3.5 text-[24px] md:text-[26px]">Strengths</h2>
        {p.strengths.map((s) => (
          <div key={s} className="pl">
            <Plus />
            <span>{s}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <h2 className="d m-0 mb-3.5 text-[24px] md:text-[26px]">Weaknesses</h2>
        {p.weaknesses.map((s) => (
          <div key={s} className="pl">
            <Dash />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CheckBeforeYouBuy({ checks, id = "check" }: { checks: Check[]; id?: string }) {
  return (
    <HeaderCard id={id} title="Check before you buy" caption={`${checks.length} checks`}>
      <div className="px-5 md:px-6 pt-2 pb-4 flex flex-col">
        {checks.map((c, i) => (
          <div key={c.title} className={`grid grid-cols-[40px_minmax(0,1fr)] gap-3 py-3.5 ${i < checks.length - 1 ? "border-b border-rule" : ""}`}>
            <span className="m font-semibold text-[15px] text-enamel">{String(i + 1).padStart(2, "0")}</span>
            <div className="flex flex-col gap-1">
              <strong className="text-[16px]">{c.title}</strong>
              <span className="text-[15px] text-ink-soft leading-[1.5]">{c.body}</span>
            </div>
          </div>
        ))}
      </div>
    </HeaderCard>
  );
}

const RETAILER_ROWS: { label: string; key: "warranty" | "returns" | "servicing" | "lessons" }[] = [
  { label: "Warranty", key: "warranty" },
  { label: "Returns", key: "returns" },
  { label: "Servicing", key: "servicing" },
  { label: "Setup and lessons", key: "lessons" },
];

/**
 * Retailer block. Facts come from docs/research/_retailer-sewing-machines-plus.md
 * and the product's published warranty. Unknowns render as [verify].
 */
export function RetailerBlock({ product: p, id = "retailer" }: { product: Product; id?: string }) {
  const warranty = p.specs.warrantyUs.value;
  const cells: Record<(typeof RETAILER_ROWS)[number]["key"], React.ReactNode> = {
    warranty: warranty ? (
      <>
        {p.brand} publishes: {warranty}. Warranty runs through an authorized dealer; confirm {site.retailer.shortName} is one for {p.brand} before you buy.
      </>
    ) : (
      <>
        {p.brand}&apos;s US warranty term for this model: <Verify />. Confirm {site.retailer.shortName} is an authorized {p.brand} dealer before you buy.
      </>
    ),
    returns: (
      <>
        {site.retailer.name} lists a 60-day return window; the buyer pays return shipping and opened machines may be refunded as store credit. Restocking fee: <Verify />. Re-check the policy page before ordering a heavy machine.
      </>
    ),
    servicing: (
      <>
        Warranty repairs go through {p.brand}&apos;s authorized service network. Whether a local {p.brand} dealer will service a machine bought online varies by dealer; ask before you buy.
      </>
    ),
    lessons: <>Online orders may not include the lessons a local dealer offers. Ask before you buy if that matters to you.</>,
  };
  return (
    <HeaderCard id={id} title={`Buying from ${site.retailer.name}`} caption={`Checked ${monthYear(p.lastUpdated)}`}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {RETAILER_ROWS.map((r, i) => (
          <div
            key={r.key}
            className={`px-5 py-4 md:px-6 md:py-[18px] flex flex-col gap-1.5 ${i < 2 ? "border-b border-rule" : i === 2 ? "border-b md:border-b-0 border-rule" : ""} ${
              i % 2 === 0 ? "md:border-r border-rule" : ""
            }`}
          >
            <span className="cap text-enamel">{r.label}</span>
            <span className="text-[16px] leading-[1.5]">{cells[r.key]}</span>
          </div>
        ))}
      </div>
    </HeaderCard>
  );
}

export function Alternatives({ product: p, id = "alternatives" }: { product: Product; id?: string }) {
  const alts = p.alternatives.map((a) => ({ ...a, product: getProduct(a.slug) })).filter((a) => a.product);
  if (!alts.length) return null;
  return (
    <section id={id} className="flex flex-col gap-5 scroll-mt-24">
      <div className="seam" />
      <h2 className="d m-0 text-[28px] md:text-[32px]">Alternatives</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {alts.map((a) => (
          <AltCard key={a.slug} product={a.product!} label={a.label} note={a.note} />
        ))}
      </div>
    </section>
  );
}

export function HeadToHeads({ items }: { items: { href: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="flex flex-col gap-3.5">
      <div className="cap">Head-to-heads</div>
      <div className="flex gap-3 flex-wrap">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="sec">
            {i.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function DiscontinuedBanner({ product: p }: { product: Product }) {
  if (!p.discontinued) return null;
  const rep = p.replacedBy ? getProduct(p.replacedBy) : undefined;
  return (
    <div className="card grid grid-cols-1 md:grid-cols-[170px_minmax(0,1fr)_auto] items-stretch">
      <div className="cap bg-steel text-paper px-4 py-3 md:py-[18px] flex items-center">Discontinued</div>
      <div className="px-5 py-4 text-[16px] leading-[1.5]">
        {p.brand} stopped making this model{rep ? ` and replaced it with the ${rep.model}` : ""}. This review stays up for people buying used or finding old stock.
      </div>
      {rep && (
        <div className="px-5 pb-4 md:py-3 flex items-center">
          <Link href={`/reviews/${rep.slug}`} className="lnk text-[15px] whitespace-nowrap">
            Read the {rep.model} review
          </Link>
        </div>
      )}
    </div>
  );
}
