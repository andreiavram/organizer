#!/usr/bin/env bash
# Copy Organizer's database from the old host into the Coolify Postgres. Run ON THE COOLIFY HOST as
# root (it execs into the Postgres container):
#
#   OLD=yeti@old.host PG_CONTAINER=<postgres resource uuid> DB_NAME=organizer DB_USER=organizer \
#     bash copy-data.sh [--force]
#
# Organizer has no media and no other on-disk state: the database is everything (tasks, users, DRF
# tokens, OAuth clients/tokens, the encrypted Notion/VolunHub credentials). Run it inside the
# maintenance window, AFTER the old host's web, celery worker and beat are stopped (CUTOVER.md), so
# no write — and no Notion/VolunHub sync — lands on the old database after the dump.
#
# The role must exist first (README.md §1); this script never handles a password. It refuses to
# restore into a database that already has tables unless --force: a second run onto a live database
# is the one mistake here that cannot be undone.
set -euo pipefail

: "${OLD:?OLD=user@old-host is required}"
: "${PG_CONTAINER:?PG_CONTAINER (the Postgres resource uuid) is required}"
: "${DB_NAME:?}"; : "${DB_USER:?}"
FORCE="${1:-}"
OLD_APP=${OLD_APP:-/var/app/organizer}
WORK=${WORK:-/root/organizer-migration}
mkdir -p "$WORK"

# The dump is built ON the old host from its own .env, so the password never crosses this script's
# command line or logs. The .env is parsed, NOT sourced: decouple values (SECRET_KEY) can contain
# characters like ')' that break `.` — same parser as the old deploy-backend workflow.
OLD_ENV_TO_PG='
set -euo pipefail
_q=$(printf "\047")
while IFS="=" read -r _k _v; do
  case "$_k" in
    DB_NAME|DB_USER|DB_PASSWORD|DB_HOST|DB_PORT)
      _v="${_v%\"}"; _v="${_v#\"}"; _v="${_v%"$_q"}"; _v="${_v#"$_q"}"
      export "$_k=$_v" ;;
  esac
done < '"$OLD_APP"'/.env
export PGHOST="${DB_HOST:-127.0.0.1}" PGPORT="${DB_PORT:-5432}" PGUSER="$DB_USER" PGPASSWORD="${DB_PASSWORD:-}" PGDATABASE="$DB_NAME"
'

old() {  # run a command on the old host with PG* set from its .env (script on stdin: any login shell)
    printf '%s\n' "${OLD_ENV_TO_PG}$1" | ssh "$OLD" 'bash -s'
}

pg() {  # psql as the superuser inside the Coolify Postgres container
    docker exec "$PG_CONTAINER" psql -v ON_ERROR_STOP=1 -U postgres "$@"
}

echo ">> old server: $(old 'psql -tAc "show server_version"')"
echo ">> dumping the old database on $OLD (custom format, no owner/ACLs — the new role owns everything)"
old 'pg_dump --format=custom --no-owner --no-acl' > "$WORK/organizer.dump"
ls -lh "$WORK/organizer.dump"

if ! pg -d postgres -tAc "select 1 from pg_roles where rolname='$DB_USER'" | grep -q 1; then
    echo "REFUSED: role $DB_USER does not exist in $PG_CONTAINER. Create it first (README.md §1)." >&2
    exit 2
fi

tables=$(pg -d "$DB_NAME" -tAc \
    "select count(*) from information_schema.tables where table_schema='public'" 2>/dev/null || echo "missing")
if [ "$tables" = "missing" ]; then
    echo ">> creating database $DB_NAME owned by $DB_USER"
    pg -d postgres -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\";"
elif [ "$tables" != "0" ] && [ "$FORCE" != "--force" ]; then
    echo "REFUSED: $DB_NAME already has $tables tables. Re-run with --force to drop and restore." >&2
    exit 3
elif [ "$tables" != "0" ]; then
    echo ">> --force: recreating $DB_NAME"
    pg -d postgres -c "DROP DATABASE \"$DB_NAME\" WITH (FORCE);"
    pg -d postgres -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\";"
fi

echo ">> restoring"
docker cp "$WORK/organizer.dump" "$PG_CONTAINER:/tmp/organizer.dump"
docker exec "$PG_CONTAINER" pg_restore --no-owner --role="$DB_USER" -U postgres -d "$DB_NAME" \
    --exit-on-error /tmp/organizer.dump
docker exec "$PG_CONTAINER" rm -f /tmp/organizer.dump
pg -d "$DB_NAME" -c "ANALYZE;" >/dev/null

echo ">> row check (old vs new) — every line must match"
mismatch=0
for t in django_migrations auth_user authtoken_token tasks_taskitem tasks_project tasks_tag \
         tasks_taskcomment oauth2_provider_application oauth2_provider_accesstoken; do
    o=$(old "psql -tAc 'select count(*) from $t'" 2>/dev/null || echo "-")
    n=$(pg -d "$DB_NAME" -tAc "select count(*) from $t" 2>/dev/null || echo "-")
    [ "$o" = "$n" ] || mismatch=1
    printf '%-32s old=%-8s new=%s\n' "$t" "$o" "$n"
done
[ "$mismatch" = 0 ] || { echo "MISMATCH: do not point DNS here until the counts agree." >&2; exit 4; }
echo ">> done"
