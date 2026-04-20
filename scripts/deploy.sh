#!/bin/bash
# deploy.sh — Pull latest Docker image and restart the Nexora stack
# Call via SSH from GitHub Actions (appleboy/ssh-action)
#
# Usage:
#   ./deploy.sh run      — pull + restart web container (normal deploy)
#   ./deploy.sh status   — check container status
#   ./deploy.sh logs     — tail deploy log

set -euo pipefail

IMAGE="nhatduyfirst/nexoratechno-web"
COMPOSE_DIR="${COMPOSE_DIR:-/home/ubuntu/Website_server/nexoratechno.com}"
COMPOSE_FILE="$COMPOSE_DIR/docker-compose.yml"
LOGFILE="$COMPOSE_DIR/deploy.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGFILE"; }

run_deploy() {
  log "=== Starting deployment ==="

  log "Pulling: $IMAGE:latest"
  docker pull --platform linux/amd64 "$IMAGE:latest"

  log "Stopping and removing old web container..."
  docker compose -f "$COMPOSE_FILE" stop web 2>/dev/null || true
  docker compose -f "$COMPOSE_FILE" rm -f web 2>/dev/null || true

  log "Pruning unused images..."
  docker image prune -f --filter "until=168h" 2>/dev/null || true

  log "Starting new web container..."
  cd "$COMPOSE_DIR"
  docker compose pull web
  docker compose up -d --no-deps web

  log "=== Deployment complete ==="
}

case "${1:-run}" in
  run)    run_deploy ;;
  logs)   tail -f "$LOGFILE" ;;
  status) docker compose -f "$COMPOSE_FILE" ps web ;;
  *)      echo "Usage: deploy.sh {run|logs|status}"
          exit 1 ;;
esac