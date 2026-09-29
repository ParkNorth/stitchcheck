import Link from "next/link";
import { nav, site } from "@/lib/site";
import { LogoMark, Wordmark } from "./Logo";
import { MobileNav } from "./MobileNav";

export function TopBar() {
  return (
    <div className="m bg-graphite text-footer-text text-[13px] px-5 md:px-16 py-2 flex justify-between gap-4">
      <span className="truncate">{site.topBar.left}</span>
      <span className="hidden md:inline whitespace-nowrap">{site.topBar.right}</span>
    </div>
  );
}

export function Header({ active, hideTopBar = false }: { active?: string; hideTopBar?: boolean }) {
  return (
    <>
      {!hideTopBar && <TopBar />}
      <header className="flex items-center justify-between px-5 md:px-16 h-[60px] md:h-[76px] border-b-[1.5px] border-graphite">
        <Link href="/" className="flex items-center gap-2.5 no-underline text-graphite" aria-label="Stitch Check home">
          <span className="hidden md:inline-flex">
            <LogoMark size={30} />
          </span>
          <span className="md:hidden inline-flex">
            <LogoMark size={24} />
          </span>
          <span className="hidden md:inline-flex">
            <Wordmark size={20} />
          </span>
          <span className="md:hidden inline-flex">
            <Wordmark size={16} />
          </span>
        </Link>
        <nav className="nav hidden md:flex gap-8" aria-label="Primary">
          {nav.primary.map((item) => (
            <Link key={item.href} href={item.href} aria-current={active === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/reviews"
            aria-label="Search models and guides"
            className="hidden md:flex w-11 h-11 border-[1.5px] border-graphite rounded-[4px] items-center justify-center text-graphite hover:bg-graphite hover:text-paper"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M11.5 11.5L16 16" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </Link>
          <MobileNav active={active} />
        </div>
      </header>
    </>
  );
}
