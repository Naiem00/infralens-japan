// Day 8 recommendation rules. Advice only — scoring stays in src/assessment/.
// Every evaluate() reads the same ctx shape as Day 7 (isSelected / get) and
// only fields that already exist on Day 6 services.
//
// Missing-service recommendations are gated on the CURRENT selection
// (e.g. WAF only if there is already a public HTTP entry). We do not suggest
// unrelated catalog services "because they exist."

export const PRIORITY_RANK = {
  critical: 0,
  high: 1,
  recommended: 2,
  consider: 3,
};

export const PRIORITY_IDS = ['critical', 'high', 'recommended', 'consider'];

export const RECOMMENDATION_RULES = [
  // ================================ CRITICAL ================================
  {
    id: 'rec-rds-public',
    priority: 'critical',
    category: 'security',
    titleKey: 'recommendations.items.rdsPublic.title',
    explanationKey: 'recommendations.items.rdsPublic.explanation',
    conceptKey: 'recommendations.items.rdsPublic.concept',
    relatedRuleId: 'security-rds-public',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'publiclyAccessible') === true,
  },

  // ================================= HIGH =================================
  {
    id: 'rec-monitoring-absent',
    priority: 'high',
    category: 'operations',
    titleKey: 'recommendations.items.monitoringAbsent.title',
    explanationKey: 'recommendations.items.monitoringAbsent.explanation',
    conceptKey: 'recommendations.items.monitoringAbsent.concept',
    relatedRuleId: 'operations-monitoring-absent',
    evaluate: (ctx) => !ctx.isSelected('cloudwatch'),
  },
  {
    id: 'rec-single-compute-no-scaling',
    priority: 'high',
    category: 'reliability',
    titleKey: 'recommendations.items.singleComputeNoScaling.title',
    explanationKey: 'recommendations.items.singleComputeNoScaling.explanation',
    conceptKey: 'recommendations.items.singleComputeNoScaling.concept',
    relatedRuleId: 'reliability-single-compute-no-scaling',
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
  {
    id: 'rec-too-many-fixed-instances',
    priority: 'high',
    category: 'costEfficiency',
    titleKey: 'recommendations.items.tooManyFixedInstances.title',
    explanationKey: 'recommendations.items.tooManyFixedInstances.explanation',
    conceptKey: 'recommendations.items.tooManyFixedInstances.concept',
    relatedRuleId: 'cost-too-many-fixed-instances',
    evaluate: (ctx) =>
      ctx.isSelected('ec2') && Number(ctx.get('ec2', 'instanceCount')) > 5 && !ctx.get('ec2', 'autoScalingEnabled'),
  },
  {
    id: 'rec-rds-private-subnet',
    priority: 'high',
    category: 'security',
    titleKey: 'recommendations.items.rdsPrivateSubnet.title',
    explanationKey: 'recommendations.items.rdsPrivateSubnet.explanation',
    conceptKey: 'recommendations.items.rdsPrivateSubnet.concept',
    relatedRuleId: 'security-rds-private-subnet',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'privateSubnet') !== true,
  },
  {
    id: 'rec-rds-encryption',
    priority: 'high',
    category: 'security',
    titleKey: 'recommendations.items.rdsEncryption.title',
    explanationKey: 'recommendations.items.rdsEncryption.explanation',
    conceptKey: 'recommendations.items.rdsEncryption.concept',
    relatedRuleId: 'security-rds-encryption',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'encryptionEnabled') !== true,
  },
  {
    id: 'rec-s3-public-blocked',
    priority: 'high',
    category: 'security',
    titleKey: 'recommendations.items.s3PublicBlocked.title',
    explanationKey: 'recommendations.items.s3PublicBlocked.explanation',
    conceptKey: 'recommendations.items.s3PublicBlocked.concept',
    relatedRuleId: 'security-s3-public-blocked',
    evaluate: (ctx) => ctx.isSelected('s3') && ctx.get('s3', 'publicAccessBlocked') !== true,
  },

  // ============================== RECOMMENDED ==============================
  {
    id: 'rec-rds-backups',
    priority: 'recommended',
    category: 'reliability',
    titleKey: 'recommendations.items.rdsBackups.title',
    explanationKey: 'recommendations.items.rdsBackups.explanation',
    conceptKey: 'recommendations.items.rdsBackups.concept',
    relatedRuleId: 'reliability-rds-backups',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'backupsEnabled') !== true,
  },
  {
    id: 'rec-rds-multi-az',
    priority: 'recommended',
    category: 'reliability',
    titleKey: 'recommendations.items.rdsMultiAz.title',
    explanationKey: 'recommendations.items.rdsMultiAz.explanation',
    conceptKey: 'recommendations.items.rdsMultiAz.concept',
    relatedRuleId: 'reliability-rds-multi-az',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'multiAZ') !== true,
  },
  {
    id: 'rec-s3-encryption',
    priority: 'recommended',
    category: 'security',
    titleKey: 'recommendations.items.s3Encryption.title',
    explanationKey: 'recommendations.items.s3Encryption.explanation',
    conceptKey: 'recommendations.items.s3Encryption.concept',
    relatedRuleId: 'security-s3-encryption',
    evaluate: (ctx) => ctx.isSelected('s3') && ctx.get('s3', 'encryptionEnabled') !== true,
  },
  {
    id: 'rec-s3-versioning',
    priority: 'recommended',
    category: 'reliability',
    titleKey: 'recommendations.items.s3Versioning.title',
    explanationKey: 'recommendations.items.s3Versioning.explanation',
    conceptKey: 'recommendations.items.s3Versioning.concept',
    relatedRuleId: 'reliability-s3-versioning',
    evaluate: (ctx) => ctx.isSelected('s3') && ctx.get('s3', 'versioningEnabled') !== true,
  },
  {
    id: 'rec-ec2-multi-az',
    priority: 'recommended',
    category: 'reliability',
    titleKey: 'recommendations.items.ec2MultiAz.title',
    explanationKey: 'recommendations.items.ec2MultiAz.explanation',
    conceptKey: 'recommendations.items.ec2MultiAz.concept',
    relatedRuleId: 'reliability-ec2-multi-az',
    evaluate: (ctx) => ctx.isSelected('ec2') && ctx.get('ec2', 'multiAZ') !== true,
  },
  {
    id: 'rec-ecs-multi-az',
    priority: 'recommended',
    category: 'reliability',
    titleKey: 'recommendations.items.ecsMultiAz.title',
    explanationKey: 'recommendations.items.ecsMultiAz.explanation',
    conceptKey: 'recommendations.items.ecsMultiAz.concept',
    relatedRuleId: 'reliability-ecs-multi-az',
    evaluate: (ctx) => ctx.isSelected('ecsFargate') && ctx.get('ecsFargate', 'multiAZ') !== true,
  },
  {
    id: 'rec-cloudfront-https',
    priority: 'recommended',
    category: 'security',
    titleKey: 'recommendations.items.cloudfrontHttps.title',
    explanationKey: 'recommendations.items.cloudfrontHttps.explanation',
    conceptKey: 'recommendations.items.cloudfrontHttps.concept',
    relatedRuleId: 'security-cloudfront-https',
    evaluate: (ctx) => ctx.isSelected('cloudfront') && ctx.get('cloudfront', 'httpsEnabled') !== true,
  },
  {
    id: 'rec-alb-https',
    priority: 'recommended',
    category: 'security',
    titleKey: 'recommendations.items.albHttps.title',
    explanationKey: 'recommendations.items.albHttps.explanation',
    conceptKey: 'recommendations.items.albHttps.concept',
    relatedRuleId: 'security-alb-https',
    evaluate: (ctx) => ctx.isSelected('alb') && ctx.get('alb', 'httpsEnabled') !== true,
  },
  {
    id: 'rec-cloudwatch-logs',
    priority: 'recommended',
    category: 'operations',
    titleKey: 'recommendations.items.cloudwatchLogs.title',
    explanationKey: 'recommendations.items.cloudwatchLogs.explanation',
    conceptKey: 'recommendations.items.cloudwatchLogs.concept',
    relatedRuleId: 'operations-cloudwatch-logs',
    evaluate: (ctx) => ctx.isSelected('cloudwatch') && ctx.get('cloudwatch', 'logsEnabled') !== true,
  },
  {
    id: 'rec-cloudwatch-alarms',
    priority: 'recommended',
    category: 'operations',
    titleKey: 'recommendations.items.cloudwatchAlarms.title',
    explanationKey: 'recommendations.items.cloudwatchAlarms.explanation',
    conceptKey: 'recommendations.items.cloudwatchAlarms.concept',
    relatedRuleId: 'operations-cloudwatch-alarms',
    evaluate: (ctx) => ctx.isSelected('cloudwatch') && ctx.get('cloudwatch', 'alarmsEnabled') !== true,
  },
  {
    id: 'rec-secrets-manager-enabled',
    priority: 'recommended',
    category: 'security',
    titleKey: 'recommendations.items.secretsManagerEnabled.title',
    explanationKey: 'recommendations.items.secretsManagerEnabled.explanation',
    conceptKey: 'recommendations.items.secretsManagerEnabled.concept',
    relatedRuleId: 'security-secrets-manager',
    evaluate: (ctx) =>
      ctx.isSelected('secretsManager') && ctx.get('secretsManager', 'secretsManagementEnabled') !== true,
  },
  {
    id: 'rec-duplicate-compute',
    priority: 'recommended',
    category: 'costEfficiency',
    titleKey: 'recommendations.items.duplicateCompute.title',
    explanationKey: 'recommendations.items.duplicateCompute.explanation',
    conceptKey: 'recommendations.items.duplicateCompute.concept',
    relatedRuleId: 'cost-duplicate-compute',
    evaluate: (ctx) => ctx.isSelected('ec2') && ctx.isSelected('ecsFargate'),
  },
  {
    id: 'rec-cloudfront-restricted-origin',
    priority: 'recommended',
    category: 'security',
    titleKey: 'recommendations.items.cloudfrontRestrictedOrigin.title',
    explanationKey: 'recommendations.items.cloudfrontRestrictedOrigin.explanation',
    conceptKey: 'recommendations.items.cloudfrontRestrictedOrigin.concept',
    evaluate: (ctx) => ctx.isSelected('cloudfront') && ctx.get('cloudfront', 'restrictedOrigin') !== true,
  },
  {
    id: 'rec-ec2-private-placement',
    priority: 'recommended',
    category: 'security',
    titleKey: 'recommendations.items.ec2PrivatePlacement.title',
    explanationKey: 'recommendations.items.ec2PrivatePlacement.explanation',
    conceptKey: 'recommendations.items.ec2PrivatePlacement.concept',
    evaluate: (ctx) => ctx.isSelected('ec2') && ctx.get('ec2', 'placement') === 'public',
  },

  // =============================== CONSIDER ===============================
  {
    // Only when the architecture already has a public HTTP entry (ALB or CloudFront).
    id: 'rec-waf-for-public-entry',
    priority: 'consider',
    category: 'security',
    titleKey: 'recommendations.items.wafForPublicEntry.title',
    explanationKey: 'recommendations.items.wafForPublicEntry.explanation',
    conceptKey: 'recommendations.items.wafForPublicEntry.concept',
    relatedRuleId: 'security-waf-selected',
    evaluate: (ctx) => (ctx.isSelected('alb') || ctx.isSelected('cloudfront')) && !ctx.isSelected('waf'),
  },
  {
    // Only when a database that typically needs managed credentials is selected.
    id: 'rec-secrets-manager-for-rds',
    priority: 'consider',
    category: 'operations',
    titleKey: 'recommendations.items.secretsManagerForRds.title',
    explanationKey: 'recommendations.items.secretsManagerForRds.explanation',
    conceptKey: 'recommendations.items.secretsManagerForRds.concept',
    relatedRuleId: 'operations-secrets-manager',
    evaluate: (ctx) => ctx.isSelected('rdsPostgres') && !ctx.isSelected('secretsManager'),
  },
  {
    // Multiple EC2/ECS targets with no load balancer — not suggested for Lambda-only.
    id: 'rec-alb-for-multiple-targets',
    priority: 'consider',
    category: 'performance',
    titleKey: 'recommendations.items.albForMultipleTargets.title',
    explanationKey: 'recommendations.items.albForMultipleTargets.explanation',
    conceptKey: 'recommendations.items.albForMultipleTargets.concept',
    relatedRuleId: 'performance-alb-multiple-targets',
    evaluate: (ctx) => {
      if (ctx.isSelected('alb')) return false;
      const ec2Multiple = ctx.isSelected('ec2') && Number(ctx.get('ec2', 'instanceCount')) > 1;
      const ecsMultiple = ctx.isSelected('ecsFargate') && Number(ctx.get('ecsFargate', 'taskCount')) > 1;
      return ec2Multiple || ecsMultiple;
    },
  },
];
