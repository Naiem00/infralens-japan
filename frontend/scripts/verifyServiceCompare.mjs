import assert from 'node:assert/strict';
import {
  COMPARISON_GROUP_IDS,
  getComparisonGroup,
} from '../src/serviceCompare/index.js';

assert.deepEqual(COMPARISON_GROUP_IDS, [
  'compute',
  'database',
  'delivery',
]);

const compute = getComparisonGroup('compute');

assert.deepEqual(compute.serviceIds, [
  'ec2',
  'ecsFargate',
  'lambda',
]);

assert.ok(compute.attributes.includes('bestFor'));

const database = getComparisonGroup('database');
assert.deepEqual(database.serviceIds, [
  'rdsPostgres',
  'dynamoDb',
]);

assert.throws(
  () => getComparisonGroup('unknown'),
  /Unknown comparison group/
);

console.log('PASS comparison groups are deterministic');
console.log('PASS compute comparison contains EC2, ECS Fargate and Lambda');
console.log('PASS database comparison contains RDS and DynamoDB');
console.log('PASS unknown comparison groups are rejected');
console.log('\nALL CHECKS PASSED');
