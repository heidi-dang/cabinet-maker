#!/usr/bin/env bash
set -euo pipefail

### ===== CONFIG =====
APP_NAME="woodworking"
APP_DIR="$HOME/woodworking"
WEB_ROOT="/var/www/$APP_NAME"
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
### ==================

echo "========== NGINX DEPLOY START =========="

echo "==> Installing Nginx"
sudo apt-get update -y
sudo apt-get install -y nginx

echo "==> Enabling Nginx at boot"
sudo systemctl enable nginx

echo "==> Building app (safety build)"
cd "$APP_DIR"
npm run build

echo "==> Deploying files to $WEB_ROOT"
sudo rm -rf "$WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo cp -r dist/* "$WEB_ROOT"
sudo chown -R www-data:www-data "$WEB_ROOT"
sudo chmod -R 755 "$WEB_ROOT"

echo "==> Writing Nginx config"
sudo tee "$NGINX_CONF" >/dev/null <<EOF
server {
    listen 80;
    server_name _;

    root $WEB_ROOT;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

echo "==> Enabling site"
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/$APP_NAME
sudo rm -f /etc/nginx/sites-enabled/default

echo "==> Testing Nginx config"
sudo nginx -t

echo "==> Reloading Nginx"
sudo systemctl reload nginx

echo "========================================"
echo "DEPLOYMENT COMPLETE"
echo "Access your app at: http://<VPS-IP>"
echo "========================================"
