import { site } from "./site";
import { author } from "./byline";
import { bandRange } from "./price-bands";
import type { Product } from "./products";

function publisherOrganization() {
  return {
    "@type": "Organization" as const,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: { "@type": "ImageObject" as const, url: `${site.url}/brand/stitch-check-logo.png` },
  };
}

export function editorialTeam() {
  return {
    "@type": "Organization" as const,
    "@id": `${site.url}${author.urlPath}#editors`,
    name: author.name,
    url: `${site.url}${author.urlPath}`,
    description: author.bio,
  };
}

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${site.url}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/brand/stitch-check-logo.png`,
    description: site.description,
    email: site.contactEmail,
    publishingPrinciples: `${site.url}/about`,
    knowsAbout: [
      "heavy-duty sewing machines",
      "industrial sewing machines for home use",
      "sergers and overlockers",
      "coverstitch machines",
      "quilting machines",
      "long-arm quilting machines",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      email: site.contactEmail,
      url: `${site.url}/about`,
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
    publisher: publisherOrganization(),
  };
}

export function aboutPageSchema(opts: { description: string; dateModified: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${site.name}`,
    description: opts.description,
    url: `${site.url}/about`,
    dateModified: opts.dateModified,
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
    about: { "@type": "Organization", name: site.name, legalName: site.legalName, url: site.url },
    publisher: publisherOrganization(),
  };
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.url),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    image: opts.image ? absoluteUrl(opts.image) : `${site.url}/og-default.png`,
    author: editorialTeam(),
    publisher: publisherOrganization(),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(opts.url) },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function productNode(p: Product) {
  return {
    "@type": "Product" as const,
    name: p.name,
    description: p.verdict,
    brand: { "@type": "Brand" as const, name: p.brand },
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
    // Price bands, not live prices: publish a range, no availability claim.
    offers: {
      "@type": "AggregateOffer" as const,
      priceCurrency: "USD",
      description: bandRange(p.priceBand),
      url: absoluteUrl(`/reviews/${p.slug}`),
    },
  };
}

/** Spec-check review: Review wrapping Product, with our editorial rating. */
export function reviewSchema(p: Product, opts: { description: string; dateModified: string }) {
  const url = `${site.url}/reviews/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${p.name} review`,
    url,
    description: opts.description,
    dateModified: opts.dateModified,
    author: editorialTeam(),
    publisher: publisherOrganization(),
    itemReviewed: productNode(p),
    reviewRating: {
      "@type": "Rating",
      ratingValue: p.score.toFixed(1),
      bestRating: "10",
      worstRating: "0",
    },
    reviewBody: opts.description,
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListSchema(opts: { name: string; description?: string; items: { name: string; url: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    description: opts.description,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}
