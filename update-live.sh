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

echo "==> Fetching latest code"
git fetch origin
git reset --hard origin/$BRANCH
git clean -fd

echo "==> Ensuring Node.js"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt install -y nodejs
fi

node -v
npm -v

echo "==> Cleaning previous install"
rm -rf node_modules dist .parcel-cache package-lock.json

echo "==> Installing dependencies"
npm install

echo "==> Ensuring rimraf is installed"
npm install --save-dev rimraf

echo "==> Running production build"
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
echo " DEPLOY SUCCESSFUL"
echo "======================================"
