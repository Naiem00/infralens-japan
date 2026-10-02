# InfraLens Japan Terraform

Day 20 introduces the networking foundation:

- VPC
- 2 public subnets across Availability Zones
- 2 private subnets across Availability Zones
- Internet Gateway
- Public route table
- Private route table
- Terraform outputs

No NAT Gateway is created in Day 20 to avoid unnecessary development cost.

Do not run `terraform apply` until AWS credentials and cost implications have been reviewed.
