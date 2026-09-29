import type { Metadata } from "next";
import { HubPage } from "@/components/hub/HubPage";
import { getHub } from "@/lib/hubs";
import { pageMeta } from "@/lib/seo-meta";

const hub = getHub("best-heavy-duty-sewing-machines")!;

export const metadata: Metadata = pageMeta({
  title: hub.metaTitle,
  description: hub.metaDescription,
  path: `/${hub.slug}`,
});

export default function Page() {
  return <HubPage hub={hub} />;
}
