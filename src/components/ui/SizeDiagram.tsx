import type { Product } from "@/lib/products";
import { Verify } from "./SpecTable";

/**
 * Throat space drawn to scale. 22px per inch on desktop; the bars scale down
 * on mobile via the wrapper's max-width. Current machine in graphite; category
 * ranges in rule-soft with a hatched extension for the top of the range.
 */
const PX_PER_IN = 22;
const RULER = [0, 6, 12, 18, 24];

function Bar({ from, to, current = false }: { from: number; to?: number; current?: boolean }) {
  const w = from * PX_PER_IN;
  const ext = to ? (to - from) * PX_PER_IN : 0;
  return (
    <div className="relative h-[26px] border-b border-rule">
      <div className="absolute left-0 top-0 h-[26px]" style={{ width: w, background: current ? "#16181A" : "#CFCABE" }} />
      {ext > 0 && (
        <div
          className="absolute top-0 h-[26px]"
          style={{ left: w, width: ext, background: "repeating-linear-gradient(135deg,#CFCABE 0 6px,#E4E0D5 6px 12px)" }}
        />
      )}
    </div>
  );
}

function Row({ label, value, bold = false }: { label: string; value: React.ReactNode; bold?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5">
      <span className={`text-[16px] ${bold ? "font-bold" : ""}`}>{label}</span>
      <span className="m text-[14px] text-ink-soft">{value}</span>
    </div>
  );
}

export function SizeDiagram({ product: p }: { product: Product }) {
  const throat = p.specs.throatIn.value;
  const rows: { label: string; value: React.ReactNode; from: number; to?: number; current?: boolean; bold?: boolean }[] = [
    { label: "Typical beginner machine", value: "about 6 in", from: 6 },
    {
      label: p.name,
      value: throat ? `${throat} in` : <Verify />,
      from: throat ?? 0,
      current: true,
      bold: true,
    },
    { label: "Mid-arm", value: "16–18 in", from: 16, to: 18 },
    { label: "Long-arm on a frame", value: "18–26 in", from: 18, to: 26 },
  ];
  return (
    <div className="card p-4 md:p-6 flex flex-col gap-4 overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <div className="grid grid-cols-[150px_minmax(560px,1fr)] md:grid-cols-[200px_600px] gap-x-5 items-center">
          <span />
          <div className="relative h-[22px]">
            {RULER.map((n) => (
              <span
                key={n}
                className="m absolute top-0 text-[13px] text-steel border-l border-[#B9B4A8] pl-[3px] h-[18px]"
                style={{ left: n * PX_PER_IN }}
              >
                {n} in
              </span>
            ))}
          </div>
          {rows.map((r) => (
            <span key={r.label} className="contents">
              <Row label={r.label} value={r.value} bold={r.bold} />
              <Bar from={r.from} to={r.to} current={r.current} />
            </span>
          ))}
        </div>
      </div>
      <div className="m text-[14px] text-steel leading-[1.5]">
        Throat space is the distance from the needle to the machine body: how much rolled quilt fits through.
      </div>
    </div>
  );
}
