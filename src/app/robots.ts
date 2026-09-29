import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Explicit allow for AI search and citation crawlers. Cloudflare managed robots.txt stays off. */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Applebot-Extended",
  "Amazonbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/out/"] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/out/"] })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
