# Team memory

Index of shared knowledge (architecture facts, decisions, external-system setup, gotchas). One
line per note. Recalled notes reflect what was true when written — verify a named file/flag still
exists before relying on it.

> Template note: this file starts nearly empty on purpose. As you build, add a one-line pointer
> here per note and keep the note body in its own file next to this one.

## Project facts
- [Origin](origin.md) — created from the `agentic-app-starter` template (superpowers + skills +
  workflow + Supabase anon/RLS + Cloudflare Workers), without any specific product logic.
- [Security](security.md) — RLS-first: every table ships with RLS + a policy; guarded by
  `scripts/check-rls.sh` in `npm test`. Server-only secrets go through a Supabase Edge Function,
  never the browser.

## Add notes as you build
- Deploy specifics (live URL, dashboard quirks) once the app is deployed.
- Database schema conventions and gotchas.
- Domain/engine design decisions.
