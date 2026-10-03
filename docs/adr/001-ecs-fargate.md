# ADR 001: Use ECS Fargate for Backend Hosting

## Status

Accepted

## Context

InfraLens Japan requires a deployable backend architecture without managing EC2
instances directly.

## Decision

Use Amazon ECS with AWS Fargate.

## Reasons

- removes EC2 operating-system management
- demonstrates container-based AWS architecture
- integrates with ECR, ALB and CloudWatch
- appropriate for a cloud infrastructure portfolio project

## Trade-offs

Fargate can cost more than a small EC2 instance for continuously running workloads.

The current configuration is intended primarily for learning and portfolio use.
