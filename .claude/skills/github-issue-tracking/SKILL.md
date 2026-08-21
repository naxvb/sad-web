---
name: github-issue-tracking
description: Use before starting any non-trivial task — work on this repo is tracked as GitHub issues in PM/PO story format, and a PreToolUse hook blocks edits until an active issue is recorded.
---

# GitHub issue tracking

> Template note: replace `<owner>/<repo>` below with your GitHub repository (e.g. `alice/my-app`).
> That is the only edit this skill needs.

Work is tracked as GitHub issues on `<owner>/<repo>`. Use the `github` plugin (`mcp__github__*`)
to create/update issues and (optionally) a Projects v2 board.

## Rule

For any **non-trivial** task (a real feature, bugfix, refactor, or infra change — not a typo
fix, a clarifying question, or pure investigation):

1. **Before starting — literally before the first Write/Edit** — search for an existing issue
   (`search_issues` / `list_issues state:OPEN` on `<owner>/<repo>`). A `PreToolUse` hook
   mechanically blocks `Write`/`Edit` until an active issue is recorded — don't rely on memory.
2. **If none exists**, create one (`issue_write` `method: create`) in this format:
   ```
   **Story:** As a <persona>, I want <capability> so that <benefit>.

   **Acceptance criteria:**
   - [ ] ...

   **Priority:** P1/P2/P3 — <one-line reasoning>
   ```
   Label `enhancement` or `bug` **plus** `status: in progress`. (State/`state_reason` are set in
   a separate `update` call, not on create.) Optionally add it to a Projects v2 board.
3. **Satisfy the active-issue gate:** `echo '#N' > .claude/.active-issue`, then implement.
   Reference the issue in commit messages (`Refs #N`).
4. **When the work ships** (merged to `dev`): check off the acceptance criteria, move the label
   to `status: in dev` (stays **open**, not in prod yet), and comment what shipped + how it was
   verified.
5. **When `dev` merges to `main`** (an explicit release): switch to `status: deployed` and close
   (`state: closed`, `state_reason: completed`).
6. Not worth doing? Close with `state_reason: not_planned`.
7. **New distinct task later in the same session?** Clear the marker first
   (`rm .claude/.active-issue`) so the gate re-blocks until the new issue exists.

## Active-issue gate (mechanical)

`.claude/hooks/require-active-issue.sh` (matcher `Write|Edit`) denies edits unless
`.claude/.active-issue` is non-empty. Set it to the real issue number once the ticket exists, or
`echo 'skip' > .claude/.active-issue` for genuinely trivial no-ticket work. The file is
gitignored — local, ephemeral, reset per distinct task.

## Kanban via labels

- `status: backlog` — open, not started
- `status: in progress` — open, actively being worked on
- `status: in dev` — open, merged to `dev`, not yet on `main`
- `status: deployed` — closed, live in production

Labels are a full replace on `issue_write` — always include the issue's other labels
(`enhancement`/`bug`) alongside the new status label.

## Bugs on existing features

Don't file a disconnected issue: find the relevant ticket, create the bug as a new issue
(`labels: ["bug"]`) naming the parent + concrete repro, and link it as a native sub-issue.

## Why

Keep a live, honest backlog you can point to — the tracker is the source of truth for "what's
done and why", not a formality bolted on after the fact.
