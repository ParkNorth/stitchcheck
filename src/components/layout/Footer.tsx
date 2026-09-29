import Link from "next/link";
import { nav, site } from "@/lib/site";
import { LogoMark, Wordmark } from "./Logo";

function Col({ title, items }: { title: string; items: readonly { label: string; href: string }[] }) {
  return (
    <div className="fl flex flex-col gap-2.5">
      <span className="cap text-footer-muted">{title}</span>
      {items.map((i) => (
        <Link key={i.href} href={i.href}>
          {i.label}
        </Link>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-graphite text-footer-text px-5 md:px-16 pt-12 md:pt-14 pb-9 flex flex-col gap-9">
      <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <LogoMark size={26} dark />
            <Wordmark size={18} dark />
          </div>
          <p className="m-0 text-[14px] leading-[1.55] max-w-[360px]">{site.footerBlurb}</p>
        </div>
        <Col title="Jobs" items={nav.footer.jobs} />
        <Col title="Brands" items={nav.footer.brands} />
        <Col title="Guides" items={nav.footer.guides} />
        <Col title="Site" items={nav.footer.site} />
      </div>
      <div className="seam-dark" />
      <div className="m text-[13px] flex flex-col md:flex-row justify-between gap-2 text-footer-muted">
        <span>© 2026 {site.name}</span>
        <span>{site.footerNote}</span>
      </div>
    </footer>
  );
}
