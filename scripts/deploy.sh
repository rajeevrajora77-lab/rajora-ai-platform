#!/bin/bash

# Rajora AI Platform - Zero-Downtime Deployment Script
# Usage: ./scripts/deploy.sh [--strategy blue-green|canary]

set -e

STRATEGY="blue-green"
ENVIRONMENT="production"
REGION="us-east-1"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --strategy)
      STRATEGY="$2"
      shift 2
      ;;
    --environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo "====================================="
echo "Rajora AI Platform Deployment"
echo "====================================="
echo "Strategy: $STRATEGY"
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
echo "====================================="

# Build and push Docker images
echo "\n[1/5] Building Docker images..."
./scripts/build-and-push.sh

# Update task definitions
echo "\n[2/5] Updating ECS task definitions..."
IMAGE_TAG=$(git rev-parse --short HEAD)
ECR_REGISTRY=$(aws ecr describe-repositories --repository-names rajora-ai --query 'repositories[0].repositoryUri' --output text | cut -d'/' -f1)

aws ecs register-task-definition \
  --cli-input-json file://infrastructure/ecs/task-definition.json \
  --region $REGION

if [ "$STRATEGY" == "blue-green" ]; then
  echo "\n[3/5] Initiating Blue-Green deployment..."
  
  # Create CodeDeploy deployment
  DEPLOYMENT_ID=$(aws deploy create-deployment \
    --application-name rajora-ai-app \
    --deployment-group-name rajora-ai-dg-$ENVIRONMENT \
    --deployment-config-name CodeDeployDefault.ECSAllAtOnce \
    --description "Blue-Green deployment of $IMAGE_TAG" \
    --region $REGION \
    --query 'deploymentId' \
    --output text)
  
  echo "Deployment ID: $DEPLOYMENT_ID"
  
  echo "\n[4/5] Waiting for deployment to complete..."
  aws deploy wait deployment-successful --deployment-id $DEPLOYMENT_ID --region $REGION
  
  echo "\n[5/5] Deployment completed successfully!"
  
elif [ "$STRATEGY" == "canary" ]; then
  echo "\n[3/5] Initiating Canary deployment..."
  
  # Canary deployment with 10% traffic shift, then 5 minute bake time
  DEPLOYMENT_ID=$(aws deploy create-deployment \
    --application-name rajora-ai-app \
    --deployment-group-name rajora-ai-dg-$ENVIRONMENT \
    --deployment-config-name CodeDeployDefault.ECSCanary10Percent5Minutes \
    --description "Canary deployment of $IMAGE_TAG" \
    --region $REGION \
    --query 'deploymentId' \
    --output text)
  
  echo "Deployment ID: $DEPLOYMENT_ID"
  echo "Traffic routing: 10% -> wait 5min -> 100%"
  
  echo "\n[4/5] Monitoring canary deployment..."
  aws deploy wait deployment-successful --deployment-id $DEPLOYMENT_ID --region $REGION
  
  echo "\n[5/5] Canary deployment completed successfully!"
fi

# Health check
echo "\n[Post-Deploy] Running health checks..."
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names rajora-ai-alb-$ENVIRONMENT \
  --query 'LoadBalancers[0].DNSName' \
  --output text \
  --region $REGION)

for i in {1..10}; do
  if curl -f https://$ALB_DNS/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
    break
  fi
  echo "Attempt $i/10 - waiting for health check..."
  sleep 5
done

echo "\n✨ Deployment complete!"
echo "Application URL: https://$ALB_DNS"