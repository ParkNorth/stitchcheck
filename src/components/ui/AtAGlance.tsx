import type { Glance } from "@/lib/glance";

/**
 * Plain-language overview directly under the H1 of a review. The lead names the model and its published
 * headline specs; the owner paragraph (approved rollups only) says what owners said and links down to the
 * full counted section. Built in src/lib/glance.ts. Never carries a buy link or a live price.
 */
export function AtAGlance({ glance, hasOwners }: { glance: Glance; hasOwners: boolean }) {
  return (
    <section id="glance" className="card px-4 py-4 md:px-6 md:py-5 flex flex-col gap-2.5 scroll-mt-24" aria-labelledby="glance-title">
      <div id="glance-title" className="cap text-steel">
        At a glance
      </div>
      <p className="m-0 text-[16px] md:text-[17px] leading-[1.55]">{glance.lead}</p>
      {glance.ownerSummary ? (
        <p className="m-0 text-[16px] md:text-[17px] leading-[1.55]">
          {glance.ownerSummary}
          {hasOwners && (
            <>
              {" "}
              <a href="#owners" className="m text-[14px] text-steel hover:text-enamel">
                See the counted themes
              </a>
            </>
          )}
        </p>
      ) : (
        <p className="m-0 text-[15px] leading-[1.55] text-ink-soft">{glance.specCheckLine}</p>
      )}
    </section>
  );
}
