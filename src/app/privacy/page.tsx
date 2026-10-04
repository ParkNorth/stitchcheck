import type { Metadata } from "next";
import { UtilityLayout } from "@/components/layout/UtilityLayout";
import { pageMeta } from "@/lib/seo-meta";
import { longDate, site } from "@/lib/site";

const UPDATED = "2026-10-04";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy | Stitch Check",
  description: "What Stitch Check collects, what our affiliate links do, and how to contact us about your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <UtilityLayout active="/privacy">
      <div className="prose-legal flex flex-col gap-4 max-w-[760px]">
        <h1 className="d m-0 text-[44px] md:text-[64px] leading-[0.98]">Privacy</h1>
        <p className="m text-[14px] text-steel">Last updated {longDate(UPDATED)}</p>
        <p>
          {site.name} (&quot;we&quot;) is operated by {site.legalName}, doing business as {site.name}. This page says what we collect when you use {site.domain}, why, and who else sees it.
        </p>
        <h2>What we collect</h2>
        <ul>
          <li>Analytics. We use Google Analytics 4 to count visits, pages, referrers and clicks on buy buttons. IP addresses are anonymized by Google; we do not see who you are.</li>
          <li>Email. If you write to us, we keep the message to answer it and to fix the page you wrote about.</li>
          <li>Nothing else. We have no accounts, comments, or newsletter, and we do not sell or rent data.</li>
        </ul>
        <h2>Affiliate links</h2>
        <p>
          Buy buttons go through our own short-link redirect and then through an affiliate network to {site.retailer.name}. The network sets a cookie so the retailer can credit the sale to us. That cookie is the network&apos;s, governed by its privacy policy, and you can clear it at any time. We receive aggregate reports (clicks, sales, commission) and never your name, address or payment details.
        </p>
        <h2>Cookies</h2>
        <p>Google Analytics sets first-party cookies to distinguish sessions. You can block them with a browser setting or extension without losing any part of the site.</p>
        <h2>Your rights</h2>
        <p>
          If you are in a jurisdiction that grants access, deletion or correction rights, email {site.contactEmail} and we will act on the request within 30 days. Analytics data is aggregate and cannot be tied back to a person by us.
        </p>
        <h2>Changes</h2>
        <p>We date this page when it changes. Material changes get a note at the top for 30 days.</p>
        <h2>Contact</h2>
        <p>{site.contactEmail}</p>
      </div>
    </UtilityLayout>
  );
}
