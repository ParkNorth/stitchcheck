# Deploy: GitHub to Cloudflare Workers

last_updated: 2026-09-29

Every push to the repository's default branch builds the site with OpenNext and deploys it to the Cloudflare Worker `stitchcheck`, bound to `stitchcheck.com` and `www.stitchcheck.com`. The workflow is `.github/workflows/deploy-cloudflare.yml`. Pushes to other branches run `.github/workflows/ci.yml` (validator, typecheck, lint, build) and do not deploy.

## One-time setup (about ten minutes)

1. **Cloudflare account ID.** Cloudflare dashboard, Workers & Pages, right-hand sidebar shows "Account ID". Copy it.
2. **Cloudflare API token.** My Profile, API Tokens, Create Token, start from the "Edit Cloudflare Workers" template and add one permission so Wrangler can attach the custom domains:
   - Account, Workers Scripts, Edit (from the template)
   - Account, Workers KV Storage, Edit (from the template; harmless if unused)
   - Zone, Workers Routes, Edit (from the template)
   - Zone, DNS, Edit (add this; custom domains create DNS records)
   - Account Resources: the account that holds the zone. Zone Resources: `stitchcheck.com`.
3. **GitHub secrets.** Repository Settings, Secrets and variables, Actions, New repository secret:
   - `CLOUDFLARE_API_TOKEN`: the token from step 2
   - `CLOUDFLARE_ACCOUNT_ID`: the ID from step 1
4. **GitHub variables (optional, same page, Variables tab).** `GA_MEASUREMENT_ID` once GA4 exists. Affiliate values once the program is approved: `AFFILIATE_NETWORK` (`shareasale` or `awin`), `SHAREASALE_MERCHANT_ID`, `SHAREASALE_AFFILIATE_ID` or `AWIN_MERCHANT_ID`, `AWIN_PUBLISHER_ID`. Until set, buy links go straight to the retailer.
5. **First deploy.** Actions tab, "Deploy Cloudflare Worker", Run workflow, pick the branch, Run. The first run creates the Worker and the two custom domains. Later pushes to the default branch deploy on their own.

## What the workflow does

1. `npm ci`, then fails fast with a clear message if the two secrets are missing.
2. `npm run check:catalog`, `npm run typecheck`, `npm run lint`.
3. `npm run deploy`, which is `opennextjs-cloudflare build && opennextjs-cloudflare deploy`. Wrangler reads `wrangler.jsonc`: Worker name, static assets from `.open-next/assets`, the self-service binding OpenNext uses for caching, Images binding, observability, and the two custom-domain routes.
4. Smoke test: five URLs on `https://stitchcheck.com` must answer 200.

Concurrency is set so a new push cancels an in-flight deploy of the same site.

## Domain notes

- `wrangler.jsonc` declares both hostnames as `custom_domain: true`. Wrangler creates the DNS records and certificates. If a record for `stitchcheck.com` or `www` already exists in the zone (for example a placeholder A record), delete it first or the deploy reports a conflict.
- `src/middleware.ts` redirects `www` to the apex with a 301 and sets `noindex` on the `*.workers.dev` preview host, so the preview URL can stay on.
- Cloudflare SSL/TLS mode should be Full (strict). Custom domains on Workers handle the edge certificate.

## Changing the default branch

The deploy job runs when `github.ref_name` equals the repository's default branch. Today that is `claude/pensive-goodall-ren1mc` because it is the only branch. When `main` is created and made default (Settings, General, Default branch), deploys follow it with no workflow change.

## Rolling back

Cloudflare dashboard, Workers & Pages, `stitchcheck`, Deployments, pick the previous version, Rollback. Or re-run an earlier successful workflow run from the Actions tab.

## Local preview against the real Worker runtime

```bash
npm run preview   # opennextjs-cloudflare build && preview on localhost
```
