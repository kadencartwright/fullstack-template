#!/usr/bin/env bash
set -euo pipefail

IMAGE="mcr.microsoft.com/playwright:v1.53.1-noble"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

docker run --rm --network host \
  -e CI=1 \
  -e PORT="${PORT:-39147}" \
  -v "$REPO_ROOT:/work" \
  -w /work \
  "$IMAGE" \
  /bin/bash -lc "corepack enable && pnpm install --frozen-lockfile && pnpm run test:e2e"
