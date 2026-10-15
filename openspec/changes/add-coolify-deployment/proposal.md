# Change: Deploy Organizer on Coolify (containers) instead of a hand-configured supervisor host

## Why

Production runs on a hand-configured box: an nginx vhost, supervisor programs (uvicorn, celery worker,
celery beat), a NOPASSWD sudoers entry for the restart, a deploy user that owns the web root, and two
SSH workflows that `git reset` on the server, `pip install`, `collectstatic`, migrate and restart —
restarting even when the migration failed. None of that can be rebuilt from the repository. A Coolify
server (already running geogame, with shared Postgres 17 and Redis) is available, and VolunHub has
prepared the same move (`YetiLabsRO/volunhub`, `add-coolify-deployment`).

## What Changes

- **One application image, one role per container** (`web` / `worker` / `beat` / `migrate` /
  `manage`), plus an **edge** nginx image that bakes in the Angular bundle and Django's collected
  static files and proxies the backend prefixes (`/api/`, `/rest-auth/`, `/admin/`, `/o/`,
  `/integrations/`, `/.well-known/oauth-*`, `/mcp` unbuffered, `/ws/` upgraded) to `web` — the same
  single origin as the old vhost. `docker-compose.coolify.yml` is the stack; Coolify builds both
  images from the repository.
- **Migrations run in a one-shot container before anything serves.** A failed migration fails the
  deploy and the previous containers keep serving.
- **`GET /healthz/`**: a database-free liveness probe (`?deep=1` adds `SELECT 1`).
- **`STATIC_ROOT` is overridable from the environment**, so the image collects outside the source
  tree's `static/` (which also holds `STATICFILES_DIRS`). Default unchanged.
- **Deploy target is a repository variable.** `DEPLOY_TARGET_PRODUCTION=coolify` runs a new
  `deploy-coolify` job (after the existing test jobs) and skips the legacy SSH deploy; unset leaves
  the legacy deploy in charge.
- **Runbooks**: `deploy/coolify/README.md` (setup, decisions), `CUTOVER.md` (the move),
  `env.example` (env delta), `copy-data.sh` (database copy with row-count check), `deploy.sh`.

Nothing is removed. The SSH jobs, README's supervisor/nginx instructions and `docs/deployment.md`
stay until the old host is retired (CUTOVER.md step 9).

## Impact

- Affected specs: new `deployment-platform`.
- Affected code: `Dockerfile`, `.dockerignore`, `docker-compose.coolify.yml`, `deploy/`,
  `organizer/health.py`, `organizer/settings.py`, `.github/workflows/deploy-{backend,frontend}.yaml`.
- No migration. No behaviour change on the existing host until the variable is flipped.
