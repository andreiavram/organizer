#!/usr/bin/env bash
# Trigger a Coolify deployment, wait for it to finish, then smoke-test the URL.
#
#   COOLIFY_URL        https://coolify.example.ro        (no trailing slash)
#   COOLIFY_API_TOKEN  team API token with the `deploy` ability
#   APP_UUID           the Coolify application to deploy
#   SMOKE_URL          optional; GET must answer 2xx once the deploy finished
#   DEPLOY_TIMEOUT     optional seconds to wait for the build+rollout (1500)
#
# Called by .github/workflows/deploy-coolify.yaml, and runnable by hand from any
# machine holding a token — it is the whole deploy, there is no hidden half.
#
# Exit codes: 0 deployed and healthy · 1 Coolify reported failure/cancel ·
# 2 misconfiguration · 3 timed out waiting · 4 deployed but smoke test failed.
set -euo pipefail

: "${COOLIFY_URL:?COOLIFY_URL is required}"
: "${COOLIFY_API_TOKEN:?COOLIFY_API_TOKEN is required}"
: "${APP_UUID:?APP_UUID is required}"
DEPLOY_TIMEOUT="${DEPLOY_TIMEOUT:-1500}"
POLL_SECONDS="${POLL_SECONDS:-15}"

# api METHOD PATH. Reads (GET) retry on transient errors; the deploy trigger (POST — Coolify
# answers 405 to a GET on /deploy since 4.4) does not, so a retry can never queue a second deploy.
api() {
    local method="$1" retry=()
    [ "$method" = GET ] && retry=(--retry 3 --retry-delay 5 --retry-all-errors)
    curl -fsS -X "$method" "${retry[@]}" \
        -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
        -H "Accept: application/json" \
        "${COOLIFY_URL}/api/v1/$2"
}

# python3 rather than jq: present on every runner and every dev box here
# (jq is not).
json_get() {
    python3 -c 'import json,sys
data = json.load(sys.stdin)
for part in sys.argv[1].split("."):
    data = data[int(part)] if isinstance(data, list) else data.get(part)
    if data is None:
        break
print("" if data is None else data)' "$1"
}

echo "Triggering deployment of application ${APP_UUID}"
response="$(api POST "deploy?uuid=${APP_UUID}&force=false")" || {
    echo "::error::Coolify refused the deploy request (check COOLIFY_URL, token ability 'deploy', APP_UUID)."
    exit 2
}
deployment_uuid="$(printf '%s' "$response" | json_get deployments.0.deployment_uuid)"
if [ -z "$deployment_uuid" ]; then
    echo "::error::Coolify answered without a deployment uuid: ${response}"
    exit 2
fi
echo "Deployment ${deployment_uuid} queued — ${COOLIFY_URL}/project (Deployments tab)"

deadline=$(( $(date +%s) + DEPLOY_TIMEOUT ))
last_status=""
while :; do
    status="$(api GET "deployments/${deployment_uuid}" | json_get status || true)"
    if [ "$status" != "$last_status" ]; then
        echo "$(date -u +%H:%M:%S) status: ${status:-unknown}"
        last_status="$status"
    fi
    case "$status" in
        finished) break ;;
        failed|cancelled|cancelled-by-user|error)
            echo "::error::Coolify deployment ${deployment_uuid} ended as '${status}'. The previous containers keep serving."
            echo "Read the build log in Coolify, or: get_deployment(${deployment_uuid}, include_log_summary=true) over the MCP."
            exit 1
            ;;
    esac
    if [ "$(date +%s)" -ge "$deadline" ]; then
        echo "::error::Gave up waiting after ${DEPLOY_TIMEOUT}s; the deployment may still finish. Check Coolify before redeploying."
        exit 3
    fi
    sleep "$POLL_SECONDS"
done

if [ -n "${SMOKE_URL:-}" ]; then
    echo "Smoke test: ${SMOKE_URL}"
    for attempt in 1 2 3 4 5 6; do
        if curl -fsS --max-time 15 -o /dev/null "$SMOKE_URL"; then
            echo "Smoke test passed."
            exit 0
        fi
        echo "attempt ${attempt} failed; retrying in 10s"
        sleep 10
    done
    echo "::error::Deployment finished but ${SMOKE_URL} is not answering 2xx."
    exit 4
fi
echo "Deployed (no SMOKE_URL set, nothing smoke-tested)."
