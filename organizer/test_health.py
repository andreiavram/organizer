from unittest import mock

from django.db import DatabaseError
from django.test import SimpleTestCase, TestCase, override_settings


@override_settings(ALLOWED_HOSTS=["organizer.example.com"])
class ShallowHealthTests(SimpleTestCase):
    # SimpleTestCase refuses database queries, so passing at all proves the shallow probe makes none.

    def test_ok_without_touching_the_database(self):
        response = self.client.get("/healthz/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_answers_any_host(self):
        # The Docker healthcheck probes 127.0.0.1, which is not in ALLOWED_HOSTS.
        response = self.client.get("/healthz/", HTTP_HOST="10.0.1.7:8000")
        self.assertEqual(response.status_code, 200)

    def test_never_cached(self):
        response = self.client.get("/healthz/")
        self.assertIn("no-cache", response["Cache-Control"])

    def test_rejects_writes(self):
        response = self.client.post("/healthz/")
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response["Allow"], "GET, HEAD")


class DeepHealthTests(TestCase):
    def test_deep_checks_the_database(self):
        response = self.client.get("/healthz/?deep=1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "database": "ok"})

    def test_deep_reports_an_unreachable_database(self):
        with mock.patch("organizer.health.connection.cursor", side_effect=DatabaseError("down")):
            response = self.client.get("/healthz/?deep=1")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {"status": "error", "database": "unreachable"})
