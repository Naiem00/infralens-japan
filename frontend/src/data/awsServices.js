// AWS service metadata for the Architecture Analyzer (Day 6). Kept out of JSX so
// ServiceSelector/ConfigPanel stay generic renderers driven by this data, and so
// this same list can be reused later (e.g. Service Compare, Day 11) without
// duplicating service definitions.
//
// Every string is a translation KEY (resolved with t() in components), never
// literal text — see locales/*/common.json under "awsServices" and
// "serviceCategories" for the actual EN/JA strings.
//
// `configSchema` is intentionally empty for services the Day 6 spec doesn't list
// configuration for (DynamoDB, EFS, VPC, API Gateway, Route 53, KMS, WAF, SNS,
// SQS, EventBridge) — those are still selectable, just have no config panel.

export const CATEGORIES = [
  { id: 'compute', labelKey: 'serviceCategories.compute' },
  { id: 'database', labelKey: 'serviceCategories.database' },
  { id: 'storage', labelKey: 'serviceCategories.storage' },
  { id: 'networkingDelivery', labelKey: 'serviceCategories.networkingDelivery' },
  { id: 'securityOperations', labelKey: 'serviceCategories.securityOperations' },
  { id: 'messaging', labelKey: 'serviceCategories.messaging' },
];

// Field types: 'boolean' (checkbox), 'number' (numeric input with min/max),
// 'select' (native <select> with translated options).
export const AWS_SERVICES = [
  // ---- Compute ----
  {
    id: 'ec2',
    categoryId: 'compute',
    configSchema: [
      { key: 'instanceCount', type: 'number', min: 1, max: 20, defaultValue: 2 },
      { key: 'autoScalingEnabled', type: 'boolean', defaultValue: false },
      { key: 'multiAZ', type: 'boolean', defaultValue: false },
      {
        key: 'placement',
        type: 'select',
        defaultValue: 'private',
        options: [
          { value: 'private', labelKey: 'architectureAnalyzer.fields.placementPrivate' },
          { value: 'public', labelKey: 'architectureAnalyzer.fields.placementPublic' },
        ],
      },
    ],
  },
  {
    id: 'ecsFargate',
    categoryId: 'compute',
    configSchema: [
      { key: 'taskCount', type: 'number', min: 1, max: 50, defaultValue: 2 },
      { key: 'autoScalingEnabled', type: 'boolean', defaultValue: false },
      { key: 'multiAZ', type: 'boolean', defaultValue: false },
    ],
  },
  { id: 'lambda', categoryId: 'compute', configSchema: [] },

  // ---- Database ----
  {
    id: 'rdsPostgres',
    categoryId: 'database',
    configSchema: [
      { key: 'multiAZ', type: 'boolean', defaultValue: false },
      { key: 'backupsEnabled', type: 'boolean', defaultValue: true },
      { key: 'encryptionEnabled', type: 'boolean', defaultValue: true },
      { key: 'publiclyAccessible', type: 'boolean', defaultValue: false },
      { key: 'privateSubnet', type: 'boolean', defaultValue: true },
    ],
  },
  { id: 'dynamoDb', categoryId: 'database', configSchema: [] },

  // ---- Storage ----
  {
    id: 's3',
    categoryId: 'storage',
    configSchema: [
      { key: 'encryptionEnabled', type: 'boolean', defaultValue: true },
      { key: 'versioningEnabled', type: 'boolean', defaultValue: false },
      { key: 'publicAccessBlocked', type: 'boolean', defaultValue: true },
    ],
  },
  { id: 'efs', categoryId: 'storage', configSchema: [] },

  // ---- Networking / Delivery ----
  { id: 'vpc', categoryId: 'networkingDelivery', configSchema: [] },
  {
    id: 'alb',
    categoryId: 'networkingDelivery',
    configSchema: [
      { key: 'multiAZ', type: 'boolean', defaultValue: true },
      { key: 'httpsEnabled', type: 'boolean', defaultValue: true },
    ],
  },
  { id: 'apiGateway', categoryId: 'networkingDelivery', configSchema: [] },
  {
    id: 'cloudfront',
    categoryId: 'networkingDelivery',
    configSchema: [
      { key: 'httpsEnabled', type: 'boolean', defaultValue: true },
      { key: 'restrictedOrigin', type: 'boolean', defaultValue: false },
    ],
  },
  { id: 'route53', categoryId: 'networkingDelivery', configSchema: [] },

  // ---- Security / Operations ----
  {
    id: 'secretsManager',
    categoryId: 'securityOperations',
    configSchema: [{ key: 'secretsManagementEnabled', type: 'boolean', defaultValue: true }],
  },
  { id: 'kms', categoryId: 'securityOperations', configSchema: [] },
  { id: 'waf', categoryId: 'securityOperations', configSchema: [] },
  {
    id: 'cloudwatch',
    categoryId: 'securityOperations',
    configSchema: [
      { key: 'logsEnabled', type: 'boolean', defaultValue: true },
      { key: 'metricsEnabled', type: 'boolean', defaultValue: true },
      { key: 'alarmsEnabled', type: 'boolean', defaultValue: false },
    ],
  },

  // ---- Messaging ----
  { id: 'sns', categoryId: 'messaging', configSchema: [] },
  { id: 'sqs', categoryId: 'messaging', configSchema: [] },
  { id: 'eventBridge', categoryId: 'messaging', configSchema: [] },
];

export const COMPUTE_SERVICE_IDS = AWS_SERVICES.filter((s) => s.categoryId === 'compute').map((s) => s.id);

export function getServiceById(id) {
  return AWS_SERVICES.find((s) => s.id === id);
}

export function buildDefaultConfig(service) {
  const config = {};
  for (const field of service.configSchema) {
    config[field.key] = field.defaultValue;
  }
  return config;
}
