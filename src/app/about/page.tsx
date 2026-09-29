import type { Metadata } from "next";
import { UtilityLayout } from "@/components/layout/UtilityLayout";
import { JsonLd } from "@/components/schema/JsonLd";
import { aboutPageSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo-meta";
import { site } from "@/lib/site";

const UPDATED = "2026-09-29";

export const metadata: Metadata = pageMeta({
  title: "How We Check: Method, Scoring and How We're Paid | Stitch Check",
  description:
    "Every Stitch Check verdict starts from the manufacturer's own spec sheet, is cross-checked against the retailer listing, and is scored for the job. How the score weighs, how we are paid, how to report a wrong spec.",
  path: "/about",
});

const STEPS = [
  {
    n: "01",
    t: "Manufacturer specs first",
    body: "Speed, stitch types, throat space, feed system and weight come from the maker's spec sheet or manual.",
    note: "On the page: a source line under every spec table. Missing data shows as [verify], never a guess.",
  },
  {
    n: "02",
    t: "Cross-checked at the retailer",
    body: `We compare the maker's data to the ${site.retailer.name} listing and bundle.`,
    note: "On the page: conflicts go in \"Where sources disagree\" and \"Check before you buy\".",
  },
  {
    n: "03",
    t: "Scored against the job",
    body: "A serger is scored as a serger. Stitch count doesn't earn points on a heavy-duty or quilting page.",
    note: "On the page: one score out of 10, with the job it was scored for.",
  },
  {
    n: "04",
    t: "Re-checked when things change",
    body: "New model, discontinued model or a changed bundle: the page is re-checked and re-dated.",
    note: "On the page: \"Specs checked [month year]\" in every verdict box.",
  },
];

export default function AboutPage() {
  return (
    <>
      <UtilityLayout active="/about">
        <div className="flex flex-col gap-5 max-w-[880px]">
          <h1 className="d m-0 text-[44px] md:text-[64px] lg:text-[72px] leading-[0.98]">How we check</h1>
          <p className="m-0 text-[19px] md:text-[21px] leading-[1.55] text-ink-soft">
            Stitch Check reviews machines for people spending $300 to $3,000 who have outgrown a beginner model. Every verdict starts from the manufacturer&apos;s own data, and every spec on the site can be traced back to a source.
          </p>
          <p className="m-0 text-[17px] leading-[1.6] text-ink-soft">
            We are a spec-check publication. We read spec sheets, manuals, retailer listings and owner reports; we do not claim to have operated the machines. When owner evidence appears on a page it is paraphrased, attributed and labelled as owner reports, mixed signals or buyer signals.
          </p>
        </div>

        <section className="flex flex-col" aria-label="Method">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)] gap-4 md:gap-10 py-7 md:py-8 border-t-[1.5px] border-graphite ${i === STEPS.length - 1 ? "border-b-[1.5px]" : ""}`}>
              <span className="d text-[44px] md:text-[56px] leading-none">{s.n}</span>
              <div className="flex flex-col gap-2">
                <div className="d text-[22px] md:text-[24px]">{s.t}</div>
                <p className="m-0 text-[17px] leading-[1.6] text-ink-soft">{s.body}</p>
              </div>
              <div className="m text-[14px] leading-[1.6] text-ink-soft md:border-l border-rule md:pl-6">{s.note}</div>
            </div>
          ))}
        </section>

        <section id="score" className="flex flex-col gap-5 scroll-mt-24" aria-labelledby="score-title">
          <h2 id="score-title" className="d m-0 text-[30px] md:text-[34px]">
            What the score weighs
          </h2>
          <div className="overflow-x-auto no-scrollbar">
            <table className="spec-table min-w-[560px]">
              <thead>
                <tr>
                  <th scope="col" className="cap" style={{ padding: "16px 20px", width: "22%" }}>Job</th>
                  <th scope="col" className="cap" style={{ padding: "16px 20px" }}>Weighs most</th>
                  <th scope="col" className="cap" style={{ padding: "16px 20px" }}>Weighs least</th>
                </tr>
              </thead>
              <tbody className="text-[16px]">
                <tr>
                  <th scope="row" className="font-bold" style={{ padding: "16px 20px", background: "transparent", color: "inherit", borderBottom: "1px solid var(--color-rule)" }}>Heavy duty</th>
                  <td className="m text-[15px]">Motor, presser-foot lift, feed, needle system</td>
                  <td className="m text-[15px] text-steel">Stitch count, screens</td>
                </tr>
                <tr>
                  <th scope="row" className="font-bold" style={{ padding: "16px 20px", background: "transparent", color: "inherit", borderBottom: "1px solid var(--color-rule)" }}>Sergers</th>
                  <td className="m text-[15px]">Differential feed, threading, stitch options</td>
                  <td className="m text-[15px] text-steel">Accessory bundles</td>
                </tr>
                <tr>
                  <th scope="row" className="font-bold" style={{ padding: "16px 20px", background: "transparent", color: "inherit", borderBottom: "0" }}>Quilting</th>
                  <td className="m text-[15px]">Throat space, stitch quality at speed, frame fit</td>
                  <td className="m text-[15px] text-steel">Decorative stitches</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="m-0 text-[16px] leading-[1.6] text-ink-soft max-w-[760px]">
            Scores run 0 to 10 with one decimal. An 8 means we would buy it for the job without hesitation; a 7 means it does the job with limits we name on the page; below 7 we would rather send you elsewhere. The score is for the job the page is filed under, so the same machine can carry different scores on different hubs.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Money and corrections">
          <div className="card p-6 md:p-7 flex flex-col gap-2.5">
            <div className="cap text-enamel">How we&apos;re paid</div>
            <p className="m-0 text-[17px] leading-[1.6]">
              Buy buttons link to {site.retailer.name} through an affiliate network. If you buy, we earn a commission at no cost to you. Every buy button says &quot;affiliate&quot;. Dealer-only brands (Baby Lock, Bernina) have no buy button and no affiliate relationship; we send you to their dealer locator. Commission never sets the rank.
            </p>
          </div>
          <div className="card p-6 md:p-7 flex flex-col gap-2.5">
            <div className="cap text-enamel">Spotted a wrong spec?</div>
            <p className="m-0 text-[17px] leading-[1.6]">
              Tell us which page and where the right figure comes from. We fix it and re-date the page.{" "}
              <a href={`mailto:${site.correctionsEmail}`} className="lnk">
                {site.correctionsEmail}
              </a>
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3 max-w-[760px]" aria-label="Who runs Stitch Check">
          <h2 className="d m-0 text-[26px]">Who runs it</h2>
          <p className="m-0 text-[17px] leading-[1.6] text-ink-soft">
            {site.name} is published by {site.legalName}, doing business as {site.name}, in {site.governingState}. Editorial questions: {site.contactEmail}.
          </p>
        </section>
      </UtilityLayout>
      <JsonLd data={aboutPageSchema({ description: metadata.description as string, dateModified: UPDATED })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
    </>
  );
}
