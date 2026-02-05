#!/bin/bash

# Build and push Docker images to ECR

set -e

REGION="us-east-1"
REPOSITORY="rajora-ai"
IMAGE_TAG=$(git rev-parse --short HEAD)

echo "Building Docker images..."
echo "Image tag: $IMAGE_TAG"

# Login to ECR
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin \
  $(aws ecr describe-repositories --repository-names $REPOSITORY --query 'repositories[0].repositoryUri' --output text | cut -d'/' -f1)

ECR_REGISTRY=$(aws ecr describe-repositories --repository-names $REPOSITORY --query 'repositories[0].repositoryUri' --output text | cut -d'/' -f1)

# Build API image
echo "\nBuilding API image..."
docker build -t $ECR_REGISTRY/$REPOSITORY:api-$IMAGE_TAG -f infrastructure/docker/Dockerfile.api .
docker tag $ECR_REGISTRY/$REPOSITORY:api-$IMAGE_TAG $ECR_REGISTRY/$REPOSITORY:api-latest

# Build Frontend image
echo "\nBuilding Frontend image..."
docker build -t $ECR_REGISTRY/$REPOSITORY:frontend-$IMAGE_TAG -f infrastructure/docker/Dockerfile.frontend .
docker tag $ECR_REGISTRY/$REPOSITORY:frontend-$IMAGE_TAG $ECR_REGISTRY/$REPOSITORY:frontend-latest

# Push images
echo "\nPushing images to ECR..."
docker push $ECR_REGISTRY/$REPOSITORY:api-$IMAGE_TAG
docker push $ECR_REGISTRY/$REPOSITORY:api-latest
docker push $ECR_REGISTRY/$REPOSITORY:frontend-$IMAGE_TAG
docker push $ECR_REGISTRY/$REPOSITORY:frontend-latest

echo "\n✅ Images pushed successfully!"
echo "API: $ECR_REGISTRY/$REPOSITORY:api-$IMAGE_TAG"
echo "Frontend: $ECR_REGISTRY/$REPOSITORY:frontend-$IMAGE_TAG"