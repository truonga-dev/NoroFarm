# Jenkins + AWS deployment guide

This guide deploys NoroFarm to one Ubuntu EC2 instance with Docker Compose. Jenkins builds the frontend and backend images, scans them, pushes them to Amazon ECR, then connects to EC2 over SSH and starts the release.

Region used by the repository: `ap-southeast-1` (Singapore).

## 1. What is included

- `docker-compose.jenkins.yml`: local/dedicated Jenkins service.
- `jenkins/Dockerfile`: Jenkins LTS with Docker CLI, Compose, AWS CLI v2 and SSH.
- `jenkins/plugins.txt`: all plugins required by `Jenkinsfile`.
- `infra/aws/ec2-compose.yml`: ECR, EC2, Elastic IP, security group and least-privilege IAM policies.
- `docker-compose.prod.yml`: immutable release tags from ECR.
- `scripts/aws/validate-production-env.sh`: blocks deployment when required production values are missing or still placeholders.
- `nginx/nginx.ssl.conf`: HTTPS configuration activated after DNS and Let's Encrypt are ready.

## 2. Start Jenkins on Docker Desktop

The old `T_Jenkins` container uses port 8080 and must be stopped first. Stopping it does not delete its anonymous data volume.

```powershell
docker stop T_Jenkins
docker compose -f docker-compose.jenkins.yml build
docker compose -f docker-compose.jenkins.yml up -d
docker compose -f docker-compose.jenkins.yml ps
```

Open <http://localhost:8080>. Obtain the one-time password with:

```powershell
docker exec norofarm_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Create the first administrator. The custom image has already installed the required plugins.

Verify tools inside Jenkins:

```powershell
docker exec norofarm_jenkins docker version
docker exec norofarm_jenkins docker compose version
docker exec norofarm_jenkins aws --version
docker exec norofarm_jenkins git --version
```

The Docker socket grants Jenkins root-equivalent access to the Docker host. Run this setup only on a dedicated CI machine or a trusted developer machine.

## 3. Install and authenticate AWS CLI on Windows

Install AWS CLI v2, restart PowerShell, then configure a bootstrap/admin profile:

```powershell
winget install --exact --id Amazon.AWSCLI
aws configure --profile norofarm-admin
aws sts get-caller-identity --profile norofarm-admin
```

Use an administrator only to create the initial stack and Jenkins IAM user. Jenkins itself receives the narrower ECR push policy created by CloudFormation.

## 4. Prepare AWS inputs

Create or select:

1. An EC2 key pair in `ap-southeast-1`. Download its PEM file once and store it securely.
2. A VPC.
3. A public subnet whose route table points `0.0.0.0/0` to an Internet Gateway.
4. The public CIDR of the Jenkins machine, normally one address such as `203.0.113.10/32`.

You can list existing choices:

```powershell
aws ec2 describe-key-pairs --region ap-southeast-1 --profile norofarm-admin --query "KeyPairs[].KeyName"
aws ec2 describe-vpcs --region ap-southeast-1 --profile norofarm-admin --query "Vpcs[].{Id:VpcId,Default:IsDefault}"
aws ec2 describe-subnets --region ap-southeast-1 --profile norofarm-admin --query "Subnets[].{Id:SubnetId,Vpc:VpcId,AZ:AvailabilityZone,PublicIp:MapPublicIpOnLaunch}"
```

## 5. Create ECR and EC2 with CloudFormation

Replace the four parameter values below:

```powershell
aws cloudformation deploy `
  --stack-name norofarm-production `
  --template-file infra/aws/ec2-compose.yml `
  --region ap-southeast-1 `
  --profile norofarm-admin `
  --capabilities CAPABILITY_NAMED_IAM `
  --parameter-overrides `
    KeyName=YOUR_EC2_KEY_NAME `
    VpcId=vpc-xxxxxxxx `
    SubnetId=subnet-xxxxxxxx `
    AllowedSshCidr=YOUR_PUBLIC_IP/32
```

Read the outputs:

```powershell
aws cloudformation describe-stacks `
  --stack-name norofarm-production `
  --region ap-southeast-1 `
  --profile norofarm-admin `
  --query "Stacks[0].Outputs" `
  --output table
```

Save these output values:

- `ElasticIp` becomes the Jenkins credential `EC2_PRODUCTION_IP`.
- `JenkinsPolicyArn` is attached to the Jenkins IAM user.
- Both repository URIs should end in `norofarm-backend` and `norofarm-frontend`.

The EC2 instance receives an instance role that can only pull the two ECR repositories. No static AWS key is stored on EC2.

## 6. Create the restricted Jenkins IAM user

```powershell
$PolicyArn = aws cloudformation describe-stacks `
  --stack-name norofarm-production `
  --region ap-southeast-1 `
  --profile norofarm-admin `
  --query "Stacks[0].Outputs[?OutputKey=='JenkinsPolicyArn'].OutputValue" `
  --output text

aws iam create-user --user-name norofarm-jenkins --profile norofarm-admin
aws iam attach-user-policy --user-name norofarm-jenkins --policy-arn $PolicyArn --profile norofarm-admin
aws iam create-access-key --user-name norofarm-jenkins --profile norofarm-admin
```

The last command displays the access key ID and secret exactly once. Put them directly into Jenkins and do not save them in this repository, chat, screenshots or `.env` files.

## 7. Add Jenkins credentials

Open **Manage Jenkins → Credentials → System → Global credentials → Add Credentials**.

| ID | Kind | Value |
|---|---|---|
| `AWS_ACCOUNT_ID` | Secret text | The 12-digit AWS account ID |
| `aws-ecr-credentials` | AWS Credentials | Access key and secret for `norofarm-jenkins` |
| `NEXT_PUBLIC_SUPABASE_URL` | Secret text | Public Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Secret text | Public Supabase anonymous key |
| `EC2_PRODUCTION_IP` | Secret text | CloudFormation `ElasticIp` output |
| `ec2-ssh-key` | SSH Username with private key | Username `ubuntu`, private key from the EC2 key pair PEM |

Only add `EC2_STAGING_IP` when a separate staging server exists.

## 8. Prepare production configuration on EC2

Wait for the instance user-data script to finish, then copy the templates. Replace the IP and PEM path:

```powershell
scp -i C:\secure\norofarm-prod.pem .env.production.example ubuntu@EC2_IP:/opt/norofarm/.env.production
scp -i C:\secure\norofarm-prod.pem deploy.env.example ubuntu@EC2_IP:/opt/norofarm/.env
scp -i C:\secure\norofarm-prod.pem scripts/aws/validate-production-env.sh ubuntu@EC2_IP:/opt/norofarm/validate-production-env.sh
ssh -i C:\secure\norofarm-prod.pem ubuntu@EC2_IP
```

On EC2:

```bash
cd /opt/norofarm
nano .env.production
nano .env
chmod 600 .env.production .env
chmod 700 validate-production-env.sh
./validate-production-env.sh .env.production
docker --version
docker compose version
aws sts get-caller-identity
```

In `.env`, replace the sample account number in `ECR_REGISTRY`. In `.env.production`, replace every placeholder. Generate the application secret with:

```bash
openssl rand -hex 64
```

The database URL should use a production Supabase pooler or production RDS database, never the developer database.

## 9. Create the Jenkins pipeline job

1. Select **New Item → Pipeline** and name it `NoroFarm-Production-Pipeline`.
2. Under **Pipeline**, select **Pipeline script from SCM**.
3. SCM: **Git**.
4. Repository URL: `https://github.com/truongopa-dev/NoroFarm.git`.
5. Branch specifier: `*/main`.
6. Script path: `Jenkinsfile`.
7. Save.

Run the first build with:

- `DEPLOY_ENV=production`
- `RUN_TESTS=true`
- `SECURITY_SCAN=true`
- `PUSH_TO_ECR=true`
- `DEPLOY_TO_AWS=false`

This validates, builds, scans and pushes without touching EC2. If it succeeds, run again with `DEPLOY_TO_AWS=true`.

Verify on EC2:

```bash
cd /opt/norofarm
docker compose ps
docker compose logs --tail=100 backend frontend nginx
curl -f http://127.0.0.1/api/v1/health
```

## 10. DNS and HTTPS

Create these DNS records pointing to the CloudFormation `ElasticIp`:

- `norofarm.com` → A record
- `www.norofarm.com` → A or CNAME record
- `api.norofarm.com` → A record

After DNS resolves, issue the certificate on EC2. This briefly stops Nginx so Certbot can bind port 80:

```bash
cd /opt/norofarm
docker compose stop nginx
docker run --rm -p 80:80 \
  -v norofarm_certbot_etc:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  --email admin@norofarm.com --agree-tos --no-eff-email \
  -d norofarm.com -d www.norofarm.com -d api.norofarm.com
cp nginx/nginx.ssl.conf nginx/active.conf
docker compose up -d nginx
curl -f https://api.norofarm.com/api/v1/health
```

Test renewal without changing the certificate:

```bash
docker run --rm \
  -v norofarm_certbot_etc:/etc/letsencrypt \
  certbot/certbot renew --dry-run
```

Configure a systemd timer or cron job to run renewal periodically and reload `norofarm_nginx` after a successful renewal.

## 11. Routine deployment and rollback

Each build uses an immutable tag: `<Jenkins build number>-<Git SHA>`. `latest` is also pushed for convenience, but production deploys the immutable tag.

To roll back, choose a known tag from ECR and run on EC2:

```bash
cd /opt/norofarm
IMAGE_TAG=KNOWN_GOOD_TAG docker compose pull
IMAGE_TAG=KNOWN_GOOD_TAG docker compose up -d
```

Then update `/opt/norofarm/.env` with that tag if it should remain the manual default.

## 12. Common failures

- **Docker permission denied in Jenkins:** confirm `/var/run/docker.sock` is mounted and the Jenkins Compose service runs as root.
- **Credential not found:** the Jenkins credential ID must match the table exactly, including capitalization.
- **ECR 403:** confirm `aws sts get-caller-identity` succeeds inside Jenkins and the managed policy is attached to the correct IAM user.
- **EC2 cannot pull ECR:** confirm the instance has the `norofarm-ec2-ecr-pull` role and can reach the internet.
- **SSH timeout:** restrict port 22 to the actual public IP of the Jenkins host; update the security group when that IP changes.
- **Production env validation fails:** edit `/opt/norofarm/.env.production`; do not weaken or bypass the validator.
- **Nginx fails after enabling TLS:** confirm the certificate exists in the `norofarm_certbot_etc` volume and its primary name is `norofarm.com`.
