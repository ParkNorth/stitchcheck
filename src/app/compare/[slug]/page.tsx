import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, Container } from "@/components/layout/Container";
import { OurPickBadge, PriceBandBadge, TypeBadge, ValuePickBadge } from "@/components/ui/Badges";
import { BuyButton } from "@/components/ui/BuyButton";
import { PhotoWell } from "@/components/ui/PhotoWell";
import { Score } from "@/components/ui/StitchMeter";
import { DarkPanel } from "@/components/ui/Panels";
import { CompareTable, CompareTableMobile } from "@/components/compare/CompareTable";
import { StickyBuyBar } from "@/components/ui/StickyBuyBar";
import { JsonLd } from "@/components/schema/JsonLd";
import { comparisons, getComparison, resolveRows } from "@/lib/comparisons";
import { getGuide } from "@/lib/guides";
import { getProduct, type Product } from "@/lib/products";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo-meta";
import { monthYear, site } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};
  return pageMeta({ title: `${c.title}: Spec-by-Spec, Which to Buy (2026)`, description: c.description, path: `/compare/${c.slug}` });
}

function CompareHead({ p, pick, three }: { p: Product; pick?: "our-pick" | "value-pick"; three: boolean }) {
  return (
    <article className={`card p-4 md:p-6 ${three ? "flex flex-col gap-2.5" : "grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)] gap-4 md:gap-6"} ${pick === "value-pick" ? "card-brass" : ""}`}>
      <PhotoWell src={p.image} alt={p.imageAlt} caption="Photo" className={three ? "h-[130px]" : "h-[150px] lg:h-[180px]"} />
      <div className="flex flex-col gap-2.5 grow">
        {three ? (
          <>
            <div className="flex justify-between items-baseline gap-3">
              <h2 className="d m-0 text-[22px]">
                <Link href={`/reviews/${p.slug}`} className="text-graphite no-underline hover:text-enamel">
                  {p.name}
                </Link>
              </h2>
              <span className="m font-semibold">{p.score.toFixed(1)}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <PriceBandBadge band={p.priceBand} />
              {pick === "value-pick" && <ValuePickBadge />}
              {pick === "our-pick" && <OurPickBadge />}
            </div>
            <BuyButton product={p} className="w-full mt-auto" />
          </>
        ) : (
          <>
            <div className="flex gap-2 flex-wrap">
              {pick === "our-pick" ? <OurPickBadge /> : pick === "value-pick" ? <ValuePickBadge /> : <TypeBadge type={p.type} />}
              <PriceBandBadge band={p.priceBand} />
            </div>
            <h2 className="d m-0 text-[24px] md:text-[26px]">
              <Link href={`/reviews/${p.slug}`} className="text-graphite no-underline hover:text-enamel">
                {p.name}
              </Link>
            </h2>
            <Score score={p.score} size={34} />
            <div className="grow" />
            <div className="flex gap-2.5 items-center flex-wrap">
              <BuyButton product={p} />
              <Link href={`/reviews/${p.slug}`} className="lnk text-[14px]">
                Review
              </Link>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();
  const prods = c.productSlugs.map(getProduct).filter((p): p is Product => Boolean(p));
  if (prods.length !== c.productSlugs.length) notFound();
  const { rows, tally, ties } = resolveRows(c);
  const three = prods.length === 3;
  const guide = getGuide(c.relatedGuide);
  const latest = prods.map((p) => p.lastUpdated).concat(c.lastUpdated).sort().at(-1)!;
  const stickyPick = prods.find((p) => c.picks?.[p.slug] === "value-pick") ?? prods.find((p) => c.picks?.[p.slug] === "our-pick") ?? prods[0];

  const tallyText = (
    <>
      {prods.map((p) => (
        <span key={p.slug} className="block">
          {p.model} wins {tally[p.slug] ?? 0} {tally[p.slug] === 1 ? "row" : "rows"}
        </span>
      ))}
      <span className="block">
        {ties} {ties === 1 ? "tie" : "ties"}
      </span>
    </>
  );

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: c.crumb ?? c.title.replace(/^Juki |^Brother |^Singer |^Janome /, "") },
  ];


  return (
    <>
      <Header active="/compare" />
      <main id="main-content" className="flex-1">
        <Container className="py-8 md:py-12 pb-28 md:pb-24 flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-4">
            <Breadcrumb items={crumbs} />
            <h1 className="d m-0 text-[30px] md:text-[52px] lg:text-[60px] leading-[1.02] lg:leading-[1]">{c.title}</h1>
          </div>

          <div id="verdict">
            <DarkPanel eyebrow="Summary verdict" aside={three ? undefined : tallyText}>
              <p className="d m-0 text-[20px] md:text-[26px] leading-[1.3] md:leading-[1.25]">{c.summary}</p>
            </DarkPanel>
          </div>

          {/* Heads */}
          {three ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[260px_repeat(3,minmax(0,1fr))] gap-4 items-stretch">
              <div className="hidden lg:flex flex-col justify-end gap-2 pb-2">
                <div className="cap text-steel">Three-way compare</div>
                <div className="text-[14px] leading-[1.5] text-ink-soft">Used only where people search the family as a set. {tallyText}</div>
              </div>
              {prods.map((p) => (
                <CompareHead key={p.slug} p={p} pick={c.picks?.[p.slug]} three={three} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] gap-4 lg:gap-0 items-stretch">
              <CompareHead p={prods[0]} pick={c.picks?.[prods[0].slug]} three={false} />
              <div className="flex items-center justify-center py-1">
                <span className="d text-[28px] text-steel">vs</span>
              </div>
              <CompareHead p={prods[1]} pick={c.picks?.[prods[1].slug]} three={false} />
            </div>
          )}

          {/* Table */}
          <section className="flex flex-col gap-4" aria-labelledby="spec-by-spec">
            <div className="flex justify-between items-baseline gap-4 flex-wrap">
              <h2 id="spec-by-spec" className="d m-0 text-[28px] md:text-[32px]">
                Spec by spec
              </h2>
              <span className="m text-[14px] text-steel flex gap-2 items-center">
                <span className="w-3.5 h-3.5 bg-enamel-tint border border-enamel inline-block" aria-hidden="true" />
                Row winner
              </span>
            </div>
            <CompareTable products={prods} rows={rows} sourceLine={`Sources: ${prods.map((p) => p.brand).filter((b, i, a) => a.indexOf(b) === i).join(" and ")} spec sheets and dealer listings, checked ${monthYear(latest)}. Tinted cells win the row; ties stay plain.`} />
            <CompareTableMobile products={prods} rows={rows} picks={c.picks} />
          </section>

          {/* Buy if */}
          <section className={`card grid grid-cols-1 ${three ? "md:grid-cols-3" : "md:grid-cols-2"}`} aria-label="Which one to buy">
            {c.buyIf.map((b, i) => {
              const p = getProduct(b.slug)!;
              return (
                <div key={b.slug} className={`p-5 md:p-7 flex flex-col gap-3 ${i < c.buyIf.length - 1 ? "border-b md:border-b-0 md:border-r border-rule" : ""}`}>
                  <div className={`cap ${i === 0 ? "text-enamel" : "text-ink-soft"}`}>Buy the {p.model} if</div>
                  <p className="m-0 text-[16px] md:text-[17px] leading-[1.55]">{b.text}</p>
                  <div className="grow" />
                  <BuyButton product={p} size="lg" className="self-start" label={`Check ${p.model} price`} />
                </div>
              );
            })}
          </section>

          <DarkPanel eyebrow="Summary verdict">
            <p className="d m-0 text-[20px] md:text-[24px] leading-[1.3]">{c.summary}</p>
            <div className="mt-4 flex gap-4 flex-wrap text-[15px]">
              {prods.map((p) => (
                <Link key={p.slug} href={`/reviews/${p.slug}`} className="text-enamel-on-dark font-semibold">
                  {p.name} review
                </Link>
              ))}
              {guide && (
                <Link href={`/guides/${guide.slug}`} className="text-enamel-on-dark font-semibold">
                  {guide.title}
                </Link>
              )}
            </div>
          </DarkPanel>
        </Container>
      </main>
      <StickyBuyBar product={stickyPick} eyebrow={c.picks?.[stickyPick.slug] === "value-pick" ? "Value pick" : c.picks?.[stickyPick.slug] === "our-pick" ? "Our pick" : undefined} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Compare", path: "/compare" }, { name: c.title, path: `/compare/${c.slug}` }])} />
      <JsonLd data={articleSchema({ headline: c.title, description: c.description, url: `/compare/${c.slug}`, datePublished: c.lastUpdated, dateModified: latest })} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: c.title,
          itemListElement: prods.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: `${site.url}/reviews/${p.slug}` })),
        }}
      />
    </>
  );
}
