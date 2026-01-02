#!/usr/bin/env bash
set -e

# ========= CONFIG =========
PROJECT_NAME="cabinet-maker"
DIST_DIR="dist"
NODE_VERSION="18"
# ==========================

echo "== Cloudflare Pages 1-click installer =="

# 1. Install system deps
if command -v apt >/dev/null 2>&1; then
  sudo apt update -y
  sudo apt install -y curl git
fi

# 2. Install Node.js (LTS)
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt install -y nodejs
fi

node -v
npm -v

# 3. Install Wrangler (local, safe)
if [ ! -d node_modules/wrangler ]; then
  npm install --save-dev wrangler
fi

# 4. Build project
echo "== Building project =="
npm install
npm run build

if [ ! -d "$DIST_DIR" ]; then
  echo "ERROR: dist folder not found"
  exit 1
fi

# 5. Deploy to Cloudflare Pages
echo "== Deploying to Cloudflare Pages =="
npx wrangler pages deploy "$DIST_DIR" --project-name "$PROJECT_NAME"

echo "================================="
echo "DEPLOY COMPLETE"
echo "https://$PROJECT_NAME.pages.dev"
echo "================================="
