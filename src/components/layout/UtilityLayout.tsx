import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { Container } from "./Container";

const PAGES = [
  { label: "About · how we check", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

/** About, privacy and terms share this template: side nav, single text column. */
export function UtilityLayout({ active, children }: { active: string; children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <Container className="py-10 md:py-14 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          <nav className="toc flex flex-col lg:sticky lg:top-6" aria-label="Site pages">
            <div className="cap pb-3">Site</div>
            {PAGES.map((p) => (
              <Link key={p.href} href={p.href} aria-current={active === p.href ? "true" : undefined}>
                {p.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-12 md:gap-14 min-w-0">{children}</div>
        </Container>
      </main>
    </>
  );
}
