"use client";

import Link from "next/link";
import { useState } from "react";
import { pickerOptions } from "@/lib/picker";

/** Home page machine-type picker. Renders a default state without JS. */
export function TypePicker() {
  const [picked, setPicked] = useState(pickerOptions[0].id);
  const r = pickerOptions.find((o) => o.id === picked)?.result ?? pickerOptions[0].result;

  return (
    <section className="panel-dark p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6" aria-labelledby="picker-title">
      <div className="lg:col-span-5 flex flex-col gap-5">
        <div className="cap text-brass">Machine type picker</div>
        <h2 id="picker-title" className="d m-0 text-[32px] md:text-[40px] leading-[1.05]">
          Which machine type do I need?
        </h2>
        <div className="text-[16px] text-dark-muted">What will you sew most?</div>
        <div className="flex flex-col gap-2.5" role="group" aria-label="What will you sew most?">
          {pickerOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              className="opt"
              aria-pressed={picked === o.id}
              onClick={() => setPicked(o.id)}
            >
              <span>{o.label}</span>
              <span className="m text-[13px] opacity-80">{picked === o.id ? "✓" : o.mark}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-start-7 lg:col-span-6 bg-paper text-graphite rounded-[4px] p-6 md:p-9 flex flex-col gap-[18px] self-stretch" aria-live="polite">
        <div className="cap text-steel">You need</div>
        <div className="d text-[32px] md:text-[44px] leading-[1.02]">{r.type}</div>
        <p className="m-0 text-[17px] md:text-[18px] leading-[1.55] text-ink-soft">{r.why}</p>
        <div className="seam" />
        <div className="m text-[15px] text-ink-soft">{r.look}</div>
        <div className="grow" />
        <div className="flex flex-wrap gap-4 items-center">
          <Link href={r.ctaHref} className="buy buy-graphite">
            <span>{r.cta}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </Link>
          <Link href={r.guideHref} className="lnk text-[15px]">
            {r.guide}
          </Link>
        </div>
      </div>
    </section>
  );
}
