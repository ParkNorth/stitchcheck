import type { Metadata } from "next";
import type { Product } from "./products";
import { MACHINE_TYPE_LABEL } from "./products";
import { site } from "./site";

/** Shared OG image. Child `openGraph` objects replace the layout object, so pages must re-include this. */
export const defaultOgImage = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "Stitch Check: spec-checked buying guides for serious home sewing machines",
} as const;

export function pageOpenGraph(opts: {
  title: string;
  description: string;
  url: string;
  type?: "article" | "website";
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  publishedTime?: string;
  modifiedTime?: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: opts.type ?? "article",
    siteName: site.name,
    locale: "en_US",
    title: opts.title,
    description: opts.description,
    url: opts.url,
    images: opts.images ?? [defaultOgImage],
    ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    ...(opts.modifiedTime ? { modifiedTime: opts.modifiedTime } : {}),
  };
}

/** Trim to about 155 chars on a sentence or word boundary for meta descriptions. */
export function clipMetaDescription(text: string, max = 155): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max);
  const sentence = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("? "));
  if (sentence >= 110) return slice.slice(0, sentence + 1);
  const space = slice.lastIndexOf(" ");
  const clipped = (space > 80 ? slice.slice(0, space) : slice).replace(/[,;:]$/, "");
  return `${clipped}…`;
}

const YEAR = "2026";

export function reviewMetaTitle(p: Product): string {
  const kind = p.industrial
    ? "Industrial Lockstitch"
    : p.type === "serger"
      ? "Serger"
      : p.type === "coverstitch"
        ? "Coverstitch Machine"
        : p.type === "long-arm"
          ? "Long-Arm Quilting Machine"
          : `${MACHINE_TYPE_LABEL[p.type]} Sewing Machine`;
  return `${p.name} Review (${YEAR}): Specs Checked, Who It's For`.replace("Specs Checked", `${kind} Specs Checked`);
}

export function reviewMetaDescription(p: Product): string {
  const lead = `${p.verdict} ${p.whoFor}`.replace(/\s+/g, " ").trim();
  return clipMetaDescription(lead, 160);
}

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  type?: "article" | "website";
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  noindex?: boolean;
}): Metadata {
  return {
    title: { absolute: opts.title },
    description: opts.description,
    alternates: { canonical: opts.path },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: pageOpenGraph({
      title: opts.title,
      description: opts.description,
      url: opts.path,
      type: opts.type,
      images: opts.images,
    }),
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description },
  };
}
