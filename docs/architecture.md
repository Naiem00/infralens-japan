# InfraLens Japan Architecture

## Overview

InfraLens Japan is a bilingual AWS architecture assessment and learning platform.

The project consists of:

- React + Vite frontend
- Node.js + Express backend
- PostgreSQL database
- Terraform-managed AWS infrastructure
- GitHub Actions CI
- OIDC-based AWS authentication for deployment workflows

## Frontend

The frontend provides:

- Dashboard
- Architecture Analyzer
- Deterministic scoring
- Recommendations
- Architecture visualization
- Failure simulation
- AWS service comparison
- Cost calculator
- Production readiness checks

The production hosting design uses:

- Amazon S3
- Amazon CloudFront
- Origin Access Control

## Backend

The backend uses:

- Node.js
- Express
- PostgreSQL
- JWT authentication

The AWS hosting design uses:

- Amazon ECR
- Amazon ECS Fargate
- Application Load Balancer
- CloudWatch Logs

## Database

PostgreSQL is designed to run on Amazon RDS.

The database is placed in private subnets and accepts PostgreSQL traffic only from
the backend security group.

## Networking

The Terraform network contains:

- one VPC
- two public subnets
- two private subnets
- Internet Gateway
- public and private route tables

The current development design intentionally avoids a NAT Gateway to reduce cost.

## Deployment status

Infrastructure code is validated but has not yet been applied to AWS.

Actual deployment is reserved for the final deployment phase.
