#!/usr/bin/env bash
set -e

# ========= CONFIG =========
PROJECT_NAME="cabinet-maker"   # MUST match Pages project name
DIST_DIR="dist"
NODE_VERSION="20"
# ==========================

echo "=== Cloudflare Pages Local Deploy (Node $NODE_VERSION) ==="

# 1. Install Node.js 20 LTS
if ! command -v node >/dev/null 2>&1 || ! node -v | grep -q "v20"; then
  echo "Installing Node.js $NODE_VERSION LTS..."
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt install -y nodejs
fi

node -v
npm -v

# 2. Clean install (avoid bun interference)
echo "Cleaning old installs..."
rm -rf node_modules package-lock.json

# 3. Install dependencies
echo "Installing dependencies..."
npm install

# 4. Build project
echo "Building project..."
npm run build

# 5. Validate dist
if [ ! -d "$DIST_DIR" ]; then
  echo "ERROR: dist folder not found. Build failed."
  exit 1
fi

# 6. Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy "$DIST_DIR" --project-name "$PROJECT_NAME"

echo "===================================="
echo "DEPLOY COMPLETE"
echo "https://${PROJECT_NAME}.pages.dev"
echo "===================================="