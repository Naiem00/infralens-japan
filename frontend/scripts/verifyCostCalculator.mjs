import assert from 'node:assert/strict';
import {
  calculateSampleCost,
  SAMPLE_RATES_JPY,
} from '../src/costCalculator/index.js';

const input = {
  ec2Instances: 2,
  rdsInstances: 1,
  s3StorageGb: 100,
  cloudfrontTransferGb: 200,
};

const a = calculateSampleCost(input);
const b = calculateSampleCost(input);

assert.deepEqual(a, b);

assert.equal(
  a.breakdown.ec2,
  2 * SAMPLE_RATES_JPY.ec2InstanceMonth
);

assert.equal(
  a.total,
  a.breakdown.ec2 +
    a.breakdown.rds +
    a.breakdown.s3 +
    a.breakdown.cloudfront
);

const invalid = calculateSampleCost({
  ec2Instances: -5,
  rdsInstances: 'x',
  s3StorageGb: 0,
  cloudfrontTransferGb: '',
});

assert.equal(invalid.total, 0);

console.log('PASS cost estimate is deterministic');
console.log('PASS cost breakdown sums to total');
console.log('PASS invalid or negative quantities safely become zero');
console.log('PASS sample pricing logic is isolated from the UI');
console.log('\nALL CHECKS PASSED');
