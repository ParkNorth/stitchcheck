import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandPage } from "@/components/brand/BrandPage";
import { getBrand, getSeries, seriesHubs } from "@/lib/brands";
import { pageMeta } from "@/lib/seo-meta";

export const dynamicParams = false;

export async function generateStaticParams() {
  return seriesHubs().map(({ brand, series }) => ({ brand: brand.slug, series: series.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string; series: string }> }): Promise<Metadata> {
  const { brand, series } = await params;
  const b = getBrand(brand);
  const s = getSeries(brand, series);
  if (!b || !s || !s.hasHub) return {};
  return pageMeta({
    title: `${b.name} ${s.code} Series: ${s.name}, Every Model Compared (2026)`,
    description: s.description,
    path: `/brands/${b.slug}/${s.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ brand: string; series: string }> }) {
  const { brand, series } = await params;
  const b = getBrand(brand);
  const s = getSeries(brand, series);
  if (!b || !s || !s.hasHub) notFound();
  return <BrandPage brand={b} series={s} />;
}
