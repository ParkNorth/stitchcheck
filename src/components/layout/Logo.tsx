export function LogoMark({ size = 30, dark = false }: { size?: number; dark?: boolean }) {
  const ink = dark ? "#F2F0EA" : "#16181A";
  const check = dark ? "#8FC1A8" : "#1F4A3A";
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="28" height="28" rx="3" stroke={ink} strokeWidth="2" />
      <path d="M7 15.5l5.5 5.5L23 9.5" stroke={check} strokeWidth="3" strokeDasharray="4 2.5" />
    </svg>
  );
}

export function Wordmark({ size = 20, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <span
      className="d d-wide"
      style={{ fontSize: size, color: dark ? "#F2F0EA" : undefined, lineHeight: 1 }}
    >
      STITCH CHECK
    </span>
  );
}
