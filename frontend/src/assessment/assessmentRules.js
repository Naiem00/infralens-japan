// The complete, fixed rule set. Every rule only reads fields that already
// exist in data/awsServices.js's configSchema (Day 6) — nothing here invents
// a new configuration field, and nothing here scores Terraform, CI/CD, cost,
// or Failure-Simulator concerns, which are out of scope for Day 7.
//
// `ctx` passed to every `evaluate` is built once per assessment run in
// calculateAssessment.js from ONLY the currently selected services' config
// (see scoreUtils.getActiveConfig) — so a rule can never fire off stale,
// deselected-service data even if it tried to.
//
// Rule shape:
//   id             stable, language-independent identifier (e.g. for logs/tests)
//   category       one of the 5 category ids
//   descriptionKey i18next key for the human-readable, FACTUAL description
//                  ("Database publicly accessible") — never prescriptive
//                  advice ("You should..."); that's the Day 8 recommendation
//                  engine's job, not Day 7's.
//   impact         whole-number score delta, no fractional points
//   severity       'critical' | 'high' | 'moderate' | 'positive' — for UI
//                  styling only; scoring itself only uses `impact`.
//   evaluate(ctx)  pure boolean condition

export const RULES = [
  // ============================== RELIABILITY ==============================
  {
    id: 'reliability-ec2-multi-az',
    category: 'reliability',
    descriptionKey: 'assessment.rules.reliability.ec2MultiAz',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('ec2') && ctx.get('ec2', 'multiAZ') === true,
  },
  {
    id: 'reliability-ecs-multi-az',
    category: 'reliability',
    descriptionKey: 'assessment.rules.reliability.ecsMultiAz',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('ecsFargate') && ctx.get('ecsFargate', 'multiAZ') === true,
  },
  {
    id: 'reliability-ec2-multiple-instances',
    category: 'reliability',
    descriptionKey: 'assessment.rules.reliability.ec2MultipleInstances',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('ec2') && Number(ctx.get('ec2', 'instanceCount')) > 1,
  },
  {
    id: 'reliability-ecs-multiple-tasks',
    category: 'reliability',
    descriptionKey: 'assessment.rules.reliability.ecsMultipleTasks',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('ecsFargate') && Number(ctx.get('ecsFargate', 'taskCount')) > 1,
  },
  {
    id: 'reliability-rds-multi-az',
    category: 'reliability',
    descriptionKey: 'assessment.rules.reliability.rdsMultiAz',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'multiAZ') === true,
  },
  {
    id: 'reliability-rds-backups',
    category: 'reliability',
    descriptionKey: 'assessment.rules.reliability.rdsBackups',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'backupsEnabled') === true,
  },
  {
    id: 'reliability-s3-versioning',
    category: 'reliability',
    descriptionKey: 'assessment.rules.reliability.s3Versioning',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('s3') && ctx.get('s3', 'versioningEnabled') === true,
  },
  {
    id: 'reliability-single-compute-no-scaling',
    category: 'reliability',
    descriptionKey: 'assessment.rules.reliability.singleComputeNoScaling',
    impact: -10,
    severity: 'high',
    evaluate: (ctx) => {
      const ec2Risk =
        ctx.isSelected('ec2') && Number(ctx.get('ec2', 'instanceCount')) === 1 && !ctx.get('ec2', 'autoScalingEnabled');
      const ecsRisk =
        ctx.isSelected('ecsFargate') &&
        Number(ctx.get('ecsFargate', 'taskCount')) === 1 &&
        !ctx.get('ecsFargate', 'autoScalingEnabled');
      return ec2Risk || ecsRisk;
    },
  },

  // ================================ SECURITY ================================
  {
    id: 'security-rds-public',
    category: 'security',
    descriptionKey: 'assessment.rules.security.rdsPublic',
    impact: -15,
    severity: 'critical',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'publiclyAccessible') === true,
  },
  {
    id: 'security-rds-private-subnet',
    category: 'security',
    descriptionKey: 'assessment.rules.security.rdsPrivateSubnet',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'privateSubnet') === true,
  },
  {
    id: 'security-rds-encryption',
    category: 'security',
    descriptionKey: 'assessment.rules.security.rdsEncryption',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'encryptionEnabled') === true,
  },
  {
    id: 'security-s3-encryption',
    category: 'security',
    descriptionKey: 'assessment.rules.security.s3Encryption',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('s3') && ctx.get('s3', 'encryptionEnabled') === true,
  },
  {
    id: 'security-s3-public-blocked',
    category: 'security',
    descriptionKey: 'assessment.rules.security.s3PublicBlocked',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('s3') && ctx.get('s3', 'publicAccessBlocked') === true,
  },
  {
    id: 'security-cloudfront-https',
    category: 'security',
    descriptionKey: 'assessment.rules.security.cloudfrontHttps',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('cloudfront') && ctx.get('cloudfront', 'httpsEnabled') === true,
  },
  {
    id: 'security-alb-https',
    category: 'security',
    descriptionKey: 'assessment.rules.security.albHttps',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('alb') && ctx.get('alb', 'httpsEnabled') === true,
  },
  {
    id: 'security-secrets-manager',
    category: 'security',
    descriptionKey: 'assessment.rules.security.secretsManagerEnabled',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) =>
      ctx.isSelected('secretsManager') && ctx.get('secretsManager', 'secretsManagementEnabled') === true,
  },
  {
    id: 'security-waf-selected',
    category: 'security',
    descriptionKey: 'assessment.rules.security.wafSelected',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('waf'),
  },
  {
    id: 'security-kms-selected',
    category: 'security',
    descriptionKey: 'assessment.rules.security.kmsSelected',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('kms'),
  },

  // ============================= COST EFFICIENCY =============================
  {
    id: 'cost-ec2-auto-scaling',
    category: 'costEfficiency',
    descriptionKey: 'assessment.rules.costEfficiency.ec2AutoScaling',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('ec2') && ctx.get('ec2', 'autoScalingEnabled') === true,
  },
  {
    id: 'cost-ecs-auto-scaling',
    category: 'costEfficiency',
    descriptionKey: 'assessment.rules.costEfficiency.ecsAutoScaling',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('ecsFargate') && ctx.get('ecsFargate', 'autoScalingEnabled') === true,
  },
  {
    id: 'cost-lambda-selected',
    category: 'costEfficiency',
    descriptionKey: 'assessment.rules.costEfficiency.lambdaSelected',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('lambda'),
  },
  {
    // Running two general-purpose compute platforms side by side is the
    // "unnecessary duplicate" pattern the spec asks for. Lambda is excluded
    // from this check: pairing serverless with EC2/ECS is a common, valid
    // hybrid pattern, not a duplicate.
    id: 'cost-duplicate-compute',
    category: 'costEfficiency',
    descriptionKey: 'assessment.rules.costEfficiency.duplicateCompute',
    impact: -5,
    severity: 'moderate',
    evaluate: (ctx) => ctx.isSelected('ec2') && ctx.isSelected('ecsFargate'),
  },
  {
    // Threshold of 5 fixed instances is a documented judgment call, not an
    // AWS rule: past this point, without Auto Scaling, fixed capacity is
    // increasingly likely to be over-provisioned for average load.
    id: 'cost-too-many-fixed-instances',
    category: 'costEfficiency',
    descriptionKey: 'assessment.rules.costEfficiency.tooManyFixedInstances',
    impact: -10,
    severity: 'high',
    evaluate: (ctx) =>
      ctx.isSelected('ec2') && Number(ctx.get('ec2', 'instanceCount')) > 5 && !ctx.get('ec2', 'autoScalingEnabled'),
  },

  // =============================== PERFORMANCE ===============================
  {
    id: 'performance-cloudfront-selected',
    category: 'performance',
    descriptionKey: 'assessment.rules.performance.cloudfrontSelected',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('cloudfront'),
  },
  {
    id: 'performance-alb-multiple-targets',
    category: 'performance',
    descriptionKey: 'assessment.rules.performance.albMultipleTargets',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => {
      if (!ctx.isSelected('alb')) return false;
      const ec2Multiple = ctx.isSelected('ec2') && Number(ctx.get('ec2', 'instanceCount')) > 1;
      const ecsMultiple = ctx.isSelected('ecsFargate') && Number(ctx.get('ecsFargate', 'taskCount')) > 1;
      return ec2Multiple || ecsMultiple;
    },
  },
  {
    id: 'performance-ec2-auto-scaling',
    category: 'performance',
    descriptionKey: 'assessment.rules.performance.ec2AutoScaling',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('ec2') && ctx.get('ec2', 'autoScalingEnabled') === true,
  },
  {
    id: 'performance-ecs-auto-scaling',
    category: 'performance',
    descriptionKey: 'assessment.rules.performance.ecsAutoScaling',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('ecsFargate') && ctx.get('ecsFargate', 'autoScalingEnabled') === true,
  },
  {
    id: 'performance-api-gateway-lambda',
    category: 'performance',
    descriptionKey: 'assessment.rules.performance.apiGatewayLambda',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('apiGateway') && ctx.isSelected('lambda'),
  },
  {
    id: 'performance-single-fixed-compute',
    category: 'performance',
    descriptionKey: 'assessment.rules.performance.singleFixedCompute',
    impact: -10,
    severity: 'high',
    evaluate: (ctx) => {
      const onlyEc2 = ctx.isSelected('ec2') && !ctx.isSelected('ecsFargate') && !ctx.isSelected('lambda');
      const onlyEcs = ctx.isSelected('ecsFargate') && !ctx.isSelected('ec2') && !ctx.isSelected('lambda');
      const ec2Fixed = onlyEc2 && Number(ctx.get('ec2', 'instanceCount')) === 1 && !ctx.get('ec2', 'autoScalingEnabled');
      const ecsFixed =
        onlyEcs && Number(ctx.get('ecsFargate', 'taskCount')) === 1 && !ctx.get('ecsFargate', 'autoScalingEnabled');
      return ec2Fixed || ecsFixed;
    },
  },

  // ================================ OPERATIONS ================================
  {
    id: 'operations-cloudwatch-logs',
    category: 'operations',
    descriptionKey: 'assessment.rules.operations.cloudwatchLogs',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('cloudwatch') && ctx.get('cloudwatch', 'logsEnabled') === true,
  },
  {
    id: 'operations-cloudwatch-alarms',
    category: 'operations',
    descriptionKey: 'assessment.rules.operations.cloudwatchAlarms',
    impact: 10,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('cloudwatch') && ctx.get('cloudwatch', 'alarmsEnabled') === true,
  },
  {
    id: 'operations-cloudwatch-metrics',
    category: 'operations',
    descriptionKey: 'assessment.rules.operations.cloudwatchMetrics',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('cloudwatch') && ctx.get('cloudwatch', 'metricsEnabled') === true,
  },
  {
    id: 'operations-secrets-manager',
    category: 'operations',
    descriptionKey: 'assessment.rules.operations.secretsManagerSelected',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('secretsManager'),
  },
  {
    id: 'operations-rds-backups',
    category: 'operations',
    descriptionKey: 'assessment.rules.operations.rdsBackups',
    impact: 5,
    severity: 'positive',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'backupsEnabled') === true,
  },
  {
    id: 'operations-monitoring-absent',
    category: 'operations',
    descriptionKey: 'assessment.rules.operations.monitoringAbsent',
    impact: -10,
    severity: 'high',
    evaluate: (ctx) => !ctx.isSelected('cloudwatch'),
  },
];
