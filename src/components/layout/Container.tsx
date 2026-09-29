import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 md:px-16 max-w-[1440px] mx-auto w-full min-w-0 ${className}`}>{children}</div>;
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="m text-[14px] text-steel">
      <ol className="flex flex-wrap gap-x-2 list-none m-0 p-0">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex gap-2">
            {item.href ? (
              <a href={item.href} className="text-steel no-underline hover:text-enamel">
                {item.label}
              </a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Seam({ className = "" }: { className?: string }) {
  return <div className={`seam ${className}`} aria-hidden="true" />;
}
