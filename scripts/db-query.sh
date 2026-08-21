#!/usr/bin/env bash
# Uruchamia SQL (stdin) na projekcie Supabase przez Management API.
# Użycie: SUPABASE_PAT=sbp_… scripts/db-query.sh <project-ref> < plik.sql
set -euo pipefail
ref="${1:?użycie: db-query.sh <project-ref> (SQL na stdin)}"
: "${SUPABASE_PAT:?ustaw SUPABASE_PAT (sbp_…)}"
# Bez `curl -f`: przy błędzie API zwraca w body powód (np. treść błędu Postgresa),
# a -f by go wyrzucił, zostawiając samo "error: 400". Kod HTTP czytamy osobno.
body=$(
  /usr/bin/python3 -c 'import json,sys; print(json.dumps({"query": sys.stdin.read()}))' \
    | curl -sS -X POST \
        -H "Authorization: Bearer $SUPABASE_PAT" \
        -H "Content-Type: application/json" \
        -w '\n%{http_code}' \
        "https://api.supabase.com/v1/projects/$ref/database/query" \
        -d @-
)
status="${body##*$'\n'}"   # ostatnia linia = kod HTTP z -w
printf '%s\n' "${body%$'\n'*}"
if [ "$status" -lt 200 ] || [ "$status" -ge 300 ]; then
  echo "db-query: Management API zwróciło HTTP $status (treść błędu powyżej)" >&2
  exit 1
fi
