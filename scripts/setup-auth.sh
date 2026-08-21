#!/usr/bin/env bash
# Jednorazowa konfiguracja auth projektu: tworzy konto i wyłącza rejestrację.
# Użycie: SUPABASE_PAT=… SUPABASE_URL=… SUPABASE_ANON_KEY=… \
#         scripts/setup-auth.sh <project-ref> <email> <hasło>
set -uo pipefail
ref="${1:?ref}"; email="${2:?email}"; pass="${3:?hasło}"
: "${SUPABASE_PAT:?}"; : "${SUPABASE_URL:?}"; : "${SUPABASE_ANON_KEY:?}"
api="https://api.supabase.com/v1/projects/$ref/config/auth"
hdr=(-H "Authorization: Bearer $SUPABASE_PAT" -H "Content-Type: application/json")

tmpfile="$(mktemp)"

# Gwarancja: niezależnie od przebiegu poniższych kroków (sukces/błąd signupu),
# przy wyjściu ze skryptu rejestracja jest zawsze wyłączana (disable_signup=true).
cleanup() {
  rm -f "$tmpfile"
  curl -sS -f -X PATCH "$api" "${hdr[@]}" -d '{"disable_signup": true}' > /dev/null \
    && echo "OK: rejestracja wyłączona (disable_signup=true)." \
    || echo "BŁĄD: nie udało się wyłączyć rejestracji — sprawdź ręcznie!" >&2
}
trap cleanup EXIT

# 1) na czas zakładania konta: signup on + autopotwierdzenie e-maila
curl -sS -f -X PATCH "$api" "${hdr[@]}" -d '{"disable_signup": false, "mailer_autoconfirm": true}' > /dev/null

# 2) załóż konto (jeśli konto o tym e-mailu już istnieje, signup zwróci błąd —
#    traktujemy to jako akceptowalne pod warunkiem, że logowanie hasłem działa;
#    zweryfikuj to osobno przez POST /auth/v1/token?grant_type=password)
status="$(curl -sS -o "$tmpfile" -w '%{http_code}' -X POST "$SUPABASE_URL/auth/v1/signup" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Content-Type: application/json" \
  -d "{\"email\": \"$email\", \"password\": \"$pass\"}")"

if [[ "$status" -ge 200 && "$status" -lt 300 ]]; then
  echo "OK: konto $email utworzone."
else
  echo "UWAGA: signup zwrócił HTTP $status (konto może już istnieć): $(cat "$tmpfile")" >&2
fi

# 3) wyłączenie rejestracji następuje w cleanup() (trap EXIT) — patrz wyżej.
