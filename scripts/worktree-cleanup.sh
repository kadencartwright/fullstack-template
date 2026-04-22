#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

readonly MAX_AGE_DAYS=14

get_primary_checkout() {
  cd "$REPO_ROOT"
  if [ -f ".git" ]; then
    local git_dir
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

list_worktrees() {
  local primary_checkout=$1
  cd "$primary_checkout"

  git worktree list --porcelain 2>/dev/null | while IFS= read -r line; do
    if [[ $line == worktree* ]]; then
      worktree_path="${line#worktree }"
    elif [[ $line == branch* ]]; then
      branch="${line#branch refs/heads/}"
      if [[ "$branch" != "main" && "$branch" != "master" && "$worktree_path" != "$primary_checkout" ]]; then
        echo "$worktree_path|$branch"
      fi
    elif [[ $line == detached ]]; then
      if [[ "$worktree_path" != "$primary_checkout" ]]; then
        echo "$worktree_path|detached"
      fi
    fi
  done
}

get_last_commit_time() {
  local worktree_path=$1
  cd "$worktree_path"
  git log -1 --format=%ct 2>/dev/null || echo "0"
}

format_date() {
  local timestamp=$1
  if [[ "$OSTYPE" == "darwin"* ]]; then
    date -r "$timestamp" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "unknown"
  else
    date -d "@$timestamp" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "unknown"
  fi
}

cleanup_worktrees() {
  local dry_run=false
  local arg="${1:-}"

  if [[ "$arg" == "--" ]]; then
    arg="${2:-}"
  fi

  if [[ "$arg" == "--dry-run" ]]; then
    dry_run=true
  fi

  local primary_checkout
  primary_checkout=$(get_primary_checkout)

  echo "=== Worktree Cleanup ==="
  echo "Primary checkout: $primary_checkout"
  echo "Max age: $MAX_AGE_DAYS days"
  if $dry_run; then
    echo "Mode: DRY RUN (no actual deletions)"
  fi
  echo ""

  local current_timestamp
  current_timestamp=$(date +%s)
  local max_age_seconds=$((MAX_AGE_DAYS * 24 * 60 * 60))

  while IFS='|' read -r worktree_path branch; do
    [ -z "$worktree_path" ] && continue

    if [ ! -d "$worktree_path" ]; then
      echo "Skipping: $branch (directory already removed)"
      continue
    fi

    local last_commit
    last_commit=$(get_last_commit_time "$worktree_path")
    local age_seconds=$((current_timestamp - last_commit))
    local age_days=$((age_seconds / 86400))
    local last_commit_date
    last_commit_date=$(format_date "$last_commit")

    if [ $age_seconds -gt $max_age_seconds ]; then
      echo "[OLD] $branch"
      echo "      Path: $worktree_path"
      echo "      Last commit: $last_commit_date ($age_days days ago)"

      if $dry_run; then
        echo "      Action: Would remove (dry-run)"
      else
        echo "      Action: Removing..."

        cd "$primary_checkout"
        if git worktree remove "$worktree_path" --force 2>/dev/null; then
          echo "      Result: Worktree removed successfully"
        else
          echo "      Result: git worktree remove failed, trying manual cleanup..."
          rm -rf "$worktree_path"
          git worktree prune
          echo "      Result: Manual cleanup completed"
        fi

        if git branch -D "$branch" 2>/dev/null; then
          echo "      Result: Branch '$branch' deleted"
        fi
      fi
      echo ""
    else
      echo "[OK]  $branch - Last commit: $last_commit_date ($age_days days ago)"
    fi
  done < <(list_worktrees "$primary_checkout")

  echo "=== Cleanup complete! ==="
}

cleanup_worktrees "${1:-}" "${2:-}"
