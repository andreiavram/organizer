# Cutover: old supervisor host → Coolify

There is no staging environment, so steps 0.3–0.4 (a full deploy on an empty database and a copy
rehearsal, before DNS moves) are the rehearsal. Do not skip them. Every step names where it runs.

Rollback at any point before step 9 is "point DNS back, unset `DEPLOY_TARGET_PRODUCTION`, start the
old programs". The old host is untouched until the very end.

## 0. Before (days ahead)

1. **Old host** — collect the facts the repository cannot show:
   - `psql -tAc 'show server_version'` against the app DB (copy-data.sh prints it too);
   - `crontab -l` for the deploy user and root: anything besides certbot needs a Coolify *Scheduled
     Task* (e.g. a cron fallback for `generate_recurring_tasks`);
   - `sudo supervisorctl status`: the program names to stop in step 2 (expected `organizer`,
     `organizer-celery-worker`, `organizer-celery-beat`);
   - whether `INTEGRATIONS_TOKEN_KEY` is set in `/var/app/organizer/.env` (see env.example);
   - the current DNS TTL of the organizer domain.
2. **DNS** — lower the organizer domain's TTL to 300 s.
3. **Coolify** — set up as in [README.md](README.md) §1–§4, with a **generated `sslip.io` domain** on
   `edge` and `MCP_BASE_URL`/`FRONTEND_BASE_URL`/`ALLOWED_HOSTS` pointing at that domain for now.
   Deploy against the **empty** `organizer` database: it proves the images build, `migrate` runs and
   the stack comes up healthy. Then
   `docker exec -it <web> python manage.py createsuperuser`, and check on the sslip domain:
   `/healthz/?deep=1`, SPA login, create a task, a second tab updates live, `/admin/` login, and
   `docker exec <web> python manage.py check --deploy`.
   Do **not** restore the real data here: worker + beat start with the stack (and beat fires its
   interval jobs on first start), so with the copied integration credentials they would sync the
   same Notion/VolunHub accounts as the old host.
4. **Coolify host** — rehearse the copy into a throwaway database the app never reads:
   `OLD=… PG_CONTAINER=ouanf4qtdgssyb63r8vomcae DB_NAME=organizer_rehearsal DB_USER=organizer bash deploy/coolify/copy-data.sh`.
   It must end with matching row counts. Then
   `docker exec ouanf4qtdgssyb63r8vomcae psql -U postgres -c 'DROP DATABASE organizer_rehearsal'`.

## The window (expect ~15 min; the database is small)

1. **Coolify** — put the real values back in the environment: `MCP_BASE_URL`, `FRONTEND_BASE_URL`,
   `ALLOWED_HOSTS` = the organizer domain. Move the `edge` domain to `https://<organizer domain>`.
   Do not deploy yet.
2. **Old host** — stop the writers, beat first, so no scheduled job fires after the dump:
   `sudo supervisorctl stop organizer-celery-beat organizer-celery-worker organizer`.
3. **Coolify host** — final copy:
   `OLD=<user>@<old host> PG_CONTAINER=ouanf4qtdgssyb63r8vomcae DB_NAME=organizer DB_USER=organizer bash deploy/coolify/copy-data.sh --force`
   (`--force` because the 0.3 deploy migrated an empty schema into it). It exits non-zero unless
   every row count matches.
4. **Coolify** — deploy (or `deploy.sh`). Confirm the migrate container logged `migrate: done` and
   that worker + beat are running again.
5. **DNS** — point the organizer domain at the Coolify server. Wait for Traefik's certificate
   (Coolify proxy log).
6. **GitHub** — set `SMOKE_URL_PRODUCTION`, then `DEPLOY_TARGET_PRODUCTION=coolify`. From now on a
   push to `develop` deploys here and the SSH jobs skip.
7. **Verify**, as the real user:
   - SPA login, task list, create/complete a task; a second tab updates live (WebSocket `/ws/`);
   - `/admin/` login (proves CSRF + `X-Forwarded-Proto` through Traefik → edge → uvicorn);
   - `curl https://<domain>/.well-known/oauth-authorization-server`: every URL in it is `https://`;
   - the Claude **Organizer** connector still lists tasks (existing OAuth tokens moved with the DB);
   - Notion "Sync now" and a VolunHub sync succeed (proves the integration key survived);
   - the worker log shows beat's scheduled tasks arriving.
8. **Window ends.** Old host stays stopped but intact.
9. **After a week of quiet** — retire the old host: final backup of `/var/app/organizer/.env` and the
   nginx vhost somewhere safe, then stop nginx/supervisor programs there. Open the follow-up PR that
   removes the SSH deploy jobs and their `DEPLOY_TARGET_PRODUCTION` branching, the supervisor/nginx
   instructions in README.md and docs/deployment.md, and bumps CI's Postgres service to 17.

## If it goes wrong

- **Deploy fails at `migrate`** — the previous containers (or none) keep running; read the migrate
  container log in Coolify. Nothing on the old host changed.
- **Before step 5** — `sudo supervisorctl start organizer organizer-celery-worker organizer-celery-beat`
  on the old host; try another day.
- **After step 5** — point DNS back, unset `DEPLOY_TARGET_PRODUCTION`, start the old programs. Writes
  made on Coolify in between exist only there; for a single-user organizer, re-enter them by hand.
