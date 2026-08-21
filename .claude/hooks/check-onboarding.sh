#!/usr/bin/env bash
# Per-machine onboarding nudge. The marker filename derives from the repo folder so
# each project cloned from this template gets its own marker automatically.
REPO="$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")"
MARKER="$HOME/.claude/${REPO}-onboarded"
if [ ! -f "$MARKER" ]; then
  cat <<EOF
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"[onboarding] No onboarding marker found (~/.claude/${REPO}-onboarded) for this machine. This may be the first time Claude Code is used on ${REPO} here. Before diving into the request, briefly check whether the person needs onboarding (plugins installed? GitHub token set? Supabase .env filled? project MCP servers trusted?) and if so follow the onboarding-setup skill one step at a time. If they're clearly already set up, create the marker file yourself and proceed without mentioning this."}}
EOF
fi
