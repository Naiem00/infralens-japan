resource "random_password" "jwt_secret" {
  length  = 48
  special = true
}

resource "aws_secretsmanager_secret" "jwt" {
  name_prefix = "infralens-${var.environment}-jwt-"

  tags = {
    Name = "infralens-${var.environment}-jwt"
  }
}

resource "aws_secretsmanager_secret_version" "jwt" {
  secret_id     = aws_secretsmanager_secret.jwt.id
  secret_string = random_password.jwt_secret.result
}

resource "aws_iam_role_policy" "ecs_execution_secrets" {
  name = "infralens-${var.environment}-ecs-secrets"
  role = aws_iam_role.ecs_execution.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "secretsmanager:GetSecretValue"
        ]

        Resource = [
          aws_secretsmanager_secret.jwt.arn,
          aws_db_instance.main.master_user_secret[0].secret_arn
        ]
      }
    ]
  })
}
