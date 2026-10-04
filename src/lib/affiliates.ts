/**
 * Money plumbing. One retailer: Sewing Machines Plus (SMP).
 *
 * Retailer buy buttons point at a Linkly short link (`src/lib/buy-links.ts`) that
 * redirects through Awin to the SMP product page. A model with no short link falls
 * back to `/out/{slug}`, and `/out/{slug}` forwards to the short link for old URLs.
 * Every purchase link goes through here so the network
 * (Awin or ShareASale) and the IDs live in one place. Until the program is
 * approved and the env vars are set, `/out/` 302s to the plain SMP product URL
 * with the same rel attributes, so nothing on the page changes when money
 * switches on. Never hand-write an outbound purchase anchor.
 *
 * Brands SMP does not carry (dealer-only lines such as Baby Lock and Bernina)
 * get a "Find a dealer" link to the manufacturer locator, `rel="nofollow"`,
 * and no buy button. Never fake an affiliate relationship.
 */

import { BUY_SHORT_LINKS } from "@/lib/buy-links";

export type Network = "awin" | "shareasale" | "direct";

export const NETWORK: Network = ((process.env.NEXT_PUBLIC_AFFILIATE_NETWORK as Network | undefined) ??
  "direct") as Network;

/** Awin (if SMP is joined via Awin). */
export const AWIN_MERCHANT_ID = process.env.AWIN_MERCHANT_ID ?? "";
export const AWIN_PUBLISHER_ID = process.env.AWIN_PUBLISHER_ID ?? "";
/** Site token on a shared publisher account. Lowercase, under 50 chars. */
export const AWIN_CLICKREF = "stitchcheck";

/** ShareASale (if SMP is joined via ShareASale). */
export const SAS_MERCHANT_ID = process.env.SHAREASALE_MERCHANT_ID ?? "";
export const SAS_AFFILIATE_ID = process.env.SHAREASALE_AFFILIATE_ID ?? "";

/** True when the program is approved and IDs are present. Drives the disclosure state. */
export const AFFILIATE_ACTIVE =
  (NETWORK === "awin" && Boolean(AWIN_MERCHANT_ID && AWIN_PUBLISHER_ID)) ||
  (NETWORK === "shareasale" && Boolean(SAS_MERCHANT_ID && SAS_AFFILIATE_ID));

/**
 * The design rule: while a program is live the word "affiliate" is never dropped
 * from a buy button. No program is live today, so the chip and the sticky-bar
 * line are off site wide. This is a hard switch, deliberately not derived from
 * env vars: flip it to true in the same commit that switches the network on.
 */
export const SHOW_AFFILIATE_LABEL = false;

export type BuyTarget =
  | { kind: "retailer"; url: string }
  | { kind: "dealer"; url: string; label: string }
  | { kind: "none" };

function awinDeepLink(productUrl: string, slug: string): string {
  const q = new URLSearchParams();
  q.set("awinmid", AWIN_MERCHANT_ID);
  q.set("awinaffid", AWIN_PUBLISHER_ID);
  q.set("clickref", AWIN_CLICKREF);
  q.set("clickref2", slug);
  q.set("ued", productUrl);
  return `https://www.awin1.com/cread.php?${q.toString()}`;
}

function shareasaleDeepLink(productUrl: string, slug: string): string {
  const q = new URLSearchParams();
  q.set("b", "0");
  q.set("u", SAS_AFFILIATE_ID);
  q.set("m", SAS_MERCHANT_ID);
  q.set("urllink", productUrl.replace(/^https?:\/\//, ""));
  q.set("afftrack", `stitchcheck_${slug}`);
  return `https://www.shareasale.com/r.cfm?${q.toString()}`;
}

/** Final destination for `/out/{slug}`. A Linkly short link wins over the env-driven deep link. */
export function affiliateDestination(slug: string, retailerUrl: string): string {
  if (BUY_SHORT_LINKS[slug]) return BUY_SHORT_LINKS[slug];
  if (NETWORK === "awin" && AFFILIATE_ACTIVE) return awinDeepLink(retailerUrl, slug);
  if (NETWORK === "shareasale" && AFFILIATE_ACTIVE) return shareasaleDeepLink(retailerUrl, slug);
  return retailerUrl;
}

/** Shared href/rel/target for any outbound purchase link. */
export function outboundLinkProps(
  slug: string,
  target: BuyTarget,
): { href: string; rel: string; target: "_blank" } | null {
  if (target.kind === "retailer") {
    return { href: BUY_SHORT_LINKS[slug] ?? `/out/${slug}`, rel: "sponsored nofollow noopener", target: "_blank" };
  }
  if (target.kind === "dealer") {
    return { href: target.url, rel: "nofollow noopener external", target: "_blank" };
  }
  return null;
}
