# CLAUDE.md — agentic-app-starter

Guidance for working in this repo.

> **This is a template.** It's a clean, agent-ready base for building a web app: build tooling,
> a Supabase-backed database, an authenticated app shell, and the working conventions below.
> The domain (your actual product) is **not yet written** — build it on top. When you start a
> real project from this template, do a one-time pass: rename the project (see "First-run
> checklist"), then delete this note.

## What this is

Stack: **React 18 + TypeScript (strict) + Vite**, data in **Supabase** (Postgres + RLS),
deployed to **Cloudflare Workers** (Static Assets). The reusable value is the *agent workflow*:
superpowers (brainstorm → plan → execute), project skills, a GitHub-issue-first gate, shared
team memory, and an RLS-first database convention.

## First-run checklist (do once, when starting a real project)

1. Rename: `package.json` `name`, `wrangler.jsonc` `name`, `index.html` `<title>`, this file's
   heading, `README.md`.
2. In `.claude/skills/github-issue-tracking/SKILL.md`, replace `<owner>/<repo>` with your repo,
   then create the kanban labels (they don't copy from a template):
   `GITHUB_TOKEN=… scripts/setup-labels.sh <owner>/<repo>`.
3. Create a Supabase project; copy `.env.example` → `.env` and fill it; set
   `SUPABASE_PROJECT_REF` (used by `npm run check:rls`) in your env / CI.
4. Add your Cloudflare Pages/Workers deploy (see `docs/deploy.md`).
5. Replace the example `items` feature (`src/features/items/`, `supabase/migrations/0001_init.sql`)
   with your real domain — keep the patterns (data layer → hooks → screen; RLS-first migrations).

## Commands

```bash
npm install        # install deps
npm run dev        # Vite dev server
npm test           # vitest run (all unit tests) + RLS guard
npm run build      # tsc --noEmit + vite build → dist/
npm run preview    # serve the production build locally
```

## Data — Supabase

- The browser talks to Supabase directly via `src/lib/supabase.ts` (`@supabase/supabase-js`),
  using the **anon key + Row Level Security**. This is the plain, idiomatic setup — NOT a
  custom server-side proxy. Protect every table with RLS policies; never rely on hiding the key.
- **RLS-first — non-negotiable convention:** every `create table` in `supabase/migrations/`
  ships in the same migration with `enable row level security` + at least one policy
  (`authenticated_all`: `for all to authenticated using (true) with check (true)`). A table
  without RLS/policy = data exposed to anyone with the anon key. Enforced by
  `scripts/check-rls.sh` (runs inside `npm test` when `SUPABASE_PAT` is set; CI must set it).
  Secrets that must NOT reach the browser go through a Supabase Edge Function, never the client.
- Config lives in `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — copy from
  `.env.example`. `.env` is gitignored.
- Keep schema changes as SQL migrations you can re-run (`supabase/migrations/`, numbered).
- `scripts/db-query.sh <ref>` runs SQL against the project via the Supabase Management API
  (needs `SUPABASE_PAT`). `scripts/setup-auth.sh` creates the single app account and disables
  sign-up (single-tenant apps).

## Conventions

- **TDD.** Write the failing test first, then implement.
- **TypeScript strict.** `npm run build` must pass `tsc --noEmit` with zero errors.
- Conventional commits; end commit bodies with a `Co-Authored-By:` trailer.
- Keep domain/engine logic pure and UI-free where practical, so it's easy to unit-test. Prefer a
  pure `src/engine/` (no React/Supabase imports) if your domain has real logic.

## Git & deploy workflow

Two branches: **`dev`** (default integration) and **`main`** (production, updated only by an
explicit release). See the `dev-branch-workflow` skill for the exact git steps. Default pattern:
feature branch cut from `dev` → merge to `dev` and push when done (no need to ask) → `dev`→`main`
only on explicit release request. Deploy host: **Cloudflare Workers**, auto-deploy from `main`
(`wrangler.jsonc`, `.nvmrc`, `VITE_SUPABASE_*` set in the Cloudflare dashboard). See
`docs/deploy.md`.

## Issue tracking

Work is tracked as GitHub issues (PM/PO story format). A `PreToolUse` hook blocks edits until an
active issue is recorded. See the `github-issue-tracking` skill.

## Superpowers & skills

This repo is set up for the **superpowers** workflow (brainstorming → writing-plans →
executing-plans, TDD, systematic-debugging, verification-before-completion). Design docs go in
`docs/superpowers/specs/`, implementation plans in `docs/superpowers/plans/`. To add a new
project skill, use the superpowers `writing-skills` skill and drop it under `.claude/skills/`.

## Shared team memory

`docs/team-memory/` is a git-tracked knowledge base (architecture facts, decisions, gotchas).
Start at `docs/team-memory/MEMORY.md`. Commit/push memory notes in the same unit of work as the
change they document.

## New contributor?

A `SessionStart` hook flags machines with no `~/.claude/<repo>-onboarded` marker and points to
the `onboarding-setup` skill (plugins, GitHub token, Supabase `.env`, install) — one step at a
time.
