---
name: onboarding-setup
description: Use when a SessionStart hook flags this machine as not onboarded, or the user asks to set up/onboard a new contributor — walks through the one-time per-machine setup this repo needs, one step at a time.
---

# New-contributor onboarding

A few things must be set up per machine before working here. Walk through them **one at a time**,
waiting for confirmation before moving on — don't dump the whole checklist at once.

## Step 1 — Plugins
Claude Code should prompt to install the plugins declared in `.claude/settings.json`:
`superpowers`, `basic-memory`, `github`, `context7`, `serena`, `playwright` (all
`@claude-plugins-official` except `basic-memory@basicmachines-co`). Confirm they accepted; if
not, `/plugin install <name>@<marketplace>` then `/reload-plugins`. The `npx`-spawned servers
(`context7`, `serena`, `playwright`) silently fail if Node isn't on PATH — have them run
`node --version` if tools don't appear.

## Step 2 — GitHub access
Issue tracking + PRs go through your GitHub repo. Confirm the `github` plugin is authenticated
(a `get_me` call succeeds). If not, they need to sign in / provide a token with repo scope.

## Step 3 — Supabase `.env`
Copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` from the
project's Supabase dashboard (Settings → API). The anon key is browser-safe (RLS protects data).
`.env` is gitignored — never commit real keys.

## Step 4 — Install + smoke test
`npm install`, then `npm run build` (tsc + vite) should pass clean, and `npm run dev` should
serve the starter shell.

## Step 5 — Mark done
Once set up, create the marker so the SessionStart nudge stops. The marker name derives from the
repo folder — the check-onboarding hook prints the exact path, e.g.:
`touch ~/.claude/<repo>-onboarded`.
