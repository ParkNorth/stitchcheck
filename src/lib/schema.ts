import { site } from "./site";
import { author } from "./byline";
import type { Product } from "./products";
import { ogImageFor } from "./seo-meta";

const ORG_ID = `${site.url}/#organization`;

/** Same node, same @id, on every page. Legal name and contact live on the root Organization only. */
function publisherOrganization() {
  return {
    "@type": "Organization" as const,
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    logo: { "@type": "ImageObject" as const, url: `${site.url}/brand/stitch-check-logo.png` },
  };
}

/** Byline node for Article and Review. No bio here: repeating it on every URL reads as boilerplate. The bio lives on /about. */
export function editorialTeam() {
  return {
    "@type": "Organization" as const,
    "@id": `${site.url}${author.urlPath}#editors`,
    name: author.name,
    url: `${site.url}${author.urlPath}`,
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
    "@id": ORG_ID,
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
    about: { "@id": ORG_ID },
    mainEntity: { ...editorialTeam(), description: author.bio },
    publisher: publisherOrganization(),
  };
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  /** Defaults to the page's own Open Graph card, never a shared image. */
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
    image: absoluteUrl(opts.image ?? ogImageFor(opts.url, opts.headline).url),
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
    model: p.model,
    description: p.verdict,
    brand: { "@type": "Brand" as const, name: p.brand },
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
    // No offers: we publish price bands, never a price, and an offer with no
    // price is invalid Product markup.
  };
}

/** Spec-check review: Review wrapping Product, with our editorial rating. `body` is the visible verdict text, not the clipped meta description. */
export function reviewSchema(p: Product, opts: { description: string; body: string; dateModified: string }) {
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
      ratingValue: Number(p.score.toFixed(1)),
      bestRating: 10,
      worstRating: 0,
    },
    reviewBody: opts.body,
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

function itemListNode(opts: { name: string; description?: string; items: { name: string; url: string }[] }) {
  return {
    "@type": "ItemList" as const,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

export function itemListSchema(opts: { name: string; description?: string; items: { name: string; url: string }[] }) {
  return { "@context": "https://schema.org", ...itemListNode(opts) };
}

/** Hub, brand and series pages: one CollectionPage carrying its list. `dateModified` only where the page has a real content date. */
export function collectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
  about?: { name: string; url?: string };
  partOf?: { name: string; path: string };
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.about ? { about: { "@type": "Brand", name: opts.about.name, ...(opts.about.url ? { url: opts.about.url } : {}) } } : {}),
    ...(opts.partOf ? { isPartOf: { "@type": "CollectionPage", name: opts.partOf.name, url: absoluteUrl(opts.partOf.path) } } : {}),
    publisher: publisherOrganization(),
    mainEntity: itemListNode({ name: opts.name, items: opts.items }),
  };
}
