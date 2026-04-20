#!/bin/bash
# deploy.sh — Pull latest Docker image and restart the Nexora stack
# Call via SSH from GitHub Actions (appleboy/ssh-action)
#
# Usage:
#   ./deploy.sh run      — pull + restart web container (normal deploy)
#   ./deploy.sh status   — check container status
#   ./deploy.sh logs     — tail deploy log
#   ./deploy.sh rollback — rollback to previous image tag

set -euo pipefail

IMAGE="nhatduyfirst/nexoratechno-web"
COMPOSE_DIR="${COMPOSE_DIR:-/opt/nexora}"
COMPOSE_FILE="$COMPOSE_DIR/docker-compose.yml"
LOGFILE="$COMPOSE_DIR/deploy.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGFILE"; }

run_deploy() {
  log "=== Starting deployment ==="

  # Pull latest image
  log "Pulling: $IMAGE:latest"
  docker pull "$IMAGE:latest"

  # Get image info
  TAG_SHA=$(docker inspect --format='{{index .Config.Labels "git_sha"}}' \
              "$IMAGE:latest" 2>/dev/null || echo "unknown")
  log "Image git_sha: $TAG_SHA"

  # Stop + prune old web container (remove image if no other container uses it)
  log "Stopping and removing old web container..."
  docker compose -f "$COMPOSE_FILE" stop web 2>/dev/null || true
  docker compose -f "$COMPOSE_FILE" rm -f web 2>/dev/null || true

  # Prune dangling/unused images for this repo
  log "Pruning unused images..."
  docker image prune -f --filter "until=168h" 2>/dev/null || true

  # Pull latest + restart web (only web — WP + MySQL stay running)
  log "Starting new web container..."
  cd "$COMPOSE_DIR"
  docker compose pull web
  docker compose up -d --no-deps web

  log "=== Deployment complete ==="
}

case "${1:-run}" in
  run)      run_deploy ;;
  logs)     tail -f "$LOGFILE" ;;
  status)   docker compose -f "$COMPOSE_FILE" ps web ;;
  rollback)
            docker tag "$IMAGE:latest" "$IMAGE:rollback"
            cd "$COMPOSE_DIR" && docker compose up -d --no-deps web
            log "Rolled back to previous image" ;;
  *)        echo "Usage: deploy.sh {run|logs|status|rollback}"
            exit 1 ;;
esac