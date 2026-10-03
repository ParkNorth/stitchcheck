import { bandLabel, bandRange } from "@/lib/price-bands";
import { checkedDate, type Product } from "@/lib/products";
import { monthYear } from "@/lib/site";
import { PriceBandBadge, TypeBadge } from "./Badges";
import { BuyButton, LastSeen } from "./BuyButton";
import { Score, StitchMeter } from "./StitchMeter";

export function VerdictBox({ product: p, id = "verdict", buyHref }: { product: Product; id?: string; buyHref?: string }) {
  return (
    <section id={id} className="card flex flex-col scroll-mt-24" aria-labelledby={`${id}-title`}>
      <div className="cap bg-graphite text-paper px-4 md:px-6 py-2 md:py-2.5 flex justify-between gap-4">
        <span id={`${id}-title`}>Verdict</span>
        <span className="font-medium normal-case tracking-normal md:tracking-[.08em] md:uppercase">
          <span className="hidden md:inline">Specs checked against {p.brand} data · </span>
          <span className="md:hidden">Checked </span>
          {monthYear(checkedDate(p))}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_380px]">
        {/* Score */}
        <div className="p-4 md:p-6 lg:py-7 lg:border-r border-rule flex lg:flex-col gap-4 lg:gap-3 items-center lg:items-start">
          <span className="hidden lg:block">
            <Score score={p.score} size={76} />
          </span>
          <span className="lg:hidden">
            <Score score={p.score} size={52} suffix={false} />
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="m text-[13px] text-steel lg:hidden">out of 10</span>
            <StitchMeter score={p.score} />
            <a href="/about#score" className="m text-[13px] text-steel no-underline hover:text-enamel hidden lg:inline">
              How we score
            </a>
          </div>
        </div>

        {/* Verdict */}
        <div className="px-4 pb-4 md:p-7 flex flex-col gap-4 md:gap-[18px]">
          <p className="d m-0 text-[19px] md:text-[27px] leading-[1.25] md:leading-[1.2]">{p.verdict}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div className="flex flex-col gap-1.5 border-t border-rule pt-3 md:border-0 md:pt-0">
              <div className="cap text-enamel">Who it&apos;s for</div>
              <div className="text-[15px] md:text-[16px] leading-[1.5]">{p.whoFor}</div>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-rule pt-3 md:border-0 md:pt-0">
              <div className="cap text-steel">Skip it if</div>
              <div className="text-[15px] md:text-[16px] leading-[1.5]">{p.skipIf}</div>
            </div>
          </div>
        </div>

        {/* Buy */}
        <div className="p-4 md:p-6 lg:py-7 border-t lg:border-t-0 lg:border-l border-rule flex flex-col gap-3.5 justify-center">
          <div className="flex justify-between items-baseline gap-3">
            <span className="cap text-steel">Price band</span>
            <span className="m text-[20px] font-semibold">{bandRange(p.priceBand)}</span>
          </div>
          <div className="flex gap-2 lg:hidden">
            <PriceBandBadge band={p.priceBand} />
            <TypeBadge type={p.type} />
          </div>
          <BuyButton product={p} size="lg" className="w-full" hrefOverride={buyHref} />
          <LastSeen product={p} />
        </div>
      </div>

      {/* Real cost footer */}
      <div className="border-t-[1.5px] border-graphite px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-2 md:gap-6 items-center bg-paper rounded-b-[3px]">
        <span className="cap">Real cost to get sewing</span>
        <div className="m flex flex-wrap gap-x-2.5 gap-y-1 text-[14px] md:text-[15px] items-center">
          <span className="font-semibold">Machine {bandLabel(p.priceBand)}</span>
          {p.realCost
            .filter((c) => !/^machine\b/i.test(c))
            .map((c) => (
              <span key={c} className="contents">
                <span aria-hidden="true">+</span>
                <span>{c}</span>
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
