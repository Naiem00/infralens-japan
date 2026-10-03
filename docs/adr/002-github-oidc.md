# ADR 002: Use GitHub Actions OIDC for AWS Authentication

## Status

Accepted

## Context

CI/CD requires AWS authentication.

Long-lived AWS access keys stored in GitHub secrets increase credential-management
risk.

## Decision

Use GitHub Actions OIDC to assume an AWS IAM role.

## Consequences

- no long-lived AWS access keys are stored in GitHub
- the AWS trust policy must restrict access to the intended repository
- an IAM deployment role must be bootstrapped before deployment
