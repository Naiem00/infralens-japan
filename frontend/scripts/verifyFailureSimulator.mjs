import assert from 'node:assert/strict';
import { simulateFailure } from '../src/failureSimulation/index.js';

const weakArchitecture = {
  selectedServices: ['ec2', 'ecsFargate', 'rdsPostgres'],
  architectureConfig: {
    ec2: {
      instanceCount: 1,
      autoScalingEnabled: false,
      multiAZ: false,
    },
    ecsFargate: {
      taskCount: 1,
      autoScalingEnabled: false,
      multiAZ: false,
    },
    rdsPostgres: {
      multiAZ: false,
      backupsEnabled: true,
    },
  },
};

const strongArchitecture = {
  selectedServices: ['ec2', 'ecsFargate', 'rdsPostgres'],
  architectureConfig: {
    ec2: {
      instanceCount: 3,
      autoScalingEnabled: true,
      multiAZ: true,
    },
    ecsFargate: {
      taskCount: 3,
      autoScalingEnabled: true,
      multiAZ: true,
    },
    rdsPostgres: {
      multiAZ: true,
      backupsEnabled: true,
    },
  },
};

const weakAz = simulateFailure({
  scenarioId: 'azOutage',
  ...weakArchitecture,
});

const strongAz = simulateFailure({
  scenarioId: 'azOutage',
  ...strongArchitecture,
});

assert.equal(weakAz.severity, 'critical');
assert.equal(strongAz.severity, 'medium');

const a = simulateFailure({
  scenarioId: 'rdsFailure',
  ...weakArchitecture,
});

const b = simulateFailure({
  scenarioId: 'rdsFailure',
  ...weakArchitecture,
});

assert.deepEqual(a, b);

console.log('PASS weak AZ outage is critical');
console.log('PASS strong Multi-AZ architecture reduces AZ severity');
console.log('PASS failure simulation is deterministic');
console.log('\nALL CHECKS PASSED');
