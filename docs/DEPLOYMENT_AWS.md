# Deploying Car Dynasty to AWS: step by step, with commands

Every step below is a command you copy and paste.
- **Part A** runs on **your Windows laptop** in **Git Bash** with the AWS CLI. It creates the AWS resources.
- **Part B** runs **on the server**. One script installs and starts everything.
- **Part C** covers day-to-day work: updates, backups and monitoring.

Plan for about **1 hour** the first time, most of it waiting for DNS and the first build.

## What you're building

The frontend, backend and database are **one Next.js app plus one SQLite file**, so they run together on **one EC2 server**:

```
Visitor ──HTTPS──► Caddy :443 (free auto-renewing certificate)
                      │
                      ▼ 127.0.0.1:3000 (not reachable from the internet)
                    Next.js app ──► /var/lib/cardynasty/cms.db  (encrypted EBS disk)
                                          ├─ nightly SQLite backup ──► S3 (private, versioned)
                                          └─ nightly disk snapshot ──► EBS snapshots (7 kept)
```

| Resource | Purpose | Approx. cost/month* |
|---|---|---|
| EC2 `t4g.small` (Arm/Graviton, 2 vCPU, 2 GiB) | Runs everything | ~US$12 |
| EBS gp3 20 GiB, encrypted | Disk, including the database | ~US$1.6 |
| Elastic IP (public IPv4) | Fixed address for your domain | ~US$3.6 |
| S3 + snapshots + CloudWatch alarms | Backups and alerts | < US$1 |

*Prices depend on your Region. Check the EC2 pricing page for exact figures.

**Trade-off:** one server means a hardware failure takes the site down until it's recovered. The auto-recovery alarm (A9) and the backups (C2) keep that short, with no lost data. Moving to multiple servers would first need the database moved to RDS PostgreSQL.

---

# Part A: On your laptop (Git Bash)

## A0. Sign in and pick your Region

**Why:** the CLI needs credentials, and your project only allows resources in its one selected Region.

1. **Find your Region:** in **AWS Settings → View all projects → Overview → Additional info → Region**. For example, `ap-south-1` is Mumbai.
2. **Sign in.** This opens your browser. The credentials it creates are short-lived and rotate on their own, so no permanent keys are stored on your laptop.

```bash
aws login
aws sts get-caller-identity            # shows your account number = signed in
```

3. **Check your plan and spend limit:**

```bash
aws freetier get-account-plan-state --region us-east-1
```

- **`"FREE"`:** confirm that EC2, S3, Systems Manager, CloudWatch and SNS are on the [Free plan supported services list](https://docs.aws.amazon.com/accounts/latest/reference/supported-services-sign-up-new.html#supported-services-free-tier).
- **`"PAID"`:** check the [Paid plan list](https://docs.aws.amazon.com/accounts/latest/reference/supported-services-sign-up-new.html#supported-services-paid-plan) instead.
- **Spend limit:** check it in **AWS Settings → Billing**. If you hit it, your project pauses and the site goes offline. If AWS commands suddenly fail with **Access Denied**, check this first.

## A1. Set your variables (edit the first 4 lines)

Every later command uses these. **Re-run this block whenever you open a new Git Bash window.**

```bash
export AWS_REGION=ap-south-1                 # ← your project's Region from A0
DOMAIN=cardynasty.in                         # ← your domain (no https://, no www)
ALERT_EMAIL=you@example.com                  # ← gets enquiry alerts and server alarms
APP=cardynasty

export MSYS_NO_PATHCONV=1                    # stops Git Bash rewriting "/paths" in AWS arguments
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET=$APP-backups-$ACCOUNT_ID
echo "Region=$AWS_REGION Account=$ACCOUNT_ID Bucket=$BUCKET"
```

## A2. S3 bucket for database backups

**Why:** an off-server copy of the data, in case the server's disk is lost.
- **Private:** all public access is blocked.
- **Versioned:** a bad backup can't overwrite a good one.
- **Self-cleaning:** backups expire after 30 days.

```bash
if [ "$AWS_REGION" = "us-east-1" ]; then
  aws s3api create-bucket --bucket "$BUCKET"
else
  aws s3api create-bucket --bucket "$BUCKET" --create-bucket-configuration LocationConstraint="$AWS_REGION"
fi
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
aws s3api put-bucket-versioning --bucket "$BUCKET" --versioning-configuration Status=Enabled
aws s3api put-bucket-lifecycle-configuration --bucket "$BUCKET" --lifecycle-configuration \
  '{"Rules":[{"ID":"expire-old-backups","Status":"Enabled","Filter":{"Prefix":"sqlite/"},"Expiration":{"Days":30},"NoncurrentVersionExpiration":{"NoncurrentDays":30}}]}'
```

S3 encrypts new objects by default (SSE-S3), so there's nothing extra to set for that.

## A3. IAM role for the server

**Why:** the server gets short-lived credentials automatically, so no keys are ever stored on it. The role allows exactly two things:
1. **Session Manager**, so you can open a browser shell without SSH or an open port 22.
2. **Uploading backups.** It can't *read, list or delete* them, so even a hacked server can't wipe your backups. It can only read files you deliberately place in `restore/`, which is how you restore (C2).

```bash
aws iam create-role --role-name "$APP-server" --assume-role-policy-document \
  '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

aws iam attach-role-policy --role-name "$APP-server" \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore

aws iam put-role-policy --role-name "$APP-server" --policy-name backup-upload-only --policy-document \
  "{\"Version\":\"2012-10-17\",\"Statement\":[
     {\"Effect\":\"Allow\",\"Action\":\"s3:PutObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/sqlite/*\"},
     {\"Effect\":\"Allow\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/restore/*\"}]}"

aws iam create-instance-profile --instance-profile-name "$APP-server"
aws iam add-role-to-instance-profile --instance-profile-name "$APP-server" --role-name "$APP-server"
sleep 15   # a new instance profile takes a few seconds before EC2 can use it
```

## A4. Firewall (security group)

**Why:** only web traffic (80 and 443) is allowed in.
- Port 80 is needed to issue the HTTPS certificate and to redirect http→https.
- There's **no SSH port**, so there's nothing to brute-force.

```bash
VPC_ID=$(aws ec2 describe-vpcs --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)
echo "Default VPC: $VPC_ID"     # if this prints "None", create one: aws ec2 create-default-vpc

SG_ID=$(aws ec2 create-security-group --group-name "$APP-web" --vpc-id "$VPC_ID" \
  --description "HTTP and HTTPS for $APP" --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --ip-permissions \
  'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}],Ipv6Ranges=[{CidrIpv6=::/0}]' \
  'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}],Ipv6Ranges=[{CidrIpv6=::/0}]'
```

## A5. Launch the server

Every choice here is deliberate:
- **Ubuntu 24.04 on Arm (Graviton):** better price-performance, and every dependency of this app supports Arm.
- **IMDSv2 required:** blocks a common credential-theft attack (SSRF).
- **CPU credits `standard`:** `t4g` defaults to *unlimited*, which **silently bills extra** if the CPU stays busy. *Standard* slows down instead of charging.
- **Encrypted 20 GiB gp3 disk.**
- **Termination protection:** prevents one wrong click from deleting the server.
- **Volume tag `Backup=daily`:** the snapshot policy in A8 uses it.

```bash
AMI_ID=$(aws ssm get-parameter \
  --name /aws/service/canonical/ubuntu/server/24.04/stable/current/arm64/hvm/ebs-gp3/ami-id \
  --query Parameter.Value --output text)
SUBNET_ID=$(aws ec2 describe-subnets --filters Name=vpc-id,Values="$VPC_ID" Name=default-for-az,Values=true \
  --query 'Subnets[0].SubnetId' --output text)
echo "AMI=$AMI_ID Subnet=$SUBNET_ID"

INSTANCE_ID=$(aws ec2 run-instances \
  --image-id "$AMI_ID" --instance-type t4g.small \
  --subnet-id "$SUBNET_ID" --security-group-ids "$SG_ID" --associate-public-ip-address \
  --iam-instance-profile Name="$APP-server" \
  --metadata-options HttpTokens=required,HttpEndpoint=enabled \
  --credit-specification CpuCredits=standard \
  --disable-api-termination \
  --block-device-mappings 'DeviceName=/dev/sda1,Ebs={VolumeSize=20,VolumeType=gp3,Encrypted=true,DeleteOnTermination=true}' \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$APP-web}]" \
                       "ResourceType=volume,Tags=[{Key=Name,Value=$APP-web},{Key=Backup,Value=daily}]" \
  --query 'Instances[0].InstanceId' --output text)
echo "Instance: $INSTANCE_ID — waiting until it's healthy (2–4 min)…"
aws ec2 wait instance-status-ok --instance-ids "$INSTANCE_ID" && echo "Ready"
```

If you get **`InsufficientInstanceCapacity`**, AWS is temporarily out of `t4g.small` in that zone. Pick another default subnet (a different zone) and run it again.

## A6. Fixed public IP (Elastic IP)

**Why:** without this, the IP changes every time the server stops and starts, and your domain would break.

```bash
ALLOC_ID=$(aws ec2 allocate-address --domain vpc \
  --tag-specifications "ResourceType=elastic-ip,Tags=[{Key=Name,Value=$APP-web}]" \
  --query AllocationId --output text)
aws ec2 associate-address --instance-id "$INSTANCE_ID" --allocation-id "$ALLOC_ID"
PUBLIC_IP=$(aws ec2 describe-addresses --allocation-ids "$ALLOC_ID" --query 'Addresses[0].PublicIp' --output text)
echo "Public IP: $PUBLIC_IP"

# Save the IDs so a new terminal can reload them with:  source ~/cardynasty-aws.env
cat > ~/cardynasty-aws.env <<EOF
export AWS_REGION=$AWS_REGION MSYS_NO_PATHCONV=1
APP=$APP DOMAIN=$DOMAIN ALERT_EMAIL=$ALERT_EMAIL ACCOUNT_ID=$ACCOUNT_ID BUCKET=$BUCKET
VPC_ID=$VPC_ID SG_ID=$SG_ID INSTANCE_ID=$INSTANCE_ID ALLOC_ID=$ALLOC_ID PUBLIC_IP=$PUBLIC_IP
EOF
```

## A7. Point your domain at the server

**If your domain is at a registrar** (GoDaddy, Hostinger, Namecheap and so on), add two DNS records there:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | *your PUBLIC_IP* | 300 |
| A | `www` | *your PUBLIC_IP* | 300 |

**If your domain's DNS is in Route 53:**

```bash
ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name "$DOMAIN" --query 'HostedZones[0].Id' --output text)
aws route53 change-resource-record-sets --hosted-zone-id "$ZONE_ID" --change-batch \
  "{\"Changes\":[
    {\"Action\":\"UPSERT\",\"ResourceRecordSet\":{\"Name\":\"$DOMAIN\",\"Type\":\"A\",\"TTL\":300,\"ResourceRecords\":[{\"Value\":\"$PUBLIC_IP\"}]}},
    {\"Action\":\"UPSERT\",\"ResourceRecordSet\":{\"Name\":\"www.$DOMAIN\",\"Type\":\"A\",\"TTL\":300,\"ResourceRecords\":[{\"Value\":\"$PUBLIC_IP\"}]}}]}"
```

**Check it.** Repeat until both lines show your IP. This usually takes minutes, sometimes up to an hour.

```bash
nslookup "$DOMAIN"; nslookup "www.$DOMAIN"
```

## A8. Daily disk snapshots

**Why:** the S3 backup (C2) protects the *data*. A disk snapshot protects the *whole server* (OS, settings, Caddy), so you can rebuild in minutes. Snapshots run at 02:00 IST and the last 7 are kept.

```bash
aws dlm create-default-role --resource-type snapshot
DLM_ROLE_ARN=$(aws iam get-role --role-name AWSDataLifecycleManagerDefaultRole --query Role.Arn --output text)
aws dlm create-lifecycle-policy --description "$APP daily snapshots" --state ENABLED \
  --execution-role-arn "$DLM_ROLE_ARN" --policy-details \
  '{"PolicyType":"EBS_SNAPSHOT_MANAGEMENT","ResourceTypes":["VOLUME"],
    "TargetTags":[{"Key":"Backup","Value":"daily"}],
    "Schedules":[{"Name":"daily","CopyTags":true,
      "CreateRule":{"Interval":24,"IntervalUnit":"HOURS","Times":["20:30"]},
      "RetainRule":{"Count":7}}]}'
```

## A9. Alarms and a budget

**Why:** you hear about problems by email instead of from visitors.
- **Hardware failure:** the server is **moved to healthy hardware automatically**.
- **Frozen operating system:** it's **rebooted**.
- **CPU above 80%:** you get an email.
- **Spending above 80% of US$25/month:** you get an email.

```bash
TOPIC_ARN=$(aws sns create-topic --name "$APP-alerts" --query TopicArn --output text)
aws sns subscribe --topic-arn "$TOPIC_ARN" --protocol email --notification-endpoint "$ALERT_EMAIL"
echo "→ Open the email from AWS Notifications and click 'Confirm subscription'."

aws cloudwatch put-metric-alarm --alarm-name "$APP-auto-recover" \
  --namespace AWS/EC2 --metric-name StatusCheckFailed_System --dimensions Name=InstanceId,Value="$INSTANCE_ID" \
  --statistic Maximum --period 60 --evaluation-periods 2 --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold \
  --alarm-actions "arn:aws:automate:$AWS_REGION:ec2:recover" "$TOPIC_ARN"

aws cloudwatch put-metric-alarm --alarm-name "$APP-auto-reboot" \
  --namespace AWS/EC2 --metric-name StatusCheckFailed_Instance --dimensions Name=InstanceId,Value="$INSTANCE_ID" \
  --statistic Maximum --period 60 --evaluation-periods 3 --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold \
  --alarm-actions "arn:aws:automate:$AWS_REGION:ec2:reboot" "$TOPIC_ARN"

aws cloudwatch put-metric-alarm --alarm-name "$APP-high-cpu" \
  --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=InstanceId,Value="$INSTANCE_ID" \
  --statistic Average --period 300 --evaluation-periods 3 --threshold 80 --comparison-operator GreaterThanThreshold \
  --alarm-actions "$TOPIC_ARN"

aws budgets create-budget --account-id "$ACCOUNT_ID" \
  --budget '{"BudgetName":"cardynasty-monthly","BudgetLimit":{"Amount":"25","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}' \
  --notifications-with-subscribers "[{\"Notification\":{\"NotificationType\":\"ACTUAL\",\"ComparisonOperator\":\"GREATER_THAN\",\"Threshold\":80,\"ThresholdType\":\"PERCENTAGE\"},\"Subscribers\":[{\"SubscriptionType\":\"EMAIL\",\"Address\":\"$ALERT_EMAIL\"}]}]"
```

The budget is only an *alert*. Your project's **spend limit** in AWS Settings is what actually stops spending.

---

# Part B: On the server

## B1. Open a shell on the server

**Option 1 (easiest):** in the AWS console, go to **EC2 → Instances → `cardynasty-web` → Connect → Session Manager → Connect**. A terminal opens in your browser.

**Option 2 (from Git Bash):**
1. Install the [Session Manager plugin for Windows](https://s3.amazonaws.com/session-manager-downloads/plugin/latest/windows/SessionManagerPluginSetup.exe).
2. Reopen Git Bash, then run:

```bash
source ~/cardynasty-aws.env
aws ssm start-session --target "$INSTANCE_ID"
```

**If it says the instance isn't connected,** wait 2 minutes, then check it's registered:

```bash
aws ssm describe-instance-information --filters Key=InstanceIds,Values="$INSTANCE_ID" --query 'InstanceInformationList[0].PingStatus'
# → "Online"
```

## B2. Run the bootstrap (one command, ~10 minutes)

**Wait until DNS from A7 shows your IP** before this step, so the HTTPS certificate can be issued.

In the server shell, download the script, read it if you like, then run it. Replace the three values with your own: use the bucket name printed in A1.

```bash
curl -fsSL https://raw.githubusercontent.com/shubham075/car_dynasty/main/deploy/server-bootstrap.sh -o bootstrap.sh
less bootstrap.sh          # optional: read what it does (q to quit)

sudo DOMAIN=cardynasty.in NOTIFY_EMAIL=you@example.com BACKUP_BUCKET=cardynasty-backups-123456789012 \
     bash bootstrap.sh
```

What it does, step by step. It's safe to run again; finished steps are skipped.

| # | Step | Why |
|---|---|---|
| 1 | OS updates and build tools | Security patches; `better-sqlite3` compiles natively |
| 2 | AWS CLI | Uploads backups to S3 |
| 3 | Node.js 24 LTS | Same version as CI |
| 4 | Caddy | HTTPS with automatic Let's Encrypt certificates and renewal |
| 5 | 2 GiB swap | `next build` can exceed 2 GiB of RAM for a moment |
| 6 | `cardynasty` user, `/var/lib/cardynasty`, clone repo | The app runs without root rights; data lives outside the code folder |
| 7 | `/etc/cardynasty/app.env` (mode 640) | Settings and secrets, readable only by root and the app |
| 8 | systemd services and nightly backup timer, first build | Starts on boot, restarts if it crashes |
| 9 | Caddy config for your domain | Turns HTTPS on |

It ends with **"✓ Server ready."** Open `https://<your-domain>`. The first load takes a few extra seconds while the certificate is issued.

## B3. Create your admin login

Pick a strong password of at least 10 characters. You'll be asked to type it twice.

```bash
cd /opt/cardynasty/app && sudo -u cardynasty bash -c 'set -a; . /etc/cardynasty/app.env; set +a; npm run admin -- create you@example.com "Apoorva Shrivastava"'
```

Then sign in at `https://<your-domain>/admin`.

## B4. Turn on email alerts (optional)

Enquiries are saved either way. This only controls whether alert and auto-reply emails get sent.

**Option 1: Resend (simplest).**
1. Sign up at resend.com, verify your domain with the DNS records they give you, and create an API key.
2. Edit the settings file:

```bash
sudo nano /etc/cardynasty/app.env      # set: RESEND_API_KEY=re_...
sudo systemctl restart cardynasty
```

**Option 2: Amazon SES.** First check it's on your plan's supported-services list.
1. Verify your domain:

   ```bash
   aws sesv2 create-email-identity --email-identity "$DOMAIN" --query 'DkimAttributes.Tokens'
   ```

   It prints 3 tokens. For each token, add a CNAME record at your DNS provider:
   - **Name:** `<token>._domainkey.<your-domain>`
   - **Value:** `<token>.dkim.amazonses.com`
2. In the console, go to **SES → SMTP settings → Create SMTP credentials**.
3. Put these in `app.env`:
   - `SMTP_HOST=email-smtp.<region>.amazonaws.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=...`
   - `SMTP_PASS=...`
4. Run `sudo systemctl restart cardynasty`.
5. New SES projects start in a **sandbox** that can only send to verified addresses. That's enough for the owner's alerts. To send auto-replies to visitors, request **production access** in the SES console.

---

# Part C: Running it

## C1. Deploy an update

Push to `main` and wait for the GitHub Actions CI to pass, then **from your laptop** run:

```bash
source ~/cardynasty-aws.env
CMD_ID=$(aws ssm send-command --instance-ids "$INSTANCE_ID" --document-name AWS-RunShellScript \
  --comment "deploy" --parameters 'commands=["sudo -u cardynasty bash /opt/cardynasty/app/deploy/deploy.sh"]' \
  --query Command.CommandId --output text)
aws ssm wait command-executed --command-id "$CMD_ID" --instance-id "$INSTANCE_ID" || true
aws ssm get-command-invocation --command-id "$CMD_ID" --instance-id "$INSTANCE_ID" \
  --query '[Status,StandardOutputContent,StandardErrorContent]' --output text
```

Or, in a server shell:

```bash
sudo -u cardynasty bash /opt/cardynasty/app/deploy/deploy.sh
```

`deploy.sh` does the following, with only a few seconds of downtime during the restart:
1. backs up the database
2. resets to `origin/main`
3. runs `npm ci`
4. builds
5. restarts the app
6. checks that it responds

**To roll back:** revert the bad commit on GitHub (`git revert <sha>`, then push) and deploy again.

**To refresh YouTube content,** run this on the server, then deploy (the project pages are built at deploy time):

```bash
cd /opt/cardynasty/app && sudo -u cardynasty bash -c 'set -a; . /etc/cardynasty/app.env; set +a; npm run youtube:sync -- --apply'
```

## C2. Backups

**Run one now and check it uploaded.** On the server:

```bash
sudo systemctl start cardynasty-backup.service
journalctl -u cardynasty-backup -n 20 --no-pager      # ends with "Uploaded s3://…"
systemctl list-timers cardynasty-backup.timer          # next nightly run (02:30 IST)
```

**List the backups from your laptop:**

```bash
aws s3 ls "s3://$BUCKET/sqlite/"
```

**Restore a backup.** Practise this once, so you know it works.

1. **On your laptop,** stage the backup you want in the `restore/` folder (a copy inside S3, nothing is downloaded):

   ```bash
   aws s3 cp "s3://$BUCKET/sqlite/<file>.db.gz" "s3://$BUCKET/restore/latest.db.gz"
   ```

2. **On the server:**

   ```bash
   B=$(sudo grep ^BACKUP_BUCKET= /etc/cardynasty/app.env | cut -d= -f2)
   aws s3 cp "s3://$B/restore/latest.db.gz" /tmp/latest.db.gz
   # safety copy of the current DB first (kept in /var/lib/cardynasty/backups/)
   sudo -u cardynasty bash -c 'set -a; . /etc/cardynasty/app.env; set +a; cd /opt/cardynasty/app && node scripts/backup-db.mjs'
   sudo systemctl stop cardynasty
   gunzip -c /tmp/latest.db.gz | sudo -u cardynasty tee /var/lib/cardynasty/cms.db >/dev/null
   sudo rm -f /var/lib/cardynasty/cms.db-wal /var/lib/cardynasty/cms.db-shm /tmp/latest.db.gz
   sudo systemctl start cardynasty
   ```

3. **On your laptop,** clean up:

   ```bash
   aws s3 rm "s3://$BUCKET/restore/latest.db.gz"
   ```

**Why it works this way:** the server can only *add* backups and read the one file you stage. A compromised server can't delete or alter your backup history.

## C3. Logs and health

```bash
systemctl status cardynasty              # running?
journalctl -u cardynasty -f              # live app logs (Ctrl+C to stop)
sudo tail -f /var/log/caddy/access.log   # web requests
journalctl -u caddy -n 50 --no-pager     # certificate / HTTPS problems
df -h /  &&  free -h                     # disk and memory
```

## C4. Security checklist

- [ ] There's no port 22 in the security group. Shell access is through Session Manager only.
- [ ] IMDSv2 is required, the disk is encrypted, and termination protection is on.
- [ ] The app runs as `cardynasty`, only on 127.0.0.1, behind Caddy.
- [ ] `/etc/cardynasty/app.env` is mode 640, owned by `root:cardynasty`.
- [ ] The backup timer is active and you've tested a restore once.
- [ ] Ubuntu security updates install automatically. Check with `systemctl status unattended-upgrades`.
- [ ] You've confirmed the SNS email subscription.
- [ ] Your admin password is strong and unique.

**Optional upgrade:** keep the secret values in **SSM Parameter Store (SecureString)** instead of `app.env`. They're then encrypted at rest and every read is logged in CloudTrail.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `aws` commands say "Unable to locate credentials" | `aws login` again. Sessions last up to 12 hours |
| Sudden **Access Denied** on things that worked | Check your **spend limit** in AWS Settings → Billing |
| Paths like `C:/Program Files/Git/dev/sda1` in errors | You skipped `export MSYS_NO_PATHCONV=1` (A1) |
| Session Manager: instance "not connected" | Wait 2–3 min; check the role from A3 is attached: `aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].IamInstanceProfile'` |
| Browser shows a certificate error | DNS doesn't point at `$PUBLIC_IP` yet (`nslookup`), or ports 80/443 aren't open; check `journalctl -u caddy -n 50` |
| 502 Bad Gateway | The app is down: `journalctl -u cardynasty -n 100` |
| Build killed / out of memory | `swapon --show` should list `/swapfile`; otherwise resize to `t4g.medium` |
| Site unreachable after stop/start | The Elastic IP is still associated: `aws ec2 describe-addresses --allocation-ids $ALLOC_ID` |

## Removing everything (if you ever take the site down)

Download a final backup first. Then run these **in this order**, or something keeps billing:

```bash
source ~/cardynasty-aws.env
aws ec2 modify-instance-attribute --instance-id "$INSTANCE_ID" --no-disable-api-termination
aws ec2 terminate-instances --instance-ids "$INSTANCE_ID" && aws ec2 wait instance-terminated --instance-ids "$INSTANCE_ID"
aws ec2 release-address --allocation-id "$ALLOC_ID"            # Elastic IPs bill even when unused
aws cloudwatch delete-alarms --alarm-names "$APP-auto-recover" "$APP-auto-reboot" "$APP-high-cpu"
aws dlm get-lifecycle-policies --query 'Policies[].PolicyId'   # then: aws dlm delete-lifecycle-policy --policy-id <id>
aws ec2 describe-snapshots --owner-ids self --filters Name=tag:Name,Values="$APP-web" --query 'Snapshots[].SnapshotId'  # delete each
aws ec2 delete-security-group --group-id "$SG_ID"
aws iam remove-role-from-instance-profile --instance-profile-name "$APP-server" --role-name "$APP-server"
aws iam delete-instance-profile --instance-profile-name "$APP-server"
aws iam detach-role-policy --role-name "$APP-server" --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
aws iam delete-role-policy --role-name "$APP-server" --policy-name backup-upload-only
aws iam delete-role --role-name "$APP-server"
# Bucket last, after you have a local copy of the backups. Versioned buckets need every version removed (S3 console → Empty).
```
