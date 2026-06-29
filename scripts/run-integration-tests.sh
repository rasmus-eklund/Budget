#!/bin/sh

set -eu

COMPOSE_FILE="./docker-compose.test.yml"

cleanup() {
  docker compose -f "$COMPOSE_FILE" down -v --remove-orphans >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

docker compose -f "$COMPOSE_FILE" up --abort-on-container-exit --exit-code-from test-runner test-runner
