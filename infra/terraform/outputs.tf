output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id,
  ]
}

output "private_subnet_ids" {
  value = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id,
  ]
}


output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.id
}

output "frontend_cloudfront_domain" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "backend_ecr_repository_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "backend_alb_dns_name" {
  value = aws_lb.backend.dns_name
}

output "database_endpoint" {
  value     = aws_db_instance.main.endpoint
  sensitive = true
}
