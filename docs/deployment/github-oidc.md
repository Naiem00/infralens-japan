# GitHub Actions OIDC Deployment

InfraLens Japan uses GitHub Actions OIDC federation for AWS deployment.

## Why OIDC

The workflow does not store long-lived AWS access keys in GitHub.

GitHub Actions obtains short-lived AWS credentials by assuming an IAM role through OIDC.

## Required GitHub configuration

Repository variable:

`AWS_DEPLOY_ROLE_ARN`

Repository secret:

`DB_PASSWORD`

Never commit database credentials to the repository.

## Current workflow

`.github/workflows/deploy.yml`

The current workflow is manual-only and performs:

1. AWS OIDC authentication
2. Terraform formatting validation
3. Terraform initialization
4. Terraform validation
5. Terraform plan

## Apply policy

Terraform apply is intentionally NOT enabled yet.

Before apply is enabled, the project must have:

- reviewed AWS costs
- secure production secrets
- a persistent Terraform remote state strategy
- completed production readiness review
- reviewed `terraform plan`

Actual AWS deployment is reserved for Day 30.

## Current status

AWS OIDC trust and the deployment IAM role are not configured yet.

Committing this workflow does not create AWS resources.
