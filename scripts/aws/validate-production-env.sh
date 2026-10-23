#!/usr/bin/env sh
set -eu

env_file="${1:-.env.production}"

if [ ! -f "$env_file" ]; then
  echo "ERROR: $env_file does not exist." >&2
  exit 1
fi

required_keys="ENVIRONMENT SECRET_KEY BACKEND_CORS_ORIGINS FRONTEND_URL SUPABASE_DB_URL"

for key in $required_keys; do
  value="$(grep -E "^${key}=" "$env_file" | tail -n 1 | cut -d= -f2- || true)"
  if [ -z "$value" ]; then
    echo "ERROR: $key is missing or empty in $env_file." >&2
    exit 1
  fi
  case "$value" in
    *YOUR*|*REPLACE*|*generate-a-secure*|*'<'*'>'*)
      echo "ERROR: $key still contains a placeholder." >&2
      exit 1
      ;;
  esac
done

secret_key="$(grep -E '^SECRET_KEY=' "$env_file" | tail -n 1 | cut -d= -f2-)"
if [ "${#secret_key}" -lt 64 ]; then
  echo "ERROR: SECRET_KEY must contain at least 64 characters." >&2
  exit 1
fi

if ! grep -Eq '^ENVIRONMENT=production$' "$env_file"; then
  echo "ERROR: ENVIRONMENT must be production." >&2
  exit 1
fi

echo "Production environment file passed the required checks."
