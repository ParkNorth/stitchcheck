export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type AffiliateClickParams = {
  product_slug: string;
  link_url: string;
  link_text: string;
  affiliate: boolean;
  page_path: string;
};

export function trackAffiliateClick(params: AffiliateClickParams) {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "affiliate_click", params);
}
