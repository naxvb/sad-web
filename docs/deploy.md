# Deploy — Cloudflare Workers (Static Assets)

This template deploys the static Vite build (`dist/`) as **Cloudflare Workers Static Assets**,
auto-deployed from `main`. Config: `wrangler.jsonc` (`assets.directory = ./dist`,
`not_found_handling = single-page-application` for SPA-fallback routing) and `.nvmrc` (Node
version).

## One-time setup

1. **Create the Worker.** In the Cloudflare dashboard: Workers & Pages → Create → connect this
   GitHub repo. Build command `npm run build`, output dir `dist`. The Worker `name` in
   `wrangler.jsonc` must match the project name in the dashboard.
2. **Environment variables.** Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Settings →
   Variables) — they're injected at build time. Both are browser-safe (RLS protects data).
3. **Branch.** Set production branch = `main`. Pushes to `main` deploy to production; other
   branches get preview deployments.

## Gotchas

- **Vite ≥ 6 required.** `wrangler` auto-detects Vite and expects v6+; this template pins it.
- **No `public/_redirects`.** That's a Cloudflare *Pages* mechanism and collides with Workers
  Static Assets — SPA fallback is handled by `not_found_handling` in `wrangler.jsonc` instead.
- **CLI deploy** (optional): `npx wrangler deploy` from a clean `dist/` build. Preview a branch
  with `npx wrangler versions upload`.

## Alternative: Cloudflare Pages

If you prefer Pages, use a `public/_redirects` containing `/*  /index.html  200` for SPA
fallback and remove `wrangler.jsonc`. Pages and Workers Static Assets are two different products
— pick one.
