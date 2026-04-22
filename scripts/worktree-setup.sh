#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

get_primary_checkout() {
  if [ -f ".git" ]; then
    git_dir=$(git rev-parse --git-common-dir 2>/dev/null || true)
    if [ -n "$git_dir" ] && [ "$git_dir" != ".git" ]; then
      dirname "$git_dir"
    else
      echo "Error: Unable to determine primary checkout path from worktree" >&2
      exit 1
    fi
  else
    echo "$REPO_ROOT"
  fi
}

copy_if_missing() {
  local source_path="$1"
  local target_path="$2"

  if [ -f "$target_path" ]; then
    echo "$target_path already exists - skipping copy"
  elif [ -f "$source_path" ]; then
    mkdir -p "$(dirname "$target_path")"
    cp "$source_path" "$target_path"
    echo "Copied ${target_path#$REPO_ROOT/}"
  fi
}

echo "=== Worktree Setup ==="
echo ""

PRIMARY_CHECKOUT=$(get_primary_checkout)
echo "Primary checkout: $PRIMARY_CHECKOUT"
echo "Current worktree: $REPO_ROOT"
echo ""

echo "=== Copying local env files ==="
if [ "$REPO_ROOT" = "$PRIMARY_CHECKOUT" ]; then
  echo "Already in primary checkout - no env copy needed"
else
  copy_if_missing "$PRIMARY_CHECKOUT/.env" "$REPO_ROOT/.env"
  copy_if_missing "$PRIMARY_CHECKOUT/.env.local" "$REPO_ROOT/.env.local"
  copy_if_missing "$PRIMARY_CHECKOUT/apps/frontend/.env" "$REPO_ROOT/apps/frontend/.env"
  copy_if_missing "$PRIMARY_CHECKOUT/apps/frontend/.env.local" "$REPO_ROOT/apps/frontend/.env.local"
fi
echo ""

echo "=== Installing dependencies ==="
pnpm install --frozen-lockfile
echo "Dependencies installed."
echo ""

echo "=== Setup complete! ==="
