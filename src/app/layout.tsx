import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/schema/JsonLd";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { defaultOgImage } from "@/lib/seo-meta";
import { site } from "@/lib/site";

const archivo = localFont({
  src: "../fonts/archivo-variable-latin.woff2",
  variable: "--font-archivo",
  display: "swap",
  weight: "400 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

const plexSans = localFont({
  src: "../fonts/plex-sans-variable-latin.woff2",
  variable: "--font-plex-sans",
  display: "swap",
  weight: "400 700",
});

const plexMono = localFont({
  src: [
    { path: "../fonts/plex-mono-400-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/plex-mono-500-latin.woff2", weight: "500", style: "normal" },
    { path: "../fonts/plex-mono-600-latin.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  openGraph: { type: "website", siteName: site.name, locale: "en_US", images: [defaultOgImage] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16181A",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full`}>
      <head>
        <link rel="alternate" href="/llms.txt" type="text/plain" title="LLM site map" />
        <link rel="alternate" href="/llms-full.txt" type="text/plain" title="Full LLM site brief" />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
        <Footer />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
