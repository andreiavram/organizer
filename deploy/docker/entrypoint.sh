#!/usr/bin/env bash
# Organizer container entrypoint — one image, one role per container.
#
#   web      uvicorn on :8000 (ASGI: REST API, admin, OAuth, /mcp, /ws/)
#   worker   celery worker (recurring tasks, Notion + VolunHub sync)
#   beat     celery beat — exactly ONE replica, ever (two would double every scheduled job)
#   migrate  one-shot: migrate, then exit 0. The other roles wait for it (docker-compose.coolify.yml)
#   manage   `manage <args>` → python manage.py <args> (maintenance, shells)
#   *        exec'd verbatim
set -euo pipefail

cd /app
role="${1:-web}"
shift || true

case "$role" in
    web)
        # --proxy-headers + --forwarded-allow-ips: trust X-Forwarded-Proto/-For from the edge nginx,
        # so request.is_secure() is true behind Traefik's TLS (CSRF origin check, OAuth metadata).
        exec uvicorn organizer.asgi:application \
            --host 0.0.0.0 --port 8000 \
            --workers "${WEB_CONCURRENCY:-3}" \
            --proxy-headers --forwarded-allow-ips "*" \
            --timeout-graceful-shutdown 30 \
            "$@"
        ;;
    worker)
        exec celery -A organizer worker \
            --loglevel="${CELERY_LOGLEVEL:-info}" \
            --concurrency="${CELERY_WORKER_CONCURRENCY:-2}" \
            "$@"
        ;;
    beat)
        # The schedule file lives on the `beat` volume so interval jobs (Notion/VolunHub sync) keep
        # their last-run times across deploys instead of all firing on every restart.
        exec celery -A organizer beat --loglevel="${CELERY_LOGLEVEL:-info}" \
            --schedule /data/beat/celerybeat-schedule "$@"
        ;;
    migrate)
        python manage.py migrate --noinput
        echo "migrate: done"
        ;;
    manage)
        exec python manage.py "$@"
        ;;
    *)
        exec "$role" "$@"
        ;;
esac
