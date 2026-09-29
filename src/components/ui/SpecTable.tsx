import { formatSpec, SPEC_LABEL, SPEC_ROWS_BY_TYPE, type Product } from "@/lib/products";

export function Verify() {
  return (
    <span className="verify" title="Not published by the manufacturer. We never fill a spec we can't source.">
      [verify]
    </span>
  );
}

/** Single-model spec table. Missing values render as [verify]. */
export function SpecTable({ product: p, compact = false }: { product: Product; compact?: boolean }) {
  const rows = SPEC_ROWS_BY_TYPE[p.type];
  const shown = compact ? rows.slice(0, 5) : rows;
  const sources = new Set(
    shown.map((k) => p.specs[k].source).filter((s): s is string => Boolean(s)).map((u) => new URL(u).hostname.replace(/^www\./, "")),
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto no-scrollbar">
        <table className="spec-table">
          <caption className="sr-only">{p.name} specifications</caption>
          <tbody>
            {shown.map((k) => {
              const v = formatSpec(k, p.specs[k].value);
              return (
                <tr key={k}>
                  <th scope="row" className="lbl bg-transparent text-steel font-semibold" style={{ width: "36%", padding: "14px 16px", borderBottom: "1px solid var(--color-rule)" }}>
                    {SPEC_LABEL[k]}
                  </th>
                  <td className="val">{v ?? <Verify />}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!compact && (
        <div className="m text-[13px] text-steel leading-[1.5]">
          Source: {sources.size ? Array.from(sources).join(" · ") : "manufacturer spec sheet pending"}. Bracketed cells are values the manufacturer does not publish; we never fill a spec we can&apos;t source.
        </div>
      )}
    </div>
  );
}
