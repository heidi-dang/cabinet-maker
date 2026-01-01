#!/usr/bin/env bash
set -euo pipefail

### ===== CONFIG =====
REPO_URL="https://github.com/nguyenhhluong/woodworking.git"
REPO_DIR="$HOME/woodworking"
NODE_VERSION="18"
### ==================

echo "========== Woodworking 1-Click Build =========="

echo "==> Updating system"
sudo apt-get update -y
sudo apt-get install -y curl git build-essential

echo "==> Installing Node.js $NODE_VERSION LTS"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

node -v
npm -v

echo "==> Cloning or updating repository"
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone "$REPO_URL" "$REPO_DIR"
else
  cd "$REPO_DIR"
  git fetch origin
  git reset --hard origin/HEAD
  git clean -fd
fi

cd "$REPO_DIR"

echo "==> Fixing prebuild script for Linux (rimraf)"
npm install --save-dev rimraf

# Ensure Linux-compatible prebuild
node <<'EOF'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.prebuild = "rimraf dist";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
EOF

echo "==> Creating lockfile (if missing)"
if [ ! -f package-lock.json ]; then
  npm install --package-lock-only
fi

echo "==> Installing dependencies (clean)"
rm -rf node_modules dist .parcel-cache
npm ci || npm install

echo "==> Running production build"
npm run build

echo "==============================================="
echo "BUILD SUCCESSFUL"
echo "Output directory: $REPO_DIR/dist"
echo "==============================================="