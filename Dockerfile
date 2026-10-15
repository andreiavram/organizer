# syntax=docker/dockerfile:1.7
#
# Organizer — two images from one file, both built on the Coolify host from
# docker-compose.coolify.yml (see deploy/coolify/README.md):
#
#   target `app`   Django + Celery. One image, one role per container (web / worker / beat /
#                  migrate), chosen by the first argument to deploy/docker/entrypoint.sh.
#   target `edge`  nginx: the Angular bundle, Django's collected static files, and the proxy to
#                  `web`. Same-origin, exactly like the old host's vhost.

ARG PYTHON_VERSION=3.12
ARG NODE_VERSION=20

# ---------------------------------------------------------------- python deps ---
FROM python:${PYTHON_VERSION}-slim-bookworm AS builder

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/opt/venv

COPY --from=ghcr.io/astral-sh/uv:0.8 /uv /usr/local/bin/uv

WORKDIR /app
# uv.lock is the source of truth (requirements.txt is only an export of it for the old pip deploy).
# --frozen: fail rather than re-resolve if pyproject.toml and the lock disagree.
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev --no-install-project

# ---------------------------------------------------------------- app ---
FROM python:${PYTHON_VERSION}-slim-bookworm AS app

# tini: PID 1 that forwards signals (uvicorn/celery shut down gracefully on deploy) and reaps.
# curl: the compose healthcheck. psycopg[binary] bundles its own libpq.
RUN apt-get update \
 && apt-get install -y --no-install-recommends tini curl \
 && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:$PATH" \
    DJANGO_SETTINGS_MODULE=organizer.settings \
    STATIC_ROOT=/app/staticfiles \
    HOME=/home/organizer

# /app is created here, owned by the app user: WORKDIR would create it as root, and COPY --chown
# changes only the copied files — not /app itself — so collectstatic could not create STATIC_ROOT.
RUN groupadd --system --gid 1000 organizer \
 && useradd --system --uid 1000 --gid organizer --create-home --home-dir /home/organizer organizer \
 && mkdir -p /data/beat /app \
 && chown -R organizer:organizer /data /app

COPY --from=builder /opt/venv /opt/venv
WORKDIR /app
COPY --chown=organizer:organizer . .

USER organizer

# Static files are collected at BUILD time: nothing in them depends on runtime data, and the edge
# target copies the result straight out of this stage (no shared volume). It also fails the build on
# a broken settings import. Neither the database nor Redis is touched — both connect lazily — so
# dummy values satisfy the import. There is no .env in the image (.dockerignore), so settings read
# the environment only.
RUN SECRET_KEY=build-only DEBUG=False python manage.py collectstatic --noinput --verbosity 0

ARG GIT_SHA=unknown
ENV GIT_SHA=${GIT_SHA}
LABEL org.opencontainers.image.source="https://github.com/YetiLabsRO/organizer" \
      org.opencontainers.image.revision="${GIT_SHA}"

EXPOSE 8000
ENTRYPOINT ["/usr/bin/tini", "--", "/app/deploy/docker/entrypoint.sh"]
CMD ["web"]

# ---------------------------------------------------------------- frontend ---
FROM node:${NODE_VERSION}-bookworm-slim AS spa

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY frontend/ ./
# environment.prod.ts: apiBase/wsBase empty → same origin, which is what the edge serves.
RUN npm run build

# ---------------------------------------------------------------- edge ---
FROM nginx:1.27-alpine AS edge

RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY deploy/docker/nginx/proxy.conf /etc/nginx/organizer-proxy.conf
COPY --from=spa /frontend/dist/organizer-frontend/browser /srv/spa
COPY --from=app /app/staticfiles /srv/static
EXPOSE 80
