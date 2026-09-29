@AGENTS.md

# Working in this repo

- Node 22, Next.js 16 App Router, Tailwind 4, OpenNext on Cloudflare Workers. `npm run dev` for local, `npm run build` for prod, `npm run deploy` for Cloudflare.
- Before a PR: `npm run build:catalog && npm run check:catalog && npm run typecheck && npm run lint && npm run build`.
- Content lives in registries under `src/lib/`: `products.ts` (site editorial fields), `catalog-data.ts` (generated from `data/specs/*.json`), `hubs.ts`, `comparisons.ts`, `guides.ts`, `brands.ts`, `picker.ts`.
- Research lives under `docs/research/`. One briefing per model. Keyword data in `_keywords.md`. Retailer, brand, SERP and guide facts in the `_*.md` files.
- Plan and process docs live under `docs/`. Linear project "Stitch" (P-WEB-47) is the how and why; GitHub is the diff.
