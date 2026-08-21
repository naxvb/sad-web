# Security

**RLS-first.** The browser holds the Supabase **anon key**, which is public by design. The only
thing protecting data is **Row Level Security**. Therefore:

- Every `create table` migration ships in the same file with `enable row level security` **and**
  at least one policy. The baseline is `authenticated_all`:
  `for all to authenticated using (true) with check (true)` — any signed-in user, full access.
  Tighten it (per-user `auth.uid()` checks, read-only roles) as the domain needs.
- `scripts/check-rls.sh <ref>` fails if any `public` table lacks RLS or a policy. It runs inside
  `npm test` when `SUPABASE_PAT` is set — **CI must set it**, so an unprotected table can't merge.
- **Secrets never reach the browser.** Anything that must stay server-side (a third-party API
  key, a privileged operation) goes through a **Supabase Edge Function** with the service-role
  key held server-side — never shipped in the client bundle.
- Single-tenant apps: `scripts/setup-auth.sh` creates the one account and disables sign-up.
