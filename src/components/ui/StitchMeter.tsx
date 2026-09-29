/** Score out of 10 as ten bars. Partial bar via hard-stop gradient. */
export function StitchMeter({ score, large = false }: { score: number; large?: boolean }) {
  const full = Math.floor(score);
  const frac = Math.round((score - full) * 100);
  return (
    <div className={`st ${large ? "st-lg" : ""}`} role="img" aria-label={`${score.toFixed(1)} out of 10`}>
      {Array.from({ length: 10 }).map((_, i) => {
        if (i < full) return <span key={i} className="on" />;
        if (i === full && frac > 0) {
          return (
            <span
              key={i}
              style={{ background: `linear-gradient(90deg, #1F4A3A ${frac}%, #CFCABE ${frac}%)` }}
            />
          );
        }
        return <span key={i} />;
      })}
    </div>
  );
}

export function Score({
  score,
  size = 30,
  suffix = true,
}: {
  score: number;
  size?: number;
  suffix?: boolean;
}) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="d" style={{ fontSize: size, lineHeight: 0.9 }}>
        {score.toFixed(1)}
      </span>
      {suffix && <span className="m text-[14px] text-steel">/10</span>}
    </span>
  );
}
