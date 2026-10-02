import assert from 'node:assert/strict';
import {
  validateArchitecturePayload,
} from '../src/validators/architectureValidator.js';

const valid = {
  name: 'Production API',
  selectedServices: [
    'ec2',
    'rdsPostgres',
    'cloudwatch',
  ],
  config: {
    ec2: {
      instanceCount: 2,
    },
  },
};

assert.deepEqual(
  validateArchitecturePayload(valid),
  []
);

assert.ok(
  validateArchitecturePayload({
    name: '',
    selectedServices: 'ec2',
    config: null,
  }).length === 3
);

console.log(
  'PASS valid saved architecture payload accepted'
);

console.log(
  'PASS invalid saved architecture payload rejected'
);

console.log(
  '\nALL CHECKS PASSED'
);
