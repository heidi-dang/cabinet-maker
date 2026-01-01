#!/usr/bin/env bash
set -euo pipefail

# ========= CONFIG =========
APP_NAME="cabinet-maker"
REPO_DIR="$HOME/cabinet-maker"
BRANCH="master"
WEB_ROOT="/var/www/$APP_NAME"
LOG_DIR="$REPO_DIR/logs"
NODE_VERSION="18"
TIMESTAMP="$(date '+%Y-%m-%d_%H-%M-%S')"
LOG_FILE="$LOG_DIR/update-live_$TIMESTAMP.log"
# ==========================

mkdir -p "$LOG_DIR"

# Log to screen + file
exec > >(tee -a "$LOG_FILE") 2>&1

echo "======================================"
echo " FAST LIVE UPDATE"
echo " Time: $TIMESTAMP"
echo " Log : $LOG_FILE"
echo "======================================"

cd "$REPO_DIR"

echo "==> Fetching latest code"
git fetch origin
git reset --hard origin/$BRANCH
git clean -fd

echo "==> Checking Node.js"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt install -y nodejs
fi

node -v
npm -v

# ---------- SMART DEP CHECK ----------
echo "==> Checking dependency changes"
if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
  echo "package.json changed → running npm install"
  npm install
else
  echo "package.json unchanged → skipping npm install"
fi
# ------------------------------------

echo "==> Ensuring rimraf exists (one-time safety)"
if ! npx --no-install rimraf --version >/dev/null 2>&1; then
  npm install --save-dev rimraf
fi

echo "==> Building production bundle"
npm run build

echo "==> Deploying to Nginx: $WEB_ROOT"
sudo rm -rf "$WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo cp -r dist/* "$WEB_ROOT"
sudo chown -R www-data:www-data "$WEB_ROOT"
sudo chmod -R 755 "$WEB_ROOT"

echo "==> Testing Nginx"
sudo nginx -t

echo "==> Reloading Nginx"
sudo systemctl reload nginx

echo "======================================"
echo " DEPLOY COMPLETE (FAST MODE)"
echo "======================================"
