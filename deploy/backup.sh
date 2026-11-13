#!/usr/bin/env bash
# Nightly: consistent SQLite backup → gzip → S3. Run by cardynasty-backup.timer.
# Needs BACKUP_BUCKET in /etc/cardynasty/app.env and an instance role that may
# s3:PutObject to that bucket (see docs/DEPLOYMENT_AWS.md, step 3).
set -euo pipefail

set -a; source /etc/cardynasty/app.env; set +a
: "${BACKUP_BUCKET:?Set BACKUP_BUCKET in /etc/cardynasty/app.env}"

cd /opt/cardynasty/app
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

name="cms-$(date -u +%Y%m%dT%H%M%SZ).db"
node scripts/backup-db.mjs "$tmp/$name"
gzip -9 "$tmp/$name"

aws s3 cp "$tmp/$name.gz" "s3://$BACKUP_BUCKET/sqlite/$name.gz" --only-show-errors
echo "Uploaded s3://$BACKUP_BUCKET/sqlite/$name.gz"
