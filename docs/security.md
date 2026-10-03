# Security Notes

## Implemented controls

InfraLens Japan currently includes or plans for:

- private RDS networking
- encrypted RDS storage
- encrypted S3 storage
- S3 public-access blocking
- CloudFront Origin Access Control
- ECS task and execution IAM roles
- ECR image scanning
- security-group separation
- GitHub Actions OIDC
- no long-lived AWS credentials in GitHub

## Production items still requiring review

Before production deployment:

- replace development JWT secret fallback with a secure secret
- securely inject DATABASE_URL and JWT_SECRET into ECS
- review database password handling
- enable HTTPS using ACM on the Application Load Balancer
- review Terraform remote state security
- review IAM permissions for least privilege
- verify CloudWatch retention and alarms
- review ECS network placement
