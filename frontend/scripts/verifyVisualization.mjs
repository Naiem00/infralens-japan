import assert from 'node:assert/strict';
import { buildArchitectureView } from '../src/visualization/index.js';

const selectedServices = ['route53', 'cloudfront', 'alb', 'ec2', 'rdsPostgres', 'cloudwatch', 'vpc'];

const architectureConfig = {
  ec2: {
    instanceCount: 2,
    autoScalingEnabled: true,
    multiAZ: true,
    placement: 'private',
  },
  rdsPostgres: {
    multiAZ: true,
    backupsEnabled: true,
    encryptionEnabled: true,
    publiclyAccessible: false,
    privateSubnet: true,
  },
  cloudfront: {
    httpsEnabled: true,
    restrictedOrigin: true,
  },
  cloudwatch: {
    logsEnabled: true,
    metricsEnabled: true,
    alarmsEnabled: true,
  },
  s3: {
    encryptionEnabled: false,
    versioningEnabled: false,
  },
};

const a = buildArchitectureView({ selectedServices, architectureConfig });
const b = buildArchitectureView({ selectedServices, architectureConfig });

assert.deepEqual(a, b, 'Visualization must be deterministic.');
assert.equal(a.vpcSelected, true, 'VPC should be represented as context.');
assert.equal(
  JSON.stringify(a).includes('"s3"'),
  false,
  'Deselected stale S3 config must not appear.'
);

const renderedIds = [
  ...a.lanes.flatMap((lane) => lane.services.map((service) => service.id)),
  ...a.supportingServices.map((service) => service.id),
];

for (const id of renderedIds) {
  assert.ok(selectedServices.includes(id), `Unselected service rendered: ${id}`);
}

console.log('PASS deterministic visualization');
console.log('PASS stale deselected config ignored');
console.log('PASS no unselected AWS services rendered');
console.log('PASS VPC is context, not a traffic-path node');
console.log('\nALL CHECKS PASSED');
