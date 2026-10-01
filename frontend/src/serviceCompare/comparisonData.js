export const COMPARISON_GROUPS = {
  compute: {
    serviceIds: ['ec2', 'ecsFargate', 'lambda'],
    attributes: [
      'management',
      'scaling',
      'control',
      'billingModel',
      'bestFor',
    ],
  },
  database: {
    serviceIds: ['rdsPostgres', 'dynamoDb'],
    attributes: [
      'databaseType',
      'management',
      'scaling',
      'queryModel',
      'bestFor',
    ],
  },
  delivery: {
    serviceIds: ['alb', 'apiGateway', 'cloudfront'],
    attributes: [
      'primaryRole',
      'layer',
      'scaling',
      'bestFor',
      'keyTradeoff',
    ],
  },
};

export const COMPARISON_GROUP_IDS = Object.keys(COMPARISON_GROUPS);

export function getComparisonGroup(groupId) {
  const group = COMPARISON_GROUPS[groupId];

  if (!group) {
    throw new Error(`Unknown comparison group: ${groupId}`);
  }

  return group;
}
