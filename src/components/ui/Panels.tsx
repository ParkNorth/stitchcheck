import type { ReactNode } from "react";

/** Dark panel with a brass eyebrow: "Summary verdict", "Short answer". */
export function DarkPanel({
  eyebrow,
  children,
  aside,
  className = "",
}: {
  eyebrow: string;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel-dark px-5 py-5 md:px-8 md:py-7 grid gap-4 md:gap-8 items-center ${aside ? "md:grid-cols-[160px_minmax(0,1fr)_260px]" : "md:grid-cols-[160px_minmax(0,1fr)]"} ${className}`}>
      <div className="cap text-brass">{eyebrow}</div>
      <div>{children}</div>
      {aside && <div className="m text-[14px] leading-[1.7] text-footer-text">{aside}</div>}
    </div>
  );
}

/** Definition callout for guides. */
export function Definition({ term, body }: { term: string; body: string }) {
  return (
    <div className="card grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)]">
      <div className="cap bg-graphite text-paper px-4 py-3 md:py-5">Definition</div>
      <div className="px-5 py-4 md:px-6 md:py-5 flex flex-col gap-1.5">
        <div className="font-bold text-[17px] md:text-[18px]">{term}</div>
        <div className="text-[16px] md:text-[17px] leading-[1.6] text-ink-soft">{body}</div>
      </div>
    </div>
  );
}

/** Card with a titled header row and a right-hand mono caption. */
export function HeaderCard({
  title,
  caption,
  children,
  id,
  as: Tag = "section",
}: {
  title: string;
  caption?: string;
  children: ReactNode;
  id?: string;
  as?: "section" | "div";
}) {
  return (
    <Tag id={id} className="card flex flex-col scroll-mt-24">
      <div className="px-5 py-4 md:px-6 md:py-5 border-b-[1.5px] border-graphite flex justify-between items-center gap-4">
        <h2 className="d m-0 text-[22px] md:text-[26px]">{title}</h2>
        {caption && <span className="cap text-steel whitespace-nowrap">{caption}</span>}
      </div>
      {children}
    </Tag>
  );
}
