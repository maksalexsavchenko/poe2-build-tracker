#!/bin/bash
# Run this ONCE on a fresh Hetzner Ubuntu server as root
# Usage: bash server-setup.sh

set -e

echo "=== Installing Docker ==="
apt-get update
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "=== Installing Certbot ==="
apt-get install -y certbot

echo "=== Creating app directory ==="
mkdir -p /app
mkdir -p /var/www/certbot

echo "=== Setup complete ==="
echo "Next steps:"
echo "1. Copy your project files to /app"
echo "2. Create /app/.env from .env.example"
echo "3. Run: certbot certonly --standalone -d poe2-build-tracker.online -d www.poe2-build-tracker.online"
echo "4. Run: cd /app && docker compose up -d"
