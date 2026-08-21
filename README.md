# agentic-app-starter

A GitHub **template repository** for building web apps with an agent (Claude Code) in the loop.
It gives you a working, deployable base plus the whole agent workflow — so a fresh project starts
with brainstorm→plan→execute, GitHub-issue tracking, TDD, and an RLS-first database already wired
up.

**Stack:** React 18 + TypeScript (strict) + Vite + Vitest · Supabase (Postgres + Row Level
Security) · Cloudflare Workers (Static Assets).

## Use this template

Click **“Use this template”** on GitHub (or `gh repo create <name> --template <owner>/agentic-app-starter`),
then:

```bash
cp .env.example .env      # fill in your Supabase URL + anon key (Settings → API)
npm install
npm run dev               # http://localhost:5173
```

Then do the one-time rename pass in **`CLAUDE.md` → “First-run checklist”** (project name, repo
owner in the issue-tracking skill, Supabase project, deploy).

## What you get

**Agent workflow (the reusable core)**
- `.claude/skills/` — project skills: `dev-branch-workflow`, `github-issue-tracking`,
  `onboarding-setup`.
- `.claude/hooks/` — a `PreToolUse` gate that blocks edits until a GitHub issue is recorded,
  a SessionStart onboarding nudge, and a per-turn issue-tracking reminder.
- `.claude/settings.json` — superpowers + companion plugins enabled.
- `docs/superpowers/` — where design specs and implementation plans live.
- `docs/team-memory/` — a git-tracked shared knowledge base.
- `CLAUDE.md` — the conventions the agent follows (TDD, strict TS, RLS-first, branch/deploy).

**Working app skeleton**
- Supabase auth (email/password) gate → app shell → an example `items` CRUD screen that
  demonstrates the full pattern: data layer (`src/data/`) → `useLoad`/`useMutation` hooks →
  screen, all over the anon-key + RLS client.
- `supabase/migrations/0001_init.sql` — an example table shipping with RLS + a policy (the
  RLS-first convention in miniature).
- `scripts/` — `db-query.sh` (run SQL via the Management API), `check-rls.sh` (CI guard that
  every table has RLS), `setup-auth.sh` (create the account, disable sign-up),
  `setup-labels.sh` (create the kanban issue labels in a new repo).
- Cloudflare Workers deploy config (`wrangler.jsonc`, `.nvmrc`).

## Layout

```
src/
  main.tsx, App.tsx          auth gate + shell + example screen
  lib/supabase.ts            Supabase browser client (anon key + RLS)
  lib/env.ts                 dev/prod detection by hostname
  data/                      row mapping + typed data access (example: items)
  features/auth/             session hook + login screen
  features/shell/            app shell (sidebar nav)
  features/items/            example CRUD feature — replace with your domain
  features/shared/           reusable hooks + UI primitives
  styles/tokens.css          minimal reset + design tokens
.claude/                     skills, hooks, settings (superpowers + workflow)
docs/superpowers/            design specs + implementation plans
docs/team-memory/            shared knowledge base
supabase/migrations/         numbered SQL migrations (RLS-first)
scripts/                     db-query, check-rls, setup-auth
```

## Workflow

- Branches: `dev` (integration) → `main` (release only on request). See
  `.claude/skills/dev-branch-workflow`.
- Every non-trivial change gets a GitHub issue first. See `.claude/skills/github-issue-tracking`.
- Database is anon-key + RLS — add an RLS policy for every table (guarded by `npm test`).
