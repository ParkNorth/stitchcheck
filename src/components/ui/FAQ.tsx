import type { Faq } from "@/lib/products";

export function FAQ({ faqs, id = "faq", title = "Questions people ask" }: { faqs: Faq[]; id?: string; title?: string }) {
  if (!faqs.length) return null;
  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-24">
      <h2 className="d m-0 text-[28px] md:text-[32px]">{title}</h2>
      <div className="card flex flex-col">
        {faqs.map((f, i) => (
          <details key={f.q} className={`group ${i < faqs.length - 1 ? "border-b border-rule" : ""}`}>
            <summary className="cursor-pointer list-none px-5 py-4 md:px-6 flex justify-between gap-4 font-bold text-[16px] md:text-[17px]">
              <span>{f.q}</span>
              <span aria-hidden="true" className="m text-steel group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 md:px-6 text-[16px] leading-[1.6] text-ink-soft">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
