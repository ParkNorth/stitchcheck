import { outboundLinkProps } from "@/lib/affiliates";
import { hasBuyButton, type Product } from "@/lib/products";
import { site } from "@/lib/site";
import { formatUsd } from "@/lib/price-bands";
import { longDate } from "@/lib/site";

function ExternalArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M5 2h7v7M12 2L4 10" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/**
 * The only purchase link on the site. Always labelled as an affiliate link.
 * `size`: "lg" (verdict box, rails), "md" (default, cards), "sm" (tables, grid cards).
 * Dealer-only products render a "Find a dealer" secondary link instead.
 */
export function BuyButton({
  product,
  size = "md",
  label,
  className = "",
  graphite = false,
}: {
  product: Product;
  size?: "lg" | "md" | "sm";
  label?: string;
  className?: string;
  graphite?: boolean;
}) {
  const link = outboundLinkProps(product.slug, product.buy);
  if (!link) {
    return (
      <span className={`sec cursor-default ${className}`} aria-disabled="true">
        Not sold online
      </span>
    );
  }
  if (product.buy.kind === "dealer") {
    return (
      <a href={link.href} rel={link.rel} target={link.target} className={`sec ${className}`}>
        {product.buy.label}
        <ExternalArrow />
      </a>
    );
  }
  const text = label ?? "Check lowest price";
  if (size === "lg") {
    return (
      <a
        href={link.href}
        rel={link.rel}
        target={link.target}
        className={`buy buy-lg ${graphite ? "buy-graphite" : ""} ${className}`}
        data-affiliate="true"
        data-slug={product.slug}
      >
        <span className="text-[16px] text-left">{text}</span>
        <ExternalArrow />
      </a>
    );
  }
  return (
    <a
      href={link.href}
      rel={link.rel}
      target={link.target}
      className={`buy ${size === "sm" ? "buy-sm" : ""} ${graphite ? "buy-graphite" : ""} ${className}`}
      data-affiliate="true"
      data-slug={product.slug}
    >
      <span>{text}</span>
      <span className="aff">Affiliate</span>
    </a>
  );
}

/** "Last seen $X on date at Sewing Machines Plus. Today's price is on their page." */
export function LastSeen({ product }: { product: Product }) {
  if (!hasBuyButton(product)) {
    return (
      <div className="text-[14px] text-ink-soft leading-[1.45]">
        {product.brand} publishes dealer pricing only. Ask a dealer for today&apos;s price.
      </div>
    );
  }
  if (product.priceUsdSeen && product.priceSeenDate) {
    const where = product.priceSeenAt === site.retailer.name ? site.retailer.name : product.priceSeenAt;
    return (
      <div className="text-[14px] text-ink-soft leading-[1.45]">
        <span className="m">
          Last seen {formatUsd(product.priceUsdSeen)} on {longDate(product.priceSeenDate)}
        </span>{" "}
        at {where}. Today&apos;s price is on the {site.retailer.name} page.
      </div>
    );
  }
  return (
    <div className="text-[14px] text-ink-soft leading-[1.45]">
      <span className="m">Price band only.</span> Today&apos;s price is on the {site.retailer.name} page.
    </div>
  );
}
