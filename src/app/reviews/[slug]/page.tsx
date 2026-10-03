import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, Container } from "@/components/layout/Container";
import { PriceBandBadge, TypeBadge, DiscontinuedBadge } from "@/components/ui/Badges";
import { BuyButton } from "@/components/ui/BuyButton";
import { PhotoWell } from "@/components/ui/PhotoWell";
import { AtAGlance } from "@/components/ui/AtAGlance";
import { VerdictBox } from "@/components/ui/VerdictBox";
import { SpecTable, Verify } from "@/components/ui/SpecTable";
import { SizeDiagram } from "@/components/ui/SizeDiagram";
import { Alternatives, CheckBeforeYouBuy, DiscontinuedBanner, HeadToHeads, ProsCons, RetailerBlock } from "@/components/ui/ReviewBlocks";
import { DocumentChecks, GoodNotGood, MethodologyBox, OwnerSignals, RivalSignals, SiblingDifferences } from "@/components/ui/RollupBlocks";
import { StickyBuyBar } from "@/components/ui/StickyBuyBar";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { FAQ } from "@/components/ui/FAQ";
import { JsonLd } from "@/components/schema/JsonLd";
import { brandSlugFor, seriesForProduct } from "@/lib/brands";
import { comparisonsForProduct } from "@/lib/comparisons";
import { glanceFor } from "@/lib/glance";
import { hubForJob } from "@/lib/hubs";
import { bandLabel } from "@/lib/price-bands";
import { formatSpec, getProduct, products, JOB_LABEL } from "@/lib/products";
import { getRollup } from "@/lib/rollups";
import { breadcrumbSchema, faqSchema, reviewSchema } from "@/lib/schema";
import { pageOpenGraph, reviewMetaDescription, reviewMetaTitle } from "@/lib/seo-meta";
import { site } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = reviewMetaTitle(p);
  const description = reviewMetaDescription(p);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/reviews/${p.slug}` },
    openGraph: pageOpenGraph({ title, description, url: `/reviews/${p.slug}`, modifiedTime: p.lastUpdated }),
    twitter: { card: "summary_large_image", title, description },
  };
}

function showsSize(type: string) {
  return type === "mechanical" || type === "computerized" || type === "long-arm";
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const brandSlug = brandSlugFor(p.brand);
  const series = brandSlug ? seriesForProduct(brandSlug, p.series) : undefined;
  const hub = hubForJob(p.scoredFor);
  const compares = comparisonsForProduct(p.slug);
  const rollup = getRollup(p.slug);
  const faqs = p.faqs.length ? p.faqs : buildFaqs(p);
  const description = reviewMetaDescription(p);
  const glance = glanceFor(p, rollup);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Brands", href: "/brands" },
    ...(brandSlug ? [{ label: p.brand, href: `/brands/${brandSlug}` }] : []),
    ...(series && brandSlug ? [{ label: `${series.code} series`, href: series.hasHub ? `/brands/${brandSlug}/${series.slug}` : undefined }] : []),
    { label: p.model },
  ];

  const toc = [
    { id: "verdict", text: "Verdict" },
    { id: "specs", text: "Specs" },
    ...(showsSize(p.type) ? [{ id: "size", text: "Size and space" }] : []),
    { id: "strengths", text: "Strengths and weaknesses" },
    { id: "check", text: "Check before you buy" },
    ...(p.buy.kind === "retailer" ? [{ id: "retailer", text: `Buying from ${site.retailer.shortName}` }] : []),
    ...(p.ownerThemes.length || rollup ? [{ id: "owners", text: p.evidence === "positioning" ? "Buyer signals" : "What owners say" }] : []),
    ...(rollup && (rollup.siblings.some((s) => s.rows.length) || rollup.rivals.length) ? [{ id: "compared", text: "Siblings and rivals" }] : []),
    ...(faqs.length ? [{ id: "faq", text: "Questions" }] : []),
    { id: "alternatives", text: "Alternatives" },
  ];

  const hubLinks = p.jobs.map(hubForJob).filter((h): h is NonNullable<typeof h> => Boolean(h));

  return (
    <>
      <Header active={hub ? `/${hub.slug}` : undefined} />
      <main id="main-content" className="flex-1">
        <Container className="py-8 md:py-12 pb-28 md:pb-24 flex flex-col gap-8 md:gap-12">
          {/* Title block */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-6 lg:gap-12 items-end">
            <div className="flex flex-col gap-4 md:gap-[18px]">
              <Breadcrumb items={crumbs} />
              <h1 className="d m-0 text-[34px] md:text-[56px] lg:text-[64px] leading-[1.02] lg:leading-[1]">{p.name} review</h1>
              <div className="flex gap-2.5 items-center flex-wrap">
                {p.discontinued ? <DiscontinuedBadge replacedBy={p.replacedBy} /> : <TypeBadge type={p.type} />}
                <PriceBandBadge band={p.priceBand} />
                <span className="m text-[14px] text-steel md:ml-2">
                  {p.context.split(" · ")[0]} · in{" "}
                  {hubLinks.map((h, i) => (
                    <span key={h.slug}>
                      <Link href={`/${h.slug}`} className="text-steel hover:text-enamel">
                        {JOB_LABEL[h.job]}
                      </Link>
                      {i < hubLinks.length - 1 ? (i === hubLinks.length - 2 ? " and " : ", ") : ""}
                    </span>
                  ))}{" "}
                  {hubLinks.length > 1 ? "hubs" : "hub"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <PhotoWell src={p.image} alt={p.imageAlt} caption={`Photo · ${p.name}, 3/4 view`} className="h-[220px] md:h-[300px]" priority sizes="(max-width: 1024px) 100vw, 440px" />
              {p.imageCredit && <span className="m text-[12px] text-steel">{p.imageCredit}</span>}
            </div>
          </div>

          <DiscontinuedBanner product={p} />
          <AtAGlance glance={glance} hasOwners={Boolean(rollup)} />
          <VerdictBox product={p} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-10 lg:gap-16 items-start">
            <div className="flex flex-col gap-12 md:gap-14 min-w-0">
              {/* Specs */}
              <section id="specs" className="flex flex-col gap-4 scroll-mt-24" aria-labelledby="specs-title">
                <div className="flex justify-between items-baseline gap-4 flex-wrap">
                  <h2 id="specs-title" className="d m-0 text-[28px] md:text-[32px]">
                    Specs
                  </h2>
                  <span className="m text-[14px] text-steel">
                    {p.specsVerified ? `Checked against ${p.brand} ${p.specsVerified}` : `Research pass ${p.lastUpdated} · manufacturer page check pending`}
                  </span>
                </div>
                <SpecTable product={p} />
                {rollup && <DocumentChecks checks={rollup.documentChecks} brand={p.brand} />}
                {p.conflicts.length > 0 && (
                  <div className="card p-4 md:p-5 flex flex-col gap-2">
                    <div className="cap text-brass-ink">Where sources disagree</div>
                    <ul className="m-0 pl-5 text-[15px] leading-[1.55] text-ink-soft flex flex-col gap-1.5">
                      {p.conflicts.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {p.claims.length > 0 && (
                  <details className="m text-[13px] text-steel">
                    <summary className="cursor-pointer">Manufacturer claims we quote but do not assert ({p.claims.length})</summary>
                    <ul className="mt-2 pl-5 flex flex-col gap-1">
                      {p.claims.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </section>

              {/* Size and space */}
              {showsSize(p.type) && (
                <section id="size" className="flex flex-col gap-4 scroll-mt-24" aria-labelledby="size-title">
                  <div className="flex justify-between items-baseline gap-4 flex-wrap">
                    <h2 id="size-title" className="d m-0 text-[28px] md:text-[32px]">
                      Size and space
                    </h2>
                    <span className="m text-[14px] text-steel">Throat space, drawn to scale</span>
                  </div>
                  <SizeDiagram product={p} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-[1.5px] border-graphite rounded-[4px] px-5 py-4 flex flex-col gap-1">
                      <span className="cap text-steel">Weight</span>
                      <span className="m text-[16px] font-semibold">{formatSpec("weightLb", p.specs.weightLb.value) ?? <Verify />}</span>
                      <span className="text-[15px] text-ink-soft">
                        {p.type === "long-arm"
                          ? "Lives on its frame. Plan the room, not the table."
                          : (p.specs.weightLb.value ?? 0) > 22
                            ? "Heavy enough that it should live on the table, not in a cupboard."
                            : "Light enough to move between table and shelf."}
                      </span>
                    </div>
                    <div className="border-[1.5px] border-graphite rounded-[4px] px-5 py-4 flex flex-col gap-1">
                      <span className="cap text-steel">{p.type === "long-arm" ? "Frame" : "Table footprint"}</span>
                      <span className="m text-[16px] font-semibold">
                        {p.type === "long-arm" ? p.specs.frame.value ?? <Verify /> : formatSpec("dimensionsIn", p.specs.dimensionsIn.value) ?? <Verify />}
                      </span>
                      <span className="text-[15px] text-ink-soft">
                        {p.type === "long-arm" ? "Frame length sets the largest quilt you can load." : "Add room on the left for the fabric to spill."}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              <ProsCons product={p} />
              <CheckBeforeYouBuy checks={p.checks} />
              {p.buy.kind === "retailer" && <RetailerBlock product={p} />}

              {rollup && (
                <section id="owners" className="flex flex-col gap-4 scroll-mt-24" aria-labelledby="owners-title">
                  <div className="flex justify-between items-baseline gap-4 flex-wrap">
                    <h2 id="owners-title" className="d m-0 text-[28px] md:text-[32px]">
                      {p.evidence === "positioning" ? "Buyer signals" : p.evidence === "mixed" ? "Owner and buyer signals" : "What owners say"}
                    </h2>
                    <span className="m text-[14px] text-steel">Counted from {rollup.method.voices} voices. Paraphrased, attributed.</span>
                  </div>
                  {rollup.ownerNote && <p className="m-0 text-[15px] leading-[1.55] text-ink-soft">{rollup.ownerNote}</p>}
                  <GoodNotGood rollup={rollup} />
                  <OwnerSignals rollup={rollup} />
                  <MethodologyBox rollup={rollup} />
                </section>
              )}

              {rollup && (rollup.siblings.some((x) => x.rows.length) || rollup.rivals.length > 0) && (
                <section id="compared" className="flex flex-col gap-4 scroll-mt-24" aria-labelledby="compared-title">
                  <div className="flex justify-between items-baseline gap-4 flex-wrap">
                    <h2 id="compared-title" className="d m-0 text-[28px] md:text-[32px]">
                      Siblings and rivals
                    </h2>
                    <span className="m text-[14px] text-steel">What sources claim, counted by independent pages</span>
                  </div>
                  <SiblingDifferences rollup={rollup} modelName={p.model} />
                  <RivalSignals rollup={rollup} modelName={p.model} />
                </section>
              )}

              {!rollup && p.ownerThemes.length > 0 && (
                <section id="owners" className="flex flex-col gap-4 scroll-mt-24" aria-labelledby="owners-title">
                  <div className="flex justify-between items-baseline gap-4 flex-wrap">
                    <h2 id="owners-title" className="d m-0 text-[28px] md:text-[32px]">
                      {p.evidence === "positioning" ? "Buyer signals" : p.evidence === "mixed" ? "Owner and buyer signals" : "What owners say"}
                    </h2>
                    <span className="m text-[14px] text-steel">Paraphrased, attributed.</span>
                  </div>
                  <div className="card flex flex-col">
                    {p.ownerThemes.map((t, i) => (
                      <div key={t.theme} className={`px-5 py-4 md:px-6 grid grid-cols-[90px_minmax(0,1fr)] gap-4 ${i < p.ownerThemes.length - 1 ? "border-b border-rule" : ""}`}>
                        <span className={`cap ${t.tone === "positive" ? "text-enamel" : t.tone === "negative" ? "text-brass-ink" : "text-steel"}`}>{t.tone}</span>
                        <div className="flex flex-col gap-1">
                          <span className="text-[16px] leading-[1.55]">{t.theme}</span>
                          {t.source && (
                            <a href={t.source} rel="nofollow noopener external" target="_blank" className="m text-[13px] text-steel no-underline hover:text-enamel break-all">
                              {new URL(t.source).hostname.replace(/^www\./, "")}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <FAQ faqs={faqs} />

              <HeadToHeads
                items={compares.map((c) => ({
                  href: `/compare/${c.slug}`,
                  label: c.productSlugs.length === 2 ? `vs ${getProduct(c.productSlugs.find((s) => s !== p.slug)!)?.name ?? c.title}` : c.title,
                }))}
              />
            </div>

            {/* Rail */}
            <aside className="hidden lg:flex flex-col gap-3.5 card p-5 sticky top-6">
              <div className="flex gap-3.5 items-center">
                <PhotoWell src={p.image} alt={p.imageAlt} className="w-[72px] h-[72px] !p-0 shrink-0" sizes="72px" />
                <div className="flex flex-col gap-1">
                  <strong className="text-[16px]">{p.name}</strong>
                  <span className="m text-[14px]">
                    {p.score.toFixed(1)}/10 · {bandLabel(p.priceBand)}
                  </span>
                </div>
              </div>
              <BuyButton product={p} size="lg" className="w-full !min-h-[56px]" label="Check lowest price" />
              <div className="seam my-1" />
              <TableOfContents items={toc} />
            </aside>
          </div>

          <Alternatives product={p} />
        </Container>
      </main>
      <StickyBuyBar product={p} />
      <JsonLd data={reviewSchema(p, { description, dateModified: p.lastUpdated, reviewBody: glance.reviewBody })} />
      <JsonLd data={breadcrumbSchema(crumbs.filter((c) => c.href).map((c) => ({ name: c.label, path: c.href! })).concat([{ name: p.model, path: `/reviews/${p.slug}` }]))} />
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
    </>
  );
}

/** Fallback FAQs from published data when the briefing has no hand-written set yet. */
function buildFaqs(p: ReturnType<typeof getProduct> & object) {
  const out: { q: string; a: string }[] = [];
  const spm = p.specs.maxSpm.value;
  if (spm) out.push({ q: `How fast is the ${p.name}?`, a: `${p.brand} publishes a top speed of ${spm.toLocaleString("en-US")} stitches per minute. That is the spec, not a promise of finished quality at that speed; heavy layers want a slower setting.` });
  if (p.specs.stitchTypes.value) out.push({ q: `What stitches does the ${p.model} have?`, a: `${p.specs.stitchTypes.value}.${p.specs.stitchCount.value === 1 ? " There is no zigzag or buttonhole; plan a second machine for those." : ""}` });
  if (p.specs.throatIn.value) out.push({ q: `How much throat space does the ${p.model} have?`, a: `${p.specs.throatIn.value} in from the needle to the body. About 6 in is a typical beginner machine; 16 in and up is mid-arm and long-arm territory.` });
  if (p.specs.warrantyUs.value) out.push({ q: `What is the ${p.model} warranty?`, a: `${p.brand} publishes: ${p.specs.warrantyUs.value}. Warranty service runs through authorized dealers, so confirm the seller's status before you buy.` });
  out.push({ q: `Who should skip the ${p.model}?`, a: p.skipIf });
  return out.slice(0, 6);
}
