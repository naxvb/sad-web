---
name: dev-branch-workflow
description: Use when finishing a task, committing, or releasing — this project runs two long-lived branches (dev integration, main production) and main is only ever updated by an explicit release.
---

# dev-branch workflow

> Template note: this skill is stack/domain-agnostic. Nothing to edit — it works as-is for any
> project cloned from this template.

Two long-lived branches: **`dev`** (default integration branch) and **`main`** (production).
`main` is only ever updated by an explicit, user-initiated release.

## Rule

- **Never commit directly to `main`.**
- Do task work on a feature branch cut from `dev`.
- When a task is done and verified (tests pass, build clean), merge the feature branch into
  `dev` and push `dev`. **This is the default "finish the task" action — do it without asking,
  same as any normal commit/push.**
- **Never merge `dev` into `main`, and never push to `main`,** unless the user explicitly asks
  to release/deploy/ship in that message. Treat it as a deliberate, prod-affecting action:
  confirm scope, don't over-reach.

## Steps: finishing a task

```bash
git checkout dev
git pull --ff-only origin dev
git checkout -b <feature-branch>
# ... TDD work, commits ...
git checkout dev
git merge --no-ff <feature-branch>
git push origin dev
```

Leave the feature branch in place unless asked to delete it.

## Steps: releasing to production (only when explicitly requested)

Every `dev`→`main` merge is a **versioned release** — semver in `package.json` + a git tag:

- **Patch** (`x.y.Z+1`) — fixes only, no new user-facing capability.
- **Minor** (`x.Y+1.0`) — new features, backward compatible.
- **Major** (`X+1.0.0`) — breaking changes, or first stable release.

1. Bump `package.json` `version`, commit to `dev` first (so it ships in the PR).
2. Open a PR `dev` → `main` summarizing what's shipping (commits / closed issues).
3. **Confirm with the user before merging** (unless pre-authorized in the same message).
4. Tag the resulting `main` commit `vX.Y.Z` and push the tag.
5. Move the shipped issue(s) to `status: deployed` and close them (see `github-issue-tracking`).

## Commit conventions

Conventional commits. Reference the tracking issue in the body (`Refs #N`). End commit bodies
with a `Co-Authored-By:` trailer for the model that did the work.
