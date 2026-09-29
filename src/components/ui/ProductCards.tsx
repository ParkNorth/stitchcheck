import Link from "next/link";
import type { Pick } from "@/lib/hubs";
import type { Product } from "@/lib/products";
import { OurPickBadge, PriceBandBadge, TypeBadge, ValuePickBadge, DiscontinuedBadge } from "./Badges";
import { BuyButton } from "./BuyButton";
import { PhotoWell } from "./PhotoWell";
import { Score } from "./StitchMeter";

/** A · Hub card: ranked shortlist row. */
export function HubCard({
  product: p,
  rank,
  pick,
  reason,
  id,
}: {
  product: Product;
  rank: number;
  pick?: Pick;
  reason?: string;
  id?: string;
}) {
  return (
    <article
      id={id}
      className={`card grid grid-cols-[48px_minmax(0,1fr)] md:grid-cols-[56px_190px_minmax(0,1fr)_210px] gap-4 md:gap-6 p-4 md:p-6 items-center scroll-mt-24 ${
        pick === "value-pick" ? "card-brass" : ""
      }`}
    >
      <div className="d text-[36px] md:text-[44px] leading-none self-start">{String(rank).padStart(2, "0")}</div>
      <PhotoWell
        src={p.image}
        alt={p.imageAlt}
        caption="Photo"
        className="h-[120px] md:h-[150px] col-start-2 md:col-start-auto"
      />
      <div className="flex flex-col gap-2.5 col-span-2 md:col-span-1">
        <div className="flex gap-2 flex-wrap items-center">
          {pick === "our-pick" && <OurPickBadge />}
          {pick === "value-pick" && <ValuePickBadge />}
          {p.discontinued ? <DiscontinuedBadge replacedBy={p.replacedBy} /> : <TypeBadge type={p.type} />}
          <PriceBandBadge band={p.priceBand} />
          {p.industrial && <span className="m text-[13px] text-steel self-center">+ table</span>}
        </div>
        <h3 className="d m-0 text-[22px] md:text-[24px]">
          <Link href={`/reviews/${p.slug}`} className="text-graphite no-underline hover:text-enamel">
            {p.name}
          </Link>
        </h3>
        <div className="m text-[14px] font-medium">{p.keySpec}</div>
        <p className="m-0 text-[16px] leading-[1.5] text-ink-soft">{reason ?? p.reason}</p>
      </div>
      <div className="flex flex-col gap-2.5 col-span-2 md:col-span-1 md:self-stretch justify-center md:border-l border-rule md:pl-6 border-t md:border-t-0 pt-3 md:pt-0">
        <Score score={p.score} size={30} />
        <BuyButton product={p} className="w-full" />
        <Link href={`/reviews/${p.slug}`} className="sec w-full">
          Read review
        </Link>
      </div>
    </article>
  );
}

/** B · Grid card: brand hubs, index pages, guide CTAs. */
export function GridCard({
  product: p,
  seriesCode,
  pick,
  note,
  wellHeight = 180,
}: {
  product: Product;
  seriesCode?: string;
  pick?: Pick;
  note?: string;
  wellHeight?: number;
}) {
  return (
    <article className="card p-4 flex flex-col gap-3">
      <PhotoWell
        src={p.image}
        alt={p.imageAlt}
        caption="Photo"
        style={{ height: wellHeight, opacity: p.discontinued ? 0.55 : 1 }}
      />
      <div className="flex gap-2 flex-wrap items-center">
        {pick === "our-pick" && <OurPickBadge />}
        {pick === "value-pick" && <ValuePickBadge />}
        {p.discontinued ? <DiscontinuedBadge replacedBy={p.replacedBy} /> : <TypeBadge type={p.type} />}
        <PriceBandBadge band={p.priceBand} />
        {seriesCode && <span className="m text-[13px] text-steel self-center ml-auto">{seriesCode}</span>}
      </div>
      <div className="flex justify-between items-baseline gap-3">
        <h3 className="d m-0 text-[19px] md:text-[20px]">
          <Link href={`/reviews/${p.slug}`} className="text-graphite no-underline hover:text-enamel">
            {p.name}
          </Link>
        </h3>
        <span className="m text-[16px] font-semibold">{p.score.toFixed(1)}</span>
      </div>
      <div className={`${note ? "" : "m"} text-[15px] text-ink-soft leading-[1.5]`}>{note ?? p.keySpec}</div>
      <div className="flex gap-3 items-center mt-auto">
        <BuyButton product={p} size="sm" className="grow" />
        <Link href={`/reviews/${p.slug}`} className="lnk text-[14px]">
          Review
        </Link>
      </div>
    </article>
  );
}

/** C · Alternatives row card (review footer). */
export function AltCard({ product: p, label, note }: { product: Product; label: string; note: string }) {
  return (
    <Link
      href={`/reviews/${p.slug}`}
      className="card no-underline text-graphite p-3.5 grid grid-cols-[88px_minmax(0,1fr)] md:grid-cols-[96px_minmax(0,1fr)] gap-4 items-center hover:border-enamel"
    >
      <PhotoWell src={p.image} alt={p.imageAlt} className="h-[72px] md:h-[80px] !p-0" />
      <span className="flex flex-col gap-1">
        <span className="cap text-steel">{label}</span>
        <span className="font-bold text-[16px] md:text-[17px]">{p.name}</span>
        <span className="text-[15px] text-ink-soft">{note}</span>
      </span>
    </Link>
  );
}
