import type { Metadata } from "next";
import { UtilityLayout } from "@/components/layout/UtilityLayout";
import { pageMeta } from "@/lib/seo-meta";
import { longDate, site } from "@/lib/site";

const UPDATED = "2026-09-29";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use | Stitch Check",
  description: "The terms for using Stitch Check, including our affiliate disclosure and what our specs do and do not promise.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <UtilityLayout active="/terms">
      <div className="prose-legal flex flex-col gap-4 max-w-[760px]">
        <h1 className="d m-0 text-[44px] md:text-[64px] leading-[0.98]">Terms</h1>
        <p className="m text-[14px] text-steel">Last updated {longDate(UPDATED)}</p>
        <p>
          By using {site.domain} you agree to these terms. The site is published by {site.legalName}, doing business as {site.name}, under the laws of {site.governingState}.
        </p>
        <h2>What the site is</h2>
        <p>
          {site.name} is an independent buying guide. We check published specifications against manufacturer data and score machines for a job. We are not a manufacturer, dealer or service center, and we do not operate or test the machines we cover. Nothing here is a warranty of fitness for your purpose.
        </p>
        <h2>Affiliate disclosure</h2>
        <p>{site.disclosure}</p>
        <h2>Specs and prices</h2>
        <p>
          Specifications come from manufacturer and retailer pages on the date shown on each page and can change without notice. We publish price bands, not live prices; today&apos;s price is on the retailer&apos;s page. Where we could not source a value we show [verify] rather than a guess. Check the manufacturer before you buy.
        </p>
        <h2>Trademarks</h2>
        <p>Brand and model names belong to their owners. We use them to identify the machines we write about and we do not reproduce logos.</p>
        <h2>Liability</h2>
        <p>
          To the extent permitted by law, {site.name} is not liable for losses arising from reliance on the site, from purchases made through links, or from the availability of the site. Your contract for any purchase is with the retailer.
        </p>
        <h2>Corrections</h2>
        <p>
          Spot an error: {site.correctionsEmail}. We fix it and re-date the page.
        </p>
      </div>
    </UtilityLayout>
  );
}
