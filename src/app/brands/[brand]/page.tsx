import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandPage } from "@/components/brand/BrandPage";
import { brands, getBrand } from "@/lib/brands";
import { pageMeta } from "@/lib/seo-meta";

export const dynamicParams = false;

export async function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand } = await params;
  const b = getBrand(brand);
  if (!b) return {};
  return pageMeta({
    title: `${b.name} Sewing Machines Decoded: ${b.series.map((s) => s.code).join(", ")} Series Explained (2026)`,
    description: b.metaDescription,
    path: `/brands/${b.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const b = getBrand(brand);
  if (!b) notFound();
  return <BrandPage brand={b} />;
}
