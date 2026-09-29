# Measurement loop

last_updated: 2026-09-29
status: draft until launch

## Instrumentation (before launch)

| System | Property | Notes |
|---|---|---|
| GA4 | New property, separate from Flail Path and Chip It Right | Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the deploy workflow. `affiliate_click` on every buy button. |
| GSC | `sc-domain:stitchcheck.com` | Submit `/sitemap.xml`. Inspect the lead review and each hub after indexing. |
| Affiliate | SMP via ShareASale (or Awin) | Set `NEXT_PUBLIC_AFFILIATE_NETWORK` and IDs. Use `afftrack=stitchcheck_{slug}` (ShareASale) or `clickref=stitchcheck`, `clickref2={slug}` (Awin) so per-model attribution survives. |
| Ahrefs | New project for stitchcheck.com | Rank tracker on the hub, guide and top review keywords in `docs/research/_keywords.md`. |
| Cloudflare | Worker `stitchcheck` | Observability on; preview hosts noindexed by middleware. |

## Weekly

1. GSC: top queries, pages, striking distance (positions 8 to 20). Move striking-distance pages into the content plan's "refresh" column.
2. GA4: sessions by landing page, `affiliate_click` by `product_slug`, click-through from hub to review to buy.
3. Affiliate dashboard: clicks, pending, approved, by tracking token. Note the first approved conversion here with the date.
4. Any 404s or broken `/out/` redirects (Cloudflare logs).

## Monthly

1. Re-pull keyword clusters (Ahrefs) for the seed terms and update `_keywords.md` with the date.
2. Re-check prices and bundles on every listing linked from a review; update `priceUsdSeen`, `priceSeenDate`, and any spec that changed, with the briefing row.
3. Ship 1 to 3 backlog pages only when they map to a keyword row and a SERP format.
4. Re-read the About page's "How we check" against what the pages actually do.

## KPIs (first 90 days after indexing; directional until a baseline exists)

- 100 percent of launch URLs indexed.
- Affiliate click baseline in week 1; improve CTR on the three hubs and the lead review.
- First approved conversion: validates tracking end to end.
- Hub keywords in the top 20 for their primary term by day 90.

## Rules

- No traffic number is a strategy until GSC has 28 days of data.
- A page that gets impressions and no clicks gets a title and description rewrite before anything else.
- A page that gets clicks and no affiliate clicks gets its verdict box and buy placement reviewed against the design, not more copy.
