# Tasks: Deploy Organizer on Coolify

## 1. Application
- [x] 1.1 `organizer/health.py`: `HealthCheckMiddleware` first in `MIDDLEWARE`; `/healthz/` answers
      without the database or `Host` check, `?deep=1` runs `SELECT 1` (503 when unreachable), never
      cached, 405 for writes. Tests in `organizer/test_health.py`.
- [x] 1.2 `settings.STATIC_ROOT` read from the environment (default unchanged).

## 2. Images and stack
- [x] 2.1 `Dockerfile`: `builder` (uv sync --frozen from `uv.lock`), `app` (non-root uid 1000, tini,
      collectstatic at build), `spa` (npm ci + ng build), `edge` (nginx + bundle + static).
- [x] 2.2 `deploy/docker/entrypoint.sh`: web / worker / beat / migrate / manage roles.
- [x] 2.3 `deploy/docker/nginx/`: port of the README vhost; `X-Forwarded-Proto` passed through.
- [x] 2.4 `docker-compose.coolify.yml`: migrate gates web/worker/beat; healthchecks; `beat` volume.
- [x] 2.5 `.dockerignore`: no secrets, dumps or dev artifacts in any layer.

## 3. Deploy pipeline
- [x] 3.1 `deploy/coolify/deploy.sh` (trigger, wait, smoke-test).
- [x] 3.2 `deploy-coolify` jobs in `deploy-backend.yaml` / `deploy-frontend.yaml` behind the tests,
      gated on `DEPLOY_TARGET_PRODUCTION == 'coolify'`; legacy SSH steps carry the inverse gate.

## 4. Runbooks
- [x] 4.1 `deploy/coolify/README.md`, `CUTOVER.md`, `env.example`, `copy-data.sh`.
- [x] 4.2 Pointers from `docs/deployment.md` and `CLAUDE.md`.

## 5. Cutover (operational, after merge — CUTOVER.md)
- [ ] 5.1 First image build on Coolify succeeds; empty-database deploy healthy on an sslip domain.
- [ ] 5.2 Copy rehearsal row counts match.
- [ ] 5.3 Production window: copy, deploy, DNS, `DEPLOY_TARGET_PRODUCTION=coolify`, verification list.
- [ ] 5.4 After a week: retire the old host; follow-up PR removes the SSH path and bumps CI Postgres to 17.
