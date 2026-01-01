#!/usr/bin/env bash
set -euo pipefail

# ========= CONFIG =========
REPO_DIR="$HOME/cabinet-maker"
BRANCH="main"
NODE_VERSION="18"
# ==========================

echo "======================================"
echo " Cabinet-Maker Auto Build Script"
echo "======================================"

cd "$REPO_DIR"

echo "==> Fetching latest code"
git fetch origin

echo "==> Resetting to origin/$BRANCH (safe clean state)"
git reset --hard origin/$BRANCH
git clean -fd

echo "==> Checking Node.js"
if ! command -v node >/dev/null 2>&1; then
  echo "Node not found. Installing Node $NODE_VERSION"
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt install -y nodejs
fi

node -v
npm -v

echo "==> Cleaning old build files"
rm -rf node_modules dist .parcel-cache

echo "==> Installing dependencies"
npm install

echo "==> Running production build"
npm run build

echo "======================================"
echo " BUILD SUCCESSFUL"
echo " Output directory: dist/"
echo "======================================"
