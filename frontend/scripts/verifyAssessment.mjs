// Lightweight, dependency-free verification script for the Day 7 scoring
// engine. No test framework was added (per the Day 7 spec: don't add a large
// testing stack just for this) — this is a plain Node script that imports the
// real engine and asserts the required scenarios. Run with:
//   node scripts/verifyAssessment.mjs

import { calculateAssessment } from '../src/assessment/index.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) {
    failures += 1;
    console.error(`FAIL  ${message}`);
  } else {
    console.log(`PASS  ${message}`);
  }
}

function printResult(label, result) {
  console.log(`\n--- ${label} ---`);
  console.log('Overall:', result.overallScore, `(${result.overallRating})`);
  for (const [category, score] of Object.entries(result.categoryScores)) {
    console.log(`  ${category}: ${score} (${result.categoryRatings[category]})`);
  }
  console.log(`  ${result.appliedRules.length} rules applied:`);
  for (const rule of result.appliedRules) {
    const sign = rule.impact > 0 ? '+' : '';
    console.log(`    ${sign}${rule.impact}  ${rule.ruleId}`);
  }
}

// ---- Scenario A: weak architecture ----
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
const resultA = calculateAssessment(scenarioA);
printResult('Scenario A — weak architecture', resultA);

assert(resultA.categoryScores.security < 60, 'Scenario A: security score is noticeably low (<60)');
assert(resultA.categoryScores.reliability < 65, 'Scenario A: reliability score is noticeably low (<65)');
assert(resultA.categoryScores.operations < 65, 'Scenario A: operations score is noticeably low (<65, no CloudWatch)');
assert(
  resultA.appliedRules.some((r) => r.ruleId === 'security-rds-public' && r.impact === -15),
  'Scenario A: "security-rds-public" rule fired with -15 impact'
);
assert(
  resultA.appliedRules.some((r) => r.ruleId === 'reliability-single-compute-no-scaling'),
  'Scenario A: "reliability-single-compute-no-scaling" rule fired'
);
assert(
  resultA.appliedRules.some((r) => r.ruleId === 'operations-monitoring-absent'),
  'Scenario A: "operations-monitoring-absent" rule fired (no CloudWatch selected)'
);

// ---- Scenario B: stronger architecture ----
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
const resultB = calculateAssessment(scenarioB);
printResult('Scenario B — stronger architecture', resultB);

assert(resultB.overallScore > resultA.overallScore, 'Scenario B overall score > Scenario A overall score');
for (const category of Object.keys(resultB.categoryScores)) {
  assert(
    resultB.categoryScores[category] > resultA.categoryScores[category],
    `Scenario B "${category}" score (${resultB.categoryScores[category]}) > Scenario A (${resultA.categoryScores[category]})`
  );
}
assert(
  resultB.appliedRules.every((r) => r.ruleId !== 'security-rds-public'),
  'Scenario B: no "security-rds-public" penalty (RDS is not public)'
);

// ---- Scenario C: determinism — same input twice ----
const resultB2 = calculateAssessment(scenarioB);
assert(
  JSON.stringify(resultB) === JSON.stringify(resultB2),
  'Scenario C: running Scenario B twice produces byte-identical results (deterministic)'
);

// ---- Scenario D: stale deselected-service config must be ignored ----
// Same as Scenario A, but with leftover config for services that are NOT
// selected (mirrors exactly what Day 6 keeps in React state after a toggle
// off). If the engine incorrectly reads architectureConfig directly instead
// of the selectedServices-filtered activeConfig, these would change the score.
const scenarioD = {
  selectedServices: scenarioA.selectedServices,
  architectureConfig: {
    ...scenarioA.architectureConfig,
    // Deselected services with maximally "good" leftover config — if this
    // leaked in, it would IMPROVE the score, which is exactly what we assert
    // does NOT happen.
    s3: { encryptionEnabled: true, versioningEnabled: true, publicAccessBlocked: true },
    cloudfront: { httpsEnabled: true, restrictedOrigin: true },
    cloudwatch: { logsEnabled: true, metricsEnabled: true, alarmsEnabled: true },
    secretsManager: { secretsManagementEnabled: true },
    waf: {},
    kms: {},
  },
};
const resultD = calculateAssessment(scenarioD);
assert(
  JSON.stringify(resultA) === JSON.stringify(resultD),
  'Scenario D: stale config for deselected services (s3/cloudfront/cloudwatch/secretsManager/waf/kms) does NOT change the result'
);

// ---- Score bounds sanity across A, B, D ----
for (const [label, result] of [
  ['A', resultA],
  ['B', resultB],
  ['D', resultD],
]) {
  const allInBounds = [result.overallScore, ...Object.values(result.categoryScores)].every(
    (s) => s >= 0 && s <= 100
  );
  assert(allInBounds, `Scenario ${label}: overall + all category scores are within [0, 100]`);
}

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
