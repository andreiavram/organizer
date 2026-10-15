## ADDED Requirements

### Requirement: Container images with one role per container
The system SHALL ship an application image whose entrypoint selects one role — `web` (uvicorn serving the ASGI application on port 8000), `worker` (Celery worker), `beat` (Celery beat), `migrate` (one-shot) or `manage` (a management command) — and an edge image that serves the Angular bundle at `/` with client-side-routing fallback, serves Django's collected static files at `/static/`, and proxies `/api/`, `/rest-auth/`, `/admin/`, `/o/`, `/integrations/`, `/.well-known/oauth-*`, `/healthz/`, `/mcp` (unbuffered) and `/ws/` (WebSocket upgrade) to the web role. The edge MUST forward the `X-Forwarded-Proto` it receives rather than its own scheme, because TLS terminates in front of it. Credentials and secrets MUST NOT be baked into any image layer.

#### Scenario: Request arrives over HTTPS through the platform proxy
- **WHEN** a request reaches the edge over plain HTTP carrying `X-Forwarded-Proto: https`
- **THEN** the web role sees `request.is_secure()` as true, the admin login passes the CSRF origin check, and the OAuth authorization-server metadata advertises `https://` URLs

#### Scenario: Secrets are supplied at runtime only
- **WHEN** the images are built from a working tree containing `.env` or a database dump
- **THEN** neither file is present in any image

### Requirement: Migrations complete before the new version serves
The deployment SHALL run `migrate` in a one-shot container, and the web, worker and beat roles MUST start only after it exits successfully. A failed migration MUST fail the deployment and leave the previous containers serving.

#### Scenario: Migration fails
- **WHEN** the migrate container exits non-zero
- **THEN** the new web, worker and beat containers are not started and the deployment is reported failed

### Requirement: Liveness probe
The system SHALL answer `GET /healthz/` with 200 and `{"status": "ok"}` without touching the database — before any other middleware runs and whatever its `Host` header — and with `?deep=1` SHALL additionally run `SELECT 1`, answering 503 when the database is unreachable. The response MUST NOT be cacheable, and methods other than GET and HEAD MUST be answered with 405.

#### Scenario: Database down
- **WHEN** the database is unreachable and the platform probes `/healthz/`
- **THEN** the probe answers 200, so the web container is not restarted for an outage it cannot fix
- **AND** `/healthz/?deep=1` answers 503

#### Scenario: Probe by container address
- **WHEN** the healthcheck requests `/healthz/` with a `Host` that is not in `ALLOWED_HOSTS`
- **THEN** the probe answers 200

### Requirement: Deploy target selected by repository variable
Production SHALL be deployed by exactly one mechanism, chosen by the repository variable `DEPLOY_TARGET_PRODUCTION`: the value `coolify` runs the Coolify deploy job and skips the legacy SSH deploy; any other value or none leaves the legacy SSH deploy in charge. In both cases the deploy MUST run only after the workflow's tests pass.

#### Scenario: Cutover
- **WHEN** `DEPLOY_TARGET_PRODUCTION` is `coolify` and a commit lands on `develop`
- **THEN** after the tests pass the Coolify deployment is triggered and awaited, and the SSH deploy steps are skipped
