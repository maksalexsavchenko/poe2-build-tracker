#!/bin/bash
# Run on the server to deploy/update the app
# Usage: bash deploy.sh

set -e

cd /app

echo "=== Pulling latest changes ==="
git pull

echo "=== Building and restarting ==="
docker compose build nextjs
docker compose up -d

echo "=== Running DB migrations ==="
docker compose exec nextjs npx prisma migrate deploy

echo "=== Done! ==="
docker compose ps
