import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { hubs } from "@/lib/hubs";

export default function NotFound() {
  return (
    <>
      <Header hideTopBar />
      <main id="main-content" className="flex-1">
        <Container className="py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-6">
            <div className="cap text-steel">Error 404</div>
            <div className="d text-[120px] md:text-[200px] leading-[0.85] tracking-[-0.03em]">404</div>
            <div className="seam max-w-[420px]" />
            <h1 className="d m-0 text-[32px] md:text-[40px]">Page not found</h1>
            <p className="m-0 text-[18px] leading-[1.55] text-ink-soft max-w-[520px]">The link may be old, or the model may have been discontinued. Search, or start from the job you&apos;re shopping for.</p>
          </div>
          <div className="flex flex-col gap-3.5">
            <form action="/reviews" method="get" className="flex flex-col gap-3.5" role="search">
              <label htmlFor="q404" className="cap">
                Search models and guides
              </label>
              <div className="flex gap-2">
                <input
                  id="q404"
                  name="q"
                  type="search"
                  placeholder="e.g. TL-2010Q, coverstitch"
                  className="grow min-h-[52px] border-[1.5px] border-graphite rounded-[4px] bg-card px-4 text-[16px] text-graphite"
                />
                <button type="submit" className="min-h-[52px] px-5 border-0 rounded-[4px] bg-graphite text-paper font-semibold">
                  Search
                </button>
              </div>
            </form>
            <div className="cap mt-5">Or start from a job</div>
            {hubs
              .filter((h) => !h.feeder)
              .map((h) => (
                <Link key={h.slug} href={`/${h.slug}`} className="jp">
                  {h.h1} <span aria-hidden="true">→</span>
                </Link>
              ))}
          </div>
        </Container>
      </main>
    </>
  );
}
