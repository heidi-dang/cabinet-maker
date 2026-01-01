#!/usr/bin/env bash
set -euo pipefail

# ========= CONFIG =========
APP_NAME="cabinet-maker"
REPO_DIR="$HOME/cabinet-maker"
BRANCH="master"
WEB_ROOT="/var/www/$APP_NAME"
NODE_VERSION="18"
# ==========================

echo "======================================"
echo " Cabinet-Maker LIVE UPDATE"
echo "======================================"

cd "$REPO_DIR"

echo "==> Fetching latest code from GitHub"
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

echo "==> Installing dependencies (clean)"
rm -rf node_modules dist .parcel-cache
npm install

echo "==> Building production bundle"
npm run build

echo "==> Deploying to Nginx web root: $WEB_ROOT"
sudo rm -rf "$WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo cp -r dist/* "$WEB_ROOT"

sudo chown -R www-data:www-data "$WEB_ROOT"
sudo chmod -R 755 "$WEB_ROOT"

echo "==> Testing Nginx configuration"
sudo nginx -t

echo "==> Reloading Nginx"
sudo systemctl reload nginx

echo "======================================"
echo " DEPLOYMENT COMPLETE"
echo "======================================"
