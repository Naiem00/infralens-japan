import { getActiveConfig } from '../assessment/scoreUtils.js';

const LANE_DEFINITIONS = [
  { id: 'dns', services: ['route53'] },
  { id: 'edge', services: ['cloudfront'] },
  { id: 'entry', services: ['apiGateway', 'alb'] },
  { id: 'compute', services: ['ec2', 'ecsFargate', 'lambda'] },
  { id: 'data', services: ['rdsPostgres', 'dynamoDb', 's3', 'efs'] },
  { id: 'messaging', services: ['sns', 'sqs', 'eventBridge'] },
];

const SUPPORTING_SERVICE_IDS = ['waf', 'cloudwatch', 'kms', 'secretsManager'];

function buildAnnotations(serviceId, config = {}) {
  const annotations = [];

  if (serviceId === 'ec2') {
    if (config.instanceCount) annotations.push(`${config.instanceCount}x`);
    if (config.multiAZ) annotations.push('Multi-AZ');
    if (config.autoScalingEnabled) annotations.push('Auto Scaling');
    if (config.placement) annotations.push(config.placement);
  }

  if (serviceId === 'ecsFargate') {
    if (config.taskCount) annotations.push(`${config.taskCount} tasks`);
    if (config.multiAZ) annotations.push('Multi-AZ');
    if (config.autoScalingEnabled) annotations.push('Auto Scaling');
  }

  if (serviceId === 'rdsPostgres') {
    if (config.multiAZ) annotations.push('Multi-AZ');
    if (config.publiclyAccessible) annotations.push('Public');
    else if (config.privateSubnet) annotations.push('Private');
    if (config.encryptionEnabled) annotations.push('Encrypted');
  }

  if (serviceId === 's3') {
    if (config.encryptionEnabled) annotations.push('Encrypted');
    if (config.versioningEnabled) annotations.push('Versioning');
  }

  if (serviceId === 'alb' || serviceId === 'cloudfront') {
    if (config.httpsEnabled) annotations.push('HTTPS');
  }

  if (serviceId === 'cloudwatch') {
    if (config.logsEnabled) annotations.push('Logs');
    if (config.metricsEnabled) annotations.push('Metrics');
    if (config.alarmsEnabled) annotations.push('Alarms');
  }

  return annotations;
}

export function buildArchitectureView({ selectedServices, architectureConfig }) {
  const selected = new Set(selectedServices);
  const activeConfig = getActiveConfig(selectedServices, architectureConfig);

  const lanes = LANE_DEFINITIONS.map((lane) => ({
    id: lane.id,
    services: lane.services
      .filter((serviceId) => selected.has(serviceId))
      .map((serviceId) => ({
        id: serviceId,
        annotations: buildAnnotations(serviceId, activeConfig[serviceId]),
      })),
  })).filter((lane) => lane.services.length > 0);

  const supportingServices = SUPPORTING_SERVICE_IDS
    .filter((serviceId) => selected.has(serviceId))
    .map((serviceId) => ({
      id: serviceId,
      annotations: buildAnnotations(serviceId, activeConfig[serviceId]),
    }));

  return {
    hasSelection: selectedServices.length > 0,
    vpcSelected: selected.has('vpc'),
    lanes,
    supportingServices,
  };
}
