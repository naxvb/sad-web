#!/usr/bin/env bash
cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"[github-issue-tracking] HARD GATE, not a suggestion: if this turn starts non-trivial new work (feature, bugfix, refactor, infra/process change) on this repo, your FIRST action this turn — before any Write/Edit/Bash that touches the repo — must be to search for an existing issue and, if none exists, create one (github-issue-tracking skill, PM/PO story format). Do not implement first and backfill the ticket after. Reference the issue in commits, move its status label as work progresses, and file bug reports on existing features as linked sub-issues. Skip only for trivial Q&A, clarifying questions, or pure discussion with no repo changes."}}
EOF
