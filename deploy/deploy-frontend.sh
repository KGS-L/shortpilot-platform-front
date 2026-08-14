#!/bin/sh
set -eu

if [ "$#" -ne 2 ]; then
  echo "Usage: deploy-frontend.sh IMAGE HEALTHCHECK_URL" >&2
  exit 64
fi

new_image=$1
healthcheck_url=$2
compose_file=compose.staging.yml
service=frontend
container=omnelyo-frontend
previous_image=$(docker inspect --format '{{.Config.Image}}' "$container" 2>/dev/null || true)

wait_for_health() {
  url=$1
  attempts=12
  while [ "$attempts" -gt 0 ]; do
    if curl --fail --silent --show-error --max-time 10 "$url" >/dev/null; then
      return 0
    fi
    attempts=$((attempts - 1))
    sleep 5
  done
  return 1
}

rollback() {
  if [ -z "$previous_image" ] || [ "$previous_image" = "$new_image" ]; then
    echo "Deployment failed and no distinct previous image is available for rollback." >&2
    return 1
  fi
  echo "Deployment unhealthy; restoring the previous frontend image." >&2
  FRONTEND_IMAGE=$previous_image docker compose -f "$compose_file" up -d --no-deps --force-recreate "$service"
  wait_for_health "http://127.0.0.1:3000/"
}

if [ -n "$previous_image" ] && [ "$previous_image" != "$new_image" ]; then
  printf '%s\n' "$previous_image" > .previous-frontend-image
fi

echo "Pulling the immutable frontend image."
FRONTEND_IMAGE=$new_image docker compose -f "$compose_file" pull "$service"
echo "Recreating the frontend service only."
if ! FRONTEND_IMAGE=$new_image docker compose -f "$compose_file" up -d --no-deps --force-recreate "$service"; then
  rollback || true
  exit 1
fi

if ! wait_for_health "http://127.0.0.1:3000/" || ! wait_for_health "$healthcheck_url"; then
  rollback || true
  exit 1
fi

echo "Frontend deployment is healthy."
