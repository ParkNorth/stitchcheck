import type { ResolvedRow } from "@/lib/comparisons";
import type { Product } from "@/lib/products";

function WinnerCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Winner" role="img" className="shrink-0">
      <path d="M2 7.5l3 3L12 3.5" stroke="#1F4A3A" strokeWidth="2.2" />
    </svg>
  );
}

/** Desktop compare table (2 or 3 columns). Winner cell: enamel tint + check + weight 600. */
export function CompareTable({ products, rows, sourceLine }: { products: Product[]; rows: ResolvedRow[]; sourceLine: string }) {
  const three = products.length === 3;
  return (
    <div className="hidden md:flex flex-col gap-3">
      <table className="spec-table" style={three ? { tableLayout: "fixed" } : undefined}>
        <caption className="sr-only">Spec by spec comparison</caption>
        <thead>
          <tr>
            <th scope="col" className="cap" style={{ padding: "14px 20px", width: three ? 260 : "28%" }}>
              Spec
            </th>
            {products.map((p) => (
              <th key={p.slug} scope="col" style={{ padding: "14px 20px", fontWeight: 700 }}>
                {p.model}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row" className="lbl" style={{ padding: "16px 20px", background: "transparent", borderBottom: "1px solid var(--color-rule)" }}>
                {r.label}
              </th>
              {r.cells.map((c) => (
                <td key={c.slug} className={`val ${c.winner ? "w" : ""} ${c.missing ? "verify" : ""}`} style={{ padding: "16px 20px" }}>
                  {c.winner ? (
                    <span className="inline-flex gap-2 items-center">
                      <WinnerCheck />
                      {c.text}
                    </span>
                  ) : (
                    c.text
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="m text-[13px] text-steel">{sourceLine}</div>
    </div>
  );
}

/** Mobile compare: fixed label column, machine columns scroll horizontally. */
export function CompareTableMobile({
  products,
  rows,
  picks,
}: {
  products: Product[];
  rows: ResolvedRow[];
  picks?: Record<string, "our-pick" | "value-pick">;
}) {
  const colW = 112;
  const labelW = 104;
  const total = labelW + colW * products.length;
  return (
    <div className="md:hidden flex flex-col gap-3">
      {products.length > 2 && (
        <div className="flex justify-between items-center">
          <span className="m text-[14px]">Showing 2 of {products.length}</span>
          <span className="m text-[14px] text-enamel font-semibold flex items-center gap-1.5">
            Swipe for {products[products.length - 1].model}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
        </div>
      )}
      <div className="card relative overflow-x-auto no-scrollbar">
        <div style={{ width: total, minWidth: "100%" }}>
          <div
            className="grid border-b-[1.5px] border-graphite"
            style={{ gridTemplateColumns: `${labelW}px repeat(${products.length}, ${colW}px)` }}
          >
            <div className="cap bg-graphite text-paper p-3 border-r-[1.5px] border-graphite">Spec</div>
            {products.map((p, i) => (
              <div
                key={p.slug}
                className={`p-3 flex flex-col gap-1 ${i > 0 ? "border-l border-rule" : ""} ${
                  picks?.[p.slug] === "value-pick" ? "bg-brass-tint" : ""
                }`}
              >
                <strong className="text-[15px]">{p.model}</strong>
                {picks?.[p.slug] === "value-pick" ? (
                  <span className="value self-start">Value</span>
                ) : (
                  <span className="m text-[13px]">{p.score.toFixed(1)}</span>
                )}
              </div>
            ))}
          </div>
          {rows.map((r, ri) => (
            <div
              key={r.label}
              className={`grid ${ri < rows.length - 1 ? "border-b border-rule" : ""}`}
              style={{ gridTemplateColumns: `${labelW}px repeat(${products.length}, ${colW}px)` }}
            >
              <div className="m bg-paper border-r-[1.5px] border-graphite p-3 text-[12px] font-semibold uppercase tracking-[.04em] text-ink-soft">
                {r.label}
              </div>
              {r.cells.map((c) => (
                <div key={c.slug} className={`m p-3 text-[14px] ${c.winner ? "bg-enamel-tint font-semibold" : ""} ${c.missing ? "verify" : ""}`}>
                  {c.winner ? "✓ " : ""}
                  {c.text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="m text-[13px] text-steel leading-[1.45]">Label column stays fixed; machine columns swipe. Ties stay plain.</div>
    </div>
  );
}
