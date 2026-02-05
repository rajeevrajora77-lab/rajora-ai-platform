# 🚀 Deployment Guide

## AWS Production Deployment

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Terraform** >= 1.0
4. **Docker** installed locally
5. **Domain name** (optional, for custom domain)

### Step 1: Infrastructure Setup

```bash
# Navigate to Terraform directory
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Review infrastructure plan
terraform plan -var="environment=production"

# Apply infrastructure
terraform apply -var="environment=production"
```

This creates:
- VPC with public/private subnets
- ECS Fargate cluster
- RDS Aurora PostgreSQL
- ElastiCache Redis
- Application Load Balancer
- CloudFront CDN
- WAF for security
- Secrets Manager

### Step 2: Configure Secrets

```bash
# Store database credentials
aws secretsmanager create-secret \
  --name rajora-ai/db-url \
  --secret-string "postgresql://user:pass@host:5432/rajora_ai"

# Store Redis URL
aws secretsmanager create-secret \
  --name rajora-ai/redis-url \
  --secret-string "redis://redis-host:6379/0"

# Store application secret key
aws secretsmanager create-secret \
  --name rajora-ai/app-secret \
  --secret-string "$(openssl rand -base64 32)"
```

### Step 3: Build and Push Docker Images

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Build and push to ECR
./scripts/build-and-push.sh
```

### Step 4: Deploy Application

#### Option A: Blue-Green Deployment (Zero Downtime)

```bash
./scripts/deploy.sh --strategy blue-green --environment production
```

**How it works:**
1. Deploys new version (Green) alongside current (Blue)
2. Routes traffic to Green
3. Health checks validate Green
4. Switches 100% traffic to Green
5. Terminates Blue environment

#### Option B: Canary Deployment (Gradual Rollout)

```bash
./scripts/deploy.sh --strategy canary --environment production
```

**Traffic routing:**
1. 10% traffic to new version
2. Monitor for 5 minutes
3. If healthy, route 100% traffic
4. Auto-rollback on failures

### Step 5: Configure DNS

```bash
# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names rajora-ai-alb-production \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

echo "ALB DNS: $ALB_DNS"
```

Create CNAME record:
```
api.rajora.ai -> $ALB_DNS
```

### Step 6: SSL Certificate

```bash
# Request certificate in ACM
aws acm request-certificate \
  --domain-name api.rajora.ai \
  --validation-method DNS \
  --region us-east-1

# Follow DNS validation steps
```

## CI/CD with GitHub Actions

Every push to `main` branch:
1. ✅ Runs tests (pytest + coverage)
2. ✅ Lints code (ESLint + TypeScript)
3. ✅ Builds Docker images
4. ✅ Pushes to ECR
5. ✅ Deploys to ECS with blue-green
6. ✅ Runs health checks
7. ✅ Auto-rollback on failure

### Required GitHub Secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

## Monitoring

### CloudWatch Logs

```bash
# View API logs
aws logs tail /ecs/rajora-api-production --follow

# View error logs
aws logs filter-pattern /ecs/rajora-api-production --filter-pattern "ERROR"
```

### Metrics Dashboard

Access CloudWatch Dashboard:
- ECS CPU/Memory utilization
- API latency (p50, p95, p99)
- Request rate
- Error rate
- Database connections

### Alarms

Configured alarms:
- High CPU (> 80%)
- High memory (> 85%)
- Error rate (> 1%)
- Database connections (> 90%)
- API latency p99 (> 500ms)

## Scaling

### Auto-scaling Configuration

```hcl
# CPU-based scaling
target_value = 70.0  # Scale at 70% CPU
min_capacity = 2
max_capacity = 10

# Memory-based scaling
target_value = 80.0  # Scale at 80% memory
```

### Manual Scaling

```bash
# Scale to specific count
aws ecs update-service \
  --cluster rajora-ai-production \
  --service rajora-api-production \
  --desired-count 5
```

## Disaster Recovery

### Database Backups

- **Automated:** Daily snapshots retained for 7 days
- **Point-in-time recovery:** Up to 5 minutes

```bash
# Manual backup
aws rds create-db-snapshot \
  --db-instance-identifier rajora-ai-db \
  --db-snapshot-identifier rajora-ai-manual-backup-$(date +%Y%m%d)
```

### Restore from Backup

```bash
# List snapshots
aws rds describe-db-snapshots \
  --db-instance-identifier rajora-ai-db

# Restore
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier rajora-ai-db-restored \
  --db-snapshot-identifier <snapshot-id>
```

## Cost Optimization

### Estimated Monthly Costs (Production)

| Service | Configuration | Monthly Cost |
|---------|--------------|-------------|
| ECS Fargate | 2-10 tasks (2 vCPU, 4GB) | $150-750 |
| RDS Aurora | db.r6g.large (2 instances) | $400 |
| ElastiCache | cache.r6g.large | $200 |
| ALB | Standard | $20 |
| CloudFront | 1TB transfer | $85 |
| **Total** | | **$855-1,455/month** |

### Cost Savings Tips

1. **Use Spot instances** for non-critical workloads
2. **Reserved instances** for predictable load (save 40%)
3. **Auto-scaling** to scale down during off-peak
4. **S3 lifecycle policies** for old logs
5. **CloudFront caching** to reduce ALB traffic

## Troubleshooting

### Deployment Failures

```bash
# Check deployment status
aws deploy get-deployment --deployment-id <id>

# View ECS service events
aws ecs describe-services \
  --cluster rajora-ai-production \
  --services rajora-api-production

# Check task health
aws ecs list-tasks \
  --cluster rajora-ai-production \
  --service-name rajora-api-production
```

### Rollback

```bash
# Automatic rollback on health check failures
# Manual rollback to previous task definition
aws ecs update-service \
  --cluster rajora-ai-production \
  --service rajora-api-production \
  --task-definition rajora-api-production:<previous-revision>
```

### Database Connection Issues

```bash
# Test database connectivity from ECS task
aws ecs execute-command \
  --cluster rajora-ai-production \
  --task <task-id> \
  --container api \
  --interactive \
  --command "/bin/bash"

# Inside container:
psql $DATABASE_URL -c "SELECT version();"
```

## Security Checklist

- [ ] Secrets stored in AWS Secrets Manager
- [ ] IAM roles with least privilege
- [ ] VPC with private subnets for database
- [ ] Security groups restrict access
- [ ] WAF rules enabled
- [ ] CloudTrail audit logging enabled
- [ ] Encryption at rest (RDS, ElastiCache)
- [ ] Encryption in transit (TLS 1.3)
- [ ] Regular security updates
- [ ] Vulnerability scanning

## Support

For deployment issues:
- 📧 Email: devops@rajora.ai
- 💬 Discord: [Join DevOps channel](https://discord.gg/rajora-ai)
- 🐛 Issues: [GitHub Issues](https://github.com/rajeevrajora77-lab/rajora-ai-platform/issues)