#!/usr/bin/env bash
set -euo pipefail

# ===== CONFIG =====
REPO_DIR="$HOME/woodworking"
REMOTE="origin"
BRANCH="master"   # change to 'main' if needed
# ==================

echo "==> Going to repo: $REPO_DIR"
cd "$REPO_DIR"

echo "==> Fetching latest from $REMOTE..."
git fetch "$REMOTE"

echo "==> HARD RESET (local changes will be LOST)"
git reset --hard "$REMOTE/$BRANCH"

echo "==> Removing untracked files..."
git clean -fd

echo "==> Repo is now clean and up to date"
git status --short
