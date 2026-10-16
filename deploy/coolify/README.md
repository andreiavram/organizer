# Organizer on Coolify

How Organizer runs on the Coolify server, how to set it up, and why it is shaped this way. Moving
the data and DNS off the old supervisor host is [CUTOVER.md](CUTOVER.md). The layout follows
VolunHub's (`YetiLabsRO/volunhub`, `deploy/coolify/`), minus what Organizer does not have (media,
published sites, staging).

Nothing here changes the old host. Until the `DEPLOY_TARGET_PRODUCTION` repository variable is
`coolify`, every deploy still goes over SSH exactly as before.

## The shape

```
            Traefik (Coolify proxy: TLS, Let's Encrypt)
               │  <organizer domain>
               ▼
   ┌────────────────── one compose stack ───────────────────┐
   │  edge (nginx)                                          │
   │    /            Angular bundle (baked into the image)   │
   │    /static/     Django collectstatic (baked in too)     │
   │    /api/ /rest-auth/ /admin/ /o/ /integrations/         │
   │    /.well-known/oauth-*  /mcp  /ws/   ──►  web :8000    │
   │                                                         │
   │  web     uvicorn, ASGI (REST, admin, OAuth, MCP, WS)     │
   │  worker  celery (recurring tasks, Notion/VolunHub sync)  │
   │  beat    celery beat — exactly one (volume: beat)        │
   │  migrate one-shot, gates the three above                 │
   └─────────────────────────────────────────────────────────┘
               │ coolify network
               ▼
   Postgres 17 + Redis 7 ("Shared Infrastructure" project)
```

| file | what it is |
|---|---|
| `Dockerfile` | target `app` (one image, roles via `deploy/docker/entrypoint.sh`) and target `edge` (nginx + SPA + static) |
| `deploy/docker/nginx/` | the edge config — a port of the README's production vhost |
| `docker-compose.coolify.yml` | the stack Coolify deploys |
| `organizer/health.py` | `/healthz/` (DB-free liveness; `?deep=1` adds `SELECT 1`) |
| `deploy/coolify/deploy.sh` | trigger a Coolify deploy, wait, smoke-test (CI and by hand) |
| `deploy/coolify/env.example` | what changes in the env vs the old `.env` |
| `deploy/coolify/copy-data.sh` | database copy, run on the Coolify host |

## Decisions, and why

**Coolify builds the images, not GitHub Actions.** Same as VolunHub and geogame: the
`coolify-yetilabs` GitHub App already has access to this repository, Coolify keeps previous images
for its rollback button, and there is no registry to run. The Actions job only asks Coolify to
deploy and waits.

**Tests still gate the deploy.** The Coolify job is a job in the existing `deploy-backend` /
`deploy-frontend` workflows, `needs:` their test job. Coolify's own auto-deploy on push stays
**off**, or an untested commit would ship.

**One image, roles by argument.** web, worker, beat and migrate run the same code at the same commit
by construction.

**Migrations run in a one-shot container that gates everything else.** `web`/`worker`/`beat` declare
`depends_on: migrate: service_completed_successfully`. A failed migration fails the deploy and the
previous containers keep serving. (The old workflow restarted the service even when migrate failed.)

**The SPA and Django static are baked into the edge image.** Nothing in either depends on runtime
data, so there is no shared volume: the `edge` stage copies the Angular build from a Node stage and
the collected static from the `app` stage. Same origin as today, so `environment.prod.ts` (empty
`apiBase`/`wsBase`) needs no change, and neither does any OAuth redirect URI.

**The edge forwards `X-Forwarded-Proto` from Traefik; it never rebuilds it from `$scheme`.** nginx
only ever speaks plain HTTP to Traefik, so `$scheme` is always `http`. Forwarding that would make
`request.is_secure()` false: the admin login (also the OAuth consent login) fails CSRF, and the OAuth
metadata advertises `http://` URLs, which MCP clients reject. uvicorn runs with `--proxy-headers
--forwarded-allow-ips "*"` to trust it.

**`/healthz/` is a first-in-line middleware, not a view.** It never touches the database or checks
`Host`, so a Postgres blip doesn't get the web container restarted in a loop, and the Docker
healthcheck (Host `127.0.0.1`) works whatever `ALLOWED_HOSTS` says. `?deep=1` is for the smoke test.

**Env vars, not an `.env` file in the image.** The old `.env` is pasted into Coolify's environment
editor; compose hands it to every app container via `env_file`. `settings.py` already falls back to
pure environment variables when there is no `.env` file. Nothing secret is in an image layer
(`.dockerignore`).

**Service names that other apps' containers can reach must be unique on the server.** The stack
joins Coolify's shared `coolify` network (to reach Postgres/Redis), and Docker DNS resolves a
service name across every network a container is on. The backend is therefore `organizer-web`, not
`web`: VolunHub and geogame both have a `web`, and the first deploy's `web:8000` upstream
round-robined requests between the three apps.

**Shared Postgres and Redis.** Organizer is a single-user app; a dedicated database resource buys
nothing. It gets its own role and database in the shared Postgres 17 (a `pg_dump`/`pg_restore` from
16 → 17 is supported) and its own DB numbers in the shared Redis.

**No pre-deploy `pg_dump`.** The old workflow dumped the DB before every deploy. Here, backups belong
to the database resource (§1). The bookworm `pg_dump` (15) cannot dump a 17 server anyway.

## Setting it up (once)

### 1. Database

In the Coolify terminal of **Shared Infrastructure → postgresql-database**
(`ouanf4qtdgssyb63r8vomcae`):

```sql
CREATE ROLE organizer LOGIN PASSWORD '<generated>';
CREATE DATABASE organizer OWNER organizer;
```

**Backups:** the resource has a daily scheduled backup, but it is **local only, with no S3**: a
dead disk takes the backups with it. Add an S3 destination, and make sure `organizer` is in the
backup's database list. Do this before cutover, because the old host's per-deploy dumps go away.

### 2. Redis

The shared Redis (`hfxgixhepxvbl2fbcrrfsh40`). Organizer uses DB 6 (Celery) and 7 (Channels); see
`env.example`. Note its password from the resource page.

### 3. The application

In Coolify: *Projects → + New project "organizer" → production → + New → Private Repository (with
GitHub App)* → `coolify-yetilabs` → `YetiLabsRO/organizer`:

| field | value |
|---|---|
| branch | `develop` (what production tracks today) |
| build pack | Docker Compose |
| compose file | `/docker-compose.coolify.yml` |
| auto-deploy on push | **off** (the workflows deploy, after tests) |
| "Connect to predefined network" | **on** (reach the DB/Redis by name) |

Domain: on the **`edge`** service only, port 80 — `https://<organizer domain>`. Before DNS moves,
use a Coolify-generated `sslip.io` domain to test (§ CUTOVER 0.3). Leave every other service
without a domain.

Environment: paste the old `.env` with the changes in `env.example`.

Deploy once. The first build is the slow one (Python deps + `npm ci` + the Angular build); later
ones reuse layers.

### 4. GitHub (repository settings → variables / secrets)

| name | kind | value |
|---|---|---|
| `COOLIFY_URL` | variable | `https://<coolify host>` (no trailing slash) |
| `COOLIFY_API_TOKEN` | secret | team API token with the **deploy** ability |
| `COOLIFY_APP_UUID_PRODUCTION` | variable | from the application's page |
| `SMOKE_URL_PRODUCTION` | variable | `https://<organizer domain>/healthz/?deep=1`. Set it only once DNS points at Coolify, or the smoke test probes the old host |
| `DEPLOY_TARGET_PRODUCTION` | variable | `coolify` flips production over (CUTOVER.md). Unset = legacy SSH |

## Operating it

- **Deploy**: merge to `develop`. By hand: *Actions → deploy-backend → Run workflow*, or
  `COOLIFY_URL=… COOLIFY_API_TOKEN=… APP_UUID=… bash deploy/coolify/deploy.sh`.
- **Roll back**: Coolify's *Deployments → Rollback* to the previous image. A rollback does not undo
  migrations — same as on the old host.
- **A management command** (`sync_notion`, `generate_recurring_tasks`, `createsuperuser`, …):
  Coolify terminal on the `web` container, or `docker exec <web container> python manage.py …`.
- **Health**: `/healthz/` (no database; what Docker probes) and `/healthz/?deep=1` (adds `SELECT 1`).
- **Logs**: every container logs to stdout — Coolify's *Logs* tab, or `get_logs` over the Coolify MCP.
- **Never scale `beat` above one.** Two beats double every scheduled job, including the Notion and
  VolunHub syncs.
