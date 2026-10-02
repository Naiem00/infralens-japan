# InfraLens Japan Terraform

Terraform configuration for the InfraLens Japan portfolio project.

## Implemented foundations

### Day 20 — Networking
- VPC
- 2 public subnets across Availability Zones
- 2 private subnets across Availability Zones
- Internet Gateway
- Public and private route tables

### Day 21 — Frontend hosting
- Private Amazon S3 bucket
- S3 public access block
- Server-side encryption
- Amazon CloudFront
- Origin Access Control (OAC)
- SPA fallback to `index.html`

### Day 22 — Backend hosting
- Amazon ECR repository
- Amazon ECS cluster
- AWS Fargate task definition
- Application Load Balancer
- ECS service and security groups
- CloudWatch application log group

### Day 23 — Database
- Amazon RDS for PostgreSQL
- Private DB subnet group
- Encrypted storage
- ECS-only PostgreSQL ingress
- Automated backups
- Optional Multi-AZ setting

### Day 24 — Monitoring and security baseline
- ECS Container Insights
- CloudWatch log retention
- ECS CPU alarm
- RDS CPU alarm
- RDS free-storage alarm
- Private RDS
- Encrypted S3 and RDS
- ECR image scanning
- Dedicated ECS IAM roles

## Deployment status

The infrastructure is currently **deployment-ready only**.

Do not run `terraform apply` until:

1. AWS authentication is configured.
2. `terraform plan` has been reviewed.
3. Expected AWS costs have been reviewed.
4. A secure value for `db_password` has been supplied.

No real AWS resources are required for `terraform fmt`, `terraform init`, or `terraform validate`.
