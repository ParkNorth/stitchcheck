import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, Container } from "@/components/layout/Container";
import { IndexSwitcher } from "@/components/index/IndexSwitcher";
import { JsonLd } from "@/components/schema/JsonLd";
import { brands } from "@/lib/brands";
import { productsForBrand } from "@/lib/products";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo-meta";

export const metadata: Metadata = pageMeta({
  title: "Sewing Machine Brands Decoded: Juki, Janome, Brother, Singer, Baby Lock, Bernina | Stitch Check",
  description:
    "What each brand's series letters mean, which lines matter for heavy fabric, sergers and quilting, where each brand is weak, and which are dealer-only.",
  path: "/brands",
  type: "website",
});

export default function BrandsIndex() {
  return (
    <>
      <Header active="/brands" />
      <main id="main-content" className="flex-1">
        <Container className="py-10 md:py-12 pb-16 md:pb-24 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div className="flex flex-col gap-3.5">
              <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />
              <h1 className="d m-0 text-[40px] md:text-[60px] leading-[1]">Brands</h1>
              <p className="m-0 text-[17px] text-ink-soft max-w-[640px]">The letters on the machine tell you the job. Each brand page decodes its series, says where the brand is weak, and lists every model we have checked.</p>
            </div>
            <IndexSwitcher active="/brands" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {brands.map((b) => {
              const n = productsForBrand(b.name).length;
              return (
                <Link key={b.slug} href={`/brands/${b.slug}`} className="card no-underline text-graphite flex flex-col hover:border-enamel">
                  <div className="bg-graphite text-paper p-5 flex justify-between items-baseline gap-3">
                    <span className="d text-[36px] md:text-[40px] leading-none">{b.name}</span>
                    {b.dealerOnly && <span className="type type-inverse">Dealer only</span>}
                  </div>
                  <div className="p-5 flex flex-col gap-1 grow">
                    <div className="row !border-t-0 !pt-0" style={{ gridTemplateColumns: "110px minmax(0,1fr)" }}>
                      <span className="cap text-steel">Strongest at</span>
                      <span>{b.glance.strongest}</span>
                    </div>
                    <div className="row" style={{ gridTemplateColumns: "110px minmax(0,1fr)" }}>
                      <span className="cap text-steel">Weaker at</span>
                      <span>{b.glance.weaker}</span>
                    </div>
                    <div className="row" style={{ gridTemplateColumns: "110px minmax(0,1fr)" }}>
                      <span className="cap text-steel">Series</span>
                      <span className="m">{b.series.map((s) => s.code).join(" · ")}</span>
                    </div>
                    <div className="row" style={{ gridTemplateColumns: "110px minmax(0,1fr)" }}>
                      <span className="cap text-steel">We cover</span>
                      <span className="m">
                        {n} {n === 1 ? "model" : "models"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Brands", path: "/brands" }])} />
      <JsonLd data={itemListSchema({ name: "Brands", items: brands.map((b) => ({ name: b.name, url: `/brands/${b.slug}` })) })} />
    </>
  );
}
