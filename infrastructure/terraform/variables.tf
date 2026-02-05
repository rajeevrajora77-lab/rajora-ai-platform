variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "app_image" {
  description = "Docker image for application"
  type        = string
}

variable "llm_image" {
  description = "Docker image for LLM service"
  type        = string
}

variable "admin_image" {
  description = "Docker image for admin panel"
  type        = string
}