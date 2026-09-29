"use client";

import { useEffect, useState } from "react";

/**
 * Series tabs on a brand hub. Toggles visibility of pre-rendered cards by
 * their data-series attribute so the page stays static HTML for crawlers.
 */
export function SeriesFilter({ codes, items, total }: { codes: string[]; items: { slug: string; series: string }[]; total: number }) {
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    const grid = document.querySelector("[data-model-grid]");
    if (!grid) return;
    grid.querySelectorAll<HTMLElement>("[data-series]").forEach((el) => {
      const show = active === "all" || el.dataset.series?.toLowerCase() === active.toLowerCase();
      el.style.display = show ? "" : "none";
    });
  }, [active, items]);

  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by series">
      <button type="button" className="tab" aria-pressed={active === "all"} onClick={() => setActive("all")}>
        All {total}
      </button>
      {codes.map((c) => (
        <button key={c} type="button" className="tab" aria-pressed={active === c} onClick={() => setActive(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}
