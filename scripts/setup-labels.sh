#!/usr/bin/env bash
# One-time: create the issue labels the github-issue-tracking skill expects.
# GitHub does NOT copy labels when a repo is created from a template, so run this once
# in each new project.
#
# Usage: GITHUB_TOKEN=ghp_… scripts/setup-labels.sh <owner>/<repo>
# Idempotent: a label that already exists (HTTP 422) is left as-is.
set -uo pipefail
repo="${1:?usage: setup-labels.sh <owner>/<repo>  (GITHUB_TOKEN in env)}"
: "${GITHUB_TOKEN:?set GITHUB_TOKEN (a token with repo scope)}"

api="https://api.github.com/repos/$repo/labels"
hdr=(-H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" -H "User-Agent: setup-labels")

# name|color|description
labels=(
  "enhancement|a2eeef|New feature or request"
  "bug|d73a4a|Something isn't working"
  "status: backlog|ededed|Open, not started"
  "status: in progress|fbca04|Open, actively being worked on"
  "status: in dev|0e8a16|Merged to dev, not yet in production"
  "status: deployed|5319e7|Closed, live in production"
)

for spec in "${labels[@]}"; do
  IFS='|' read -r name color desc <<< "$spec"
  payload="$(/usr/bin/python3 -c 'import json,sys; print(json.dumps({"name":sys.argv[1],"color":sys.argv[2],"description":sys.argv[3]}))' "$name" "$color" "$desc")"
  code="$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$api" "${hdr[@]}" -d "$payload")"
  case "$code" in
    201) echo "  created: $name" ;;
    422) echo "  exists:  $name" ;;
    *)   echo "  ERROR $code: $name" >&2 ;;
  esac
done
echo "done."
