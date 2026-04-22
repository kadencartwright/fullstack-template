#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

generate_worktree_name() {
  local adjectives=("happy" "swift" "bright" "calm" "eager" "fancy" "gentle" "jolly" "kind" "lively" "merry" "noble" "proud" "quiet" "rapid" "sunny" "vivid" "witty" "zesty" "brave")
  local nouns=("apple" "beach" "cloud" "dolphin" "eagle" "forest" "garden" "harbor" "island" "jungle" "kite" "lake" "meadow" "ocean" "pearl" "river" "star" "tiger" "valley" "wave")

  local adj="${adjectives[$RANDOM % ${#adjectives[@]}]}"
  local noun="${nouns[$RANDOM % ${#nouns[@]}]}"
  local digits
  digits=$(printf "%04d" $((RANDOM % 10000)))

  echo "${adj}-${noun}-${digits}"
}

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

main() {
  local base_branch="${1:-origin/main}"

  if [ "$base_branch" = "--" ]; then
    base_branch="${2:-origin/main}"
  fi

  echo "=== Creating New Worktree ==="
  echo "Base branch: $base_branch"
  echo ""

  local primary_checkout
  primary_checkout=$(get_primary_checkout)

  local worktree_name
  worktree_name=$(generate_worktree_name)

  local repo_name
  repo_name="$(basename "$primary_checkout")"
  local worktree_base="$HOME/.worktrees/$repo_name"

  mkdir -p "$worktree_base"

  while [ -d "$worktree_base/$worktree_name" ]; do
    worktree_name=$(generate_worktree_name)
  done

  local worktree_path="$worktree_base/$worktree_name"

  echo "Worktree name: $worktree_name"
  echo "Worktree path: $worktree_path"
  echo ""

  cd "$primary_checkout"

  echo "Creating worktree from $base_branch..."
  git worktree add "$worktree_path" -b "$worktree_name" "$base_branch"
  echo "Worktree created."
  echo ""

  cd "$worktree_path"
  echo "Changed to: $(pwd)"
  echo ""

  echo "Starting worktree:setup in the background..."
  nohup bash -c "cd '$worktree_path' && ./scripts/worktree-setup.sh > '$worktree_path/.worktree-setup.log' 2>&1" &
  local setup_pid=$!

  echo "Setup process started (PID: $setup_pid)"
  echo "Logs: $worktree_path/.worktree-setup.log"
  echo ""
  echo "=== Worktree creation initiated! ==="
  echo "The setup is running in the background."
  echo "Check progress with: tail -f $worktree_path/.worktree-setup.log"
}

main "$@"
