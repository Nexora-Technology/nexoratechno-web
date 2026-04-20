#!/bin/bash
# deploy.sh — Sync files from GitHub + pull latest image + restart Nexora stack
# Call via SSH from GitHub Actions (appleboy/ssh-action)
#
# Usage:
#   ./deploy.sh run      — sync files + pull + restart web container
#   ./deploy.sh sync     — sync files only
#   ./deploy.sh logs     — tail deploy log
#   ./deploy.sh status   — check container status

set -euo pipefail

IMAGE="nhatduyfirst/nexoratechno-web"
COMPOSE_DIR="${COMPOSE_DIR:-/home/ubuntu/Website_server/nexoratechno.com}"
COMPOSE_FILE="$COMPOSE_DIR/docker-compose.yml"
LOGFILE="$COMPOSE_DIR/deploy.log"
REPO_URL="https://github.com/Nexora-Technology/nexoratechno-web.git"
BRANCH="main"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGFILE"; }

# ── Sync files from GitHub (exclude docker-compose.yml) ──────────────────────
sync_files() {
  log "Syncing files from GitHub..."

  # Clone/pull into a temp dir
  TEMP_DIR=$(mktemp -d)
  git clone --depth=1 --branch "$BRANCH" "$REPO_URL" "$TEMP_DIR/repo" 2>/dev/null || {
    # If already cloned, just pull
    if [ -d "$COMPOSE_DIR/.git" ]; then
      log "Updating existing repo..."
      git -C "$COMPOSE_DIR" fetch origin "$BRANCH"
      git -C "$COMPOSE_DIR" reset --hard "origin/$BRANCH"
      TEMP_DIR=""
    else
      log "ERROR: repo not found and clone failed"
      return 1
    fi
  }

  if [ -n "$TEMP_DIR" ]; then
    # Backing up docker-compose.yml and .env (user-managed)
    BACKUP_DIR="$COMPOSE_DIR/.backup_$(date +%s)"
    mkdir -p "$BACKUP_DIR"
    [ -f "$COMPOSE_FILE" ] && cp "$COMPOSE_FILE" "$BACKUP_DIR/docker-compose.yml"
    [ -f "$COMPOSE_DIR/.env" ] && cp "$COMPOSE_DIR/.env" "$BACKUP_DIR/.env"

    # Sync everything except docker-compose.yml and .env
    rsync -a --exclude='docker-compose.yml' --exclude='.env' \
          --exclude='.git' --exclude='node_modules' \
          --exclude='data/' --exclude='deploy.log' \
          "$TEMP_DIR/repo/" "$COMPOSE_DIR/"

    # Restore docker-compose.yml and .env
    [ -f "$BACKUP_DIR/docker-compose.yml" ] && cp "$BACKUP_DIR/docker-compose.yml" "$COMPOSE_FILE"
    [ -f "$BACKUP_DIR/.env" ] && cp "$BACKUP_DIR/.env" "$COMPOSE_DIR/.env"

    rm -rf "$BACKUP_DIR"
    rm -rf "$TEMP_DIR"
  fi

  log "Sync complete"
}

# ── Main deploy logic ─────────────────────────────────────────────────────────
run_deploy() {
  log "=== Starting deployment ==="

  sync_files

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
  sync)   sync_files ;;
  logs)   tail -f "$LOGFILE" ;;
  status) docker compose -f "$COMPOSE_FILE" ps web ;;
  *)      echo "Usage: deploy.sh {run|sync|logs|status}"
          exit 1 ;;
esac