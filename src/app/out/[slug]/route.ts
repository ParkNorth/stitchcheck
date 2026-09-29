import { NextRequest, NextResponse } from "next/server";
import { affiliateDestination } from "@/lib/affiliates";
import { getProduct } from "@/lib/products";

/**
 * Affiliate mask. Noindex, disallowed in robots.txt, never in the sitemap.
 * Only products with a retailer buy route resolve here; dealer-only models 404.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p || p.buy.kind !== "retailer") {
    return NextResponse.json({ error: "Unknown product" }, { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });
  }
  return NextResponse.redirect(affiliateDestination(slug, p.buy.url), {
    status: 302,
    headers: {
      "Cache-Control": "private, no-store, no-cache, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
}
