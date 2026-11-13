#!/usr/bin/env bash
# Pull the latest main, build, and restart. Run on the server as the cardynasty user:
#   sudo -u cardynasty /opt/cardynasty/app/deploy/deploy.sh
# The site keeps serving the old build until the restart at the end (a few seconds).
set -euo pipefail

cd /opt/cardynasty/app
set -a; source /etc/cardynasty/app.env; set +a   # the build reads the DB (DATA_DIR)

echo "→ Backing up the database before deploying"
node scripts/backup-db.mjs >/dev/null || echo "  (no database yet, first deploy)"

echo "→ Fetching main"
git fetch --quiet origin main
git reset --hard --quiet origin/main
echo "  at $(git log --oneline -1)"

echo "→ Installing dependencies"
npm ci --no-audit --no-fund

echo "→ Building"
NODE_ENV=production npm run build

echo "→ Restarting"
sudo /usr/bin/systemctl restart cardynasty
sleep 3
if curl -fsS -o /dev/null http://127.0.0.1:3000/; then
  echo "✓ Deployed and responding"
else
  echo "✗ The site is not responding. Check: journalctl -u cardynasty -n 100" >&2
  exit 1
fi
