resource "aws_db_subnet_group" "main" {
  name = "infralens-${var.environment}"

  subnet_ids = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id,
  ]

  tags = {
    Name = "infralens-${var.environment}-db-subnets"
  }
}

resource "aws_security_group" "database" {
  name        = "infralens-${var.environment}-database"
  description = "PostgreSQL access from backend ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "PostgreSQL from ECS backend"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"

    security_groups = [
      aws_security_group.backend.id,
    ]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"

    cidr_blocks = [
      "0.0.0.0/0",
    ]
  }
}

resource "aws_db_instance" "main" {
  identifier = "infralens-${var.environment}"

  engine         = "postgres"
  engine_version = var.postgres_engine_version

  instance_class        = var.db_instance_class
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage

  storage_type      = "gp3"
  storage_encrypted = true

  db_name                     = var.db_name
  username                    = var.db_username
  manage_master_user_password = true
  port                        = 5432

  db_subnet_group_name = aws_db_subnet_group.main.name

  vpc_security_group_ids = [
    aws_security_group.database.id,
  ]

  publicly_accessible = false
  multi_az            = var.db_multi_az

  backup_retention_period = var.db_backup_retention_days

  deletion_protection = var.environment == "prod"

  skip_final_snapshot = var.environment != "prod"

  apply_immediately = var.environment != "prod"

  tags = {
    Name = "infralens-${var.environment}-postgres"
  }
}
