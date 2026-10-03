# Production Readiness Review

## Status

InfraLens Japan is not yet deployed to production.

Terraform configuration is currently validation-ready only.

## Ready

- [x] Frontend production build works
- [x] Backend verification scripts pass
- [x] Terraform formatting passes
- [x] Terraform validation passes
- [x] S3 + CloudFront infrastructure defined
- [x] ECS + ALB infrastructure defined
- [x] RDS infrastructure defined
- [x] CloudWatch alarms defined
- [x] GitHub Actions CI defined
- [x] GitHub OIDC plan workflow defined

## Must complete before AWS apply

- [ ] Configure AWS CLI/account identity
- [ ] Configure GitHub OIDC IAM provider and deployment role
- [ ] Configure persistent Terraform remote state
- [ ] Review terraform plan
- [ ] Review expected AWS cost
- [ ] Add backend Dockerfile and verify image build
- [ ] Configure DATABASE_URL securely
- [ ] Configure JWT_SECRET securely
- [ ] Remove production reliance on development JWT fallback
- [ ] Review database credential handling
- [ ] Configure HTTPS / ACM
- [ ] Configure frontend API URL for production
- [ ] Configure backend allowed frontend origin
- [ ] Review ECS subnet/public-IP strategy
- [ ] Review IAM least privilege
- [ ] Review deletion protection and backup policy

## Known development compromises

### ECS network placement

The current ECS design uses public subnets and public IPs because no NAT Gateway
is provisioned.

Inbound backend traffic is restricted to the Application Load Balancer security group.

### Database credentials

Terraform currently receives a database password through a sensitive variable.

Sensitive Terraform variables can still exist inside Terraform state, so state
security must be addressed before deployment.

### HTTPS

The current Application Load Balancer listener is HTTP-only.

HTTPS using AWS Certificate Manager should be configured for production.

### Terraform state

The current workflow initializes Terraform without a persistent remote backend.

Terraform apply must not be enabled in ephemeral GitHub runners until persistent
state is configured.
