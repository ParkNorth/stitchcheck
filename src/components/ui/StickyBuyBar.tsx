"use client";

import { useEffect, useState } from "react";
import { SHOW_AFFILIATE_LABEL } from "@/lib/affiliates";
import { bandLabel } from "@/lib/price-bands";
import type { Product } from "@/lib/products";
import { site } from "@/lib/site";
import { BuyButton } from "./BuyButton";
import { PhotoWell } from "./PhotoWell";

/**
 * Mobile sticky buy bar. Appears after the verdict box scrolls off.
 * Review and compare pages only. Hidden on md and up (the rail takes over).
 */
export function StickyBuyBar({
  product: p,
  watch = "verdict",
  eyebrow,
}: {
  product: Product;
  watch?: string;
  eyebrow?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watch);
    if (!target || typeof IntersectionObserver === "undefined") {
      const t = window.setTimeout(() => setShow(true), 0);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [watch]);

  if (p.buy.kind !== "retailer") return null;

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-card border-t-[1.5px] border-graphite px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))] flex flex-col gap-2 transition-transform duration-200 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-3">
        <PhotoWell src={p.image} alt={p.imageAlt} className="w-12 h-12 !p-0 shrink-0" sizes="48px" />
        <div className="grow flex flex-col gap-[3px] min-w-0">
          {eyebrow && <div className="cap text-brass-ink">{eyebrow}</div>}
          <div className="font-bold text-[15px] truncate">{p.name}</div>
          {!eyebrow && (
            <div className="m text-[13px] text-ink-soft">
              {p.score.toFixed(1)}/10 · {bandLabel(p.priceBand)}
            </div>
          )}
        </div>
        <BuyButton product={p} size="sm" className="!min-h-[48px] !text-[15px]" label="Check lowest price" />
      </div>
      {SHOW_AFFILIATE_LABEL && (
        <div className="m text-[13px] text-steel text-right">Affiliate link to {site.retailer.name}</div>
      )}
    </div>
  );
}
