# Stitch Check

Independent, spec-checked buying guide for serious home sewing machines: heavy-duty and industrial-for-home, sergers and coverstitch, quilting up to long-arm. Next.js 16 App Router, Tailwind 4, OpenNext on Cloudflare Workers.

Read `AGENTS.md` first (editorial constitution), then `docs/00-foundations.md` (scope and money) and `docs/02-ia-and-linking.md` (URLs). The design contract is `docs/01-design-system.md`. Plan and content roadmap: `docs/04-content-plan.md` and the Linear project "Stitch".

## Develop

```bash
npm install
npm run dev            # http://localhost:3000
npm run build:catalog  # data/specs/*.json -> src/lib/catalog-data.ts
npm run check:catalog  # validator: provenance, linking, copy rules
npm run typecheck && npm run lint && npm run build
npm run screenshots -- --serve /reviews/juki-tl-2010q /best-sergers
```

## Deploy

Push to `main` deploys to Cloudflare Workers via `.github/workflows/deploy-cloudflare.yml`. Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Variables: `GA_MEASUREMENT_ID`. Affiliate env (set when the program is approved): `NEXT_PUBLIC_AFFILIATE_NETWORK` (`shareasale` or `awin`), `SHAREASALE_MERCHANT_ID`, `SHAREASALE_AFFILIATE_ID` or `AWIN_MERCHANT_ID`, `AWIN_PUBLISHER_ID`.

## Where things live

| Thing | Path |
|---|---|
| Catalog editorial fields | `src/lib/products.ts` |
| Research cache (one JSON per model, sourced) | `data/specs/*.json` |
| Research briefings | `docs/research/*.md` |
| Keyword data | `docs/research/_keywords.md` |
| Hubs, compares, guides, brands | `src/lib/hubs.ts`, `comparisons.ts`, `guides.ts`, `brands.ts` |
| Shared components | `src/components/ui/*` |
| Design tokens | `src/app/globals.css` |
| Schema and meta helpers | `src/lib/schema.ts`, `src/lib/seo-meta.ts` |
| Affiliate plumbing | `src/lib/affiliates.ts`, `src/app/out/[slug]/route.ts` |
