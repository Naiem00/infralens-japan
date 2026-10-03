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


variable "frontend_origin" {
  description = "Allowed frontend origin for the backend API."
  type        = string
  default     = "http://localhost:5173"
}

variable "backend_cpu" {
  description = "Fargate task CPU units."
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Fargate task memory in MiB."
  type        = number
  default     = 512
}

variable "backend_desired_count" {
  description = "Number of backend ECS tasks."
  type        = number
  default     = 1
}

variable "postgres_engine_version" {
  description = "PostgreSQL major engine version."
  type        = string
  default     = "16"
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  description = "Initial RDS storage in GiB."
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum autoscaled RDS storage in GiB."
  type        = number
  default     = 100
}

variable "db_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "infralens"
}

variable "db_username" {
  description = "PostgreSQL master username."
  type        = string
  default     = "infralens_admin"
}


variable "db_multi_az" {
  description = "Whether RDS Multi-AZ is enabled."
  type        = bool
  default     = false
}

variable "db_backup_retention_days" {
  description = "RDS automated backup retention in days."
  type        = number
  default     = 0
}
