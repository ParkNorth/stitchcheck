import { bandLabel, type PriceBand } from "@/lib/price-bands";
import { MACHINE_TYPE_LABEL, type MachineType } from "@/lib/products";

export function PriceBandBadge({ band }: { band: PriceBand }) {
  return <span className="band">{bandLabel(band)}</span>;
}

export function TypeBadge({ type, inverse = false }: { type: MachineType; inverse?: boolean }) {
  return <span className={`type ${inverse ? "type-inverse" : ""}`}>{MACHINE_TYPE_LABEL[type]}</span>;
}

export function OurPickBadge() {
  return <span className="type type-pick">Our pick</span>;
}

export function ValuePickBadge({ short = false }: { short?: boolean }) {
  return <span className="value">{short ? "Value" : "Value pick"}</span>;
}

export function DiscontinuedBadge({ replacedBy }: { replacedBy?: string | null }) {
  return (
    <span className="flex gap-2 flex-wrap">
      <span className="type type-steel">Discontinued</span>
      {replacedBy && <span className="type type-steel">Replaced by {replacedBy}</span>}
    </span>
  );
}
