"use client";

import { useEffect, useState } from "react";

export function TableOfContents({
  items,
  title = "On this page",
  className = "",
}: {
  items: { id: string; text: string }[];
  title?: string;
  className?: string;
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className={`toc flex flex-col ${className}`} aria-label={title}>
      <div className="cap pb-3">{title}</div>
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} aria-current={active === i.id ? "true" : undefined}>
          {i.text}
        </a>
      ))}
    </nav>
  );
}
