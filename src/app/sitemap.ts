import type { MetadataRoute } from "next";
import { brands, seriesHubs } from "@/lib/brands";
import { comparisons } from "@/lib/comparisons";
import { publishedGuides } from "@/lib/guides";
import { hubs } from "@/lib/hubs";
import { products, productsForBrand } from "@/lib/products";
import { site } from "@/lib/site";

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/** Latest real content date wins. Never stamp lastmod as "now" on each build. */
function latest(...dates: (string | undefined | null)[]): string {
  const valid = dates.filter((d): d is string => Boolean(d));
  if (valid.length === 0) return site.lastUpdated;
  return valid.sort()[valid.length - 1]!;
}

function loc(path: string): string {
  if (!path || path === "/") return site.url;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

function entry(path: string, lastModified: string, changeFrequency: Freq, priority: number): MetadataRoute.Sitemap[number] {
  return { url: loc(path), lastModified, changeFrequency, priority };
}

const UTILITY_UPDATED = "2026-09-29";

export default function sitemap(): MetadataRoute.Sitemap {
  const productDates = products.map((p) => p.lastUpdated);
  const rows: MetadataRoute.Sitemap = [
    entry("/", latest(...productDates), "weekly", 1),
    ...hubs.map((h) =>
      entry(
        `/${h.slug}`,
        latest(h.lastUpdated, ...products.filter((p) => p.jobs.includes(h.job)).map((p) => p.lastUpdated)),
        "weekly",
        h.feeder ? 0.8 : 0.9,
      ),
    ),
    entry("/brands", latest(...brands.map((b) => b.dateModified)), "weekly", 0.7),
    ...brands.map((b) => entry(`/brands/${b.slug}`, latest(b.dateModified, ...productsForBrand(b.name).map((p) => p.lastUpdated)), "weekly", 0.75)),
    ...seriesHubs().map(({ brand, series, href }) =>
      entry(href, latest(series.dateModified, ...productsForBrand(brand.name).filter((p) => p.series?.toLowerCase() === series.code.toLowerCase()).map((p) => p.lastUpdated)), "weekly", 0.7),
    ),
    entry("/reviews", latest(...productDates), "weekly", 0.7),
    ...products.map((p) => entry(`/reviews/${p.slug}`, latest(p.lastUpdated, p.specsVerified), "weekly", 0.85)),
    entry("/compare", latest(...comparisons.map((c) => c.lastUpdated)), "weekly", 0.7),
    ...comparisons.map((c) => entry(`/compare/${c.slug}`, latest(c.lastUpdated, ...c.productSlugs.map((s) => products.find((p) => p.slug === s)?.lastUpdated)), "monthly", 0.8)),
    entry("/guides", latest(...publishedGuides().map((g) => g.updated)), "weekly", 0.7),
    ...publishedGuides().map((g) => entry(`/guides/${g.slug}`, g.updated, "monthly", g.awareness ? 0.8 : 0.75)),
    entry("/about", UTILITY_UPDATED, "monthly", 0.4),
    entry("/privacy", UTILITY_UPDATED, "yearly", 0.2),
    entry("/terms", UTILITY_UPDATED, "yearly", 0.2),
  ];
  // /out/ never enters the sitemap. Draft guides stay out until published.
  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const row of rows) unique.set(row.url, row);
  return [...unique.values()].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0) || a.url.localeCompare(b.url));
}
