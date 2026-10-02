resource "aws_cloudwatch_metric_alarm" "backend_cpu_high" {
  alarm_name          = "infralens-${var.environment}-backend-cpu-high"
  alarm_description   = "Backend ECS CPU utilization is high."
  comparison_operator = "GreaterThanThreshold"

  evaluation_periods = 2
  period             = 300

  metric_name = "CPUUtilization"
  namespace   = "AWS/ECS"
  statistic   = "Average"
  threshold   = 80

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.backend.name
  }

  treat_missing_data = "notBreaching"
}

resource "aws_cloudwatch_metric_alarm" "database_cpu_high" {
  alarm_name          = "infralens-${var.environment}-database-cpu-high"
  alarm_description   = "RDS CPU utilization is high."
  comparison_operator = "GreaterThanThreshold"

  evaluation_periods = 2
  period             = 300

  metric_name = "CPUUtilization"
  namespace   = "AWS/RDS"
  statistic   = "Average"
  threshold   = 80

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  treat_missing_data = "notBreaching"
}

resource "aws_cloudwatch_metric_alarm" "database_storage_low" {
  alarm_name          = "infralens-${var.environment}-database-storage-low"
  alarm_description   = "RDS free storage space is low."
  comparison_operator = "LessThanThreshold"

  evaluation_periods = 1
  period             = 300

  metric_name = "FreeStorageSpace"
  namespace   = "AWS/RDS"
  statistic   = "Average"

  threshold = 2147483648

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }

  treat_missing_data = "notBreaching"
}
