import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, Container, Seam } from "@/components/layout/Container";
import { HubCard } from "@/components/ui/ProductCards";
import { BuyButton } from "@/components/ui/BuyButton";
import { FAQ } from "@/components/ui/FAQ";
import { JsonLd } from "@/components/schema/JsonLd";
import { comparisons } from "@/lib/comparisons";
import { getGuide } from "@/lib/guides";
import { allHubEntries, hubForJob, type Hub } from "@/lib/hubs";
import { bandLabel } from "@/lib/price-bands";
import { formatSpec, getProduct, stitchSummary, typeLabel, type Product } from "@/lib/products";
import { breadcrumbSchema, faqSchema, itemListSchema } from "@/lib/schema";
import { monthYear } from "@/lib/site";

const TONE: Record<Hub["shortAnswer"][number]["tone"], string> = {
  enamel: "text-enamel",
  brass: "text-brass-ink",
  ink: "text-ink-soft",
};

export function HubPage({ hub }: { hub: Hub }) {
  const entries = allHubEntries(hub);
  const rankOf = new Map(entries.map((e, i) => [e.slug, i + 1]));
  const resolved = entries.map((e) => ({ ...e, product: getProduct(e.slug) })).filter((e): e is typeof e & { product: Product } => Boolean(e.product));
  const latest = resolved.map((r) => r.product.lastUpdated).sort().at(-1) ?? hub.lastUpdated;
  const guides = hub.relatedGuides.map(getGuide).filter((g): g is NonNullable<typeof g> => Boolean(g));
  const h2h = hub.headToHeads.map((s) => comparisons.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const others = hub.otherJobs.map(hubForJob).filter((h): h is Hub => Boolean(h));

  return (
    <>
      <Header active={hub.feeder ? undefined : `/${hub.slug}`} />
      <main id="main-content" className="flex-1">
        <Container className="py-10 md:py-12 pb-16 md:pb-24 flex flex-col gap-10 md:gap-14">
          <div className="flex flex-col gap-5">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: hub.label }]} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <h1 className="d m-0 lg:col-span-7 text-[40px] md:text-[56px] lg:text-[64px] leading-[1]">{hub.h1}</h1>
              <div className="m lg:col-start-9 lg:col-span-4 flex flex-col gap-1.5 lg:pb-1.5 text-[14px]">
                <span>
                  {resolved.length} machines · specs checked {monthYear(latest)}
                </span>
                <span className="text-steel">{hub.scope}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 max-w-[760px]">
              {hub.intro.map((line) => (
                <p key={line} className="m-0 text-[17px] md:text-[18px] leading-[1.55] text-ink-soft">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* The short answer */}
          <div className="card grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)]">
            <div className="cap bg-graphite text-paper px-5 py-4 md:py-6">The short answer</div>
            <div className="flex flex-col">
              {hub.shortAnswer.map((s, i) => {
                const p = getProduct(s.slug);
                if (!p) return null;
                const rank = rankOf.get(s.slug);
                return (
                  <div
                    key={s.slug}
                    className={`grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)_160px] gap-2 md:gap-6 px-5 py-4 md:px-6 md:py-[18px] items-center ${
                      i < hub.shortAnswer.length - 1 ? "border-b border-rule" : ""
                    }`}
                  >
                    <span className={`cap ${TONE[s.tone]}`}>{s.label}</span>
                    <span className="text-[16px] md:text-[17px]">
                      <strong>{p.name}</strong>: {s.sentence}
                    </span>
                    {rank && (
                      <a href={`#rank-${rank}`} className="lnk text-[14px] md:text-right">
                        Jump to #{rank}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10 lg:gap-12 items-start">
            <div className="flex flex-col gap-10">
              <section className="flex flex-col gap-5" aria-labelledby="shortlist">
                <div className="flex justify-between items-baseline gap-4 flex-wrap">
                  <h2 id="shortlist" className="d m-0 text-[28px] md:text-[32px]">
                    The shortlist
                  </h2>
                  <span className="m text-[14px] text-steel">Ranked for the job, not feature count</span>
                </div>
                {hub.ranked.map((e) => {
                  const p = getProduct(e.slug);
                  if (!p) return null;
                  const rank = rankOf.get(e.slug)!;
                  return <HubCard key={e.slug} id={`rank-${rank}`} product={p} rank={rank} pick={e.pick} reason={e.reason} />;
                })}
              </section>

              {hub.sections?.map((sec) => (
                <section key={sec.title} id={sec.title.toLowerCase().split(" ")[0]} className="flex flex-col gap-5 scroll-mt-24" aria-labelledby={`sec-${sec.title}`}>
                  <Seam />
                  <h2 id={`sec-${sec.title}`} className="d m-0 text-[28px] md:text-[32px]">
                    {sec.title}
                  </h2>
                  <p className="m-0 text-[17px] leading-[1.55] text-ink-soft max-w-[760px]">{sec.intro}</p>
                  {sec.entries.map((e) => {
                    const p = getProduct(e.slug);
                    if (!p) return null;
                    const rank = rankOf.get(e.slug)!;
                    return <HubCard key={e.slug} id={`rank-${rank}`} product={p} rank={rank} pick={e.pick} reason={e.reason} />;
                  })}
                </section>
              ))}
            </div>

            <aside className="flex flex-col gap-9 lg:sticky lg:top-6">
              {guides.length > 0 && (
                <div className="side flex flex-col">
                  <div className="cap pb-2.5 border-b-[1.5px] border-graphite">Related guides</div>
                  {guides.map((g) => (
                    <Link key={g.slug} href={`/guides/${g.slug}`}>
                      {g.title} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              )}
              {h2h.length > 0 && (
                <div className="side flex flex-col">
                  <div className="cap pb-2.5 border-b-[1.5px] border-graphite">Head-to-heads</div>
                  {h2h.map((c) => (
                    <Link key={c.slug} href={`/compare/${c.slug}`}>
                      {c.title.replace(/^Juki |^Brother |^Singer /, "")} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              )}
              <div className="side flex flex-col">
                <div className="cap pb-2.5 border-b-[1.5px] border-graphite">Other jobs</div>
                {others.map((o) => (
                  <Link key={o.slug} href={`/${o.slug}`}>
                    {o.h1.replace(/ who plan.*$/, "")} <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </aside>
          </div>

          {/* Side by side */}
          <section className="flex flex-col gap-5" aria-labelledby="side-by-side">
            <Seam />
            <h2 id="side-by-side" className="d m-0 text-[28px] md:text-[32px]">
              Side by side
            </h2>
            <div className="relative overflow-x-auto no-scrollbar w-full max-w-[calc(100vw-40px)] md:max-w-none">
              <table className="spec-table min-w-[900px]">
                <caption className="sr-only">{hub.h1} compared</caption>
                <thead>
                  <tr className="cap">
                    <th scope="col" style={{ padding: "14px 16px" }}>Machine</th>
                    <th scope="col" style={{ padding: "14px 16px" }}>Type</th>
                    <th scope="col" style={{ padding: "14px 16px" }}>Price band</th>
                    <th scope="col" style={{ padding: "14px 16px" }}>Max speed</th>
                    <th scope="col" style={{ padding: "14px 16px" }}>{hub.job === "serger" ? "Threads" : hub.job === "quilting" ? "Throat" : "Stitches"}</th>
                    <th scope="col" style={{ padding: "14px 16px" }}>Also budget for</th>
                    <th scope="col" style={{ padding: "14px 16px" }}>Score</th>
                    <th scope="col" style={{ padding: "14px 16px" }}>
                      <span className="sr-only">Buy</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[15px]">
                  {(() => {
                    const spms = resolved.map((r) => r.product.specs.maxSpm.value ?? 0);
                    const maxSpm = Math.max(...spms);
                    const bands = resolved.map((r) => r.product.priceBand);
                    const minBand = Math.min(...bands);
                    const bandTie = bands.filter((b) => b === minBand).length > 1;
                    const spmTie = spms.filter((s) => s === maxSpm).length > 1;
                    return resolved.map((r) => {
                      const p = r.product;
                      const spm = p.specs.maxSpm.value;
                      const third = hub.job === "quilting" ? formatSpec("throatIn", p.specs.throatIn.value) ?? "[verify]" : stitchSummary(p);
                      return (
                        <tr key={p.slug}>
                          <th scope="row" className="font-bold" style={{ padding: "14px 16px", background: "transparent", color: "inherit", borderBottom: "1px solid var(--color-rule)" }}>
                            <Link href={`/reviews/${p.slug}`} className="text-graphite no-underline hover:text-enamel">
                              {p.name}
                            </Link>
                          </th>
                          <td className="m">{typeLabel(p)}</td>
                          <td className={`m ${!bandTie && p.priceBand === minBand ? "w" : ""}`}>{bandLabel(p.priceBand)}</td>
                          <td className={`m ${spm && !spmTie && spm === maxSpm ? "w" : ""} ${spm ? "" : "verify"}`}>{formatSpec("maxSpm", spm) ?? "[verify]"}</td>
                          <td className="m">{third}</td>
                          <td className="text-ink-soft">{r.alsoBudget ?? "Nothing extra"}</td>
                          <td className="m font-semibold">{p.score.toFixed(1)}</td>
                          <td style={{ padding: "10px 16px" }}>
                            <BuyButton product={p} size="sm" />
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
            <div className="m text-[13px] text-steel">Sources: manufacturer spec sheets, linked on each review. Price bands, not live prices. Tinted cells mark the best value in the column; ties stay plain.</div>
          </section>

          <FAQ faqs={hub.faqs} />
        </Container>
      </main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: hub.label, path: `/${hub.slug}` }])} />
      <JsonLd data={itemListSchema({ name: hub.h1, description: hub.metaDescription, items: resolved.map((r) => ({ name: r.product.name, url: `/reviews/${r.product.slug}` })) })} />
      {hub.faqs.length > 0 && <JsonLd data={faqSchema(hub.faqs)} />}
    </>
  );
}
