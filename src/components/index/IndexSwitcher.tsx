import Link from "next/link";

const SECTIONS = [
  { label: "Reviews", href: "/reviews" },
  { label: "Compares", href: "/compare" },
  { label: "Guides", href: "/guides" },
  { label: "Brands", href: "/brands" },
];

export function IndexSwitcher({ active }: { active: string }) {
  return (
    <div className="m flex gap-3 text-[15px] flex-wrap" aria-label="Index sections">
      {SECTIONS.map((s, i) => (
        <span key={s.href} className="flex gap-3">
          <Link
            href={s.href}
            className={s.href === active ? "text-graphite font-semibold no-underline shadow-[inset_0_-2px_0_#1F4A3A]" : "text-steel no-underline hover:text-enamel"}
            aria-current={s.href === active ? "page" : undefined}
          >
            {s.label}
          </Link>
          {i < SECTIONS.length - 1 && <span className="text-rule">/</span>}
        </span>
      ))}
    </div>
  );
}
