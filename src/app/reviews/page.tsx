import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, Container } from "@/components/layout/Container";
import { FilterGrid, type FilterItem } from "@/components/index/FilterGrid";
import { IndexSwitcher } from "@/components/index/IndexSwitcher";
import { GridCard } from "@/components/ui/ProductCards";
import { JsonLd } from "@/components/schema/JsonLd";
import { products } from "@/lib/products";
import { itemListSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo-meta";

export const metadata: Metadata = pageMeta({
  title: "All Sewing Machine Reviews, Spec-Checked | Stitch Check",
  description:
    "Every heavy-duty, serger, coverstitch and quilting machine we have spec-checked, filterable by type, price band and brand. Scores are for the job, not the feature list.",
  path: "/reviews",
  type: "website",
});

export default function ReviewsIndex() {
  const sorted = [...products].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const items: FilterItem[] = sorted.map((p) => ({ slug: p.slug, brand: p.brand, type: p.type, priceBand: p.priceBand, score: p.score, name: p.name }));
  const cards = Object.fromEntries(sorted.map((p) => [p.slug, <GridCard key={p.slug} product={p} wellHeight={170} />]));
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <Container className="py-10 md:py-12 pb-16 md:pb-24 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div className="flex flex-col gap-3.5">
              <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Reviews" }]} />
              <h1 className="d m-0 text-[40px] md:text-[60px] leading-[1]">All reviews</h1>
            </div>
            <IndexSwitcher active="/reviews" />
          </div>
          <FilterGrid items={items} cards={cards} noun="reviews" />
        </Container>
      </main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Reviews", path: "/reviews" }])} />
      <JsonLd data={itemListSchema({ name: "All reviews", items: sorted.map((p) => ({ name: p.name, url: `/reviews/${p.slug}` })) })} />
    </>
  );
}
