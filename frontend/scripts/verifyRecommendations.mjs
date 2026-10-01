// Lightweight, dependency-free verification for the Day 8 recommendation
// engine. Mirrors scripts/verifyAssessment.mjs. Run with:
//   node scripts/verifyRecommendations.mjs

import { generateRecommendations } from '../src/recommendations/index.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) {
    failures += 1;
    console.error(`FAIL  ${message}`);
  } else {
    console.log(`PASS  ${message}`);
  }
}

function ids(result) {
  return result.recommendations.map((r) => r.id);
}

function has(result, id) {
  return result.recommendations.some((r) => r.id === id);
}

function printResult(label, result) {
  console.log(`\n--- ${label} ---`);
  console.log(`${result.recommendations.length} recommendations:`);
  for (const rec of result.recommendations) {
    console.log(`    [${rec.priority}]  ${rec.id}`);
  }
}

const scenarioA = {
  selectedServices: ['ec2', 'rdsPostgres'],
  architectureConfig: {
    ec2: { instanceCount: 1, autoScalingEnabled: false, multiAZ: false, placement: 'private' },
    rdsPostgres: {
      multiAZ: false,
      backupsEnabled: false,
      encryptionEnabled: false,
      publiclyAccessible: true,
      privateSubnet: false,
    },
  },
};
const resultA = generateRecommendations(scenarioA);
printResult('Scenario A — weak architecture', resultA);

assert(has(resultA, 'rec-rds-public'), 'Scenario A: Critical rec for public RDS');
assert(
  resultA.recommendations[0].id === 'rec-rds-public' && resultA.recommendations[0].priority === 'critical',
  'Scenario A: first recommendation is Critical (public RDS), sorted by priority'
);
assert(has(resultA, 'rec-monitoring-absent'), 'Scenario A: High rec for missing CloudWatch');
assert(has(resultA, 'rec-single-compute-no-scaling'), 'Scenario A: High rec for single compute without scaling');
assert(has(resultA, 'rec-rds-private-subnet'), 'Scenario A: High rec for RDS not in a private subnet');
assert(has(resultA, 'rec-rds-encryption'), 'Scenario A: High rec for RDS encryption off');
assert(has(resultA, 'rec-rds-backups'), 'Scenario A: Recommended rec for RDS backups off');
assert(has(resultA, 'rec-secrets-manager-for-rds'), 'Scenario A: Consider rec for Secrets Manager because RDS is selected');
assert(
  !has(resultA, 'rec-waf-for-public-entry'),
  'Scenario A: does NOT suggest WAF (no ALB/CloudFront — no public HTTP entry)'
);
assert(
  !has(resultA, 'rec-alb-for-multiple-targets'),
  'Scenario A: does NOT suggest ALB (only one EC2 instance)'
);
assert(
  !has(resultA, 'rec-s3-encryption') && !has(resultA, 'rec-s3-versioning') && !has(resultA, 'rec-s3-public-blocked'),
  'Scenario A: does NOT suggest S3 controls (S3 is not selected)'
);

const scenarioB = {
  selectedServices: ['ec2', 'rdsPostgres', 's3', 'cloudfront', 'cloudwatch', 'secretsManager'],
  architectureConfig: {
    ec2: { instanceCount: 3, autoScalingEnabled: true, multiAZ: true, placement: 'private' },
    rdsPostgres: {
      multiAZ: true,
      backupsEnabled: true,
      encryptionEnabled: true,
      publiclyAccessible: false,
      privateSubnet: true,
    },
    s3: { encryptionEnabled: true, versioningEnabled: true, publicAccessBlocked: true },
    cloudfront: { httpsEnabled: true, restrictedOrigin: true },
    cloudwatch: { logsEnabled: true, metricsEnabled: true, alarmsEnabled: true },
    secretsManager: { secretsManagementEnabled: true },
  },
};
const resultB = generateRecommendations(scenarioB);
printResult('Scenario B — stronger architecture', resultB);

assert(!has(resultB, 'rec-rds-public'), 'Scenario B: no public-RDS recommendation');
assert(!has(resultB, 'rec-monitoring-absent'), 'Scenario B: no missing-CloudWatch recommendation');
assert(!has(resultB, 'rec-single-compute-no-scaling'), 'Scenario B: no single-compute recommendation');
assert(has(resultB, 'rec-waf-for-public-entry'), 'Scenario B: Consider WAF because CloudFront is a public HTTP entry');
assert(has(resultB, 'rec-alb-for-multiple-targets'), 'Scenario B: Consider ALB because multiple EC2 instances have no load balancer');
assert(!has(resultB, 'rec-secrets-manager-for-rds'), 'Scenario B: Secrets Manager already selected — no "add Secrets Manager" rec');
assert(
  resultA.recommendations.length > resultB.recommendations.length,
  'Scenario B produces fewer recommendations than Scenario A'
);

const resultB2 = generateRecommendations(scenarioB);
assert(
  JSON.stringify(resultB) === JSON.stringify(resultB2),
  'Scenario C: running Scenario B twice produces byte-identical results (deterministic)'
);

const scenarioD = {
  selectedServices: scenarioA.selectedServices,
  architectureConfig: {
    ...scenarioA.architectureConfig,
    s3: { encryptionEnabled: true, versioningEnabled: true, publicAccessBlocked: true },
    cloudfront: { httpsEnabled: true, restrictedOrigin: true },
    cloudwatch: { logsEnabled: true, metricsEnabled: true, alarmsEnabled: true },
    secretsManager: { secretsManagementEnabled: true },
    waf: {},
    kms: {},
  },
};
const resultD = generateRecommendations(scenarioD);
assert(
  JSON.stringify(resultA) === JSON.stringify(resultD),
  'Scenario D: stale config for deselected services does NOT change recommendations'
);
assert(
  !ids(resultD).some((id) => id.startsWith('rec-s3-') || id === 'rec-waf-for-public-entry' || id === 'rec-cloudfront-https'),
  'Scenario D: leftover S3/CloudFront/WAF config does not create those recommendations'
);

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
