"use client";

import { useMemo, useState } from "react";
import { PRICE_BANDS, type PriceBand } from "@/lib/price-bands";
import { MACHINE_TYPES, MACHINE_TYPE_LABEL, type MachineType } from "@/lib/products";

export interface FilterItem {
  slug: string;
  brand: string;
  type: MachineType;
  priceBand: PriceBand;
  score: number;
  name: string;
}

type Sort = "score-desc" | "price-asc" | "price-desc" | "name-asc";

const SORT_LABEL: Record<Sort, string> = {
  "score-desc": "Score, high to low",
  "price-asc": "Price band, low to high",
  "price-desc": "Price band, high to low",
  "name-asc": "Name, A to Z",
};

/**
 * Client-side filters for index pages. Children are pre-rendered cards keyed by
 * slug; this component only decides which are visible and in what order, so
 * the page ships full HTML for crawlers with no JS.
 */
export function FilterGrid({
  items,
  cards,
  noun = "reviews",
  showTypes = true,
}: {
  items: FilterItem[];
  cards: Record<string, React.ReactNode>;
  noun?: string;
  showTypes?: boolean;
}) {
  const [types, setTypes] = useState<Set<MachineType>>(new Set());
  const [bands, setBands] = useState<Set<PriceBand>>(new Set());
  const [brand, setBrand] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("score-desc");

  const brands = useMemo(() => Array.from(new Set(items.map((i) => i.brand))).sort(), [items]);
  const availableTypes = useMemo(() => MACHINE_TYPES.filter((t) => items.some((i) => i.type === t)), [items]);

  const filtered = useMemo(() => {
    let out = items.filter(
      (i) => (types.size === 0 || types.has(i.type)) && (bands.size === 0 || bands.has(i.priceBand)) && (brand === "all" || i.brand === brand),
    );
    out = [...out].sort((a, b) => {
      switch (sort) {
        case "score-desc":
          return b.score - a.score || a.name.localeCompare(b.name);
        case "price-asc":
          return a.priceBand - b.priceBand || b.score - a.score;
        case "price-desc":
          return b.priceBand - a.priceBand || b.score - a.score;
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return out;
  }, [items, types, bands, brand, sort]);

  const toggle = <T,>(set: Set<T>, v: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
  };

  const active = [
    ...Array.from(types).map((t) => MACHINE_TYPE_LABEL[t]),
    ...Array.from(bands).map((b) => PRICE_BANDS[b].label),
    ...(brand !== "all" ? [brand] : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="border-y-[1.5px] border-graphite py-5 flex flex-col gap-4">
        {showTypes && (
          <div className="flex flex-col md:flex-row gap-2 md:gap-8 md:items-center">
            <span className="cap md:w-[90px]">Type</span>
            <div className="flex gap-2 flex-wrap">
              <button type="button" className="chip" aria-pressed={types.size === 0} onClick={() => setTypes(new Set())}>
                All
              </button>
              {availableTypes.map((t) => (
                <button key={t} type="button" className="chip" aria-pressed={types.has(t)} onClick={() => toggle(types, t, setTypes)}>
                  {MACHINE_TYPE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 md:items-center">
          <span className="cap md:w-[90px]">Price band</span>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(PRICE_BANDS).map(Number) as PriceBand[]).map((b) => (
              <button key={b} type="button" className="chip" aria-pressed={bands.has(b)} onClick={() => toggle(bands, b, setBands)}>
                {PRICE_BANDS[b].label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 md:items-center">
          <span className="cap md:w-[90px]">Brand</span>
          <div className="flex gap-3 items-center flex-wrap grow">
            <label className="sr-only" htmlFor="brand-select">
              Brand
            </label>
            <select id="brand-select" className="sel" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="all">All brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <span className="grow" />
            <label className="m text-[14px] text-steel" htmlFor="sort-select">
              Sort
            </label>
            <select id="sort-select" className="sel" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {(Object.keys(SORT_LABEL) as Sort[]).map((s) => (
                <option key={s} value={s}>
                  {SORT_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap">
        <span className="m text-[14px]">
          Showing {filtered.length} of {items.length} {noun}
          {active.length ? ` · ${active.join(", ")}` : ""}
        </span>
        {active.length > 0 && (
          <button
            type="button"
            className="lnk text-[14px] bg-transparent border-0 p-0 cursor-pointer"
            onClick={() => {
              setTypes(new Set());
              setBands(new Set());
              setBrand("all");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-6 text-[16px] text-ink-soft">No machines match those filters yet. Clear a filter, or tell us what we are missing.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((i) => (
            <div key={i.slug} className="contents">
              {cards[i.slug]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
