import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, Container } from "@/components/layout/Container";
import { IndexSwitcher } from "@/components/index/IndexSwitcher";
import { PhotoWell } from "@/components/ui/PhotoWell";
import { PriceBandBadge } from "@/components/ui/Badges";
import { JsonLd } from "@/components/schema/JsonLd";
import { comparisons } from "@/lib/comparisons";
import { getProduct, type Product } from "@/lib/products";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo-meta";

export const metadata: Metadata = pageMeta({
  title: "Sewing Machine Comparisons: Head-to-Head, Spec by Spec | Stitch Check",
  description:
    "Two machines side by side with the winner marked per row. Juki TL-2010Q vs TL-2000Qi, Brother 1034D vs 1034DX, Singer 4423 vs 4432 vs 4452, and more.",
  path: "/compare",
  type: "website",
});

export default function CompareIndex() {
  return (
    <>
      <Header active="/compare" />
      <main id="main-content" className="flex-1">
        <Container className="py-10 md:py-12 pb-16 md:pb-24 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div className="flex flex-col gap-3.5">
              <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
              <h1 className="d m-0 text-[40px] md:text-[60px] leading-[1]">Head-to-heads</h1>
              <p className="m-0 text-[17px] text-ink-soft max-w-[640px]">Exactly two machines per page, spec by spec, with the winner marked on each row. The Singer Heavy Duty family is the one three-way exception because that is how people search it.</p>
            </div>
            <IndexSwitcher active="/compare" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comparisons.map((c) => {
              const prods = c.productSlugs.map(getProduct).filter((p): p is Product => Boolean(p));
              return (
                <Link key={c.slug} href={`/compare/${c.slug}`} className="card no-underline text-graphite p-5 flex flex-col gap-4 hover:border-enamel">
                  <div className="flex items-center gap-3">
                    {prods.map((p, i) => (
                      <span key={p.slug} className="contents">
                        <PhotoWell src={p.image} alt={p.imageAlt} className="h-[80px] grow !p-0" />
                        {i < prods.length - 1 && <span className="d text-steel text-[18px]">vs</span>}
                      </span>
                    ))}
                  </div>
                  <h2 className="d m-0 text-[22px] md:text-[24px]">{c.title}</h2>
                  <p className="m-0 text-[15px] leading-[1.5] text-ink-soft">{c.description}</p>
                  <div className="flex gap-2 flex-wrap mt-auto">
                    {prods.map((p) => (
                      <span key={p.slug} className="flex gap-1.5 items-center">
                        <span className="m text-[13px]">{p.model}</span>
                        <PriceBandBadge band={p.priceBand} />
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Compare", path: "/compare" }])} />
      <JsonLd data={itemListSchema({ name: "Head-to-head comparisons", items: comparisons.map((c) => ({ name: c.title, url: `/compare/${c.slug}` })) })} />
    </>
  );
}
