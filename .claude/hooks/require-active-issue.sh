#!/usr/bin/env bash
MARKER=".claude/.active-issue"
if [ -s "$MARKER" ]; then
  echo '{}'
else
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"No active tracking issue set for this work (.claude/.active-issue is empty/missing). Per the github-issue-tracking skill: search for/create the GitHub issue FIRST (label it 'status: in progress' since work is starting now), then record it: echo '#<issue-number>' > .claude/.active-issue -- or, for genuinely trivial no-ticket-needed work, echo 'skip' > .claude/.active-issue once. Retry the edit after that."}}
EOF
fi
