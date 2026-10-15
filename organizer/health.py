"""Liveness probe for the container platform (Coolify / Docker healthcheck).

``/healthz/`` answers in a middleware listed FIRST in ``MIDDLEWARE``, not in a view: nothing below it
runs, so the shallow probe touches neither the database nor the session store, and a Postgres blip
cannot get the web container restarted in a loop for an outage a restart cannot fix.

It also never calls ``request.get_host()``, so the probe answers whatever ``Host`` header the
platform sends — a Docker healthcheck hits the container on 127.0.0.1, which need not be in
``ALLOWED_HOSTS``.

``?deep=1`` additionally runs ``SELECT 1``, for a human or the deploy smoke test asking whether the
app can reach its database; the platform never asks for it.
"""

from django.db import DatabaseError, connection
from django.http import JsonResponse
from django.utils.cache import add_never_cache_headers

HEALTH_PATH = "/healthz/"


def _respond(payload, status=200):
    response = JsonResponse(payload, status=status)
    add_never_cache_headers(response)
    return response


class HealthCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path != HEALTH_PATH:
            return self.get_response(request)
        if request.method not in ("GET", "HEAD"):
            response = _respond({"status": "method not allowed"}, status=405)
            response["Allow"] = "GET, HEAD"
            return response
        if request.GET.get("deep") != "1":
            return _respond({"status": "ok"})
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
        except DatabaseError:
            return _respond({"status": "error", "database": "unreachable"}, status=503)
        return _respond({"status": "ok", "database": "ok"})
