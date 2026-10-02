variable "aws_region" {
  description = "AWS region for InfraLens Japan."
  type        = string
  default     = "ap-northeast-1"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.20.0.0/16"
}
