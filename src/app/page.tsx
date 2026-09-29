import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { TypePicker } from "@/components/home/TypePicker";
import { BuyButton } from "@/components/ui/BuyButton";
import { PhotoWell } from "@/components/ui/PhotoWell";
import { PriceBandBadge, TypeBadge, ValuePickBadge } from "@/components/ui/Badges";
import { JsonLd } from "@/components/schema/JsonLd";
import { getProduct, stitchSummary } from "@/lib/products";
import { hubs } from "@/lib/hubs";
import { itemListSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo-meta";
import { site } from "@/lib/site";
import { formatSpec } from "@/lib/products";

export const metadata: Metadata = pageMeta({
  title: `${site.name}: Spec-Checked Buying Guides for Heavy-Duty, Serger and Quilting Machines`,
  description: site.description,
  path: "/",
  type: "website",
});

const JOBS = [
  {
    hub: "best-heavy-duty-sewing-machines",
    n: "01",
    title: "Heavy duty",
    copy: "Denim, canvas, leather and upholstery. From domestic heavy-duty to industrial machines that fit a home workshop.",
    types: "Mechanical · Industrial",
    cta: "Best heavy-duty",
    photo: "Photo · heavy-duty machine, denim under foot",
  },
  {
    hub: "best-sergers",
    n: "02",
    title: "Sergers + coverstitch",
    copy: "Knits, seam finishing and stretch hems. Overlockers first, with coverstitch machines as their own section.",
    types: "Serger · Coverstitch",
    cta: "Best sergers",
    photo: "Photo · serger, four cones",
  },
  {
    hub: "best-quilting-machines",
    n: "03",
    title: "Quilting",
    copy: "Domestic straight-stitch quilters, mid-arms and long-arms. Throat space decides which tier you need.",
    types: "Mechanical · Long-arm",
    cta: "Best quilting",
    photo: "Photo · long-arm on frame",
  },
];

const HOW = [
  { n: "01", t: "Manufacturer specs first", c: "Every figure comes from the maker's spec sheet or manual, with the source linked." },
  { n: "02", t: "Cross-checked at the retailer", c: "Where the listing disagrees with the maker, we say so on the page." },
  { n: "03", t: "Scored against the job", c: "A quilting machine is scored on throat and stitch quality, not stitch count." },
  { n: "04", t: "Commission never sets the rank", c: `We're paid by ${site.retailer.name} when you buy. They don't see verdicts first.` },
];

export default function HomePage() {
  const lead = getProduct("juki-tl-2010q")!;
  const value = getProduct("brother-1034d")!;
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <Container className="py-12 md:py-[72px] pb-16 md:pb-24 flex flex-col gap-16 md:gap-[88px]">
          {/* Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 flex flex-col gap-5">
              <div className="cap text-enamel">For sewists who&apos;ve outgrown a beginner machine</div>
              <h1 className="d m-0 text-[42px] md:text-[64px] lg:text-[76px] leading-[0.98] [text-wrap:balance]">
                Pick the machine for the job, not the feature list.
              </h1>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4 lg:pb-2">
              <p className="m-0 text-[17px] md:text-[18px] leading-[1.55] text-ink-soft">
                Heavy-duty, serger and quilting machines from $300 to $3,000. We check each one against the manufacturer&apos;s own specs, then tell you who it&apos;s for and who should skip it.
              </p>
              <Link href="/about" className="lnk text-[15px]">
                How we check
              </Link>
            </div>
          </section>

          {/* Job paths */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Job paths">
            {JOBS.map((j) => (
              <Link key={j.hub} href={`/${j.hub}`} className="card no-underline text-graphite flex flex-col hover:border-enamel">
                <PhotoWell alt={j.photo} caption={j.photo} className="h-[180px] md:h-[220px] rounded-b-none" />
                <div className="p-5 md:p-6 flex flex-col gap-3 grow">
                  <div className="cap text-steel">Job {j.n}</div>
                  <div className="d text-[28px] md:text-[30px]">{j.title}</div>
                  <div className="text-[16px] leading-[1.5] text-ink-soft grow">{j.copy}</div>
                  <div className="flex justify-between items-center border-t border-rule pt-3.5 gap-3">
                    <span className="m text-[14px]">{j.types}</span>
                    <span className="flex items-center gap-2 font-semibold text-enamel whitespace-nowrap">
                      {j.cta}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          <TypePicker />

          {/* Lead review + value pick */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6" aria-label="Lead review and value pick">
            <article className="lg:col-span-8 card grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)]">
              <PhotoWell
                src={lead.image}
                alt={lead.imageAlt}
                caption={`Photo · ${lead.name}`}
                className="min-h-[220px] md:min-h-[460px] rounded-b-none md:rounded-bl-[3px] md:rounded-tr-none"
                priority
              />
              <div className="p-5 md:p-8 flex flex-col gap-4">
                <div className="flex justify-between items-center gap-3 flex-wrap">
                  <div className="cap text-enamel">Lead review</div>
                  <div className="flex gap-2">
                    <TypeBadge type={lead.type} />
                    <PriceBandBadge band={lead.priceBand} />
                  </div>
                </div>
                <h2 className="d m-0 text-[30px] md:text-[36px]">
                  <Link href={`/reviews/${lead.slug}`} className="text-graphite no-underline hover:text-enamel">
                    {lead.name}
                  </Link>
                </h2>
                <p className="m-0 text-[17px] leading-[1.55] text-ink-soft">
                  The fastest domestic straight stitch you can put on a table. Buy it for quilting and heavy canvas; keep a zigzag machine for everything else.
                </p>
                <div className="m grid grid-cols-3 border-y border-rule">
                  <div className="py-3.5 flex flex-col gap-1">
                    <span className="cap text-steel">Max speed</span>
                    <span className="text-[17px] font-semibold">{formatSpec("maxSpm", lead.specs.maxSpm.value) ?? "[verify]"}</span>
                  </div>
                  <div className="py-3.5 px-4 border-l border-rule flex flex-col gap-1">
                    <span className="cap text-steel">Stitch</span>
                    <span className="text-[17px] font-semibold">{stitchSummary(lead)}</span>
                  </div>
                  <div className="py-3.5 px-4 border-l border-rule flex flex-col gap-1">
                    <span className="cap text-steel">Score</span>
                    <span className="text-[17px] font-semibold">{lead.score.toFixed(1)} / 10</span>
                  </div>
                </div>
                <div className="grow" />
                <div className="flex flex-col sm:flex-row gap-3">
                  <BuyButton product={lead} size="lg" />
                  <Link href={`/reviews/${lead.slug}`} className="sec !min-h-[56px]">
                    Read the review
                  </Link>
                </div>
              </div>
            </article>
            <article className="lg:col-span-4 card card-brass p-6 md:p-7 flex flex-col gap-4">
              <div className="flex justify-between gap-3">
                <ValuePickBadge />
                <PriceBandBadge band={value.priceBand} />
              </div>
              <PhotoWell src={value.image} alt={value.imageAlt} caption={`Photo · ${value.name}`} className="h-[170px]" />
              <h3 className="d m-0 text-[24px] md:text-[26px]">
                <Link href={`/reviews/${value.slug}`} className="text-graphite no-underline hover:text-enamel">
                  {value.name}
                </Link>
              </h3>
              <div className="m text-[14px]">{value.keySpec}</div>
              <p className="m-0 text-[16px] leading-[1.55] text-ink-soft grow">{value.verdict}</p>
              <BuyButton product={value} className="w-full" />
              <Link href="/compare/brother-1034d-vs-juki-mo-654de" className="lnk text-[15px]">
                1034D vs Juki MO-654DE
              </Link>
            </article>
          </section>

          {/* How we check */}
          <section className="flex flex-col gap-6" aria-labelledby="how-title">
            <div className="flex justify-between items-baseline gap-4">
              <h2 id="how-title" className="d m-0 text-[26px] md:text-[28px]">
                How we check
              </h2>
              <Link href="/about" className="lnk text-[15px]">
                Full method
              </Link>
            </div>
            <div className="seam" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {HOW.map((h) => (
                <div key={h.n} className="flex flex-col gap-2">
                  <span className="m text-[14px] text-enamel font-semibold">{h.n}</span>
                  <div className="font-bold text-[17px]">{h.t}</div>
                  <div className="text-[16px] leading-[1.5] text-ink-soft">{h.c}</div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>
      <JsonLd
        data={itemListSchema({
          name: "Stitch Check job paths",
          items: hubs.filter((h) => !h.feeder).map((h) => ({ name: h.h1, url: `/${h.slug}` })),
        })}
      />
    </>
  );
}
