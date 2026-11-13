#!/usr/bin/env bash
# One-time setup of a fresh Ubuntu 24.04 server (arm64 or x86_64) for Car Dynasty.
# Safe to re-run: every step checks whether it's already done.
#
#   sudo DOMAIN=cardynasty.in NOTIFY_EMAIL=you@example.com BACKUP_BUCKET=cardynasty-backups-123456789012 \
#        bash server-bootstrap.sh
#
# What it does: OS updates, AWS CLI, Node.js 24, Caddy, 2 GiB swap, an unprivileged
# app user, clones the repo, writes /etc/cardynasty/app.env, installs the systemd
# services, builds + starts the app, and turns on HTTPS. See docs/DEPLOYMENT_AWS.md.
set -euo pipefail

: "${DOMAIN:?Set DOMAIN, e.g. DOMAIN=cardynasty.in}"
: "${NOTIFY_EMAIL:?Set NOTIFY_EMAIL (where enquiry alerts go)}"
: "${BACKUP_BUCKET:?Set BACKUP_BUCKET (the S3 bucket for backups)}"
REPO_URL="${REPO_URL:-https://github.com/shubham075/car_dynasty.git}"
APP_HOME=/opt/cardynasty
APP_DIR=$APP_HOME/app

[ "$(id -u)" -eq 0 ] || { echo "Run with sudo." >&2; exit 1; }
step() { printf '\n\033[1;33m==> %s\033[0m\n' "$*"; }
export DEBIAN_FRONTEND=noninteractive

step "1/9 System updates and build tools"
apt-get update -q
apt-get upgrade -yq
apt-get install -yq git curl unzip build-essential python3 ca-certificates gnupg \
  debian-keyring debian-archive-keyring apt-transport-https

step "2/9 AWS CLI (used to upload backups)"
if ! command -v aws >/dev/null; then
  curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip" -o /tmp/awscli.zip
  unzip -qo /tmp/awscli.zip -d /tmp && /tmp/aws/install && rm -rf /tmp/aws /tmp/awscli.zip
fi
aws --version

step "3/9 Node.js 24 LTS"
if ! node -v 2>/dev/null | grep -q '^v24\.'; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -yq nodejs
fi
node -v

step "4/9 Caddy (HTTPS)"
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -q && apt-get install -yq caddy
fi

step "5/9 2 GiB swap (next build needs headroom on a 2 GiB server)"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

step "6/9 App user, folders and code"
id cardynasty >/dev/null 2>&1 || useradd --system --create-home --home-dir "$APP_HOME" --shell /bin/bash cardynasty
install -d -o cardynasty -g cardynasty -m 700 /var/lib/cardynasty
install -d -m 755 /etc/cardynasty
[ -d "$APP_DIR/.git" ] || sudo -u cardynasty git clone --quiet "$REPO_URL" "$APP_DIR"

step "7/9 Settings file /etc/cardynasty/app.env"
if [ ! -f /etc/cardynasty/app.env ]; then
  cat > /etc/cardynasty/app.env <<EOF
SITE_URL=https://$DOMAIN
DATA_DIR=/var/lib/cardynasty
TRUSTED_PROXY_HOPS=1
NOTIFY_EMAIL=$NOTIFY_EMAIL
BACKUP_BUCKET=$BACKUP_BUCKET
MAIL_FROM="Car Dynasty <no-reply@$DOMAIN>"
# Email delivery (optional; enquiries are saved either way). Set ONE of:
# RESEND_API_KEY=
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
EOF
  echo "  created"
else
  echo "  exists, left unchanged"
fi
chown root:cardynasty /etc/cardynasty/app.env
chmod 640 /etc/cardynasty/app.env

step "8/9 Services: app, nightly backup, restart permission"
echo 'cardynasty ALL=(root) NOPASSWD: /usr/bin/systemctl restart cardynasty' > /etc/sudoers.d/cardynasty
chmod 440 /etc/sudoers.d/cardynasty
visudo -cf /etc/sudoers.d/cardynasty >/dev/null
install -m 644 "$APP_DIR/deploy/cardynasty.service" "$APP_DIR/deploy/cardynasty-backup.service" \
  "$APP_DIR/deploy/cardynasty-backup.timer" /etc/systemd/system/
systemctl daemon-reload
systemctl enable cardynasty cardynasty-backup.timer
systemctl start cardynasty-backup.timer
# First build + start (takes a few minutes)
sudo -u cardynasty bash "$APP_DIR/deploy/deploy.sh"

step "9/9 HTTPS with Caddy"
sed "s/cardynasty\.example\.com/$DOMAIN/g" "$APP_DIR/deploy/Caddyfile" > /etc/caddy/Caddyfile
install -d -o caddy -g caddy /var/log/caddy
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
systemctl reload caddy

cat <<EOF

✓ Server ready.
  Site:   https://$DOMAIN  (certificate is issued on the first visit once DNS points here)
  Next:   create your admin login:
          cd $APP_DIR && sudo -u cardynasty bash -c 'set -a; . /etc/cardynasty/app.env; set +a; npm run admin -- create you@example.com "Your Name"'
EOF
