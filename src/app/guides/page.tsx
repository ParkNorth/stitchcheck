import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, Container } from "@/components/layout/Container";
import { IndexSwitcher } from "@/components/index/IndexSwitcher";
import { JsonLd } from "@/components/schema/JsonLd";
import { guides } from "@/lib/guides";
import { JOB_LABEL } from "@/lib/products";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo-meta";
import { monthYear } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Sewing Machine Buying Guides: Sergers, Heavy Duty, Quilting | Stitch Check",
  description:
    "Plain-language guides for people who have outgrown a beginner machine: serger vs sewing machine, coverstitch vs serger, mechanical vs computerized, throat space, long-arm costs, thick fabric.",
  path: "/guides",
  type: "website",
});

export default function GuidesIndex() {
  return (
    <>
      <Header active="/guides" />
      <main id="main-content" className="flex-1">
        <Container className="py-10 md:py-12 pb-16 md:pb-24 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div className="flex flex-col gap-3.5">
              <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
              <h1 className="d m-0 text-[40px] md:text-[60px] leading-[1]">Guides</h1>
              <p className="m-0 text-[17px] text-ink-soft max-w-[640px]">Definitions, decisions and costs. Guides open with the answer and end with two or three machines, never the other way round.</p>
            </div>
            <IndexSwitcher active="/guides" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {guides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="card no-underline text-graphite p-5 flex flex-col gap-3 hover:border-enamel">
                <div className="flex justify-between gap-3">
                  <span className="cap text-steel">{g.awareness ? "Explainer" : "Decision"}</span>
                  <span className="m text-[13px] text-steel">{JOB_LABEL[g.feeds]}</span>
                </div>
                <h2 className="d m-0 text-[22px] md:text-[24px]">{g.title}</h2>
                <p className="m-0 text-[15px] leading-[1.5] text-ink-soft grow">{g.standfirst}</p>
                <div className="m text-[13px] text-steel">
                  Updated {monthYear(g.updated)}
                  {g.status === "draft" ? " · draft" : ""}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }])} />
      <JsonLd data={itemListSchema({ name: "Guides", items: guides.map((g) => ({ name: g.title, url: `/guides/${g.slug}` })) })} />
    </>
  );
}
