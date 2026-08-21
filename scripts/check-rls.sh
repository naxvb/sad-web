#!/usr/bin/env bash
# Guard RLS: każda tabela w schemacie `public` musi mieć włączony Row Level Security
# ORAZ co najmniej jedną politykę. "Zielono" = wszystkie chronione.
#
# Model bezpieczeństwa aplikacji jest RLS-first (przeglądarka łączy się anon key + RLS),
# więc tabela bez RLS/polityki = dane wystawione. Ten strażnik zamyka ryzyko "dodałem
# tabelę i zapomniałem polityki".
#
# Użycie: SUPABASE_PAT=sbp_… scripts/check-rls.sh <project-ref>
# Bez SUPABASE_PAT skrypt POMIJA sprawdzenie (exit 0) — pełni rolę w CI z tokenem,
# a lokalny `npm test` bez tokenu nie jest przez to blokowany.
set -uo pipefail
ref="${1:?użycie: check-rls.sh <project-ref>}"

if [ -z "${SUPABASE_PAT:-}" ]; then
  echo "check-rls: pominięto (brak SUPABASE_PAT) — strażnik działa w CI z tokenem."
  exit 0
fi

sql="select c.relname as table,
       c.relrowsecurity as rls_enabled,
       coalesce((select count(*) from pg_policies p
                 where p.schemaname = 'public' and p.tablename = c.relname), 0) as policies
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;"

resp="$(printf '%s' "$sql" | SUPABASE_PAT="$SUPABASE_PAT" "$(dirname "$0")/db-query.sh" "$ref")" || {
  echo "check-rls: zapytanie do bazy nie powiodło się (patrz błąd powyżej)" >&2
  exit 2
}

printf '%s' "$resp" | /usr/bin/python3 -c '
import json, sys
rows = json.load(sys.stdin)
if not rows:
    print("check-rls: brak tabel w schemacie public.")
    sys.exit(0)
bad = []
for r in rows:
    table = r["table"]
    rls = r["rls_enabled"]
    pol = int(r["policies"])
    ok = bool(rls) and pol > 0
    label = "OK" if ok else "NIECHRONIONA"
    print("  [" + label + "] " + table + "  rls=" + str(rls) + " policies=" + str(pol))
    if not ok:
        bad.append(table)
if bad:
    sys.stderr.write("\ncheck-rls: " + str(len(bad)) + " tabel(a) bez RLS lub bez polityki: " + ", ".join(bad) + "\n")
    sys.stderr.write("DANE MOGA BYC WYSTAWIONE — dodaj `enable row level security` + polityke.\n")
    sys.exit(1)
print("\ncheck-rls: OK — wszystkie " + str(len(rows)) + " tabel w public chronione (RLS + polityki).")
'
