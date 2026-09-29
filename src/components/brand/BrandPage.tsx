import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, Container, Seam } from "@/components/layout/Container";
import { TypeBadge } from "@/components/ui/Badges";
import { GridCard } from "@/components/ui/ProductCards";
import { SeriesFilter } from "./SeriesFilter";
import { JsonLd } from "@/components/schema/JsonLd";
import type { BrandInfo, Series } from "@/lib/brands";
import { productsForBrand, type Product } from "@/lib/products";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export function BrandPage({ brand, series }: { brand: BrandInfo; series?: Series }) {
  const all = productsForBrand(brand.name);
  const models = series ? all.filter((p) => p.series?.toLowerCase() === series.code.toLowerCase() || p.series?.toLowerCase() === series.slug) : all;
  const decoder = series ? [series] : brand.series;
  const seriesCodes = Array.from(new Set(all.map((p) => p.series).filter((s): s is string => Boolean(s))));
  const h1 = series ? `${brand.name} ${series.code} series` : brand.name;
  const path = series ? `/brands/${brand.slug}/${series.slug}` : `/brands/${brand.slug}`;
  const crumbs = [{ label: "Home", href: "/" }, { label: "Brands", href: "/brands" }, ...(series ? [{ label: brand.name, href: `/brands/${brand.slug}` }, { label: `${series.code} series` }] : [{ label: brand.name }])];

  const cards = Object.fromEntries(
    models.map((p) => [p.slug, <GridCard key={p.slug} product={p} seriesCode={series ? undefined : p.series} wellHeight={200} />]),
  );

  return (
    <>
      <Header active="/brands" />
      <main id="main-content" className="flex-1">
        <Container className="py-10 md:py-12 pb-16 md:pb-24 flex flex-col gap-12 md:gap-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <Breadcrumb items={crumbs} />
              <h1 className="d m-0 text-[56px] md:text-[80px] lg:text-[96px] leading-[0.95]">{h1}</h1>
              <p className="m-0 text-[18px] md:text-[19px] leading-[1.55] text-ink-soft max-w-[640px]">{series ? series.description : brand.intro}</p>
              {brand.dealerOnly && (
                <p className="m-0 text-[16px] leading-[1.55] text-ink-soft max-w-[640px]">
                  {brand.name} sells through dealers and does not publish online prices. There is no buy button on this page; model pages link to the dealer locator, and we have no affiliate relationship with {brand.name}.
                </p>
              )}
            </div>
            <div className="lg:col-start-9 lg:col-span-4 card p-6 flex flex-col self-end">
              <div className="cap pb-3">{brand.name} at a glance</div>
              <div className="row">
                <span className="cap text-steel">Strongest at</span>
                <span>{brand.glance.strongest}</span>
              </div>
              <div className="row">
                <span className="cap text-steel">Weaker at</span>
                <span>{brand.glance.weaker}</span>
              </div>
              <div className="row">
                <span className="cap text-steel">Price span</span>
                <span className="m">{brand.glance.priceSpan}</span>
              </div>
              <div className="row">
                <span className="cap text-steel">We cover</span>
                <span className="m">
                  {brand.series.length} series · {all.length} {all.length === 1 ? "model" : "models"}
                </span>
              </div>
              <div className="row">
                <span className="cap text-steel">Buy</span>
                <span>{brand.dealerOnly ? "Dealer only" : `Online via ${site.retailer.name}`}</span>
              </div>
            </div>
          </div>

          <section className="flex flex-col gap-6" aria-labelledby="decoder">
            <div className="flex justify-between items-baseline gap-4 flex-wrap">
              <h2 id="decoder" className="d m-0 text-[30px] md:text-[36px]">
                {series ? "What the letters mean" : "Series decoder"}
              </h2>
              <span className="m text-[14px] text-steel">The letters tell you the job</span>
            </div>
            <Seam />
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${decoder.length >= 4 ? "lg:grid-cols-4" : decoder.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-5`}>
              {decoder.map((s) => (
                <div key={s.slug} className="card flex flex-col">
                  <div className="bg-graphite text-paper p-5 flex justify-between items-baseline gap-3">
                    <span className="d text-[40px] md:text-[48px] leading-none">{s.code}</span>
                    <TypeBadge type={s.type} inverse />
                  </div>
                  <div className="p-5 flex flex-col gap-1 grow">
                    <div className="font-bold text-[17px] pb-2">{s.name}</div>
                    <div className="row" style={{ gridTemplateColumns: "90px minmax(0,1fr)" }}>
                      <span className="cap text-steel">Built for</span>
                      <span>{s.builtFor}</span>
                    </div>
                    <div className="row" style={{ gridTemplateColumns: "90px minmax(0,1fr)" }}>
                      <span className="cap text-steel">Band</span>
                      <span className="m">{s.band}</span>
                    </div>
                    <div className="row" style={{ gridTemplateColumns: "90px minmax(0,1fr)" }}>
                      <span className="cap text-steel">Watch for</span>
                      <span>{s.watchFor}</span>
                    </div>
                  </div>
                  {s.hasHub && !series ? (
                    <Link href={`/brands/${brand.slug}/${s.slug}`} className="lnk px-5 pb-5 text-[15px]">
                      {s.code} series hub
                    </Link>
                  ) : (
                    !series && <span className="m px-5 pb-5 text-[14px] text-steel">No series hub · models below</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6" aria-labelledby="models">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h2 id="models" className="d m-0 text-[30px] md:text-[36px]">
                {series ? `${brand.name} ${series.code} models we cover` : `${brand.name} models we cover`}
              </h2>
              {!series && seriesCodes.length > 1 && <SeriesFilter codes={seriesCodes} items={models.map((p: Product) => ({ slug: p.slug, series: p.series ?? "" }))} total={models.length} />}
            </div>
            {models.length === 0 ? (
              <div className="card p-6 text-[16px] text-ink-soft">No {brand.name} models checked yet. The research queue for this brand is open in Linear.</div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${series ? "lg:grid-cols-3" : "lg:grid-cols-3"} gap-6`} data-model-grid>
                {models.map((p) => (
                  <div key={p.slug} data-series={p.series ?? ""} className="contents">
                    {cards[p.slug]}
                  </div>
                ))}
              </div>
            )}
          </section>
        </Container>
      </main>
      <JsonLd data={breadcrumbSchema(crumbs.filter((c) => c.href).map((c) => ({ name: c.label, path: c.href! })).concat([{ name: crumbs.at(-1)!.label, path }]))} />
      <JsonLd data={itemListSchema({ name: `${h1} models`, items: models.map((p) => ({ name: p.name, url: `/reviews/${p.slug}` })) })} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Brand",
          name: brand.name,
          url: brand.manufacturerUrl,
          description: brand.intro,
        }}
      />
    </>
  );
}
