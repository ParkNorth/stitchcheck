import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, Container, Seam } from "@/components/layout/Container";
import { GridCard } from "@/components/ui/ProductCards";
import { DarkPanel, Definition } from "@/components/ui/Panels";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { FAQ } from "@/components/ui/FAQ";
import { JsonLd } from "@/components/schema/JsonLd";
import { guides, getGuide, guideToc, type Block } from "@/lib/guides";
import { hubForJob } from "@/lib/hubs";
import { getProduct } from "@/lib/products";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo-meta";
import { author } from "@/lib/byline";
import { monthYear } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return pageMeta({ title: g.metaTitle, description: g.description, path: `/guides/${g.slug}`, noindex: g.status === "draft" });
}

function RenderBlock({ b }: { b: Block }) {
  switch (b.type) {
    case "h2":
      return (
        <h2 id={b.id} className="scroll-mt-24">
          {b.text}
        </h2>
      );
    case "h3":
      return <h3>{b.text}</h3>;
    case "p":
      return <p dangerouslySetInnerHTML={{ __html: b.html }} />;
    case "ul":
      return (
        <ul>
          {b.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "definition":
      return <Definition term={b.term} body={b.body} />;
    case "short":
      return (
        <DarkPanel eyebrow="Short answer" className="!grid-cols-1 !gap-2 !py-6">
          <div className="text-[18px] md:text-[19px] leading-[1.5]">{b.text}</div>
        </DarkPanel>
      );
    case "links":
      return (
        <p>
          {b.items.map((l, i) => (
            <span key={l.href}>
              <Link href={l.href} className="lnk">
                {l.label}
              </Link>
              {i < b.items.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      );
    case "table":
      return (
        <div className="overflow-x-auto no-scrollbar">
          <table className="spec-table min-w-[560px]">
            {b.caption && <caption className="sr-only">{b.caption}</caption>}
            <thead>
              <tr>
                {b.head.map((h, i) => (
                  <th key={h} scope="col" className={i === 0 ? "cap" : ""} style={{ padding: "14px 16px", fontWeight: i === 0 ? 600 : 700, width: i === 0 && b.labelCol ? "30%" : undefined }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="m text-[15px]">
              {b.rows.map((r) => (
                <tr key={r.join("|")}>
                  {r.map((cell, i) =>
                    i === 0 && b.labelCol ? (
                      <th key={i} scope="row" className="lbl" style={{ padding: "14px 16px", background: "transparent", borderBottom: "1px solid var(--color-rule)" }}>
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className={cell === "[verify]" ? "verify" : ""}>
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const toc = guideToc(g);
  const picks = g.ctaSlugs.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const hub = hubForJob(g.feeds);
  const crumbs = [{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: g.title }];

  return (
    <>
      <Header active="/guides" />
      <main id="main-content" className="flex-1">
        <Container className="py-10 md:py-14 pb-16 md:pb-24 flex flex-col gap-12 md:gap-16">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,760px)_minmax(0,1fr)] gap-8 lg:gap-16">
            <div className="hidden lg:block" />
            <div className="flex flex-col gap-5">
              <Breadcrumb items={crumbs} />
              <h1 className="d m-0 text-[36px] md:text-[52px] lg:text-[60px] leading-[1.02]">{g.h1}</h1>
              <p className="m-0 text-[19px] md:text-[21px] leading-[1.5] text-ink-soft">{g.standfirst}</p>
              <div className="m text-[14px] text-steel flex gap-4 flex-wrap">
                <span>{author.name}</span>
                <span>Updated {monthYear(g.updated)}</span>
                {g.status === "draft" && <span className="text-brass-ink">Draft: figures pending source check</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,760px)_minmax(0,1fr)] gap-8 lg:gap-16 items-start">
            <TableOfContents items={toc} className="lg:sticky lg:top-6" />
            <article className="art flex flex-col gap-[22px] min-w-0">
              {g.blocks.map((b, i) => (
                <RenderBlock key={i} b={b} />
              ))}
            </article>
            <div className="hidden lg:block" />
          </div>

          {/* CTAs at the end only */}
          <section id="picks" className="flex flex-col gap-5 scroll-mt-24" aria-labelledby="picks-title">
            <Seam />
            <div className="flex justify-between items-baseline gap-4 flex-wrap">
              <h2 id="picks-title" className="d m-0 text-[28px] md:text-[32px]">
                {g.ctaTitle}
              </h2>
              <Link href={g.ctaMore.href} className="lnk text-[15px]">
                {g.ctaMore.label}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {picks.map((p, i) => {
                const pick = hub?.ranked.find((r) => r.slug === p.slug)?.pick;
                return <GridCard key={p.slug} product={p} pick={i === 0 && pick === "value-pick" ? "value-pick" : pick === "our-pick" ? "our-pick" : undefined} note={p.reason} wellHeight={200} />;
              })}
            </div>
          </section>

          {g.faqs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,760px)_minmax(0,1fr)] gap-8 lg:gap-16">
              <div className="hidden lg:block" />
              <FAQ faqs={g.faqs} />
            </div>
          )}
        </Container>
      </main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }])} />
      <JsonLd data={articleSchema({ headline: g.h1, description: g.description, url: `/guides/${g.slug}`, datePublished: g.published, dateModified: g.updated })} />
      {g.faqs.length > 0 && <JsonLd data={faqSchema(g.faqs)} />}
    </>
  );
}
